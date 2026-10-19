/**
 * Datos de una persona: los mismos campos, en el mismo orden y con las mismas
 * reglas que la app móvil y la API (registro y ficha de cliente):
 *
 *   nombre completo*, tipo de documento*, documento*, celular* (solo números),
 *   departamento (por defecto Antioquia) y ciudad* (listas de API Colombia),
 *   dirección y correo.
 */

export const TIPOS_DOCUMENTO = [
  { value: "CC", label: "CC · Cédula de ciudadanía" },
  { value: "TI", label: "TI · Tarjeta de identidad" },
  { value: "CE", label: "CE · Cédula de extranjería" },
  { value: "PPT", label: "PPT · Permiso por protección temporal" },
  { value: "PAS", label: "PAS · Pasaporte" },
  { value: "NIT", label: "NIT" }
];

export const PERSONA_VACIA = {
  fullName: "",
  documentType: "",
  document: "",
  phone: "",
  department: "Antioquia",
  city: "",
  address: "",
  email: ""
};

export function validarNombre(v) {
  const t = (v ?? "").trim();
  if (!t) return "El nombre completo es obligatorio.";
  if (t.length < 3 || !t.includes(" ")) return "Escribe nombre y apellido.";
  return "";
}

export function validarDocumento(tipo, v) {
  const t = (v ?? "").trim();
  if (!t) return "El documento es obligatorio.";
  if (tipo === "CC" || tipo === "TI") return /^\d{5,11}$/.test(t) ? "" : "Solo números, entre 5 y 11 dígitos.";
  if (tipo === "NIT") return /^\d{6,12}(-\d)?$/.test(t) ? "" : "NIT no válido (ej. 900123456-7).";
  return /^[A-Za-z0-9]{4,15}$/.test(t) ? "" : "Documento no válido.";
}

export function validarCelular(v) {
  const t = (v ?? "").trim();
  if (!t) return "El celular es obligatorio.";
  return /^3\d{9}$/.test(t) ? "" : "Deben ser 10 números y empezar por 3.";
}

export function validarCorreo(v, { obligatorio }) {
  const t = (v ?? "").trim();
  if (!t) return obligatorio ? "El correo es obligatorio." : "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t) ? "" : "Correo no válido.";
}

/** Revisa todos los campos. Devuelve { campo: mensaje } solo con los que fallan. */
export function validarPersona(p, { correoObligatorio = false } = {}) {
  const errores = {
    fullName: validarNombre(p.fullName),
    documentType: p.documentType ? "" : "Elige el tipo de documento.",
    document: validarDocumento(p.documentType, p.document),
    phone: validarCelular(p.phone),
    department: p.department ? "" : "Elige el departamento.",
    city: p.city ? "" : "Elige la ciudad o municipio.",
    address: (p.address ?? "").length > 150 ? "Máximo 150 caracteres." : "",
    email: validarCorreo(p.email, { obligatorio: correoObligatorio })
  };
  return Object.fromEntries(Object.entries(errores).filter(([, m]) => m));
}

/** Errores por campo que devuelve la API -> nombres de campo de la web. */
export function erroresApiAPersona(detalles = {}) {
  const mapa = {
    nombre: "fullName",
    tipo_documento: "documentType",
    documento: "document",
    telefono: "phone",
    ciudad: "city",
    departamento: "department",
    direccion: "address",
    correo: "email",
    password: "password",
    acepta_datos: "acceptTerms"
  };
  const salida = {};
  for (const [k, v] of Object.entries(detalles ?? {})) salida[mapa[k] ?? k] = v;
  return salida;
}

/** Persona de la web -> cuerpo que espera la API de clientes. */
export function personaAApi(p) {
  return {
    nombre: p.fullName.trim(),
    tipo_documento: p.documentType,
    documento: p.document.trim(),
    telefono: p.phone.trim(),
    departamento: p.department || "Antioquia",
    ciudad: p.city,
    direccion: (p.address ?? "").trim(),
    correo: (p.email ?? "").trim()
  };
}

// ---------------------------------------------------------------------------
// Municipios de Antioquia: API pública "API Colombia"
// (https://api-colombia.com, departamento 2 = Antioquia). Si la API no
// responde, se usa la lista de respaldo para no bloquear el formulario.
// ---------------------------------------------------------------------------

export const URL_MUNICIPIOS = "https://api-colombia.com/api/v1/Department/2/cities";
let cache = null;

const sinTildes = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const ordenar = (l) => [...l].sort((a, b) => sinTildes(a).localeCompare(sinTildes(b)));

export async function cargarMunicipios() {
  if (cache) return cache;
  try {
    const control = new AbortController();
    const espera = setTimeout(() => control.abort(), 12000);
    const r = await fetch(URL_MUNICIPIOS, { signal: control.signal, headers: { Accept: "application/json" } });
    clearTimeout(espera);
    if (r.ok) {
      const nombres = [...new Set((await r.json()).map((m) => String(m?.name ?? "").trim()).filter(Boolean))];
      if (nombres.length > 50) {
        cache = { lista: ordenar(nombres), desdeApi: true };
        return cache;
      }
    }
  } catch {
    /* sin internet o API caída: lista de respaldo */
  }
  return { lista: ordenar(RESPALDO), desdeApi: false };
}

const RESPALDO = [
  "Medellín", "Abejorral", "Abriaquí", "Alejandría", "Amagá", "Amalfi", "Andes", "Angelópolis", "Angostura",
  "Anorí", "Anzá", "Apartadó", "Arboletes", "Argelia", "Armenia", "Barbosa", "Bello", "Belmira", "Betania",
  "Betulia", "Briceño", "Buriticá", "Cáceres", "Caicedo", "Caldas", "Campamento", "Cañasgordas", "Caracolí",
  "Caramanta", "Carepa", "Carolina", "Caucasia", "Chigorodó", "Cisneros", "Ciudad Bolívar", "Cocorná",
  "Concepción", "Concordia", "Copacabana", "Dabeiba", "Don Matías", "Ebéjico", "El Bagre", "El Carmen de Viboral",
  "El Santuario", "Entrerríos", "Envigado", "Fredonia", "Frontino", "Giraldo", "Girardota", "Gómez Plata",
  "Granada", "Guadalupe", "Guarne", "Guatapé", "Heliconia", "Hispania", "Itagüí", "Ituango", "Jardín", "Jericó",
  "La Ceja", "La Estrella", "La Pintada", "La Unión", "Liborina", "Maceo", "Marinilla", "Montebello", "Murindó",
  "Mutatá", "Nariño", "Nechí", "Necoclí", "Olaya", "Peñol", "Peque", "Pueblorrico", "Puerto Berrío",
  "Puerto Nare", "Puerto Triunfo", "Remedios", "Retiro", "Rionegro", "Sabanalarga", "Sabaneta", "Salgar",
  "San Andrés de Cuerquia", "San Carlos", "San Francisco", "San Jerónimo", "San José de La Montaña",
  "San Juan de Urabá", "San Luis", "San Pedro", "San Pedro de Urabá", "San Rafael", "San Roque", "San Vicente",
  "Santa Bárbara", "Santa Rosa de Osos", "Santafé de Antioquia", "Santo Domingo", "Segovia", "Sonsón",
  "Sopetrán", "Támesis", "Tarazá", "Tarso", "Titiribí", "Toledo", "Turbo", "Uramita", "Urrao", "Valdivia",
  "Valparaíso", "Vegachí", "Venecia", "Vigía del Fuerte", "Yalí", "Yarumal", "Yolombó", "Yondó", "Zaragoza"
];
