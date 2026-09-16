import { query } from "../../db/pool.js";
import { HttpError } from "../../middleware/errors.js";

/**
 * Proveedores.
 *
 * Las lecturas salen de `vw_frontend_proveedores`, que además de los datos
 * del proveedor trae tres cifras calculadas: cuántas compras se le han hecho,
 * cuánto se le ha comprado y cuántos productos suyos hay en catálogo. Esas
 * tres NO se guardan en la tabla a propósito: si estuvieran guardadas habría
 * que acordarse de actualizarlas cada vez que se registra una compra, y el
 * día que alguien lo olvide la cifra queda mintiendo para siempre. Calculada
 * al momento, no puede desincronizarse.
 *
 * Las escrituras van contra la tabla `proveedores`.
 */

// Lista blanca de columnas ordenables. El nombre de una columna no se puede
// parametrizar ($1 solo sirve para valores), así que si viniera suelto desde
// la petición sería una puerta abierta a inyección.
const ORDENABLES = {
  name: "name",
  city: "city",
  rating: "rating",
  reviews: "reviews",
  totalOrders: '"totalOrders"',
  totalSpent: '"totalSpent"',
  totalProducts: '"totalProducts"',
  since: "since",
  status: "status"
};

const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PATRON_TELEFONO = /^[+()\d\s-]{7,}$/;

/**
 * Mismas reglas que valida el formulario en React.
 *
 * Se repiten aquí y no se confía en las del navegador: la API se puede llamar
 * desde Postman, desde Swagger o desde un fetch en la consola, y en esos
 * casos el formulario nunca se ejecutó. La validación del navegador es
 * comodidad para quien escribe; esta es la que de verdad protege los datos.
 */
function validar({ nombre, contacto, email, telefono, ciudad, calificacion, resenas }) {
  const errores = {};

  if (!nombre?.trim()) errores.nombre = "El nombre del proveedor es obligatorio.";
  else if (nombre.trim().length > 100) errores.nombre = "El nombre no puede exceder 100 caracteres.";

  if (!contacto?.trim()) errores.contacto = "El contacto es obligatorio.";
  else if (contacto.trim().length > 100) errores.contacto = "El contacto no puede exceder 100 caracteres.";

  if (!ciudad?.trim()) errores.ciudad = "La ciudad es obligatoria.";
  else if (ciudad.trim().length > 100) errores.ciudad = "La ciudad no puede exceder 100 caracteres.";

  if (email?.trim()) {
    if (!PATRON_EMAIL.test(email.trim())) errores.email = "El correo electrónico no tiene un formato válido.";
    else if (email.trim().length > 100) errores.email = "El correo no puede exceder 100 caracteres.";
  }

  if (telefono?.trim()) {
    if (!PATRON_TELEFONO.test(telefono.trim())) errores.telefono = "El teléfono no tiene un formato válido.";
    else if (telefono.trim().length > 20) errores.telefono = "El teléfono no puede exceder 20 caracteres.";
  }

  // La calificación es opcional, pero si viene tiene que ser un número entre
  // 0 y 5: la restricción CHECK de la tabla la rechazaría de todos modos, y
  // un error de PostgreSQL no le dice nada útil a quien está llenando el
  // formulario.
  if (calificacion !== undefined && calificacion !== null && calificacion !== "") {
    const valor = Number(calificacion);
    if (Number.isNaN(valor)) errores.calificacion = "La calificación debe ser un número.";
    else if (valor < 0 || valor > 5) errores.calificacion = "La calificación va de 0 a 5.";
  }

  if (resenas !== undefined && resenas !== null && resenas !== "") {
    const valor = Number(resenas);
    if (!Number.isInteger(valor) || valor < 0) {
      errores.resenas = "La cantidad de reseñas debe ser un entero de 0 o más.";
    }
  }

  if (Object.keys(errores).length) {
    throw new HttpError(400, "Revisa los datos del formulario.", errores);
  }
}

/**
 * Dos proveedores con el mismo nombre son indistinguibles en la tabla y en
 * los selectores de Productos y Compras. La tabla tiene un UNIQUE que lo
 * impide, pero el error que devuelve PostgreSQL es genérico; esto se
 * adelanta para poder señalar el campo exacto en el formulario.
 */
async function nombreLibre(nombre, idExcluido = null) {
  const { rows } = await query(
    `SELECT id_proveedor FROM proveedores
      WHERE lower(nombre) = lower($1) AND ($2::INT IS NULL OR id_proveedor <> $2)
      LIMIT 1`,
    [nombre.trim(), idExcluido]
  );
  if (rows[0]) {
    throw new HttpError(409, `Ya existe un proveedor llamado "${nombre.trim()}".`, {
      nombre: "Ya hay un proveedor con ese nombre."
    });
  }
}

async function list({
  search = "",
  status = "all",
  city = "",
  sortBy = "name",
  sortDir = "asc",
  page = 1,
  limit = 10
} = {}) {
  const orderCol = ORDENABLES[sortBy] ?? ORDENABLES.name;
  const orderDir = String(sortDir).toLowerCase() === "desc" ? "DESC" : "ASC";

  const pagina = Math.max(1, Number(page) || 1);
  const porPagina = Math.min(100, Math.max(1, Number(limit) || 10));
  const offset = (pagina - 1) * porPagina;

  const where = [];
  const params = [];

  if (String(search).trim()) {
    params.push(`%${String(search).trim()}%`);
    where.push(
      `(name ILIKE $${params.length} OR contact ILIKE $${params.length}
        OR email ILIKE $${params.length} OR city ILIKE $${params.length})`
    );
  }
  if (status === "active" || status === "inactive") {
    params.push(status);
    where.push(`status = $${params.length}`);
  }
  if (String(city).trim()) {
    params.push(String(city).trim());
    where.push(`city = $${params.length}`);
  }

  const filtro = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const total = await query(`SELECT COUNT(*)::INT AS n FROM vw_frontend_proveedores ${filtro}`, params);

  params.push(porPagina, offset);
  const { rows } = await query(
    `SELECT * FROM vw_frontend_proveedores
      ${filtro}
      ORDER BY ${orderCol} ${orderDir}, id ASC
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return {
    data: rows,
    stats: await resumen(),
    meta: {
      total: total.rows[0].n,
      page: pagina,
      limit: porPagina,
      totalPages: Math.max(1, Math.ceil(total.rows[0].n / porPagina))
    }
  };
}

/**
 * Los indicadores de las tarjetas.
 *
 * Van aparte de la página que se está viendo: si se calcularan sumando las
 * filas visibles, "Total Proveedores" diría 10 cuando hay 30, y cambiaría al
 * pasar de página. Cuentan siempre sobre el total, sin filtros.
 */
async function resumen() {
  const { rows } = await query(
    `SELECT COUNT(*)::INT AS total,
            COUNT(*) FILTER (WHERE estado)::INT AS activos,
            COUNT(*) FILTER (WHERE NOT estado)::INT AS inactivos,
            COALESCE(ROUND(AVG(calificacion) FILTER (WHERE cantidad_resenas > 0), 1), 0)
              AS "calificacionPromedio",
            (SELECT COUNT(*)::INT FROM productos) AS "totalProductos"
       FROM proveedores`
  );
  const fila = rows[0];
  return { ...fila, calificacionPromedio: Number(fila.calificacionPromedio) };
}

async function getById(id) {
  const { rows } = await query("SELECT * FROM vw_frontend_proveedores WHERE id = $1", [id]);
  if (!rows[0]) throw new HttpError(404, "El proveedor no existe.");
  return rows[0];
}

/** Las ciudades que ya están en uso, para ofrecerlas como filtro. */
async function ciudades() {
  const { rows } = await query(
    `SELECT DISTINCT ciudad FROM proveedores
      WHERE ciudad IS NOT NULL AND btrim(ciudad) <> ''
      ORDER BY ciudad`
  );
  return { ciudades: rows.map((r) => r.ciudad) };
}

async function create({ nombre, contacto, email, telefono, ciudad, calificacion, resenas, estado = true }) {
  validar({ nombre, contacto, email, telefono, ciudad, calificacion, resenas });
  await nombreLibre(nombre);

  const { rows } = await query(
    `INSERT INTO proveedores
       (nombre, contacto, email, telefono, ciudad, calificacion, cantidad_resenas, estado)
     VALUES ($1, $2, $3, $4, $5, COALESCE($6::NUMERIC, 0), COALESCE($7::INT, 0), $8)
     RETURNING id_proveedor`,
    [
      nombre.trim(),
      contacto.trim(),
      email?.trim() || null,
      telefono?.trim() || null,
      ciudad.trim(),
      calificacion === "" || calificacion === undefined ? null : Number(calificacion),
      resenas === "" || resenas === undefined ? null : Number(resenas),
      estado !== false
    ]
  );

  return getById(rows[0].id_proveedor);
}

async function update(id, { nombre, contacto, email, telefono, ciudad, calificacion, resenas, estado }) {
  validar({ nombre, contacto, email, telefono, ciudad, calificacion, resenas });
  await nombreLibre(nombre, id);

  const { rowCount } = await query(
    `UPDATE proveedores
        SET nombre = $2,
            contacto = $3,
            email = $4,
            telefono = $5,
            ciudad = $6,
            calificacion = COALESCE($7::NUMERIC, calificacion),
            cantidad_resenas = COALESCE($8::INT, cantidad_resenas),
            estado = COALESCE($9::BOOLEAN, estado)
      WHERE id_proveedor = $1`,
    [
      id,
      nombre.trim(),
      contacto.trim(),
      email?.trim() || null,
      telefono?.trim() || null,
      ciudad.trim(),
      calificacion === "" || calificacion === undefined ? null : Number(calificacion),
      resenas === "" || resenas === undefined ? null : Number(resenas),
      estado ?? null
    ]
  );

  if (!rowCount) throw new HttpError(404, "El proveedor no existe.");
  return getById(id);
}

/** Activa o desactiva sin tocar el resto de los campos. */
async function setEstado(id, estado) {
  const { rowCount } = await query("UPDATE proveedores SET estado = $2 WHERE id_proveedor = $1", [
    id,
    Boolean(estado)
  ]);
  if (!rowCount) throw new HttpError(404, "El proveedor no existe.");
  return getById(id);
}

/**
 * Eliminar.
 *
 * Se bloquea si el proveedor tiene productos o compras. Las llaves foráneas
 * de `productos` y `compras` lo impedirían igual, pero respondiendo con el
 * 23503 pelado de PostgreSQL: "hay registros relacionados", sin decir cuáles
 * ni cuántos. Contarlos antes cuesta dos consultas y convierte un callejón
 * sin salida en una instrucción de qué hacer.
 *
 * Y borrar un proveedor con historial de compras no sería deseable aunque se
 * pudiera: esas compras son el registro contable de lo que se le pagó.
 */
async function remove(id) {
  const { rows } = await query(
    `SELECT (SELECT COUNT(*)::INT FROM productos WHERE id_proveedor = $1) AS productos,
            (SELECT COUNT(*)::INT FROM compras   WHERE id_proveedor = $1) AS compras`,
    [id]
  );
  const { productos, compras } = rows[0];

  if (productos > 0 || compras > 0) {
    const motivos = [];
    if (productos > 0) motivos.push(`${productos} producto(s) en catálogo`);
    if (compras > 0) motivos.push(`${compras} compra(s) registradas`);
    throw new HttpError(
      409,
      `No se puede eliminar: el proveedor tiene ${motivos.join(" y ")}. Desactívalo en su lugar.`
    );
  }

  const { rowCount } = await query("DELETE FROM proveedores WHERE id_proveedor = $1", [id]);
  if (!rowCount) throw new HttpError(404, "El proveedor no existe.");
  return { ok: true };
}

export { list, getById, ciudades, create, update, setEstado, remove };
