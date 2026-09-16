/**
 * Pruebas del módulo Compras contra la API corriendo de verdad.
 *
 *     npm run test:compras
 *
 * Lo que de verdad importa aquí no es el CRUD: es que el stock se mueva y
 * que el estado salga de los abonos. Por eso casi todas las comprobaciones
 * leen el stock ANTES y DESPUÉS de cada operación y comparan la diferencia.
 */

const BASE = process.env.API_URL ?? "http://localhost:4000/api";

let ok = 0;
const errores = [];

function check(nombre, condicion, detalle = "") {
  if (condicion) {
    ok++;
    console.log(`  ok   ${nombre}`);
  } else {
    errores.push(`${nombre}${detalle ? ` — ${detalle}` : ""}`);
    console.log(`  FALLA ${nombre}${detalle ? ` — ${detalle}` : ""}`);
  }
}

async function pedir(path, { method = "GET", body, token } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  return { status: res.status, body: json };
}

async function entrar(correo, clave = "Essence2026*") {
  const r = await pedir("/auth/login", { method: "POST", body: { correo, contrasena: clave } });
  if (r.status !== 200) throw new Error(`No se pudo entrar como ${correo}: ${JSON.stringify(r.body)}`);
  return r.body.token;
}

/** El stock actual de un producto, leído de la API de Productos. */
async function stockDe(token, idProducto) {
  const { body } = await pedir(`/productos/${idProducto}`, { token });
  return Number(body?.stock);
}

/** Borra las compras que dejó una corrida anterior. */
async function limpiar(token) {
  const { body } = await pedir("/compras?search=TEST&limit=100", { token });
  for (const compra of body?.data ?? []) {
    if (!compra.folio.startsWith("TEST-")) continue;
    for (const pago of compra.payments ?? []) {
      await pedir(`/compras/${compra.id}/pagos/${pago.id}`, { method: "DELETE", token });
    }
    if (compra.status !== "cancelled") {
      await pedir(`/compras/${compra.id}/cancelar`, { method: "PATCH", token });
    }
    await pedir(`/compras/${compra.id}`, { method: "DELETE", token });
  }
}

const folio = (n) => `TEST-${String(Date.now()).slice(-6)}-${n}`;

async function main() {
  console.log(`\nProbando ${BASE}\n`);

  const admin = await entrar("admin@essence.com");
  const vendedor = await entrar("carlos@essence.com");
  await limpiar(admin);

  // ----------------------------------------------------------------
  console.log("Catálogos del formulario");
  // ----------------------------------------------------------------
  const opciones = await pedir("/compras/opciones", { token: admin });
  check("GET /compras/opciones responde 200", opciones.status === 200, `dio ${opciones.status}`);
  check("trae proveedores activos", (opciones.body?.proveedores?.length ?? 0) >= 1);
  check("trae métodos de pago", (opciones.body?.metodosPago?.length ?? 0) >= 1);
  check("sugiere un folio con el patrón OC-000",
    /^OC-\d{3,}$/.test(opciones.body?.folioSugerido ?? ""), opciones.body?.folioSugerido);

  const proveedor = opciones.body.proveedores[0];
  const metodo = opciones.body.metodosPago[0];

  const productos = await pedir(`/compras/proveedores/${proveedor.id}/productos`, { token: admin });
  check("los productos del proveedor responden 200", productos.status === 200);
  check("y son solo los suyos", (productos.body?.productos?.length ?? 0) >= 1,
    `${productos.body?.productos?.length} productos`);

  const [p1, p2] = productos.body.productos;
  check("el proveedor de prueba tiene al menos dos productos", Boolean(p1 && p2));

  // Un producto de OTRO proveedor, para probar el resguardo.
  const otroProveedor = opciones.body.proveedores.find((p) => p.id !== proveedor.id);
  const ajenos = await pedir(`/compras/proveedores/${otroProveedor.id}/productos`, { token: admin });
  const productoAjeno = ajenos.body.productos[0];

  // ----------------------------------------------------------------
  console.log("\nValidaciones al registrar");
  // ----------------------------------------------------------------
  const base = { id_proveedor: proveedor.id, items: [{ id_producto: p1.id, cantidad: 5, precio_costo: 1000 }] };

  const casos = [
    ["sin folio", { ...base }, "folio"],
    ["sin proveedor", { folio: folio("a"), items: base.items }, "id_proveedor"],
    ["sin ítems", { folio: folio("b"), id_proveedor: proveedor.id, items: [] }, "items"],
    ["cantidad cero", { folio: folio("c"), id_proveedor: proveedor.id, items: [{ id_producto: p1.id, cantidad: 0, precio_costo: 100 }] }, "items"],
    ["cantidad decimal", { folio: folio("d"), id_proveedor: proveedor.id, items: [{ id_producto: p1.id, cantidad: 2.5, precio_costo: 100 }] }, "items"],
    ["costo negativo", { folio: folio("e"), id_proveedor: proveedor.id, items: [{ id_producto: p1.id, cantidad: 2, precio_costo: -5 }] }, "items"],
    ["producto repetido", { folio: folio("f"), id_proveedor: proveedor.id, items: [{ id_producto: p1.id, cantidad: 1, precio_costo: 100 }, { id_producto: p1.id, cantidad: 2, precio_costo: 100 }] }, "items"],
    ["impuesto negativo", { folio: folio("g"), id_proveedor: proveedor.id, impuesto: -100, items: base.items }, "impuesto"],
    ["fecha futura", { folio: folio("h"), id_proveedor: proveedor.id, fecha_compra: "2099-01-01", items: base.items }, "fecha_compra"]
  ];

  for (const [nombre, body, campo] of casos) {
    const r = await pedir("/compras", { method: "POST", token: admin, body });
    check(`rechaza: ${nombre}`, r.status === 400, `dio ${r.status}`);
    check(`  y señala "${campo}"`, Boolean(r.body?.details?.[campo]),
      JSON.stringify(r.body?.details));
  }

  const ajena = await pedir("/compras", {
    method: "POST",
    token: admin,
    body: {
      folio: folio("i"),
      id_proveedor: proveedor.id,
      items: [{ id_producto: productoAjeno.id, cantidad: 1, precio_costo: 100 }]
    }
  });
  check("rechaza un producto de otro proveedor", ajena.status === 409, `dio ${ajena.status}`);
  check("  y explica de quién es", /otro proveedor|no es un producto/i.test(ajena.body?.error ?? ""),
    ajena.body?.error);

  // ----------------------------------------------------------------
  console.log("\nRegistrar una compra mueve el stock");
  // ----------------------------------------------------------------
  const stock1Antes = await stockDe(admin, p1.id);
  const stock2Antes = await stockDe(admin, p2.id);

  const folioA = folio("A");
  const creada = await pedir("/compras", {
    method: "POST",
    token: admin,
    body: {
      folio: folioA,
      id_proveedor: proveedor.id,
      impuesto: 19000,
      items: [
        { id_producto: p1.id, cantidad: 10, precio_costo: 5000 },
        { id_producto: p2.id, cantidad: 4, precio_costo: 7500 }
      ]
    }
  });

  check("registra y responde 201", creada.status === 201, `dio ${creada.status}`);
  const compraId = creada.body?.id;
  check("devuelve la compra con su id", Number.isInteger(compraId));

  // 10×5000 + 4×7500 = 50000 + 30000 = 80000
  check("el subtotal lo calcula el servidor", Number(creada.body?.subtotal) === 80000,
    `dio ${creada.body?.subtotal}`);
  check("el total suma el impuesto", Number(creada.body?.total) === 99000,
    `dio ${creada.body?.total}`);
  check("nace en estado 'pending'", creada.body?.status === "pending", creada.body?.status);
  check("nace con saldo igual al total", Number(creada.body?.balance) === 99000,
    `dio ${creada.body?.balance}`);
  check("nace sin abonos", (creada.body?.payments?.length ?? 0) === 0);
  check("trae los dos ítems", (creada.body?.items?.length ?? 0) === 2);

  const stock1Despues = await stockDe(admin, p1.id);
  const stock2Despues = await stockDe(admin, p2.id);
  check(`el stock de "${p1.nombre}" subió 10`, stock1Despues === stock1Antes + 10,
    `${stock1Antes} -> ${stock1Despues}`);
  check(`el stock de "${p2.nombre}" subió 4`, stock2Despues === stock2Antes + 4,
    `${stock2Antes} -> ${stock2Despues}`);

  // Los totales NO se toman del formulario.
  const mentirosa = await pedir("/compras", {
    method: "POST",
    token: admin,
    body: {
      folio: folio("M"),
      id_proveedor: proveedor.id,
      subtotal: 1, total: 1, impuesto: 0,
      items: [{ id_producto: p1.id, cantidad: 2, precio_costo: 9000 }]
    }
  });
  check("ignora el total que manda el cliente y lo recalcula",
    Number(mentirosa.body?.total) === 18000, `dio ${mentirosa.body?.total}`);
  const mentirosaId = mentirosa.body?.id;

  const repetida = await pedir("/compras", {
    method: "POST",
    token: admin,
    body: { folio: folioA, id_proveedor: proveedor.id, items: base.items }
  });
  check("no deja repetir el folio", repetida.status === 409, `dio ${repetida.status}`);

  // ----------------------------------------------------------------
  console.log("\nEl estado sale de los abonos, no del formulario");
  // ----------------------------------------------------------------
  const abono1 = await pedir(`/compras/${compraId}/pagos`, {
    method: "POST",
    token: admin,
    body: { id_metodo_pago: metodo.id, monto: 40000, referencia: "Abono 1" }
  });
  check("registra el primer abono", abono1.status === 201, `dio ${abono1.status}`);
  check("pasa a 'partial'", abono1.body?.status === "partial", abono1.body?.status);
  check("el pagado es 40000", Number(abono1.body?.paid) === 40000, `dio ${abono1.body?.paid}`);
  check("el saldo baja a 59000", Number(abono1.body?.balance) === 59000, `dio ${abono1.body?.balance}`);
  check("el abono aparece en el historial", (abono1.body?.payments?.length ?? 0) === 1);
  check("  y el historial trae el nombre del método, no el id",
    typeof abono1.body?.payments?.[0]?.method === "string", JSON.stringify(abono1.body?.payments?.[0]));

  const excedido = await pedir(`/compras/${compraId}/pagos`, {
    method: "POST",
    token: admin,
    body: { id_metodo_pago: metodo.id, monto: 100000 }
  });
  check("no deja abonar más que el saldo", excedido.status === 409, `dio ${excedido.status}`);
  check("  y dice cuál es el saldo", /saldo/i.test(excedido.body?.error ?? ""), excedido.body?.error);

  const cero = await pedir(`/compras/${compraId}/pagos`, {
    method: "POST", token: admin, body: { id_metodo_pago: metodo.id, monto: 0 }
  });
  check("no deja abonar cero", cero.status === 400, `dio ${cero.status}`);

  const sinMetodo = await pedir(`/compras/${compraId}/pagos`, {
    method: "POST", token: admin, body: { monto: 100 }
  });
  check("exige método de pago", sinMetodo.status === 400 && Boolean(sinMetodo.body?.details?.id_metodo_pago));

  const abono2 = await pedir(`/compras/${compraId}/pagos`, {
    method: "POST",
    token: admin,
    body: { id_metodo_pago: metodo.id, monto: 59000, referencia: "Saldo" }
  });
  check("el abono que completa el total la deja en 'paid'", abono2.body?.status === "paid",
    abono2.body?.status);
  check("el saldo queda en 0", Number(abono2.body?.balance) === 0, `dio ${abono2.body?.balance}`);

  const yaPagada = await pedir(`/compras/${compraId}/pagos`, {
    method: "POST", token: admin, body: { id_metodo_pago: metodo.id, monto: 1000 }
  });
  check("una compra pagada no acepta más abonos", yaPagada.status === 409, `dio ${yaPagada.status}`);

  // ----------------------------------------------------------------
  console.log("\nAnular un abono devuelve el estado");
  // ----------------------------------------------------------------
  const idAbono2 = abono2.body.payments.find((p) => Number(p.amount) === 59000)?.id;
  const anulado = await pedir(`/compras/${compraId}/pagos/${idAbono2}`, { method: "DELETE", token: admin });
  check("anula el abono", anulado.status === 200, `dio ${anulado.status}`);
  check("vuelve a 'partial'", anulado.body?.status === "partial", anulado.body?.status);
  check("el saldo vuelve a 59000", Number(anulado.body?.balance) === 59000, `dio ${anulado.body?.balance}`);

  const abonoFantasma = await pedir(`/compras/${compraId}/pagos/999999`, { method: "DELETE", token: admin });
  check("anular un abono inexistente da 404", abonoFantasma.status === 404, `dio ${abonoFantasma.status}`);

  // ----------------------------------------------------------------
  console.log("\nCancelar: resguardos y devolución de stock");
  // ----------------------------------------------------------------
  const conAbonos = await pedir(`/compras/${compraId}/cancelar`, { method: "PATCH", token: admin });
  check("no deja cancelar una compra con abonos", conAbonos.status === 409, `dio ${conAbonos.status}`);
  check("  y dice cuántos abonos tiene", /abono/i.test(conAbonos.body?.error ?? ""), conAbonos.body?.error);

  const idAbono1 = anulado.body.payments[0].id;
  await pedir(`/compras/${compraId}/pagos/${idAbono1}`, { method: "DELETE", token: admin });

  const stock1AntesCancelar = await stockDe(admin, p1.id);
  const cancelada = await pedir(`/compras/${compraId}/cancelar`, { method: "PATCH", token: admin });
  check("ahora sí cancela", cancelada.status === 200, `dio ${cancelada.status}`);
  check("queda en 'cancelled'", cancelada.body?.status === "cancelled", cancelada.body?.status);

  const stock1Final = await stockDe(admin, p1.id);
  check(`cancelar devolvió las 10 unidades de "${p1.nombre}"`, stock1Final === stock1AntesCancelar - 10,
    `${stock1AntesCancelar} -> ${stock1Final}`);
  // No vuelve al stock inicial exacto: entre medio se registró la compra
  // "mentirosa", que también le sumó 2 unidades a este mismo producto y sigue
  // vigente. Lo que se comprueba es que la compra cancelada no dejó rastro.
  check("cancelar deshizo exactamente su propio movimiento, ni más ni menos",
    stock1Final === stock1Antes + 2,
    `inicial ${stock1Antes}, +2 de la otra compra, final ${stock1Final}`);

  const dosVeces = await pedir(`/compras/${compraId}/cancelar`, { method: "PATCH", token: admin });
  check("cancelar dos veces da 409, no un 500", dosVeces.status === 409, `dio ${dosVeces.status}`);

  const abonarCancelada = await pedir(`/compras/${compraId}/pagos`, {
    method: "POST", token: admin, body: { id_metodo_pago: metodo.id, monto: 100 }
  });
  check("una compra cancelada no acepta abonos", abonarCancelada.status === 409, `dio ${abonarCancelada.status}`);

  // El caso que de verdad importa: la mercancía ya salió.
  const stockActual = await stockDe(admin, p1.id);
  const vendible = await pedir("/compras", {
    method: "POST",
    token: admin,
    body: {
      folio: folio("V"),
      id_proveedor: proveedor.id,
      items: [{ id_producto: p1.id, cantidad: 6, precio_costo: 1000 }]
    }
  });
  // Se simula que salieron TODAS las unidades usando el ajuste de stock.
  await pedir(`/productos/${p1.id}/stock`, {
    method: "PATCH", token: admin, body: { cantidad: -(stockActual + 6) }
  });
  const sinStock = await pedir(`/compras/${vendible.body.id}/cancelar`, { method: "PATCH", token: admin });
  check("no deja cancelar si dejaría el stock en negativo", sinStock.status === 409, `dio ${sinStock.status}`);
  check("  y dice qué producto y cuántos quedan",
    /quedan \d+ en existencia/.test(sinStock.body?.error ?? ""), sinStock.body?.error);
  // Se devuelve el stock para no dejar la base sucia.
  await pedir(`/productos/${p1.id}/stock`, {
    method: "PATCH", token: admin, body: { cantidad: stockActual + 6 }
  });
  await pedir(`/compras/${vendible.body.id}/cancelar`, { method: "PATCH", token: admin });
  await pedir(`/compras/${vendible.body.id}`, { method: "DELETE", token: admin });

  // ----------------------------------------------------------------
  console.log("\nEliminar");
  // ----------------------------------------------------------------
  const vigente = await pedir(`/compras/${mentirosaId}`, { method: "DELETE", token: admin });
  check("no deja eliminar una compra vigente", vigente.status === 409, `dio ${vigente.status}`);
  check("  y dice que hay que cancelarla primero", /cancela/i.test(vigente.body?.error ?? ""),
    vigente.body?.error);

  await pedir(`/compras/${mentirosaId}/cancelar`, { method: "PATCH", token: admin });
  const borrada = await pedir(`/compras/${mentirosaId}`, { method: "DELETE", token: admin });
  check("sí elimina una cancelada", borrada.status === 200, `dio ${borrada.status}`);
  check("y ya no aparece", (await pedir(`/compras/${mentirosaId}`, { token: admin })).status === 404);

  const borradaCancelada = await pedir(`/compras/${compraId}`, { method: "DELETE", token: admin });
  check("elimina también la primera, ya cancelada", borradaCancelada.status === 200);

  // ----------------------------------------------------------------
  console.log("\nListado, filtros e indicadores");
  // ----------------------------------------------------------------
  const lista = await pedir("/compras", { token: admin });
  check("GET /compras responde 200", lista.status === 200);
  check("trae data, stats y meta", Boolean(lista.body?.data && lista.body?.stats && lista.body?.meta));
  check("stats trae totalComprado numérico", typeof lista.body?.stats?.totalComprado === "number");
  check("stats trae saldoPendiente numérico", typeof lista.body?.stats?.saldoPendiente === "number");
  check("stats trae porPagar", typeof lista.body?.stats?.porPagar === "number");

  const porPagar = await pedir("/compras?status=unpaid", { token: admin });
  check("el filtro 'unpaid' responde 200", porPagar.status === 200);
  check("  y solo trae pendientes o parciales",
    (porPagar.body?.data ?? []).every((c) => ["pending", "partial"].includes(c.status)));

  const ordenSucio = await pedir("/compras?sortBy=folio;DROP TABLE compras", { token: admin });
  check("un sortBy desconocido no rompe", ordenSucio.status === 200, `dio ${ordenSucio.status}`);
  check("la tabla compras sigue existiendo",
    (await pedir("/compras", { token: admin })).status === 200);

  const idBasura = await pedir("/compras/abc", { token: admin });
  check("un id que no es número da 400, no 500", idBasura.status === 400, `dio ${idBasura.status}`);

  // ----------------------------------------------------------------
  console.log("\nPermisos");
  // ----------------------------------------------------------------
  check("sin token responde 401", (await pedir("/compras")).status === 401);
  check("el vendedor SÍ puede listar", (await pedir("/compras", { token: vendedor })).status === 200);

  const vendedorCrea = await pedir("/compras", {
    method: "POST", token: vendedor,
    body: { folio: folio("X"), id_proveedor: proveedor.id, items: base.items }
  });
  check("el vendedor NO puede registrar compras", vendedorCrea.status === 403, `dio ${vendedorCrea.status}`);

  const vendedorCancela = await pedir("/compras/1/cancelar", { method: "PATCH", token: vendedor });
  check("el vendedor NO puede cancelar", vendedorCancela.status === 403, `dio ${vendedorCancela.status}`);

  const vendedorBorra = await pedir("/compras/1", { method: "DELETE", token: vendedor });
  check("el vendedor NO puede eliminar", vendedorBorra.status === 403, `dio ${vendedorBorra.status}`);

  // ----------------------------------------------------------------
  await limpiar(admin);
  console.log(`\n${ok} pruebas pasaron, ${errores.length} fallaron\n`);
  if (errores.length) {
    console.log("Fallas:");
    for (const e of errores) console.log(`  - ${e}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("\nLa suite se cayó:", error.message);
  process.exit(1);
});
