import { query, withTransaction } from "../../db/pool.js";
import { HttpError } from "../../middleware/errors.js";

/**
 * Roles y permisos.
 *
 * Este módulo es distinto a los demás: no gestiona datos del negocio, sino
 * quién puede hacer qué. Un error aquí no se nota en una pantalla — se nota
 * cuando alguien queda encerrado fuera del sistema sin forma de volver a
 * entrar. Por eso lleva más resguardos que los otros.
 */

const ROL_ADMINISTRADOR = "Administrador";

/**
 * Permisos que el rol Administrador NUNCA puede perder.
 *
 * Son los que permiten volver a esta misma pantalla y arreglar un error.
 * Si se pudieran quitar, un administrador podría dejarse sin acceso al
 * módulo de Roles y la única salida sería entrar a la base a mano.
 */
const PERMISOS_IRRENUNCIABLES = ["roles.view", "roles.edit"];

const ORDENABLES = {
  name: "name",
  usersCount: '"usersCount"',
  createdAt: '"createdAt"',
  id: "id"
};

/** Forma en la que el frontend espera cada rol. */
const SELECT_ROL = `
  SELECT r.id_rol                                   AS id,
         r.nombre                                   AS name,
         r.descripcion                              AS description,
         CASE WHEN r.estado THEN 'active' ELSE 'inactive' END AS status,
         r.estado                                   AS estado,
         r.created_at                               AS "createdAt",
         (SELECT COUNT(*) FROM usuarios u WHERE u.id_rol = r.id_rol)::INT AS "usersCount",
         COALESCE(
           (SELECT array_agg(rp.id_permiso ORDER BY rp.id_permiso)
              FROM rol_permiso rp WHERE rp.id_rol = r.id_rol),
           '{}'
         ) AS permissions
    FROM roles r
`;

function validar({ nombre, descripcion, permisos }) {
  const errores = {};

  if (!nombre?.trim()) errores.nombre = "El nombre del rol es obligatorio.";
  else if (nombre.trim().length > 50) errores.nombre = "El nombre no puede exceder 50 caracteres.";

  if (descripcion?.trim() && descripcion.trim().length > 200) {
    errores.descripcion = "La descripción no puede exceder 200 caracteres.";
  }

  if (!Array.isArray(permisos) || permisos.length === 0) {
    errores.permisos = "Debes seleccionar al menos un permiso.";
  }

  if (Object.keys(errores).length) throw new HttpError(400, "Revisa los datos del formulario.", errores);
}

/**
 * Comprueba que todos los permisos enviados existan en el catálogo.
 *
 * Sin esto, el frontend podría mandar un permiso inventado, la llave foránea
 * lo rechazaría y el mensaje sería un error de PostgreSQL. Además, un permiso
 * que no existe en el catálogo nunca se comprobaría en ningún lado: el rol
 * parecería tenerlo y no serviría de nada.
 */
async function permisosValidos(permisos) {
  const { rows } = await query("SELECT id_permiso FROM permisos WHERE id_permiso = ANY($1)", [permisos]);
  const conocidos = new Set(rows.map((r) => r.id_permiso));
  const desconocidos = permisos.filter((p) => !conocidos.has(p));

  if (desconocidos.length) {
    throw new HttpError(400, "Hay permisos que no existen en el catálogo del sistema.", {
      permisos: `No existen: ${desconocidos.join(", ")}.`
    });
  }
}

/** El nombre de un rol no se repite: dos "Vendedor" serían imposibles de distinguir. */
async function nombreLibre(nombre, idExcluido = null) {
  const { rows } = await query(
    `SELECT id_rol FROM roles WHERE lower(nombre) = lower($1) AND ($2::INT IS NULL OR id_rol <> $2)`,
    [nombre.trim(), idExcluido]
  );
  if (rows.length) {
    throw new HttpError(409, `Ya existe un rol llamado "${nombre.trim()}".`, {
      nombre: "Ese nombre ya está en uso."
    });
  }
}

/** Datos del rol que hacen falta para decidir si una operación es segura. */
async function traerRol(id) {
  const { rows } = await query(
    `SELECT r.id_rol, r.nombre, r.estado,
            (SELECT COUNT(*) FROM usuarios u WHERE u.id_rol = r.id_rol)::INT AS usuarios
       FROM roles r WHERE r.id_rol = $1`,
    [id]
  );
  if (!rows[0]) throw new HttpError(404, "El rol no existe.");
  return rows[0];
}

/**
 * Los dos resguardos que evitan que alguien se deje afuera.
 *
 * 1. El rol Administrador conserva siempre los permisos de Roles. Es la
 *    puerta de vuelta: mientras existan, cualquier error se puede corregir
 *    desde la interfaz.
 * 2. Nadie le quita a su propio rol el permiso de editar roles. Aunque el
 *    rol no sea Administrador, hacerlo lo dejaría sin forma de deshacerlo.
 */
async function protegerAcceso(rol, permisos, actorRolId) {
  if (rol.nombre === ROL_ADMINISTRADOR) {
    const faltantes = PERMISOS_IRRENUNCIABLES.filter((p) => !permisos.includes(p));
    if (faltantes.length) {
      throw new HttpError(
        409,
        `El rol Administrador no puede quedarse sin ${faltantes.join(" ni ")}: ` +
          "son los permisos que permiten volver a esta pantalla y corregir un error.",
        { permisos: "Faltan permisos que este rol no puede perder." }
      );
    }
  }

  if (Number(rol.id_rol) === Number(actorRolId) && !permisos.includes("roles.edit")) {
    throw new HttpError(
      409,
      "No puedes quitarle a tu propio rol el permiso de editar roles: quedarías sin forma de deshacerlo."
    );
  }
}

/* ------------------------------------------------------------------
   Consultas
------------------------------------------------------------------ */

async function list({ search = "", status = "all", sortBy = "name", sortDir = "asc", page = 1, limit = 10 }) {
  const where = [];
  const params = [];

  if (search.trim()) {
    params.push(`%${search.trim()}%`);
    where.push(`(r.nombre ILIKE $${params.length} OR r.descripcion ILIKE $${params.length})`);
  }
  if (status === "active" || status === "inactive") {
    params.push(status === "active");
    where.push(`r.estado = $${params.length}`);
  }

  const filtro = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const orderCol = ORDENABLES[sortBy] ?? ORDENABLES.name;
  const orderDir = String(sortDir).toLowerCase() === "desc" ? "DESC" : "ASC";

  const pagina = Math.max(1, Number(page) || 1);
  const porPagina = Math.min(100, Math.max(1, Number(limit) || 10));
  const offset = (pagina - 1) * porPagina;

  const resumen = await query(
    `SELECT COUNT(*)::INT AS total,
            COUNT(*) FILTER (WHERE r.estado)::INT      AS activos,
            COUNT(*) FILTER (WHERE NOT r.estado)::INT  AS inactivos
       FROM roles r ${filtro}`,
    params
  );

  const paginado = [...params, porPagina, offset];
  const { rows } = await query(
    `SELECT * FROM (${SELECT_ROL} ${filtro}) AS roles_con_datos
      ORDER BY ${orderCol} ${orderDir}, id ASC
      LIMIT $${paginado.length - 1} OFFSET $${paginado.length}`,
    paginado
  );

  const stats = resumen.rows[0];
  return {
    data: rows,
    stats,
    meta: {
      total: stats.total,
      page: pagina,
      limit: porPagina,
      totalPages: Math.max(1, Math.ceil(stats.total / porPagina))
    }
  };
}

async function getById(id) {
  const { rows } = await query(`${SELECT_ROL} WHERE r.id_rol = $1`, [id]);
  if (!rows[0]) throw new HttpError(404, "El rol no existe.");
  return rows[0];
}

/**
 * Catálogo de permisos.
 *
 * Se devuelve tal como está en la base, con su módulo. Antes el frontend lo
 * tenía escrito a mano y no coincidía: listaba permisos que no existían y se
 * saltaba módulos enteros. Ahora hay una sola fuente de verdad.
 */
async function catalogoPermisos() {
  const { rows } = await query(
    `SELECT id_permiso AS id, nombre AS name, descripcion AS description, modulo AS module
       FROM permisos
      ORDER BY modulo, id_permiso`
  );

  const modulos = [];
  for (const permiso of rows) {
    let grupo = modulos.find((m) => m.module === permiso.module);
    if (!grupo) {
      grupo = { module: permiso.module, permissions: [] };
      modulos.push(grupo);
    }
    grupo.permissions.push(permiso);
  }

  return { permisos: rows, modulos, total: rows.length };
}

/* ------------------------------------------------------------------
   Escrituras
------------------------------------------------------------------ */

async function create({ nombre, descripcion, permisos = [], estado = true }) {
  validar({ nombre, descripcion, permisos });
  await nombreLibre(nombre);
  await permisosValidos(permisos);

  const id = await withTransaction(async (cliente) => {
    const { rows } = await cliente.query(
      `INSERT INTO roles (nombre, descripcion, estado) VALUES ($1, $2, $3) RETURNING id_rol`,
      [nombre.trim(), descripcion?.trim() || null, estado !== false]
    );
    const idRol = rows[0].id_rol;

    // unnest convierte el arreglo en filas: una inserción en vez de N.
    await cliente.query(
      `INSERT INTO rol_permiso (id_rol, id_permiso)
       SELECT $1, permiso FROM unnest($2::VARCHAR[]) AS permiso`,
      [idRol, permisos]
    );
    return idRol;
  });

  return getById(id);
}

/**
 * Actualiza el rol y reemplaza su lista de permisos.
 *
 * Va en una transacción porque son dos escrituras: si se borraran los
 * permisos viejos y fallara la inserción de los nuevos, el rol se quedaría
 * sin ninguno. Con la transacción, o cambian los dos o no cambia nada.
 */
async function update(id, { nombre, descripcion, permisos = [], estado }, actor = {}) {
  validar({ nombre, descripcion, permisos });

  const rol = await traerRol(id);
  await nombreLibre(nombre, id);
  await permisosValidos(permisos);
  await protegerAcceso(rol, permisos, actor.roleId);

  if (rol.nombre === ROL_ADMINISTRADOR && nombre.trim() !== ROL_ADMINISTRADOR) {
    throw new HttpError(409, "El rol Administrador no se puede renombrar: el sistema lo busca por su nombre.", {
      nombre: "Este rol no se puede renombrar."
    });
  }
  if (estado === false) await protegerDesactivacion(rol);

  await withTransaction(async (cliente) => {
    await cliente.query(
      `UPDATE roles SET nombre = $2, descripcion = $3, estado = COALESCE($4, estado) WHERE id_rol = $1`,
      [id, nombre.trim(), descripcion?.trim() || null, estado ?? null]
    );
    await cliente.query("DELETE FROM rol_permiso WHERE id_rol = $1", [id]);
    await cliente.query(
      `INSERT INTO rol_permiso (id_rol, id_permiso)
       SELECT $1, permiso FROM unnest($2::VARCHAR[]) AS permiso`,
      [id, permisos]
    );
  });

  return getById(id);
}

/**
 * Desactivar un rol con usuarios asignados dejaría un interruptor que no
 * hace nada: esas personas seguirían entrando igual. Mejor decirlo.
 */
async function protegerDesactivacion(rol) {
  if (rol.nombre === ROL_ADMINISTRADOR) {
    throw new HttpError(409, "El rol Administrador no se puede desactivar.");
  }
  if (rol.usuarios > 0) {
    throw new HttpError(
      409,
      `No se puede desactivar: hay ${rol.usuarios} usuario(s) con este rol. ` +
        "Cámbialos de rol primero, o desactiva las cuentas una por una."
    );
  }
}

async function setEstado(id, estado) {
  const rol = await traerRol(id);
  if (!estado) await protegerDesactivacion(rol);

  await query("UPDATE roles SET estado = $2 WHERE id_rol = $1", [id, Boolean(estado)]);
  return getById(id);
}

async function remove(id, actor = {}) {
  const rol = await traerRol(id);

  if (rol.nombre === ROL_ADMINISTRADOR) {
    throw new HttpError(409, "El rol Administrador no se puede eliminar: el sistema depende de él.");
  }
  if (Number(id) === Number(actor.roleId)) {
    throw new HttpError(409, "No puedes eliminar tu propio rol.");
  }
  if (rol.usuarios > 0) {
    throw new HttpError(
      409,
      `No se puede eliminar: hay ${rol.usuarios} usuario(s) con este rol. ` +
        "Reasígnalos a otro rol antes de borrarlo."
    );
  }

  // rol_permiso tiene ON DELETE CASCADE: sus permisos se van con él.
  await query("DELETE FROM roles WHERE id_rol = $1", [id]);
  return { ok: true };
}

export {
  list,
  getById,
  catalogoPermisos,
  create,
  update,
  setEstado,
  remove,
  PERMISOS_IRRENUNCIABLES,
  ROL_ADMINISTRADOR
};
