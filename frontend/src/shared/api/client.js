/**
 * Cliente HTTP de la aplicación.
 *
 * Centraliza tres cosas que si no, habría que repetir en cada módulo:
 *  - la URL base de la API,
 *  - el token en la cabecera Authorization,
 *  - la traducción de un fallo en un mensaje que la persona entienda.
 */

/**
 * A dónde se mandan las peticiones.
 *
 * La web usa la MISMA API que la app móvil (Node + Express + PostgreSQL en
 * Vercel/Neon): un solo backend, los mismos datos en el celular y en la web.
 * Así, un pedido que el cliente hace desde la app aparece en el panel web y
 * al revés.
 *
 * VITE_API_URL permite apuntar a otra API sin tocar el código, por ejemplo a
 * la API corriendo en tu PC: VITE_API_URL=http://localhost:3000/api
 */
const BASE_URL = (import.meta.env.VITE_API_URL ?? "https://api-proyecto-formativo.vercel.app/api").replace(/\/$/, "");
const TOKEN_KEY = "eda_token_v2"; // v2: token de la API unificada (el viejo ya no sirve)

/** Se dispara cuando la API responde 401: lo usa AuthContext para cerrar sesión. */
let onUnauthorized = null;
const setUnauthorizedHandler = (handler) => { onUnauthorized = handler; };

function getToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setToken(token) {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* localStorage bloqueado: la sesión vivirá solo en memoria */
  }
}

/** Error de la API con el código HTTP y, si vino, los errores por campo. */
class ApiError extends Error {
  constructor(message, { status, details } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

/** Arma la query string ignorando valores vacíos. */
function toQuery(params = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.append(key, value);
  }
  const texto = search.toString();
  return texto ? `?${texto}` : "";
}

async function request(path, { method = "GET", body, params, auth = true } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const token = auth ? getToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}${toQuery(params)}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch {
    // fetch solo falla así cuando no hubo respuesta: servidor caído, puerto
    // equivocado o CORS. Es el error más común al montar todo por primera vez.
    throw new ApiError(
      `No se pudo conectar con el servidor (${BASE_URL}). Verifica que la API esté corriendo.`,
      { status: 0 }
    );
  }

  if (response.status === 204) return null;

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    if (response.status === 401) onUnauthorized?.();
    throw new ApiError(payload?.error ?? payload?.mensaje ?? `Error ${response.status} en la petición.`, {
      status: response.status,
      // La API responde los errores por campo en "detalles".
      details: payload?.detalles ?? payload?.details
    });
  }

  return payload;
}

/**
 * Trae TODAS las filas de un listado paginado de la API (de a 100), hasta
 * `maximo`. Las tablas del panel filtran y ordenan en el navegador, así que
 * necesitan la lista completa.
 */
async function todos(path, params = {}, { maximo = 2000 } = {}) {
  const filas = [];
  for (let page = 1; page <= 50; page++) {
    const r = await request(path, { params: { ...params, page, limit: 100 } });
    filas.push(...(r?.datos ?? []));
    const totalPaginas = r?.paginacion?.totalPaginas ?? 1;
    if (page >= totalPaginas || filas.length >= maximo) break;
  }
  return filas;
}

const api = {
  todos,
  /** Devuelve solo `datos` de la respuesta de la API ({ ok, datos }). */
  datos: async (path, params, options) => (await request(path, { ...options, params }))?.datos,
  get: (path, params, options) => request(path, { ...options, params }),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
  patch: (path, body, options) => request(path, { ...options, method: "PATCH", body }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" })
};

export { api, ApiError, getToken, setToken, setUnauthorizedHandler, BASE_URL, TOKEN_KEY };
