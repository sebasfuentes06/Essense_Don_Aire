/**
 * Pruebas del módulo Proveedores contra la API corriendo de verdad.
 *
 *     node scripts/probar-proveedores.js
 *
 * No usa mocks: levanta peticiones HTTP reales contra localhost:4000 y la
 * base de datos real. Limpia lo que crea al terminar.
 */

const BASE = process.env.API_URL ?? "http://localhost:4000/api";

let ok = 0;
let fallos = 0;
const errores = [];

function check(nombre, condicion, detalle = "") {
  if (condicion) {
    ok++;
    console.log(`  ok   ${nombre}`);
  } else {
    fallos++;
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

/**
 * Borra lo que haya quedado de una corrida anterior que se cayó a mitad.
 * Sin esto, la segunda corrida choca contra el nombre único y falla por una
 * razón que no tiene nada que ver con lo que se está probando.
 */
async function limpiarRestos(token) {
  const { body } = await pedir("/proveedores?search=Prueba&limit=100", { token });
  for (const p of body?.data ?? []) {
    if (/prueba/i.test(p.name)) await pedir(`/proveedores/${p.id}`, { method: "DELETE", token });
  }
}

async function main() {
  console.log(`\nProbando ${BASE}\n`);

  // ----------------------------------------------------------------
  console.log("Sesión y permisos");
  // ----------------------------------------------------------------
  const admin = await entrar("admin@essence.com");
  const vendedor = await entrar("carlos@essence.com");
  await limpiarRestos(admin);
  check("el administrador obtiene token", Boolean(admin));
  check("el vendedor obtiene token", Boolean(vendedor));

  const sinToken = await pedir("/proveedores");
  check("sin token responde 401", sinToken.status === 401, `dio ${sinToken.status}`);

  const tokenFalso = await pedir("/proveedores", { token: "esto.no.es.un.token" });
  check("con token inválido responde 401", tokenFalso.status === 401, `dio ${tokenFalso.status}`);

  const vendedorVe = await pedir("/proveedores", { token: vendedor });
  check("el vendedor SÍ puede listar (suppliers.view)", vendedorVe.status === 200, `dio ${vendedorVe.status}`);

  const vendedorCrea = await pedir("/proveedores", {
    method: "POST",
    token: vendedor,
    body: { nombre: "Intruso", contacto: "X", ciudad: "Cali" }
  });
  check("el vendedor NO puede crear (403)", vendedorCrea.status === 403, `dio ${vendedorCrea.status}`);

  // ----------------------------------------------------------------
  console.log("\nListado");
  // ----------------------------------------------------------------
  const lista = await pedir("/proveedores", { token: admin });
  check("GET /proveedores responde 200", lista.status === 200);
  check("trae data, stats y meta", Boolean(lista.body?.data && lista.body?.stats && lista.body?.meta));
  check("data es un arreglo", Array.isArray(lista.body?.data));

  const fila = lista.body?.data?.[0] ?? {};
  const campos = ["id", "name", "contact", "email", "phone", "city", "rating",
                  "reviews", "status", "since", "totalOrders", "totalSpent", "totalProducts"];
  const faltantes = campos.filter((c) => !(c in fila));
  check("cada fila trae los campos que espera React", faltantes.length === 0, `faltan: ${faltantes.join(", ")}`);

  check("stats.total cuenta todos los proveedores",
    lista.body?.stats?.total >= 3, `dio ${lista.body?.stats?.total}`);
  check("stats trae activos e inactivos",
    typeof lista.body?.stats?.activos === "number" && typeof lista.body?.stats?.inactivos === "number");
  check("stats trae calificacionPromedio numérica",
    typeof lista.body?.stats?.calificacionPromedio === "number",
    `dio ${typeof lista.body?.stats?.calificacionPromedio}`);
  check("stats trae totalProductos",
    typeof lista.body?.stats?.totalProductos === "number");

  const pagina = await pedir("/proveedores?page=1&limit=2", { token: admin });
  check("limit=2 devuelve 2 filas", pagina.body?.data?.length === 2, `dio ${pagina.body?.data?.length}`);
  check("meta.totalPages se calcula", pagina.body?.meta?.totalPages >= 2, `dio ${pagina.body?.meta?.totalPages}`);
  check("meta.total NO se recorta a la página",
    pagina.body?.meta?.total >= 3, `dio ${pagina.body?.meta?.total}`);

  const busca = await pedir("/proveedores?search=Premium", { token: admin });
  check("la búsqueda por nombre filtra", busca.body?.data?.length === 1, `dio ${busca.body?.data?.length}`);

  const buscaCiudad = await pedir("/proveedores?search=Medell", { token: admin });
  check("la búsqueda también mira la ciudad", buscaCiudad.body?.data?.length >= 1,
    `dio ${buscaCiudad.body?.data?.length}`);

  const ordenDesc = await pedir("/proveedores?sortBy=rating&sortDir=desc", { token: admin });
  const ratings = (ordenDesc.body?.data ?? []).map((p) => Number(p.rating));
  check("ordena por calificación descendente",
    ratings.every((v, i) => i === 0 || ratings[i - 1] >= v), `dio ${ratings.join(", ")}`);

  // Un sortBy que no está en la lista blanca no debe romper nada ni ejecutarse.
  const ordenSucio = await pedir("/proveedores?sortBy=nombre;DROP TABLE proveedores", { token: admin });
  check("un sortBy desconocido cae al orden por defecto, no rompe", ordenSucio.status === 200,
    `dio ${ordenSucio.status}`);
  const siguenAhi = await pedir("/proveedores", { token: admin });
  check("la tabla proveedores sigue existiendo después de ese intento",
    siguenAhi.status === 200 && siguenAhi.body?.data?.length >= 3);

  const ciudades = await pedir("/proveedores/ciudades", { token: admin });
  check("/ciudades responde 200 y no lo toma como un id",
    ciudades.status === 200 && Array.isArray(ciudades.body?.ciudades), `dio ${ciudades.status}`);

  // ----------------------------------------------------------------
  console.log("\nValidaciones al crear");
  // ----------------------------------------------------------------
  const casos = [
    ["sin nombre", { contacto: "Ana", ciudad: "Cali" }, "nombre"],
    ["sin contacto", { nombre: "Prueba A", ciudad: "Cali" }, "contacto"],
    ["sin ciudad", { nombre: "Prueba A", contacto: "Ana" }, "ciudad"],
    ["correo mal formado", { nombre: "Prueba A", contacto: "Ana", ciudad: "Cali", email: "arroba-falta" }, "email"],
    ["teléfono mal formado", { nombre: "Prueba A", contacto: "Ana", ciudad: "Cali", telefono: "abc" }, "telefono"],
    ["calificación fuera de rango", { nombre: "Prueba A", contacto: "Ana", ciudad: "Cali", calificacion: 9 }, "calificacion"],
    ["reseñas negativas", { nombre: "Prueba A", contacto: "Ana", ciudad: "Cali", resenas: -3 }, "resenas"]
  ];

  for (const [nombre, body, campoEsperado] of casos) {
    const r = await pedir("/proveedores", { method: "POST", token: admin, body });
    check(`rechaza: ${nombre}`, r.status === 400, `dio ${r.status}`);
    check(`  y señala el campo "${campoEsperado}"`, Boolean(r.body?.details?.[campoEsperado]),
      `details: ${JSON.stringify(r.body?.details)}`);
  }

  // ----------------------------------------------------------------
  console.log("\nCrear, leer, editar, borrar");
  // ----------------------------------------------------------------
  const creado = await pedir("/proveedores", {
    method: "POST",
    token: admin,
    body: {
      nombre: "Aromas de Prueba SAS",
      contacto: "Tester Uno",
      email: "tester@aromasprueba.com",
      telefono: "+57 604 111 2233",
      ciudad: "Manizales",
      calificacion: 4.2,
      resenas: 7
    }
  });
  check("crea y responde 201", creado.status === 201, `dio ${creado.status}`);
  const nuevoId = creado.body?.id;
  check("devuelve el proveedor ya con su id", Number.isInteger(nuevoId));
  check("guarda la ciudad", creado.body?.city === "Manizales", `dio ${creado.body?.city}`);
  check("guarda la calificación", Number(creado.body?.rating) === 4.2, `dio ${creado.body?.rating}`);
  check("un proveedor nuevo arranca sin compras",
    creado.body?.totalOrders === 0 && Number(creado.body?.totalSpent) === 0);

  const repetido = await pedir("/proveedores", {
    method: "POST",
    token: admin,
    body: { nombre: "aromas DE prueba sas", contacto: "Otro", ciudad: "Cali" }
  });
  check("no deja repetir el nombre (aunque cambie mayúsculas)", repetido.status === 409,
    `dio ${repetido.status}`);

  const uno = await pedir(`/proveedores/${nuevoId}`, { token: admin });
  check("GET /proveedores/:id lo encuentra", uno.status === 200 && uno.body?.id === nuevoId);

  const inexistente = await pedir("/proveedores/999999", { token: admin });
  check("un id que no existe da 404", inexistente.status === 404, `dio ${inexistente.status}`);

  const idBasura = await pedir("/proveedores/abc", { token: admin });
  check("un id que no es número da 400, no un 500", idBasura.status === 400, `dio ${idBasura.status}`);

  const idNegativo = await pedir("/proveedores/-5", { token: admin });
  check("un id negativo da 400", idNegativo.status === 400, `dio ${idNegativo.status}`);

  const editado = await pedir(`/proveedores/${nuevoId}`, {
    method: "PUT",
    token: admin,
    body: {
      nombre: "Aromas de Prueba SAS",
      contacto: "Tester Dos",
      email: "tester@aromasprueba.com",
      telefono: "+57 604 111 2233",
      ciudad: "Pereira",
      calificacion: 4.8,
      resenas: 9
    }
  });
  check("edita y responde 200", editado.status === 200, `dio ${editado.status}`);
  check("conservar su propio nombre al editar no se toma como duplicado",
    editado.body?.name === "Aromas de Prueba SAS");
  check("la edición cambió la ciudad", editado.body?.city === "Pereira", `dio ${editado.body?.city}`);
  check("la edición cambió el contacto", editado.body?.contact === "Tester Dos");

  const chocaConOtro = await pedir(`/proveedores/${nuevoId}`, {
    method: "PUT",
    token: admin,
    body: { nombre: "Fragancias Premium SA", contacto: "Tester Dos", ciudad: "Pereira" }
  });
  check("no deja tomar el nombre de OTRO proveedor", chocaConOtro.status === 409,
    `dio ${chocaConOtro.status}`);

  const apagado = await pedir(`/proveedores/${nuevoId}/estado`, {
    method: "PATCH",
    token: admin,
    body: { estado: false }
  });
  check("el interruptor desactiva", apagado.status === 200 && apagado.body?.status === "inactive",
    `dio ${apagado.body?.status}`);

  const soloInactivos = await pedir("/proveedores?status=inactive", { token: admin });
  check("el filtro status=inactive lo encuentra",
    soloInactivos.body?.data?.some((p) => p.id === nuevoId));
  const soloActivos = await pedir("/proveedores?status=active", { token: admin });
  check("y el filtro status=active ya no lo muestra",
    !soloActivos.body?.data?.some((p) => p.id === nuevoId));

  const vendedorApaga = await pedir(`/proveedores/${nuevoId}/estado`, {
    method: "PATCH",
    token: vendedor,
    body: { estado: true }
  });
  check("el vendedor NO puede usar el interruptor (suppliers.toggle)", vendedorApaga.status === 403,
    `dio ${vendedorApaga.status}`);

  await pedir(`/proveedores/${nuevoId}/estado`, { method: "PATCH", token: admin, body: { estado: true } });

  // ----------------------------------------------------------------
  console.log("\nResguardos al eliminar");
  // ----------------------------------------------------------------
  const conProductos = await pedir("/proveedores?search=Premium", { token: admin });
  const ocupado = conProductos.body?.data?.[0];
  check("el proveedor de prueba tiene productos", (ocupado?.totalProducts ?? 0) > 0,
    `tiene ${ocupado?.totalProducts}`);

  const borrarOcupado = await pedir(`/proveedores/${ocupado.id}`, { method: "DELETE", token: admin });
  check("no deja eliminar un proveedor con productos", borrarOcupado.status === 409,
    `dio ${borrarOcupado.status}`);
  check("y el mensaje dice cuántos productos son",
    /producto/i.test(borrarOcupado.body?.error ?? ""), borrarOcupado.body?.error);

  const vendedorBorra = await pedir(`/proveedores/${nuevoId}`, { method: "DELETE", token: vendedor });
  check("el vendedor NO puede eliminar", vendedorBorra.status === 403, `dio ${vendedorBorra.status}`);

  const borrado = await pedir(`/proveedores/${nuevoId}`, { method: "DELETE", token: admin });
  check("sí elimina uno sin productos ni compras", borrado.status === 200, `dio ${borrado.status}`);

  const yaNoEsta = await pedir(`/proveedores/${nuevoId}`, { token: admin });
  check("después de eliminar, ya no aparece", yaNoEsta.status === 404, `dio ${yaNoEsta.status}`);

  const borrarDeNuevo = await pedir(`/proveedores/${nuevoId}`, { method: "DELETE", token: admin });
  check("eliminar dos veces da 404, no un 500", borrarDeNuevo.status === 404, `dio ${borrarDeNuevo.status}`);

  // ----------------------------------------------------------------
  console.log("\nLa cifra de Total comprado (la que estaba inflada)");
  // ----------------------------------------------------------------
  const conCompras = await pedir("/proveedores?search=Premium", { token: admin });
  const p = conCompras.body?.data?.[0];
  if (process.env.COMPRAS_ESPERADAS) {
    const [ordenes, gastado] = process.env.COMPRAS_ESPERADAS.split(":");
    check(`totalOrders = ${ordenes}`, p?.totalOrders === Number(ordenes), `dio ${p?.totalOrders}`);
    check(`totalSpent = ${gastado} (sin multiplicar por la cantidad de productos)`,
      Number(p?.totalSpent) === Number(gastado), `dio ${p?.totalSpent}`);
  }

  // ----------------------------------------------------------------
  console.log(`\n${ok} pruebas pasaron, ${fallos} fallaron\n`);
  if (fallos) {
    console.log("Fallas:");
    for (const e of errores) console.log(`  - ${e}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("\nLa suite se cayó:", error.message);
  process.exit(1);
});
