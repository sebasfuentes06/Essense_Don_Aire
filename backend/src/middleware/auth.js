import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { query } from "../db/pool.js";
import { HttpError, asyncHandler } from "./errors.js";

/**
 * Verifica el token y deja en req.user los datos de la sesión, incluidos
 * los permisos que la BD tiene para su rol.
 *
 * Los permisos se leen de `rol_permiso` en cada petición a propósito: si un
 * administrador le quita un permiso a un rol, el cambio aplica de inmediato
 * y no queda "congelado" dentro de un token viejo.
 */
const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new HttpError(401, "Falta el token de acceso.");
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new HttpError(401, "El token no es válido o ya expiró.");
  }

  const { rows } = await query(
    `SELECT u.id_usuario, u.nombre, u.correo, u.telefono, u.estado,
            r.id_rol, r.nombre AS rol,
            COALESCE(array_agg(rp.id_permiso) FILTER (WHERE rp.id_permiso IS NOT NULL), '{}') AS permisos
       FROM usuarios u
       JOIN roles r ON r.id_rol = u.id_rol
       LEFT JOIN rol_permiso rp ON rp.id_rol = r.id_rol
      WHERE u.id_usuario = $1
      GROUP BY u.id_usuario, r.id_rol`,
    [payload.sub]
  );

  const user = rows[0];
  if (!user) throw new HttpError(401, "La cuenta ya no existe.");
  if (!user.estado) throw new HttpError(403, "La cuenta está desactivada.");

  req.user = {
    id: user.id_usuario,
    name: user.nombre,
    email: user.correo,
    phone: user.telefono,
    role: user.rol,
    roleId: user.id_rol,
    permissions: user.permisos
  };

  next();
});

/** Exige un permiso concreto; responde 403 si el rol no lo tiene. */
function requirePermission(permission) {
  return (req, _res, next) => {
    if (!req.user?.permissions?.includes(permission)) {
      return next(new HttpError(403, `Tu perfil no tiene el permiso "${permission}".`));
    }
    next();
  };
}

export { authenticate, requirePermission };
