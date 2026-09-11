import pg from "pg";
import { env } from "../config/env.js";

/**
 * Pool de conexiones a PostgreSQL.
 *
 * Todas las consultas van parametrizadas ($1, $2, ...). Nunca se concatena
 * un valor del usuario dentro del SQL: esa es la defensa contra inyección.
 */
const pool = new pg.Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
  max: 10,
  idleTimeoutMillis: 30000
});

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
