/**
 * Restablece la contraseña de un usuario directo en la base de datos.
 * Sirve cuando nadie puede entrar (olvidaste la clave y el correo de
 * recuperación no está configurado).
 *
 *     npm run clave -- correo@ejemplo.com NuevaClave2026*
 *
 * Guarda la clave cifrada con bcrypt (igual que el registro) y reactiva la
 * cuenta si estaba desactivada. Si el correo no existe, lista los que hay.
 */
import bcrypt from "bcryptjs";
import { pool, query } from "../src/db/pool.js";

async function main() {
  const [correo, clave] = process.argv.slice(2);
  if (!correo || !clave) {
    console.log("\nUso: npm run clave -- correo@ejemplo.com NuevaClave2026*\n");
    process.exitCode = 1;
    return;
  }
  if (clave.length < 8) {
    console.log("\nLa contraseña debe tener al menos 8 caracteres.\n");
    process.exitCode = 1;
    return;
  }

  const hash = await bcrypt.hash(clave, 10);
  const { rows } = await query(
    `UPDATE usuarios SET contrasena = $2, estado = TRUE
      WHERE lower(correo) = lower($1)
      RETURNING id_usuario, nombre, correo`,
    [correo.trim(), hash]
  );

  if (!rows[0]) {
    const { rows: todos } = await query("SELECT correo FROM usuarios ORDER BY id_usuario");
    console.log(`\nNo existe un usuario con el correo ${correo}. Los que hay son:`);
    todos.forEach((u) => console.log(`  - ${u.correo}`));
    console.log("");
    process.exitCode = 1;
    return;
  }

  console.log(`\nListo: ${rows[0].nombre} (${rows[0].correo}) ya puede entrar con la contraseña nueva.\n`);
}

main()
  .catch((e) => {
    console.error(`\nNo se pudo restablecer: ${e.message}\n`);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
