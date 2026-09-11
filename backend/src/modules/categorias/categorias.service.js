import { query } from "../../db/pool.js";
import { HttpError } from "../../middleware/errors.js";

/**
 * Categorías.
 *
 * Las lecturas salen de la vista `vw_frontend_categorias`, que ya entrega los
 * campos con los nombres que espera React (name, description, productCount,
 * status, createdAt). Las escrituras van contra la tabla `categorias`.
 */

// Lista blanca: el nombre de la columna a ordenar NUNCA puede venir suelto
// desde la petición, porque no se puede parametrizar un identificador.
const ORDENABLES = {
  name: "name",
  description: "description",
  productCount: '"productCount"',
  status: "status",
  createdAt: '"createdAt"'
};

function validar({ nombre, descripcion }) {
  const errores = {};
  if (!nombre?.trim()) errores.nombre = "El nombre de la categoría es obligatorio.";
  else if (nombre.trim().length > 100) errores.nombre = "El nombre no puede exceder 100 caracteres.";
  if (descripcion && descripcion.length > 200) {
    errores.descripcion = "La descripción no puede exceder 200 caracteres.";
  }
  if (Object.keys(errores).length) {
    throw new HttpError(400, "Revisa los datos del formulario.", errores);
  }
}

async function list({ search = "", status = "all", sortBy = "name", sortDir = "asc", page = 1, limit = 10 }) {
  const orderCol = ORDENABLES[sortBy] ?? ORDENABLES.name;
  const orderDir = String(sortDir).toLowerCase() === "desc" ? "DESC" : "ASC";

  const pagina = Math.max(1, Number(page) || 1);
  const porPagina = Math.min(100, Math.max(1, Number(limit) || 10));
  const offset = (pagina - 1) * porPagina;

  const where = [];
  const params = [];

  if (search.trim()) {
    params.push(`%${search.trim()}%`);
    where.push(`(name ILIKE $${params.length} OR description ILIKE $${params.length})`);
  }
  if (status === "active" || status === "inactive") {
    params.push(status);
    where.push(`status = $${params.length}`);
  }

  const filtro = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const total = await query(`SELECT COUNT(*)::INT AS n FROM vw_frontend_categorias ${filtro}`, params);

  params.push(porPagina, offset);
  const { rows } = await query(
    `SELECT * FROM vw_frontend_categorias
     ${filtro}
     ORDER BY ${orderCol} ${orderDir}
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return {
    data: rows,
    meta: { total: total.rows[0].n, page: pagina, limit: porPagina,
            totalPages: Math.max(1, Math.ceil(total.rows[0].n / porPagina)) }
  };
}

async function getById(id) {
  const { rows } = await query("SELECT * FROM vw_frontend_categorias WHERE id = $1", [id]);
  if (!rows[0]) throw new HttpError(404, "La categoría no existe.");
  return rows[0];
}

async function create({ nombre, descripcion, estado = true }) {
  validar({ nombre, descripcion });
  const { rows } = await query(
    `INSERT INTO categorias (nombre, descripcion, estado) VALUES ($1, $2, $3) RETURNING id_categoria`,
    [nombre.trim(), descripcion?.trim() || null, estado !== false]
  );
  return getById(rows[0].id_categoria);
}

async function update(id, { nombre, descripcion, estado }) {
  validar({ nombre, descripcion });
  const { rowCount } = await query(
    `UPDATE categorias
        SET nombre = $2,
            descripcion = $3,
            estado = COALESCE($4, estado)
      WHERE id_categoria = $1`,
    [id, nombre.trim(), descripcion?.trim() || null, estado ?? null]
  );
  if (!rowCount) throw new HttpError(404, "La categoría no existe.");
  return getById(id);
}

/** Activa o desactiva sin tocar el resto de los campos. */
async function setEstado(id, estado) {
  const { rowCount } = await query("UPDATE categorias SET estado = $2 WHERE id_categoria = $1", [
    id,
    Boolean(estado)
  ]);
  if (!rowCount) throw new HttpError(404, "La categoría no existe.");
  return getById(id);
}

/**
 * Eliminar. Se bloquea si la categoría todavía tiene productos: la FK de
 * `productos` lo impediría de todos modos, pero así el mensaje es claro.
 */
async function remove(id) {
  const { rows } = await query(
    "SELECT COUNT(*)::INT AS n FROM productos WHERE id_categoria = $1",
    [id]
  );
  if (rows[0].n > 0) {
    throw new HttpError(
      409,
      `No se puede eliminar: la categoría tiene ${rows[0].n} producto(s) asociados. Desactívala en su lugar.`
    );
  }

  const { rowCount } = await query("DELETE FROM categorias WHERE id_categoria = $1", [id]);
  if (!rowCount) throw new HttpError(404, "La categoría no existe.");
  return { ok: true };
}

export { list, getById, create, update, setEstado, remove };
