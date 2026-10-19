import { cargarMunicipios } from "./persona";

/**
 * Departamentos y ciudades de Colombia desde la API pública API Colombia
 * (https://api-colombia.com). Si no responde, se usa la lista de
 * departamentos guardada aquí y, para Antioquia, la de municipios de
 * respaldo; para los demás se deja escribir la ciudad a mano.
 */

const API = "https://api-colombia.com/api/v1";

export const DEPARTAMENTOS_RESPALDO = [
  "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bogotá D.C.", "Bolívar", "Boyacá", "Caldas", "Caquetá",
  "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca", "Guainía", "Guaviare", "Huila",
  "La Guajira", "Magdalena", "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda",
  "San Andrés y Providencia", "Santander", "Sucre", "Tolima", "Valle del Cauca", "Vaupés", "Vichada"
];

const sinTildes = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const ordenar = (l, f = (x) => x) => [...l].sort((a, b) => sinTildes(f(a)).localeCompare(sinTildes(f(b))));
export const mismoNombre = (a, b) => sinTildes(a ?? "") === sinTildes(b ?? "");

async function pedir(url) {
  const control = new AbortController();
  const espera = setTimeout(() => control.abort(), 12000);
  try {
    const r = await fetch(url, { signal: control.signal, headers: { Accept: "application/json" } });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(espera);
  }
}

let departamentos = null;
const ciudades = new Map();

/** [{ id, nombre }] — id es null si vienen del respaldo. */
export async function cargarDepartamentos() {
  if (departamentos) return departamentos;
  const datos = await pedir(`${API}/Department`);
  if (Array.isArray(datos) && datos.length > 20) {
    departamentos = ordenar(
      datos.map((d) => ({ id: d.id, nombre: String(d.name ?? "").trim() })).filter((d) => d.nombre),
      (d) => d.nombre
    );
    return departamentos;
  }
  return DEPARTAMENTOS_RESPALDO.map((nombre) => ({ id: null, nombre }));
}

/** Ciudades del departamento; [] si no hay forma de obtenerlas (se escribe a mano). */
export async function cargarCiudades(departamento) {
  if (!departamento) return [];
  if (mismoNombre(departamento.nombre, "Antioquia")) return (await cargarMunicipios()).lista;
  if (!departamento.id) return [];
  if (ciudades.has(departamento.id)) return ciudades.get(departamento.id);
  const datos = await pedir(`${API}/Department/${departamento.id}/cities`);
  const lista = Array.isArray(datos) ? ordenar([...new Set(datos.map((c) => String(c?.name ?? "").trim()).filter(Boolean))]) : [];
  if (lista.length) ciudades.set(departamento.id, lista);
  return lista;
}
