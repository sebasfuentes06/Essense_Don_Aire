import { api, BASE_URL } from "../api";
import { num } from "./formato";

/**
 * Productos de la API -> forma que usan las pantallas de la web.
 * La foto se sirve desde la API (/productos/:id/imagen); la fecha de
 * actualización va en la URL para que el navegador no muestre la vieja.
 */
export function aProducto(p) {
  const actualizada = p.imagen_actualizada ? new Date(p.imagen_actualizada).getTime() : null;
  const image = actualizada ? `${BASE_URL}/productos/${p.id_producto}/imagen?v=${actualizada}` : null;
  return {
    id: p.id_producto,
    sku: p.sku ?? "",
    name: p.nombre ?? "",
    description: p.descripcion ?? "",
    category: p.categoria ?? "",
    categoryId: p.id_categoria,
    supplier: p.proveedor ?? "",
    supplierId: p.id_proveedor,
    price: num(p.precio),
    stock: Number(p.stock ?? 0),
    minStock: Number(p.stock_minimo ?? 0),
    active: p.estado !== false,
    status: p.estado !== false ? "active" : "inactive",
    inStock: p.estado !== false && Number(p.stock ?? 0) > 0,
    image,
    images: image ? [image] : [],
    imageUpdated: p.imagen_actualizada ?? null,
    raw: p
  };
}

export async function cargarProductos(params = {}) {
  return (await api.todos("/productos", { sortBy: "nombre", ...params })).map(aProducto);
}

export async function cargarCategorias(params = { status: "active" }) {
  return (await api.todos("/categorias", params)).map((c) => ({
    id: c.id_categoria,
    name: c.nombre,
    description: c.descripcion ?? "",
    active: c.estado !== false,
    raw: c
  }));
}

export async function cargarProveedores(params = { status: "active" }) {
  return (await api.todos("/proveedores", params)).map((p) => ({ id: p.id_proveedor, name: p.nombre, raw: p }));
}
