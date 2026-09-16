import "dotenv/config";

/** Lee una variable obligatoria y falla temprano si no está. */
function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    throw new Error(
      `Falta la variable de entorno ${name}. Copia backend/.env.example como backend/.env y complétala.`
    );
  }
  return value;
}

/**
 * Orígenes permitidos para el frontend.
 * Vite salta de puerto cuando el 5173 está ocupado (5174, 5175...), así que
 * se acepta una lista en vez de uno solo: si no, el navegador bloquea las
 * peticiones con un error de CORS que no dice nada útil.
 *
 * Se admiten comodines para los despliegues de Vercel, donde cada rama genera
 * un subdominio distinto: https://*.vercel.app
 */
const corsOrigins = (process.env.CORS_ORIGINS ?? process.env.CORS_ORIGIN ?? "http://localhost:5173,http://localhost:5174,http://localhost:5175")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

/**
 * Conexión a la base de datos.
 *
 * Dos formas, y en este orden:
 *  1. DATABASE_URL: una sola cadena. Es lo que entregan Neon, Supabase,
 *     Render y compañía, y es lo que se configura en Vercel.
 *  2. PGHOST/PGUSER/...: variables sueltas, cómodas para trabajar en local
 *     contra el PostgreSQL instalado en el equipo.
 *
 * SSL: los PostgreSQL en la nube lo exigen; el de tu equipo no lo tiene.
 * Se decide solo, y se puede forzar con PGSSL=true/false.
 */
const databaseUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? null;

function esLocal(url) {
  if (!url) return (process.env.PGHOST ?? "localhost").includes("localhost");
  return /@(localhost|127\.0\.0\.1)[:/]/.test(url);
}

function resolverSsl() {
  const forzado = process.env.PGSSL ?? process.env.DB_SSL;
  if (forzado !== undefined) {
    return ["1", "true", "require"].includes(String(forzado).toLowerCase())
      ? { rejectUnauthorized: false }
      : false;
  }
  // Fuera de localhost se asume proveedor en la nube. `rejectUnauthorized: false`
  // porque estos servicios usan certificados que Node no trae en su lista, y sin
  // esto la conexión falla con "self signed certificate in certificate chain".
  return esLocal(databaseUrl) ? false : { rejectUnauthorized: false };
}

const env = {
  port: Number(process.env.PORT ?? 4000),
  // Vercel define esta variable en sus despliegues: sirve para no arrancar
  // un servidor que allá nadie va a escuchar.
  esServerless: Boolean(process.env.VERCEL),
  corsOrigins,
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
  db: {
    connectionString: databaseUrl,
    ssl: resolverSsl(),
    host: process.env.PGHOST ?? "localhost",
    port: Number(process.env.PGPORT ?? 5432),
    database: databaseUrl ? undefined : required("PGDATABASE", "essence_don_aire"),
    user: databaseUrl ? undefined : required("PGUSER", "postgres"),
    password: process.env.PGPASSWORD ?? ""
  }
};

export { env };
