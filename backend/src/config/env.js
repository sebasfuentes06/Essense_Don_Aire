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
 */
const corsOrigins = (process.env.CORS_ORIGINS ?? process.env.CORS_ORIGIN ?? "http://localhost:5173,http://localhost:5174,http://localhost:5175")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const env = {
  port: Number(process.env.PORT ?? 4000),
  corsOrigins,
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
  db: {
    host: process.env.PGHOST ?? "localhost",
    port: Number(process.env.PGPORT ?? 5432),
    database: required("PGDATABASE", "essence_don_aire"),
    user: required("PGUSER", "postgres"),
    password: process.env.PGPASSWORD ?? ""
  }
};

export { env };
