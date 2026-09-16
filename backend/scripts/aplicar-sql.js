/**
 * Ejecuta un archivo .sql contra la base configurada en .env.
 *
 *     npm run db:sql -- ../Database/parche_01_proveedores_y_roles.sql
 *
 * Existe porque `psql` no siempre está en el PATH de Windows: el instalador
 * de PostgreSQL no lo agrega salvo que se marque la casilla. Este script usa
 * el mismo `pg` y el mismo .env que la API, así que si el backend arranca,
 * esto también funciona.
 *
 * Muestra los NOTICE del servidor —los bloques DO los usan para avisar qué
 * hicieron o por qué no— y pinta las tablas que devuelvan los SELECT finales,
 * que es como se comprueba que el parche quedó aplicado.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { env } from "../src/config/env.js";

const aquí = path.dirname(fileURLToPath(import.meta.url));

function conexión() {
  return env.db.connectionString
    ? { connectionString: env.db.connectionString, ssl: env.db.ssl }
    : {
        host: env.db.host,
        port: env.db.port,
        database: env.db.database,
        user: env.db.user,
        password: env.db.password,
        ssl: env.db.ssl
      };
}

/** Imprime un resultado como tabla, si trajo filas. */
function pintar(resultado) {
  if (!resultado?.rows?.length) return;
  console.table(resultado.rows);
}

async function main() {
  const argumento = process.argv[2];
  if (!argumento) {
    console.error("Falta el archivo. Ejemplo:");
    console.error("  npm run db:sql -- ../Database/parche_01_proveedores_y_roles.sql");
    process.exit(1);
  }

  // Se admite ruta relativa a scripts/ o al directorio desde el que se llama.
  const candidatos = [
    path.resolve(process.cwd(), argumento),
    path.resolve(aquí, argumento),
    path.resolve(aquí, "..", argumento)
  ];

  let ruta = null;
  let sql = null;
  for (const candidato of candidatos) {
    try {
      sql = await readFile(candidato, "utf8");
      ruta = candidato;
      break;
    } catch {
      /* se prueba el siguiente */
    }
  }

  if (!sql) {
    console.error(`No encontré el archivo "${argumento}". Probé en:`);
    for (const c of candidatos) console.error(`  ${c}`);
    process.exit(1);
  }

  const destino = env.db.connectionString
    ? "la base de DATABASE_URL"
    : `${env.db.database} en ${env.db.host}:${env.db.port}`;

  console.log(`\nArchivo: ${ruta}`);
  console.log(`Base:    ${destino}\n`);

  const client = new pg.Client(conexión());

  // Los RAISE NOTICE de los bloques DO llegan por aquí. Sin este listener el
  // parche parecería no decir nada, que es justo lo contrario de lo que pasa.
  client.on("notice", (aviso) => {
    const texto = (aviso.message ?? "").trimEnd();
    if (texto) console.log(`  ${texto}`);
  });

  await client.connect();

  try {
    const resultado = await client.query(sql);
    // Con varias sentencias, pg devuelve un arreglo de resultados.
    if (Array.isArray(resultado)) resultado.forEach(pintar);
    else pintar(resultado);
    console.log("\nListo.\n");
  } catch (error) {
    console.error(`\nEl SQL falló: ${error.message}`);
    if (error.position) console.error(`Posición en el archivo: ${error.position}`);
    if (error.hint) console.error(`Pista: ${error.hint}`);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("No se pudo conectar:", error.message);
  process.exit(1);
});
