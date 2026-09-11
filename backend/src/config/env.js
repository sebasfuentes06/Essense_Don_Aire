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

const env = {
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
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
