import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { query } from "../../db/pool.js";
import { HttpError } from "../../middleware/errors.js";

const SALT_ROUNDS = 10;

/**
 * Hash real de una cadena aleatoria. Se usa solo para gastar el mismo tiempo
 * cuando el correo no existe; nunca coincide con ninguna contraseña.
 */
const HASH_DESCARTABLE = "$2a$10$mNnHkPETud9qiA4c/xnAP.IRSjTQt/XGCZemgKwyPQYnyxApATJKG";

/**
 * bcrypt.compare lanza excepción si el hash guardado está corrupto o vacío
 * (por ejemplo, un usuario insertado a mano en la base). Eso debe tratarse
 * como "contraseña incorrecta", no como una caída del servidor.
 */
async function comparar(contrasena, hash) {
  try {
    return await bcrypt.compare(contrasena, hash ?? "");
  } catch {
    return false;
  }
}

/** Trae al usuario con su rol y la lista de permisos de ese rol. */
async function findUserByEmail(correo) {
  const { rows } = await query(
    `SELECT u.id_usuario, u.nombre, u.correo, u.contrasena, u.telefono, u.estado,
            r.nombre AS rol,
            COALESCE(array_agg(rp.id_permiso) FILTER (WHERE rp.id_permiso IS NOT NULL), '{}') AS permisos
       FROM usuarios u
       JOIN roles r ON r.id_rol = u.id_rol
       LEFT JOIN rol_permiso rp ON rp.id_rol = r.id_rol
      WHERE lower(u.correo) = lower($1)
      GROUP BY u.id_usuario, r.id_rol`,
    [correo]
  );
  return rows[0] ?? null;
}

function toSession(user) {
  return {
    id: user.id_usuario,
    name: user.nombre,
    email: user.correo,
    phone: user.telefono,
    role: user.rol,
    permissions: user.permisos
  };
}

function signToken(user) {
  return jwt.sign({ sub: user.id_usuario, role: user.rol }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
}

async function login({ correo, contrasena }) {
  if (!correo?.trim()) throw new HttpError(400, "Debes indicar tu correo electrónico.");
  if (!contrasena) throw new HttpError(400, "Debes indicar tu contraseña.");

  const user = await findUserByEmail(correo);

  // Mismo mensaje para "no existe" y "clave incorrecta": si fueran distintos,
  // cualquiera podría averiguar qué correos están registrados.
  const genérico = new HttpError(401, "Correo o contraseña incorrectos.");

  if (!user) {
    // Se compara igual contra un hash real y descartable, para que responder
    // "no existe" tarde lo mismo que "clave incorrecta". Si no, el tiempo de
    // respuesta delataría qué correos están registrados.
    await comparar(contrasena, HASH_DESCARTABLE);
    throw genérico;
  }

  const ok = await comparar(contrasena, user.contrasena);
  if (!ok) throw genérico;
  if (!user.estado) throw new HttpError(403, "La cuenta está desactivada. Contacta al administrador.");

  await query("UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id_usuario = $1", [
    user.id_usuario
  ]);

  return { token: signToken(user), user: toSession(user) };
}

/** Registro público: solo se permite crear cuentas de Cliente o Vendedor. */
const ROLES_PUBLICOS = ["Cliente", "Vendedor"];

async function register({ nombre, correo, contrasena, telefono, rol }) {
  if (!nombre?.trim()) throw new HttpError(400, "El nombre completo es obligatorio.");
  if (!correo?.trim()) throw new HttpError(400, "El correo electrónico es obligatorio.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
    throw new HttpError(400, "El correo electrónico no tiene un formato válido.");
  }
  if (!contrasena || contrasena.length < 8) {
    throw new HttpError(400, "La contraseña debe tener al menos 8 caracteres.");
  }
  if (!ROLES_PUBLICOS.includes(rol)) {
    throw new HttpError(400, `El perfil debe ser uno de: ${ROLES_PUBLICOS.join(", ")}.`);
  }

  const existe = await findUserByEmail(correo);
  if (existe) throw new HttpError(409, "Ya hay una cuenta registrada con ese correo.");

  const hash = await bcrypt.hash(contrasena, SALT_ROUNDS);

  const { rows } = await query(
    `INSERT INTO usuarios (id_rol, nombre, correo, contrasena, telefono)
     VALUES ((SELECT id_rol FROM roles WHERE nombre = $1), $2, lower($3), $4, $5)
     RETURNING id_usuario`,
    [rol, nombre.trim(), correo.trim(), hash, telefono?.trim() || null]
  );

  const creado = await findUserByEmail(correo);
  return { token: signToken(creado), user: toSession(creado), id: rows[0].id_usuario };
}

/**
 * Cambio de contraseña de la propia cuenta.
 *
 * Se exige la contraseña actual a propósito: si alguien deja la sesión
 * abierta en un equipo compartido, no basta con tener el token para
 * quedarse con la cuenta.
 */
async function changePassword(idUsuario, { actual, nueva, confirmacion }) {
  if (!actual) throw new HttpError(400, "Debes escribir tu contraseña actual.", { actual: "Campo obligatorio." });
  if (!nueva || nueva.length < 8) {
    throw new HttpError(400, "La nueva contraseña debe tener al menos 8 caracteres.", {
      nueva: "La nueva contraseña debe tener al menos 8 caracteres."
    });
  }
  if (confirmacion !== undefined && confirmacion !== nueva) {
    throw new HttpError(400, "La confirmación no coincide con la nueva contraseña.", {
      confirmacion: "Las contraseñas no coinciden."
    });
  }
  if (actual === nueva) {
    throw new HttpError(400, "La nueva contraseña debe ser distinta de la actual.", {
      nueva: "Debe ser distinta de la actual."
    });
  }

  const { rows } = await query("SELECT contrasena FROM usuarios WHERE id_usuario = $1", [idUsuario]);
  if (!rows[0]) throw new HttpError(404, "La cuenta ya no existe.");

  const ok = await comparar(actual, rows[0].contrasena);
  if (!ok) throw new HttpError(401, "La contraseña actual no es correcta.", { actual: "No es correcta." });

  const hash = await bcrypt.hash(nueva, SALT_ROUNDS);
  await query("UPDATE usuarios SET contrasena = $2 WHERE id_usuario = $1", [idUsuario, hash]);

  return { ok: true, mensaje: "Contraseña actualizada correctamente." };
}

export { login, register, changePassword, toSession };
