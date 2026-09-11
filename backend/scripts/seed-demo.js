/**
 * Datos de demostración: proveedores y productos.
 *
 * Va aparte del script de base de datos a propósito: `data_base.sql` crea la
 * ESTRUCTURA y los catálogos que el sistema necesita para funcionar (roles,
 * permisos, métodos de pago, categorías). Esto de aquí son datos de ejemplo
 * para poder probar y sustentar, y no deberían ir mezclados con lo anterior.
 *
 *     npm run seed:demo
 *
 * Es idempotente: si el SKU ya existe, actualiza en vez de duplicar.
 * Sin al menos un proveedor no se puede crear ningún producto, porque
 * `productos.id_proveedor` es obligatorio.
 */
import { pool, query } from "../src/db/pool.js";

const PROVEEDORES = [
  { nombre: "Fragancias Premium SA",     contacto: "Juan García",  email: "juan@fragpremium.com",  telefono: "+57 601 234 5678", ciudad: "Bogotá",    calificacion: 4.8, resenas: 42 },
  { nombre: "Perfumes Internacionales",  contacto: "María López",  email: "maria@perfintl.com",    telefono: "+57 604 456 7890", ciudad: "Medellín",  calificacion: 4.5, resenas: 28 },
  { nombre: "Esencias del Caribe",       contacto: "Pedro Ramos",  email: "pedro@esencaribe.com",  telefono: "+57 605 789 0123", ciudad: "Cartagena", calificacion: 4.2, resenas: 15 }
];

const PRODUCTOS = [
  { sku: "ESS-ROY-001", nombre: "Essence Royale",  categoria: "Exclusivos", proveedor: "Fragancias Premium SA",    precio: 89.99, stock: 45, minimo: 20, descripcion: "Fragancia premium con notas de ámbar y vainilla" },
  { sku: "NOI-ELE-002", nombre: "Noir Elegance",   categoria: "Hombre",     proveedor: "Perfumes Internacionales", precio: 74.99, stock: 12, minimo: 20, descripcion: "Aroma masculino intenso con notas de madera" },
  { sku: "GOL-MIS-003", nombre: "Golden Mist",     categoria: "Mujer",      proveedor: "Fragancias Premium SA",    precio: 79.99, stock: 38, minimo: 15, descripcion: "Fragancia femenina floral y luminosa" },
  { sku: "VEL-ROS-004", nombre: "Velvet Rose",     categoria: "Mujer",      proveedor: "Esencias del Caribe",      precio: 69.99, stock: 52, minimo: 15, descripcion: "Rosa aterciopelada con fondo almizclado" },
  { sku: "OCE-BRE-005", nombre: "Ocean Breeze",    categoria: "Unisex",     proveedor: "Esencias del Caribe",      precio: 64.99, stock: 8,  minimo: 25, descripcion: "Frescura marina para todos los días" },
  { sku: "MID-DRE-006", nombre: "Midnight Dream",  categoria: "Hombre",     proveedor: "Perfumes Internacionales", precio: 84.99, stock: 30, minimo: 15, descripcion: "Nocturno, especiado y envolvente" }
];

async function main() {
  console.log("Proveedores:");
  for (const p of PROVEEDORES) {
    const { rows } = await query(
      `INSERT INTO proveedores (nombre, contacto, email, telefono, ciudad, calificacion, cantidad_resenas)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT DO NOTHING
       RETURNING id_proveedor`,
      [p.nombre, p.contacto, p.email, p.telefono, p.ciudad, p.calificacion, p.resenas]
    );
    const id = rows[0]?.id_proveedor
      ?? (await query("SELECT id_proveedor FROM proveedores WHERE nombre = $1", [p.nombre])).rows[0]?.id_proveedor;
    console.log(`  ${p.nombre.padEnd(26)} id=${id}`);
  }

  console.log("\nProductos:");
  for (const p of PRODUCTOS) {
    const { rows } = await query(
      `INSERT INTO productos (id_categoria, id_proveedor, sku, nombre, descripcion, precio, stock, stock_minimo)
       VALUES ((SELECT id_categoria FROM categorias WHERE nombre = $1),
               (SELECT id_proveedor FROM proveedores WHERE nombre = $2),
               $3, $4, $5, $6, $7, $8)
       ON CONFLICT (sku) DO UPDATE
         SET nombre = EXCLUDED.nombre, descripcion = EXCLUDED.descripcion,
             precio = EXCLUDED.precio, stock = EXCLUDED.stock, stock_minimo = EXCLUDED.stock_minimo
       RETURNING id_producto`,
      [p.categoria, p.proveedor, p.sku, p.nombre, p.descripcion, p.precio, p.stock, p.minimo]
    );
    const bajo = p.stock < p.minimo ? "  <- stock bajo" : "";
    console.log(`  ${p.sku}  ${p.nombre.padEnd(16)} stock ${String(p.stock).padStart(3)}/${p.minimo}${bajo}`);
  }

  console.log("\nListo. Dos productos quedan bajo el mínimo a propósito, para que se vean las alertas de stock.");
  await pool.end();
}

main().catch((error) => {
  console.error("Error sembrando datos de demostración:", error.message);
  process.exit(1);
});
