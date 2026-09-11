/**
 * Cliente HTTP de la aplicación.
 *
 * Centraliza tres cosas que si no, habría que repetir en cada módulo:
 *  - la URL base de la API,
 *  - el token en la cabecera Authorization,
 *  - la traducción de un fallo en un mensaje que la persona entienda.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
const TOKEN_KEY = "eda_token";

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
    throw new ApiError(payload?.error ?? `Error ${response.status} en la petición.`, {
      status: response.status,
      details: payload?.details
    });
  }

  return payload;
}

const api = {
  get: (path, params, options) => request(path, { ...options, params }),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
  patch: (path, body, options) => request(path, { ...options, method: "PATCH", body }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" })
};

export { api, ApiError, getToken, setToken, setUnauthorizedHandler, BASE_URL, TOKEN_KEY };
