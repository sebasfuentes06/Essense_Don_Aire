import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { pool } from "./db/pool.js";
import { notFound, errorHandler } from "./middleware/errors.js";
import { authRouter } from "./modules/auth/auth.controller.js";
import { categoriasRouter } from "./modules/categorias/categorias.controller.js";
import { productosRouter } from "./modules/productos/productos.controller.js";

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      // sin origin = herramientas como curl o Postman: se permiten
      if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
      // Se niega SIN lanzar excepción: así no se omite la cabecera y el
      // navegador bloquea la petición, en vez de devolver un 500 confuso.
      callback(null, false);
    },
    credentials: true
  })
);
app.use(express.json());

/** Chequeo de salud: sirve para saber si la API y la BD están vivas. */
app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, db: "conectada", origenesPermitidos: env.corsOrigins });
  } catch (error) {
    res.status(503).json({ ok: false, db: "sin conexión", error: error.message });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/categorias", categoriasRouter);
app.use("/api/productos", productosRouter);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(env.port, () => {
  console.log(`API de Essence Don Aire escuchando en http://localhost:${env.port}`);
  console.log(`Orígenes permitidos: ${env.corsOrigins.join(", ")}`);
});

/** Cierre ordenado: evita dejar conexiones colgadas en PostgreSQL. */
for (const señal of ["SIGINT", "SIGTERM"]) {
  process.on(señal, () => {
    server.close(() => pool.end().then(() => process.exit(0)));
  });
}

export { app };
