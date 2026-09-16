import bcrypt from "bcryptjs";
import { query } from "../../db/pool.js";
import { HttpError } from "../../middleware/errors.js";

/**
 * Usuarios (personal del sistema).
 *
 * En la base, personal y clientes viven en la misma tabla `usuarios` y se
 * distinguen por su rol. Este módulo lista por defecto SOLO al personal:
 * los clientes tienen su propia pantalla y su propia vista de contrato.
 */

const SALT_ROUNDS = 10;

const ORDENABLES = {
  name: "name",
  email: "email",
  role: "role",
  lastLogin: '"lastLogin"',
  joinDate: '"joinDate"'
};

const MIN_PASSWORD = 8;

function validar({ nombre, correo, telefono, id_rol, contrasena, isEditing }) {
  const errores = {};

  if (!nombre?.trim()) errores.nombre = "El nombre completo es obligatorio.";
  else if (nombre.trim().length > 150) errores.nombre = "El nombre no puede exceder 150 caracteres.";

  if (!correo?.trim()) errores.correo = "El correo electrónico es obligatorio.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) errores.correo = "El correo electrónico no tiene un formato válido.";

  if (!isEditing && !contrasena) errores.contrasena = "La contraseña es obligatoria.";
  if (contrasena && contrasena.length < MIN_PASSWORD) {
    errores.contrasena = `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`;
  }

  if (telefono?.trim() && !/^[+()\d\s-]{7,}$/.test(telefono.trim())) {
    errores.telefono = "El teléfono solo puede incluir números, espacios y signos básicos.";
  }

  if (!Number(id_rol)) errores.id_rol = "Debes seleccionar un rol.";

  if (Object.keys(errores).length) throw new HttpError(400, "Revisa los datos del formulario.", errores);
}

/**
 * Resguardo central: el sistema nunca puede quedarse sin un administrador
 * activo. Sin esto, desactivar o degradar la última cuenta de administrador
 * dejaría a todo el mundo sin forma de entrar a administrar nada.
 */
async function protegerUltimoAdministrador(idUsuario, { nuevoRolId = null, desactivando = false, eliminando = false } = {}) {
  const { rows } = await query(
    `SELECT u.id_usuario, u.estado, r.nombre AS rol,
            (SELECT COUNT(*) FROM usuarios u2
               JOIN roles r2 ON r2.id_rol = u2.id_rol
              WHERE r2.nombre = 'Administrador' AND u2.estado = TRUE)::INT AS admins_activos
       FROM usuarios u JOIN roles r ON r.id_rol = u.id_rol
      WHERE u.id_usuario = $1`,
    [idUsuario]
  );
  const usuario = rows[0];
  if (!usuario) throw new HttpError(404, "El usuario no existe.");

  const esAdminActivo = usuario.rol === "Administrador" && usuario.estado;
  if (!esAdminActivo || usuario.admins_activos > 1) return;

  if (eliminando) throw new HttpError(409, "No se puede eliminar: es el único administrador activo del sistema.");
  if (desactivando) throw new HttpError(409, "No se puede desactivar: es el único administrador activo del sistema.");

  if (nuevoRolId) {
    const { rows: rolRows } = await query("SELECT nombre FROM roles WHERE id_rol = $1", [nuevoRolId]);
    if (rolRows[0]?.nombre !== "Administrador") {
      throw new HttpError(409, "No se puede cambiar el rol: es el único administrador activo del sistema.");
    }
  }
}

async function list({ search = "", role = "Todos", status = "all", sortBy = "name", sortDir = "asc", page = 1, limit = 10, incluirClientes = "0" }) {
  const where = [];
  const params = [];

  if (incluirClientes !== "1" && role !== "Cliente") where.push(`role <> 'Cliente'`);

  if (search.trim()) {
    params.push(`%${search.trim()}%`);
    where.push(`(name ILIKE $${params.length} OR email ILIKE $${params.length})`);
  }
  if (role && role !== "Todos" && role !== "all") {
    params.push(role);
    where.push(`role = $${params.length}`);
  }
  if (status === "active" || status === "inactive") {
    params.push(status);
    where.push(`status = $${params.length}`);
  }

  const filtro = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const orderCol = ORDENABLES[sortBy] ?? ORDENABLES.name;
  const orderDir = String(sortDir).toLowerCase() === "desc" ? "DESC" : "ASC";

  const pagina = Math.max(1, Number(page) || 1);
  const porPagina = Math.min(100, Math.max(1, Number(limit) || 10));
  const offset = (pagina - 1) * porPagina;

  const resumen = await query(
    `SELECT COUNT(*)::INT                                         AS total,
            COUNT(*) FILTER (WHERE status = 'active')::INT        AS activos,
            COUNT(*) FILTER (WHERE status = 'inactive')::INT      AS inactivos,
            COUNT(*) FILTER (WHERE role = 'Administrador')::INT   AS administradores
       FROM vw_frontend_usuarios ${filtro}`,
    params
  );

  const paginado = [...params, porPagina, offset];
  const { rows } = await query(
    `SELECT * FROM vw_frontend_usuarios
     ${filtro}
     ORDER BY ${orderCol} ${orderDir}, id ASC
     LIMIT $${paginado.length - 1} OFFSET $${paginado.length}`,
    paginado
  );

  const stats = resumen.rows[0];
  return {
    data: rows,
    stats,
    meta: { total: stats.total, page: pagina, limit: porPagina, totalPages: Math.max(1, Math.ceil(stats.total / porPagina)) }
  };
}

async function getById(id) {
  const { rows } = await query("SELECT * FROM vw_frontend_usuarios WHERE id = $1", [id]);
  if (!rows[0]) throw new HttpError(404, "El usuario no existe.");
  return rows[0];
}

async function listaRoles() {
  const { rows } = await query(
    "SELECT id_rol AS id, nombre AS name, descripcion FROM roles WHERE estado = TRUE ORDER BY id_rol"
  );
  return rows;
}

async function create({ nombre, correo, contrasena, telefono, id_rol, estado = true }) {
  validar({ nombre, correo, contrasena, telefono, id_rol, isEditing: false });

  const hash = await bcrypt.hash(contrasena, SALT_ROUNDS);
  const { rows } = await query(
    `INSERT INTO usuarios (id_rol, nombre, correo, contrasena, telefono, estado)
     VALUES ($1, $2, lower($3), $4, $5, $6)
     RETURNING id_usuario`,
    [Number(id_rol), nombre.trim(), correo.trim(), hash, telefono?.trim() || null, estado !== false]
  );
  return getById(rows[0].id_usuario);
}

/** Editar no toca la contraseña: para eso está el endpoint dedicado. */
async function update(id, { nombre, correo, telefono, id_rol, estado }, actorId) {
  validar({ nombre, correo, telefono, id_rol, isEditing: true });

  if (Number(id) === Number(actorId)) {
    const actual = await query("SELECT id_rol FROM usuarios WHERE id_usuario = $1", [id]);
    if (Number(actual.rows[0]?.id_rol) !== Number(id_rol)) {
      throw new HttpError(409, "No puedes cambiar tu propio rol. Pídeselo a otro administrador.");
    }
    // El mismo bloqueo que tiene el interruptor de la tabla: sin esto,
    // bastaba con poner "Inactivo" en el formulario para dejarse fuera.
    if (estado === false) {
      throw new HttpError(409, "No puedes desactivar tu propia cuenta.");
    }
  }

  await protegerUltimoAdministrador(id, {
    nuevoRolId: Number(id_rol),
    desactivando: estado === false
  });

  const { rowCount } = await query(
    `UPDATE usuarios
        SET nombre = $2, correo = lower($3), telefono = $4, id_rol = $5, estado = COALESCE($6, estado)
      WHERE id_usuario = $1`,
    [id, nombre.trim(), correo.trim(), telefono?.trim() || null, Number(id_rol), estado ?? null]
  );
  if (!rowCount) throw new HttpError(404, "El usuario no existe.");
  return getById(id);
}

async function setEstado(id, estado, actorId) {
  if (Number(id) === Number(actorId) && !estado) {
    throw new HttpError(409, "No puedes desactivar tu propia cuenta.");
  }
  await protegerUltimoAdministrador(id, { desactivando: !estado });

  const { rowCount } = await query("UPDATE usuarios SET estado = $2 WHERE id_usuario = $1", [id, Boolean(estado)]);
  if (!rowCount) throw new HttpError(404, "El usuario no existe.");
  return getById(id);
}

/** Restablecer la contraseña de otra persona (acción de administrador). */
async function resetPassword(id, contrasena) {
  if (!contrasena || contrasena.length < MIN_PASSWORD) {
    throw new HttpError(400, `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`, {
      contrasena: `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`
    });
  }
  const hash = await bcrypt.hash(contrasena, SALT_ROUNDS);
  const { rowCount } = await query("UPDATE usuarios SET contrasena = $2 WHERE id_usuario = $1", [id, hash]);
  if (!rowCount) throw new HttpError(404, "El usuario no existe.");
  return { ok: true };
}

async function remove(id, actorId) {
  if (Number(id) === Number(actorId)) throw new HttpError(409, "No puedes eliminar tu propia cuenta.");
  await protegerUltimoAdministrador(id, { eliminando: true });

  const { rows } = await query(
    `SELECT (SELECT COUNT(*) FROM ventas  WHERE id_usuario = $1 OR id_cliente = $1)::INT AS ventas,
            (SELECT COUNT(*) FROM compras WHERE id_usuario = $1)::INT                    AS compras,
            (SELECT COUNT(*) FROM pedidos WHERE id_usuario = $1 OR id_cliente = $1)::INT AS pedidos`,
    [id]
  );
  const { ventas, compras, pedidos } = rows[0];
  if (ventas + compras + pedidos > 0) {
    const detalle = [ventas && `${ventas} venta(s)`, compras && `${compras} compra(s)`, pedidos && `${pedidos} pedido(s)`]
      .filter(Boolean).join(", ");
    throw new HttpError(
      409,
      `No se puede eliminar: la cuenta está asociada a ${detalle}. Desactívala en su lugar para conservar el historial.`
    );
  }

  const { rowCount } = await query("DELETE FROM usuarios WHERE id_usuario = $1", [id]);
  if (!rowCount) throw new HttpError(404, "El usuario no existe.");
  return { ok: true };
}

export { list, getById, listaRoles, create, update, setEstado, resetPassword, remove, MIN_PASSWORD };
