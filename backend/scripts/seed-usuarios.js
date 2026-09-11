/**
 * Crea los usuarios de prueba con la contraseña YA CIFRADA.
 *
 * No se puede sembrar desde el .sql porque el hash lo genera bcrypt, no
 * PostgreSQL. Se ejecuta una sola vez, después de correr data_base.sql:
 *
 *     npm run seed
 *
 * Es idempotente: si el correo ya existe, actualiza en vez de duplicar.
 */
import bcrypt from "bcryptjs";
import { pool, query } from "../src/db/pool.js";

const CLAVE = process.env.SEED_PASSWORD ?? "Essence2026*";

const USUARIOS = [
  { nombre: "Admin Principal",  correo: "admin@essence.com",  rol: "Administrador", telefono: "+57 300 000 0001" },
  { nombre: "Carlos Vendedor",  correo: "carlos@essence.com", rol: "Vendedor",      telefono: "+57 300 000 0002" },
  { nombre: "María Vendedora",  correo: "maria@essence.com",  rol: "Vendedor",      telefono: "+57 300 000 0003" },
  { nombre: "Laura Cliente",    correo: "laura@essence.com",  rol: "Cliente",       telefono: "+57 300 000 0004",
    direccion: "Calle 10 #43-20", ciudad: "Medellín" }
];

async function main() {
  const hash = await bcrypt.hash(CLAVE, 10);

  for (const u of USUARIOS) {
    const { rows } = await query(
      `INSERT INTO usuarios (id_rol, nombre, correo, contrasena, telefono, direccion, ciudad)
       VALUES ((SELECT id_rol FROM roles WHERE nombre = $1), $2, lower($3), $4, $5, $6, $7)
       ON CONFLICT (correo) DO UPDATE
         SET nombre = EXCLUDED.nombre,
             contrasena = EXCLUDED.contrasena,
             id_rol = EXCLUDED.id_rol,
             telefono = EXCLUDED.telefono
       RETURNING id_usuario`,
      [u.rol, u.nombre, u.correo, hash, u.telefono, u.direccion ?? null, u.ciudad ?? null]
    );
    console.log(`  ${u.correo.padEnd(22)} ${u.rol.padEnd(14)} id=${rows[0].id_usuario}`);
  }

  console.log(`\nListo. Contraseña para todos: ${CLAVE}`);
  console.log("Cámbiala en producción con la variable SEED_PASSWORD.");
  await pool.end();
}

main().catch((error) => {
  console.error("Error sembrando usuarios:", error.message);
  process.exit(1);
});
