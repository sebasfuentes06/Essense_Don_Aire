/**
 * Formato y nombres compartidos por los módulos conectados a la API
 * (los mismos textos que usa la app móvil).
 *
 * PostgreSQL devuelve NUMERIC como texto ("185000.00"): todo número pasa por
 * num() antes de sumarse o formatearse.
 */
export const num = (v) => {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
};

const moneda = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
export const dinero = (v) => moneda.format(num(v));

export const fecha = (v) =>
  v ? new Date(v).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "—";
export const fechaHora = (v) =>
  v
    ? new Date(v).toLocaleString("es-CO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "—";
export const fechaApi = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
};

export const NOMBRES_METODO = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  nequi: "Nequi",
  daviplata: "Daviplata",
  tarjeta: "Tarjeta",
  wompi: "Wompi"
};
export const METODOS_VENTA = ["efectivo", "transferencia", "nequi", "daviplata", "tarjeta", "wompi"];
export const METODOS_ABONO = ["efectivo", "transferencia", "nequi", "daviplata", "tarjeta"];
export const METODOS_REPORTE = ["transferencia", "nequi", "daviplata"];

/** Lo que escoge un cliente al hacer su pedido. */
export const METODOS_PEDIDO_CLIENTE = [
  { value: "wompi", label: "Pagar en línea con Wompi", ayuda: "Cuando confirmemos tu pedido, pagas desde tu cuenta con tarjeta, PSE o Nequi." },
  { value: "transferencia", label: "Transferencia (Nequi, Daviplata, banco)", ayuda: "Transfiere el total y sube la foto del comprobante (obligatoria)." },
  { value: "efectivo", label: "Efectivo en el punto físico", ayuda: "Pagas cuando recojas o recibas tu pedido." }
];

export const NOMBRES_CANAL = { whatsapp: "WhatsApp", punto_fisico: "Punto físico", app: "App / Web" };
export const NOMBRES_ESTADO_PAGO = { aplicado: "Aplicado", anulado: "Anulado", pendiente: "Por aprobar", rechazado: "Rechazado" };
export const hora = (v) => (v ? new Date(v).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }) : "");
