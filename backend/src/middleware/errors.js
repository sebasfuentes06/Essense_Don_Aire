/** Error con código HTTP, para lanzarlo desde los servicios. */
class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/** Envuelve un handler async para que sus errores lleguen al errorHandler. */
const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

function notFound(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

function errorHandler(error, req, res, _next) {
  const status = error.status ?? 500;

  // 23505 = unique_violation, 23503 = foreign_key_violation (códigos de PostgreSQL)
  if (error.code === "23505") {
    return res.status(409).json({ error: "Ya existe un registro con ese valor único." });
  }
  if (error.code === "23503") {
    return res.status(409).json({ error: "No se puede completar: hay registros relacionados." });
  }

  if (status >= 500) console.error("[api]", error);

  res.status(status).json({
    error: status >= 500 ? "Error interno del servidor." : error.message,
    ...(error.details ? { details: error.details } : {})
  });
}

export { HttpError, asyncHandler, notFound, errorHandler };
