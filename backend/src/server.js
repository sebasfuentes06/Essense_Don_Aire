import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { pool } from "./db/pool.js";
import { notFound, errorHandler } from "./middleware/errors.js";
import { authRouter } from "./modules/auth/auth.controller.js";
import { categoriasRouter } from "./modules/categorias/categorias.controller.js";
import { productosRouter } from "./modules/productos/productos.controller.js";
import { usuariosRouter } from "./modules/usuarios/usuarios.controller.js";
import { rolesRouter } from "./modules/roles/roles.controller.js";
import { proveedoresRouter } from "./modules/proveedores/proveedores.controller.js";
import { comprasRouter } from "./modules/compras/compras.controller.js";

const app = express();

/**
 * ¿Este origen está en la lista blanca?
 * Se admite el comodín "*" (todos) y subdominios del estilo
 * https://*.vercel.app, porque Vercel crea un dominio distinto por cada
 * despliegue de vista previa y no se pueden listar uno por uno.
 */
function origenPermitido(origin) {
  return env.corsOrigins.some((permitido) => {
    if (permitido === "*") return true;
    if (!permitido.includes("*")) return permitido === origin;
    const patron = new RegExp(
      `^${permitido.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^.]+")}$`
    );
    return patron.test(origin);
  });
}

app.use(
  cors({
    origin(origin, callback) {
      // sin origin = herramientas como curl o Postman: se permiten
      if (!origin || origenPermitido(origin)) return callback(null, true);
      // Se niega SIN lanzar excepción: así no se omite la cabecera y el
      // navegador bloquea la petición, en vez de devolver un 500 confuso.
      callback(null, false);
    },
    credentials: true
  })
);
app.use(express.json());

/** Portada: abrir la URL de la API en el navegador debe decir algo útil. */
app.get("/", (_req, res) => {
  res.json({
    nombre: "API de Essence Don Aire",
    version: "1.0.0",
    documentacion: "/api/health para el estado; los recursos cuelgan de /api",
    recursos: [
      "/api/auth",
      "/api/usuarios",
      "/api/roles",
      "/api/categorias",
      "/api/productos",
      "/api/proveedores",
      "/api/compras"
    ]
  });
});

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
app.use("/api/usuarios", usuariosRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/proveedores", proveedoresRouter);
app.use("/api/compras", comprasRouter);

app.use(notFound);
app.use(errorHandler);

/**
 * En Vercel la aplicación se exporta y la plataforma la invoca; abrir un
 * puerto allá no sirve de nada. En tu equipo sí se abre, como siempre.
 */
if (!env.esServerless) {
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
}

export default app;
export { app };
