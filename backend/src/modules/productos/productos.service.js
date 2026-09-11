import { query, withTransaction } from "../../db/pool.js";
import { HttpError } from "../../middleware/errors.js";

/**
 * Productos.
 *
 * Las lecturas salen de `vw_frontend_productos`, que ya resuelve el nombre de
 * la categoría y del proveedor y arma el arreglo de imágenes. Las escrituras
 * van contra la tabla `productos` (y `imagenes_producto` en la misma
 * transacción, para que un producto nunca quede con imágenes a medias).
 */

// Lista blanca: un identificador de columna no se puede parametrizar.
const ORDENABLES = {
  name: "name",
  price: "price",
  stock: "stock",
  category: "category",
  sku: "sku"
};

function validar({ nombre, sku, precio, stock, stock_minimo, id_categoria, id_proveedor }) {
  const errores = {};

  if (!nombre?.trim()) errores.nombre = "El nombre del producto es obligatorio.";
  else if (nombre.trim().length > 100) errores.nombre = "El nombre no puede exceder 100 caracteres.";

  if (!sku?.trim()) errores.sku = "El código SKU es obligatorio.";
  else if (sku.trim().length > 30) errores.sku = "El SKU no puede exceder 30 caracteres.";

  const precioNum = Number(precio);
  if (!Number.isFinite(precioNum) || precioNum < 0) errores.precio = "El precio debe ser un número mayor o igual a cero.";

  const stockNum = Number(stock);
  if (!Number.isInteger(stockNum) || stockNum < 0) errores.stock = "El stock debe ser un entero mayor o igual a cero.";

  const minNum = Number(stock_minimo);
  if (!Number.isInteger(minNum) || minNum < 0) errores.stock_minimo = "El stock mínimo debe ser un entero mayor o igual a cero.";

  if (!Number(id_categoria)) errores.id_categoria = "Debes seleccionar una categoría.";
  if (!Number(id_proveedor)) errores.id_proveedor = "Debes seleccionar un proveedor.";

  if (Object.keys(errores).length) {
    throw new HttpError(400, "Revisa los datos del formulario.", errores);
  }
}

/** Arma el WHERE compartido por el listado y por las estadísticas. */
function construirFiltro({ search = "", category = "Todos", status = "all", stock = "all", supplier = "all", priceMin, priceMax }) {
  const where = [];
  const params = [];

  if (search.trim()) {
    params.push(`%${search.trim()}%`);
    where.push(`(name ILIKE $${params.length} OR sku ILIKE $${params.length} OR description ILIKE $${params.length})`);
  }
  if (category && category !== "Todos" && category !== "all") {
    params.push(category);
    where.push(`category = $${params.length}`);
  }
  if (status === "active" || status === "inactive") {
    params.push(status);
    where.push(`status = $${params.length}`);
  }
  if (supplier && supplier !== "all") {
    params.push(supplier);
    where.push(`supplier = $${params.length}`);
  }
  if (stock === "low") where.push(`stock < "minStock"`);
  if (stock === "normal") where.push(`stock >= "minStock"`);

  if (priceMin !== undefined && priceMin !== "") {
    params.push(Number(priceMin));
    where.push(`price >= $${params.length}`);
  }
  if (priceMax !== undefined && priceMax !== "") {
    params.push(Number(priceMax));
    where.push(`price <= $${params.length}`);
  }

  return { filtro: where.length ? `WHERE ${where.join(" AND ")}` : "", params };
}

async function list(opciones = {}) {
  const { filtro, params } = construirFiltro(opciones);

  const orderCol = ORDENABLES[opciones.sortBy] ?? ORDENABLES.name;
  const orderDir = String(opciones.sortDir).toLowerCase() === "desc" ? "DESC" : "ASC";

  const pagina = Math.max(1, Number(opciones.page) || 1);
  const porPagina = Math.min(100, Math.max(1, Number(opciones.limit) || 10));
  const offset = (pagina - 1) * porPagina;

  /**
   * Las estadísticas se calculan sobre TODO lo filtrado, no sobre la página.
   * Si no, "Total Productos" mostraría 10 cuando hay 200.
   */
  const resumen = await query(
    `SELECT COUNT(*)::INT                                            AS total,
            COUNT(*) FILTER (WHERE status = 'active')::INT           AS activos,
            COUNT(*) FILTER (WHERE stock < "minStock")::INT          AS "lowStockCount",
            COALESCE(SUM(price * stock), 0)::NUMERIC(14,2)           AS "inventoryValue"
       FROM vw_frontend_productos ${filtro}`,
    params
  );

  const paginado = [...params, porPagina, offset];
  const { rows } = await query(
    `SELECT * FROM vw_frontend_productos
     ${filtro}
     ORDER BY ${orderCol} ${orderDir}, id ASC
     LIMIT $${paginado.length - 1} OFFSET $${paginado.length}`,
    paginado
  );

  const stats = resumen.rows[0];
  return {
    data: rows,
    stats: { ...stats, inventoryValue: Number(stats.inventoryValue) },
    meta: {
      total: stats.total,
      page: pagina,
      limit: porPagina,
      totalPages: Math.max(1, Math.ceil(stats.total / porPagina))
    }
  };
}

async function getById(id) {
  const { rows } = await query("SELECT * FROM vw_frontend_productos WHERE id = $1", [id]);
  if (!rows[0]) throw new HttpError(404, "El producto no existe.");
  return rows[0];
}

/** Catálogos para los selectores del formulario y de los filtros. */
async function opciones() {
  const categorias = await query(
    "SELECT id_categoria AS id, nombre FROM categorias WHERE estado = TRUE ORDER BY nombre"
  );
  const proveedores = await query(
    "SELECT id_proveedor AS id, nombre FROM proveedores WHERE estado = TRUE ORDER BY nombre"
  );
  return { categorias: categorias.rows, proveedores: proveedores.rows };
}

/** Reemplaza las imágenes del producto dentro de la misma transacción. */
async function guardarImagen(client, idProducto, imagen) {
  if (imagen === undefined) return;
  await client.query("DELETE FROM imagenes_producto WHERE id_producto = $1", [idProducto]);
  if (imagen?.trim()) {
    await client.query(
      "INSERT INTO imagenes_producto (id_producto, ruta_imagen, orden) VALUES ($1, $2, 0)",
      [idProducto, imagen.trim()]
    );
  }
}

async function create(datos) {
  validar(datos);
  const { nombre, sku, descripcion, precio, stock, stock_minimo, id_categoria, id_proveedor, estado = true, imagen } = datos;

  const id = await withTransaction(async (client) => {
    const { rows } = await client.query(
      `INSERT INTO productos (id_categoria, id_proveedor, sku, nombre, descripcion, precio, stock, stock_minimo, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id_producto`,
      [Number(id_categoria), Number(id_proveedor), sku.trim(), nombre.trim(),
       descripcion?.trim() || null, Number(precio), Number(stock), Number(stock_minimo), estado !== false]
    );
    await guardarImagen(client, rows[0].id_producto, imagen);
    return rows[0].id_producto;
  });

  return getById(id);
}

async function update(id, datos) {
  validar(datos);
  const { nombre, sku, descripcion, precio, stock, stock_minimo, id_categoria, id_proveedor, estado, imagen } = datos;

  await withTransaction(async (client) => {
    const { rowCount } = await client.query(
      `UPDATE productos
          SET id_categoria = $2, id_proveedor = $3, sku = $4, nombre = $5, descripcion = $6,
              precio = $7, stock = $8, stock_minimo = $9, estado = COALESCE($10, estado)
        WHERE id_producto = $1`,
      [id, Number(id_categoria), Number(id_proveedor), sku.trim(), nombre.trim(),
       descripcion?.trim() || null, Number(precio), Number(stock), Number(stock_minimo),
       estado ?? null]
    );
    if (!rowCount) throw new HttpError(404, "El producto no existe.");
    await guardarImagen(client, id, imagen);
  });

  return getById(id);
}

async function setEstado(id, estado) {
  const { rowCount } = await query("UPDATE productos SET estado = $2 WHERE id_producto = $1", [id, Boolean(estado)]);
  if (!rowCount) throw new HttpError(404, "El producto no existe.");
  return getById(id);
}

/**
 * Ajusta el stock sumando o restando (story mapping: "Gestionar stock").
 * La resta nunca puede dejar el stock en negativo.
 */
async function ajustarStock(id, cantidad) {
  const delta = Number(cantidad);
  if (!Number.isInteger(delta) || delta === 0) {
    throw new HttpError(400, "La cantidad debe ser un número entero distinto de cero.");
  }

  const { rows } = await query("SELECT stock FROM productos WHERE id_producto = $1", [id]);
  if (!rows[0]) throw new HttpError(404, "El producto no existe.");

  const nuevo = rows[0].stock + delta;
  if (nuevo < 0) {
    throw new HttpError(409, `No hay stock suficiente: hay ${rows[0].stock} unidades y se intentan restar ${Math.abs(delta)}.`);
  }

  await query("UPDATE productos SET stock = $2 WHERE id_producto = $1", [id, nuevo]);
  return getById(id);
}

/** Eliminar. Se bloquea si el producto ya aparece en ventas, compras o pedidos. */
async function remove(id) {
  const { rows } = await query(
    `SELECT (SELECT COUNT(*) FROM detalle_venta   WHERE id_producto = $1)::INT AS ventas,
            (SELECT COUNT(*) FROM detalle_compra  WHERE id_producto = $1)::INT AS compras,
            (SELECT COUNT(*) FROM detalle_pedido  WHERE id_producto = $1)::INT AS pedidos`,
    [id]
  );
  const { ventas, compras, pedidos } = rows[0];
  const total = ventas + compras + pedidos;

  if (total > 0) {
    const detalle = [
      ventas && `${ventas} venta(s)`,
      compras && `${compras} compra(s)`,
      pedidos && `${pedidos} pedido(s)`
    ].filter(Boolean).join(", ");
    throw new HttpError(
      409,
      `No se puede eliminar: el producto ya aparece en ${detalle}. Desactívalo en su lugar para conservar el historial.`
    );
  }

  const { rowCount } = await query("DELETE FROM productos WHERE id_producto = $1", [id]);
  if (!rowCount) throw new HttpError(404, "El producto no existe.");
  return { ok: true };
}

export { list, getById, opciones, create, update, setEstado, ajustarStock, remove };
