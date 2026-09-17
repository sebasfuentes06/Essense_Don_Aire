/**
 * Punto de entrada de la API cuando el proyecto corre en Vercel.
 *
 * Vercel convierte en función serverless cada archivo que encuentre dentro de
 * la carpeta /api de la raíz. Aquí no se duplica ni una línea de lógica: se
 * reexporta la MISMA aplicación de Express que se usa en tu equipo
 * (backend/src/server.js), que ya termina en `export default app` y que se
 * abstiene de abrir un puerto cuando detecta que está en Vercel
 * (env.esServerless mira la variable VERCEL).
 *
 * El enrutado interno de Express espera rutas completas —/api/health,
 * /api/auth/login, /api/compras...— y Vercel conserva la ruta original de la
 * petición al reescribirla hacia esta función, así que coincide tal cual.
 *
 * Que este archivo sea tan corto es justamente la gracia: el backend sigue
 * siendo un proyecto de Node normal, que se puede correr con `npm run dev`
 * sin saber nada de Vercel.
 */
export { default } from "../backend/src/server.js";
