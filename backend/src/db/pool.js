import pg from "pg";
import { env } from "../config/env.js";

/**
 * Pool de conexiones a PostgreSQL.
 *
 * Todas las consultas van parametrizadas ($1, $2, ...). Nunca se concatena
 * un valor del usuario dentro del SQL: esa es la defensa contra inyección.
 *
 * Sobre el tamaño del pool: en Vercel la API corre como función, y puede
 * haber varias instancias vivas al mismo tiempo. Si cada una abriera diez
 * conexiones, un plan gratuito de PostgreSQL se queda sin cupo enseguida
 * ("too many connections"). Por eso allá se abren pocas y se sueltan rápido;
 * en local se mantiene el pool de siempre.
 */
function crearPool() {
  const comun = {
    ssl: env.db.ssl,
    max: env.esServerless ? 2 : 10,
    idleTimeoutMillis: env.esServerless ? 10000 : 30000,
    connectionTimeoutMillis: 10000
  };

  return env.db.connectionString
    ? new pg.Pool({ connectionString: env.db.connectionString, ...comun })
    : new pg.Pool({
        host: env.db.host,
        port: env.db.port,
        database: env.db.database,
        user: env.db.user,
        password: env.db.password,
        ...comun
      });
}

/**
 * En serverless el módulo se reevalúa entre invocaciones, pero el proceso
 * puede seguir vivo. Guardar el pool en globalThis evita crear uno nuevo
 * (con sus conexiones) en cada petición.
 */
const pool = globalThis.__eda_pool ?? crearPool();
if (env.esServerless) globalThis.__eda_pool = pool;

pool.on("error", (error) => {
  console.error("[db] error inesperado en el pool:", error.message);
});

/** Atajo para una consulta suelta. */
const query = (text, params) => pool.query(text, params);

/** Ejecuta varias consultas dentro de una transacción. */
async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export { pool, query, withTransaction };
