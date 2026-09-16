/**
 * Formato compartido por los componentes de Compras.
 *
 * Va aparte porque cinco componentes necesitaban lo mismo y tener cinco
 * `new Intl.NumberFormat(...)` repetidos es la forma segura de que un día uno
 * muestre decimales y otro no.
 *
 * Ojo con `Number(...)`: PostgreSQL devuelve NUMERIC como CADENA, no como
 * número, para no perder precisión. Sin la conversión, "99000.00".toFixed()
 * revienta y `a + b` concatena en vez de sumar.
 */

const moneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});

const plata = (valor) => moneda.format(Number(valor ?? 0));

const fecha = (valor) =>
  valor ? new Date(valor).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const fechaHora = (valor) =>
  valor
    ? new Date(valor).toLocaleString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "—";

/** Los cuatro estados de una compra, con su etiqueta y su color. */
const ESTADOS = {
  pending: { label: "Pendiente", variant: "warning" },
  partial: { label: "Parcial", variant: "info" },
  paid: { label: "Pagada", variant: "success" },
  cancelled: { label: "Cancelada", variant: "danger" }
};

const estadoDe = (status) => ESTADOS[status] ?? { label: status ?? "—", variant: "default" };

export { plata, fecha, fechaHora, ESTADOS, estadoDe };
