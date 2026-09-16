/**
 * Instala el esquema completo en la base de datos que apunte tu .env.
 *
 *     npm run db:setup
 *
 * Sirve igual para el PostgreSQL de tu equipo que para uno en la nube
 * (Neon, Supabase, Render). Se hizo porque en la nube no hay pgAdmin para
 * abrir el .sql y darle "ejecutar": hay que mandarlo desde aquí.
 *
 * Qué hace, en orden:
 *   1. Vacía el esquema public (borra y lo vuelve a crear).
 *   2. Corre Database/data_base.sql completo.
 *   3. Cuenta tablas, vistas y permisos para confirmar que quedó bien.
 *
 * OJO: el paso 1 borra todo lo que haya en esa base. Por eso pide
 * confirmación, salvo que se pase --force.
 *
 * Opciones (con npm hay que separarlas con --, así:  npm run db:setup -- --force):
 *   --force  no preguntar
 *   --keep   no vaciar el esquema. Solo sirve si la base está vacía y el
 *            proveedor no te deja hacer DROP SCHEMA; sobre una base que ya
 *            tiene las tablas, falla.
 */
import { readFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pool, query } from "../src/db/pool.js";

const aquí = dirname(fileURLToPath(import.meta.url));
const RUTA_SQL = process.env.SQL_FILE ?? resolve(aquí, "..", "..", "Database", "data_base.sql");

const forzar = process.argv.includes("--force");
const conservar = process.argv.includes("--keep");

/** Muestra a qué base se va a conectar, sin filtrar la contraseña. */
function describirDestino() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (url) {
    try {
      const { hostname, pathname, username } = new URL(url);
      return `${username}@${hostname}${pathname}`;
    } catch {
      return "la base indicada en DATABASE_URL";
    }
  }
  const host = process.env.PGHOST ?? "localhost";
  return `${process.env.PGUSER ?? "postgres"}@${host}/${process.env.PGDATABASE ?? "essence_don_aire"}`;
}

async function confirmar(destino) {
  if (forzar) return true;
  const consola = createInterface({ input: process.stdin, output: process.stdout });
  const respuesta = await consola.question(
    `\nEsto BORRA todo lo que haya en ${destino} y lo vuelve a crear.\n¿Seguro? (escribe "si"): `
  );
  consola.close();
  return respuesta.trim().toLowerCase() === "si";
}

async function main() {
  const destino = describirDestino();
  console.log(`Destino: ${destino}`);
  console.log(`Script:  ${RUTA_SQL}`);

  const sql = await readFile(RUTA_SQL, "utf8");

  if (!(await confirmar(destino))) {
    console.log("Cancelado. No se tocó nada.");
    return;
  }

  if (!conservar) {
    console.log("\nVaciando el esquema public...");
    // DROP SCHEMA en vez de DROP DATABASE: en la nube casi nunca te dejan
    // borrar la base entera, y además no se puede estando conectado a ella.
    await query("DROP SCHEMA IF EXISTS public CASCADE");
    await query("CREATE SCHEMA public");
  }

  console.log("Ejecutando data_base.sql...");
  await query(sql);

  const { rows } = await query(
    `SELECT (SELECT COUNT(*) FROM information_schema.tables
              WHERE table_schema = 'public' AND table_type = 'BASE TABLE')::INT AS tablas,
            (SELECT COUNT(*) FROM information_schema.views
              WHERE table_schema = 'public')::INT                               AS vistas,
            (SELECT COUNT(*) FROM permisos)::INT                                AS permisos,
            (SELECT COUNT(*) FROM roles)::INT                                   AS roles`
  );
  const { tablas, vistas, permisos, roles } = rows[0];

  console.log(`\nListo: ${tablas} tablas, ${vistas} vistas, ${permisos} permisos, ${roles} roles.`);
  console.log("Ahora siembra las cuentas de prueba:  npm run seed");
}

main()
  .catch((error) => {
    console.error("\nFalló la instalación de la base:", error.message);
    // 42P07 = la tabla ya existe. Pasa al usar --keep sobre una base que ya
    // tenía el esquema; el mensaje de PostgreSQL por sí solo no lo explica.
    if (error.code === "42P07") {
      console.error("La base ya tiene el esquema. Quita --keep para volver a crearlo desde cero.");
    }
    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      console.error("No se pudo conectar. Revisa DATABASE_URL (o PGHOST/PGUSER) en tu .env.");
    }
    process.exitCode = 1;
  })
  .finally(() => pool.end());
