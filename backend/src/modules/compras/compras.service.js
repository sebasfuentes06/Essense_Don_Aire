import { query, withTransaction } from "../../db/pool.js";
import { HttpError } from "../../middleware/errors.js";

/**
 * Compras a proveedores.
 *
 * Este es el primer módulo que no solo guarda filas: mueve el inventario.
 * Registrar una compra suma al stock de cada producto; cancelarla lo resta.
 * Por eso todo lo que escribe va dentro de una transacción — si la compra se
 * guarda pero el stock no sube, o al revés, el inventario queda mintiendo y
 * nadie se entera hasta que falta mercancía en la bodega.
 *
 * Tres reglas que vale la pena tener presentes al leer el código:
 *
 * 1. Los totales NO se toman del formulario. Llegan en la petición, sí, pero
 *    se recalculan aquí a partir de cantidad × costo. Cualquiera puede mandar
 *    un total de $1 con un fetch desde la consola del navegador.
 *
 * 2. El estado NO se elige a mano. Sale de los abonos registrados: sin abonos
 *    es 'pending', con parte 'partial', con todo 'paid'. Así no puede existir
 *    una compra marcada "Pagada" que nadie pagó.
 *
 * 3. Una compra registrada no se edita. Ya movió stock y es el soporte de lo
 *    que se le debe al proveedor. Si quedó mal, se cancela y se hace otra.
 */

// Lista blanca de columnas ordenables: un identificador no se puede
// parametrizar con $1, así que si viniera suelto sería inyección.
const ORDENABLES = {
  date: "date",
  folio: "folio",
  supplierName: '"supplierName"',
  total: "total",
  balance: "balance",
  status: "status"
};

const ESTADOS = ["pending", "partial", "paid", "cancelled"];

/* ------------------------------------------------------------------ */
/* Lectura                                                             */
/* ------------------------------------------------------------------ */

function construirFiltro({ search = "", status = "all", supplierId = "", from = "", to = "" }) {
  const where = [];
  const params = [];

  if (String(search).trim()) {
    params.push(`%${String(search).trim()}%`);
    where.push(`(folio ILIKE $${params.length} OR "supplierName" ILIKE $${params.length})`);
  }
  if (ESTADOS.includes(status)) {
    params.push(status);
    where.push(`status = $${params.length}`);
  }
  // "Por pagar" agrupa pendientes y parciales: es lo que de verdad se quiere
  // ver cuando alguien pregunta qué le falta pagar a los proveedores.
  if (status === "unpaid") {
    where.push(`status IN ('pending', 'partial')`);
  }
  if (supplierId && supplierId !== "all") {
    params.push(Number(supplierId));
    where.push(`"supplierId" = $${params.length}`);
  }
  if (String(from).trim()) {
    params.push(String(from).trim());
    where.push(`date >= $${params.length}::DATE`);
  }
  if (String(to).trim()) {
    // Se suma un día para que el rango incluya todo el día final: `date` es
    // TIMESTAMP, así que "<= 2026-09-15" dejaría fuera una compra de las 3pm.
    params.push(String(to).trim());
    where.push(`date < ($${params.length}::DATE + INTERVAL '1 day')`);
  }

  return { filtro: where.length ? `WHERE ${where.join(" AND ")}` : "", params };
}

async function list(opciones = {}) {
  const { filtro, params } = construirFiltro(opciones);

  const orderCol = ORDENABLES[opciones.sortBy] ?? ORDENABLES.date;
  const orderDir = String(opciones.sortDir).toLowerCase() === "asc" ? "ASC" : "DESC";

  const pagina = Math.max(1, Number(opciones.page) || 1);
  const porPagina = Math.min(100, Math.max(1, Number(opciones.limit) || 10));
  const offset = (pagina - 1) * porPagina;

  /**
   * Los indicadores se calculan sobre TODO lo filtrado, no sobre la página.
   * Las canceladas se excluyen de las cifras de dinero: una orden anulada no
   * es plata comprada ni plata debida, aunque siga apareciendo en la tabla.
   */
  const resumen = await query(
    `SELECT COUNT(*)::INT                                                       AS total,
            COUNT(*) FILTER (WHERE status IN ('pending','partial'))::INT        AS "porPagar",
            COUNT(*) FILTER (WHERE status = 'cancelled')::INT                   AS canceladas,
            COALESCE(SUM(total)   FILTER (WHERE status <> 'cancelled'), 0)::NUMERIC(14,2) AS "totalComprado",
            COALESCE(SUM(balance) FILTER (WHERE status <> 'cancelled'), 0)::NUMERIC(14,2) AS "saldoPendiente"
       FROM vw_frontend_compras ${filtro}`,
    params
  );

  const paginado = [...params, porPagina, offset];
  const { rows } = await query(
    `SELECT * FROM vw_frontend_compras
     ${filtro}
     ORDER BY ${orderCol} ${orderDir}, id DESC
     LIMIT $${paginado.length - 1} OFFSET $${paginado.length}`,
    paginado
  );

  const stats = resumen.rows[0];
  return {
    data: rows,
    stats: {
      ...stats,
      totalComprado: Number(stats.totalComprado),
      saldoPendiente: Number(stats.saldoPendiente)
    },
    meta: {
      total: stats.total,
      page: pagina,
      limit: porPagina,
      totalPages: Math.max(1, Math.ceil(stats.total / porPagina))
    }
  };
}

async function getById(id) {
  const { rows } = await query("SELECT * FROM vw_frontend_compras WHERE id = $1", [id]);
  if (!rows[0]) throw new HttpError(404, "La compra no existe.");
  return rows[0];
}

/**
 * Propone el siguiente folio libre con el patrón OC-001.
 *
 * Es una sugerencia para el formulario, no una reserva: si dos personas
 * abrieran el formulario al mismo tiempo recibirían el mismo número y la
 * segunda chocaría contra el UNIQUE de la tabla al guardar. Ese choque se
 * traduce en un mensaje claro más abajo; el número de verdad lo decide la
 * base, no esto.
 */
async function siguienteFolio() {
  const { rows } = await query(
    `SELECT COALESCE(MAX(NULLIF(regexp_replace(folio, '\\D', '', 'g'), '')::INT), 0) AS n
       FROM compras
      WHERE folio ~ '^OC-[0-9]+$'`
  );
  return `OC-${String(rows[0].n + 1).padStart(3, "0")}`;
}

/** Catálogos para el formulario: a quién se le compra y cómo se le paga. */
async function opciones() {
  const proveedores = await query(
    "SELECT id_proveedor AS id, nombre FROM proveedores WHERE estado = TRUE ORDER BY nombre"
  );
  const metodosPago = await query(
    "SELECT id_metodo_pago AS id, nombre, codigo FROM metodo_pago WHERE estado = TRUE ORDER BY id_metodo_pago"
  );
  return {
    proveedores: proveedores.rows,
    metodosPago: metodosPago.rows,
    folioSugerido: await siguienteFolio()
  };
}

/**
 * Los productos que se le pueden comprar a un proveedor.
 *
 * Se limita a los suyos a propósito. `productos.id_proveedor` dice a quién se
 * le compra cada producto; si una compra pudiera traer productos de otro
 * proveedor, ese campo quedaría diciendo una cosa mientras el historial dice
 * otra. Si de verdad se le empieza a comprar a otro, lo correcto es cambiarle
 * el proveedor al producto desde su propio módulo.
 */
async function productosDeProveedor(idProveedor) {
  const { rows } = await query(
    `SELECT id_producto AS id, sku, nombre, precio, stock, stock_minimo AS "stockMinimo"
       FROM productos
      WHERE id_proveedor = $1 AND estado = TRUE
      ORDER BY nombre`,
    [idProveedor]
  );
  return { productos: rows };
}

/* ------------------------------------------------------------------ */
/* Escritura                                                           */
/* ------------------------------------------------------------------ */

function validarCabecera({ folio, id_proveedor, fecha_compra, impuesto }) {
  const errores = {};

  if (!folio?.trim()) errores.folio = "El folio es obligatorio.";
  else if (folio.trim().length > 20) errores.folio = "El folio no puede exceder 20 caracteres.";

  if (!Number(id_proveedor)) errores.id_proveedor = "Debes seleccionar un proveedor.";

  if (fecha_compra) {
    const fecha = new Date(fecha_compra);
    if (Number.isNaN(fecha.getTime())) {
      errores.fecha_compra = "La fecha no es válida.";
    } else {
      // Una compra registra mercancía que YA entró. Una fecha futura es un
      // dedazo, y dejarla pasar descuadra cualquier informe por período.
      const finDeHoy = new Date();
      finDeHoy.setHours(23, 59, 59, 999);
      if (fecha > finDeHoy) errores.fecha_compra = "La fecha no puede ser futura.";
    }
  }

  if (impuesto !== undefined && impuesto !== null && impuesto !== "") {
    const valor = Number(impuesto);
    if (!Number.isFinite(valor) || valor < 0) errores.impuesto = "El impuesto no puede ser negativo.";
  }

  return errores;
}

/**
 * Revisa los ítems y devuelve la lista ya normalizada, con el subtotal de
 * cada línea calculado aquí y no tomado del formulario.
 */
function validarItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return { errores: { items: "Agrega al menos un producto a la compra." }, limpios: [] };
  }

  const limpios = [];
  const vistos = new Set();

  for (const [i, item] of items.entries()) {
    const idProducto = Number(item?.id_producto ?? item?.productId);
    const cantidad = Number(item?.cantidad ?? item?.quantity);
    const costo = Number(item?.precio_costo ?? item?.unitCost);

    if (!Number.isInteger(idProducto) || idProducto < 1) {
      return { errores: { items: `El ítem ${i + 1} no tiene un producto válido.` }, limpios: [] };
    }
    if (vistos.has(idProducto)) {
      return {
        errores: { items: "Hay un producto repetido en la lista. Súmale la cantidad a la línea que ya está." },
        limpios: []
      };
    }
    vistos.add(idProducto);

    if (!Number.isInteger(cantidad) || cantidad < 1) {
      return { errores: { items: `La cantidad del ítem ${i + 1} debe ser un entero mayor que cero.` }, limpios: [] };
    }
    if (!Number.isFinite(costo) || costo < 0) {
      return { errores: { items: `El costo del ítem ${i + 1} debe ser un número mayor o igual a cero.` }, limpios: [] };
    }

    limpios.push({
      idProducto,
      cantidad,
      costo: Math.round(costo * 100) / 100,
      subtotal: Math.round(costo * cantidad * 100) / 100
    });
  }

  return { errores: {}, limpios };
}

/**
 * Recalcula pagado, saldo y estado a partir de los abonos que hay en la base,
 * y los deja guardados en la fila de la compra.
 *
 * Esas tres columnas son, en rigor, datos derivados: podrían calcularse cada
 * vez desde `pagos_compra`. Se guardan porque la vista y los informes las
 * consultan mucho, pero eso obliga a que TODO lo que toque los abonos pase
 * por aquí dentro de la misma transacción. Si alguien inserta un pago por su
 * cuenta sin llamar a esto, la compra queda diciendo un saldo que no es.
 */
async function recalcularPagos(client, idCompra) {
  const { rows } = await client.query(
    `SELECT c.total,
            COALESCE((SELECT SUM(monto) FROM pagos_compra WHERE id_compra = c.id_compra), 0) AS pagado
       FROM compras c
      WHERE c.id_compra = $1`,
    [idCompra]
  );
  if (!rows[0]) throw new HttpError(404, "La compra no existe.");

  const total = Number(rows[0].total);
  const pagado = Number(rows[0].pagado);
  const saldo = Math.round((total - pagado) * 100) / 100;

  // El >= no sobra: si alguien abona de más por un error de digitación, la
  // compra debe quedar en 'paid', no en un 'partial' con saldo negativo.
  const estado = pagado <= 0 ? "pending" : pagado >= total ? "paid" : "partial";

  await client.query(
    "UPDATE compras SET pagado = $2, saldo = $3, estado = $4 WHERE id_compra = $1",
    [idCompra, pagado, saldo, estado]
  );

  return { total, pagado, saldo, estado };
}

async function create(datos, actorId) {
  const { folio, id_proveedor, fecha_compra, impuesto = 0, items } = datos;

  const errores = validarCabecera({ folio, id_proveedor, fecha_compra, impuesto });
  const { errores: erroresItems, limpios } = validarItems(items);
  Object.assign(errores, erroresItems);

  if (Object.keys(errores).length) {
    throw new HttpError(400, "Revisa los datos de la compra.", errores);
  }

  const idCompra = await withTransaction(async (client) => {
    const proveedor = await client.query(
      "SELECT id_proveedor, nombre, estado FROM proveedores WHERE id_proveedor = $1",
      [Number(id_proveedor)]
    );
    if (!proveedor.rows[0]) {
      throw new HttpError(400, "El proveedor no existe.", { id_proveedor: "Proveedor no encontrado." });
    }
    if (!proveedor.rows[0].estado) {
      throw new HttpError(409, `${proveedor.rows[0].nombre} está inactivo: actívalo antes de registrarle compras.`, {
        id_proveedor: "Este proveedor está inactivo."
      });
    }

    const repetido = await client.query("SELECT 1 FROM compras WHERE folio = $1", [folio.trim()]);
    if (repetido.rowCount) {
      throw new HttpError(409, `Ya existe una compra con el folio "${folio.trim()}".`, {
        folio: "Ese folio ya está usado."
      });
    }

    /**
     * Se bloquean las filas de los productos con FOR UPDATE antes de leer el
     * stock. Sin eso, dos compras registradas a la vez leerían el mismo stock
     * inicial y la segunda pisaría la suma de la primera: entrarían 40
     * unidades a la bodega y el sistema mostraría 20.
     */
    const ids = limpios.map((i) => i.idProducto);
    const productos = await client.query(
      `SELECT id_producto, nombre, id_proveedor, estado
         FROM productos
        WHERE id_producto = ANY($1::INT[])
        ORDER BY id_producto
        FOR UPDATE`,
      [ids]
    );

    const porId = new Map(productos.rows.map((p) => [p.id_producto, p]));

    for (const item of limpios) {
      const producto = porId.get(item.idProducto);
      if (!producto) {
        throw new HttpError(400, `El producto con id ${item.idProducto} no existe.`, {
          items: "Hay un producto que ya no existe. Quítalo de la lista."
        });
      }
      if (!producto.estado) {
        throw new HttpError(409, `El producto "${producto.nombre}" está inactivo.`, {
          items: `"${producto.nombre}" está inactivo: actívalo o quítalo de la compra.`
        });
      }
      if (Number(producto.id_proveedor) !== Number(id_proveedor)) {
        throw new HttpError(
          409,
          `"${producto.nombre}" no es un producto de ${proveedor.rows[0].nombre}. Si ahora se le compra a este proveedor, cámbiaselo desde el módulo Productos.`,
          { items: `"${producto.nombre}" pertenece a otro proveedor.` }
        );
      }
    }

    const subtotal = Math.round(limpios.reduce((suma, i) => suma + i.subtotal, 0) * 100) / 100;
    const impuestoNum = Math.round(Number(impuesto || 0) * 100) / 100;
    const total = Math.round((subtotal + impuestoNum) * 100) / 100;

    const { rows } = await client.query(
      `INSERT INTO compras
         (folio, id_proveedor, id_usuario, fecha_compra, subtotal, impuesto, total, pagado, saldo, estado)
       VALUES ($1, $2, $3, COALESCE($4::TIMESTAMP, CURRENT_TIMESTAMP), $5, $6, $7, 0, $7, 'pending')
       RETURNING id_compra`,
      [folio.trim(), Number(id_proveedor), actorId, fecha_compra || null, subtotal, impuestoNum, total]
    );
    const nuevoId = rows[0].id_compra;

    for (const item of limpios) {
      await client.query(
        `INSERT INTO detalle_compra (id_compra, id_producto, cantidad, precio_costo, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [nuevoId, item.idProducto, item.cantidad, item.costo, item.subtotal]
      );
      // Aquí es donde la compra deja de ser un papel y entra a la bodega.
      await client.query(
        "UPDATE productos SET stock = stock + $2 WHERE id_producto = $1",
        [item.idProducto, item.cantidad]
      );
    }

    return nuevoId;
  });

  return getById(idCompra);
}

/** Registra un abono al proveedor y deja que el estado se recalcule solo. */
async function registrarPago(idCompra, { id_metodo_pago, monto, referencia, fecha_pago }) {
  const errores = {};

  if (!Number(id_metodo_pago)) errores.id_metodo_pago = "Debes elegir un método de pago.";

  const montoNum = Math.round(Number(monto) * 100) / 100;
  if (!Number.isFinite(montoNum) || montoNum <= 0) {
    errores.monto = "El monto debe ser un número mayor que cero.";
  }
  if (referencia && String(referencia).length > 100) {
    errores.referencia = "La referencia no puede exceder 100 caracteres.";
  }

  if (Object.keys(errores).length) {
    throw new HttpError(400, "Revisa los datos del abono.", errores);
  }

  await withTransaction(async (client) => {
    // FOR UPDATE sobre la compra: dos abonos simultáneos leerían el mismo
    // saldo y ambos pasarían la validación de "no excede el saldo".
    const { rows } = await client.query(
      "SELECT folio, total, pagado, estado FROM compras WHERE id_compra = $1 FOR UPDATE",
      [idCompra]
    );
    const compra = rows[0];
    if (!compra) throw new HttpError(404, "La compra no existe.");

    if (compra.estado === "cancelled") {
      throw new HttpError(409, `La compra ${compra.folio} está cancelada: no se le pueden registrar abonos.`);
    }

    const saldo = Math.round((Number(compra.total) - Number(compra.pagado)) * 100) / 100;
    if (saldo <= 0) {
      throw new HttpError(409, `La compra ${compra.folio} ya está pagada por completo.`);
    }
    if (montoNum > saldo) {
      throw new HttpError(
        409,
        `El abono ($${montoNum.toLocaleString("es-CO")}) supera el saldo pendiente ($${saldo.toLocaleString("es-CO")}).`,
        { monto: `El saldo es $${saldo.toLocaleString("es-CO")}.` }
      );
    }

    const metodo = await client.query(
      "SELECT 1 FROM metodo_pago WHERE id_metodo_pago = $1 AND estado = TRUE",
      [Number(id_metodo_pago)]
    );
    if (!metodo.rowCount) {
      throw new HttpError(400, "El método de pago no existe o está inactivo.", {
        id_metodo_pago: "Método de pago no válido."
      });
    }

    await client.query(
      `INSERT INTO pagos_compra (id_compra, id_metodo_pago, monto, referencia, fecha_pago)
       VALUES ($1, $2, $3, $4, COALESCE($5::TIMESTAMP, CURRENT_TIMESTAMP))`,
      [idCompra, Number(id_metodo_pago), montoNum, referencia?.trim() || null, fecha_pago || null]
    );

    await recalcularPagos(client, idCompra);
  });

  return getById(idCompra);
}

/**
 * Anula un abono mal registrado.
 *
 * Existe porque cancelar una compra con abonos está bloqueado: sin una forma
 * de deshacer un pago, una compra pagada por error se quedaría atascada para
 * siempre sin poder cancelarse.
 */
async function anularPago(idCompra, idPago) {
  await withTransaction(async (client) => {
    const compra = await client.query("SELECT estado FROM compras WHERE id_compra = $1 FOR UPDATE", [idCompra]);
    if (!compra.rows[0]) throw new HttpError(404, "La compra no existe.");

    const { rowCount } = await client.query(
      "DELETE FROM pagos_compra WHERE id_pago = $1 AND id_compra = $2",
      [idPago, idCompra]
    );
    if (!rowCount) throw new HttpError(404, "Ese abono no existe en esta compra.");

    await recalcularPagos(client, idCompra);
  });

  return getById(idCompra);
}

/**
 * Cancela la compra y devuelve el stock que había entrado.
 *
 * El caso que hay que atajar: se compraron 20 unidades, se vendieron 17, y
 * ahora alguien cancela la compra. Restar 20 dejaría el stock en -17, que es
 * una cifra que no significa nada. Se revisa producto por producto y se
 * bloquea diciendo exactamente cuál no alcanza.
 */
async function cancelar(id) {
  await withTransaction(async (client) => {
    const compra = await client.query(
      "SELECT folio, estado FROM compras WHERE id_compra = $1 FOR UPDATE",
      [id]
    );
    if (!compra.rows[0]) throw new HttpError(404, "La compra no existe.");
    if (compra.rows[0].estado === "cancelled") {
      throw new HttpError(409, `La compra ${compra.rows[0].folio} ya estaba cancelada.`);
    }

    const pagos = await client.query(
      "SELECT COUNT(*)::INT AS n, COALESCE(SUM(monto), 0) AS monto FROM pagos_compra WHERE id_compra = $1",
      [id]
    );
    if (pagos.rows[0].n > 0) {
      throw new HttpError(
        409,
        `No se puede cancelar: la compra tiene ${pagos.rows[0].n} abono(s) por $${Number(pagos.rows[0].monto).toLocaleString("es-CO")}. Anula primero los abonos desde el detalle de la compra.`
      );
    }

    const items = await client.query(
      `SELECT dc.id_producto, dc.cantidad, p.nombre, p.stock
         FROM detalle_compra dc
         JOIN productos p ON p.id_producto = dc.id_producto
        WHERE dc.id_compra = $1
        ORDER BY dc.id_producto
        FOR UPDATE OF p`,
      [id]
    );

    const insuficientes = items.rows.filter((i) => Number(i.stock) < Number(i.cantidad));
    if (insuficientes.length) {
      const detalle = insuficientes
        .map((i) => `"${i.nombre}" trajo ${i.cantidad} y quedan ${i.stock} en existencia`)
        .join("; ");
      throw new HttpError(
        409,
        `No se puede cancelar sin dejar el inventario en negativo: ${detalle}. Esa mercancía ya salió, así que la compra no se puede deshacer.`
      );
    }

    for (const item of items.rows) {
      await client.query(
        "UPDATE productos SET stock = stock - $2 WHERE id_producto = $1",
        [item.id_producto, item.cantidad]
      );
    }

    await client.query("UPDATE compras SET estado = 'cancelled' WHERE id_compra = $1", [id]);
  });

  return getById(id);
}

/**
 * Eliminar del todo.
 *
 * Solo se permite sobre una compra ya cancelada: así el stock ya se devolvió
 * en el paso de cancelación y aquí no hay nada de inventario que deshacer.
 * Eliminar una compra vigente borraría el soporte de una entrada de mercancía
 * que sí ocurrió.
 */
async function remove(id) {
  const { rows } = await query("SELECT folio, estado FROM compras WHERE id_compra = $1", [id]);
  if (!rows[0]) throw new HttpError(404, "La compra no existe.");

  if (rows[0].estado !== "cancelled") {
    throw new HttpError(
      409,
      `Solo se pueden eliminar compras canceladas. Cancela primero ${rows[0].folio}: así el stock que entró se devuelve antes de borrar el registro.`
    );
  }

  // detalle_compra y pagos_compra tienen ON DELETE CASCADE.
  await query("DELETE FROM compras WHERE id_compra = $1", [id]);
  return { ok: true };
}

export {
  list,
  getById,
  opciones,
  productosDeProveedor,
  siguienteFolio,
  create,
  registrarPago,
  anularPago,
  cancelar,
  remove
};
