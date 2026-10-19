import { dinero, fechaHora, NOMBRES_METODO } from "./formato";

const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/**
 * Abre la factura de una venta en una pestaña nueva lista para imprimir o
 * guardar como PDF (Ctrl+P). La venta debe venir con su detalle.
 */
export function imprimirFactura(v) {
  const w = window.open("", "_blank");
  if (!w) return false;
  const filas = v.items
    .map((i) => `<tr><td>${esc(i.productName)}<br><small>${esc(i.sku)}</small></td><td class="n">${i.quantity}</td><td class="n">${dinero(i.unitPrice)}</td><td class="n">${dinero(i.subtotal)}</td></tr>`)
    .join("");
  const pagosHtml = v.payments
    .filter((p) => p.status === "aplicado")
    .map((p) => `<tr><td>${fechaHora(p.date)}</td><td>${esc(NOMBRES_METODO[p.method] ?? p.method)}</td><td class="n">${dinero(p.amount)}</td></tr>`)
    .join("");
  w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Factura ${esc(v.invoice)}</title>
<style>
body{font-family:system-ui,Segoe UI,Arial,sans-serif;color:#1a1a1a;max-width:760px;margin:32px auto;padding:0 16px}
h1{margin:0;font-size:22px;letter-spacing:.08em}.oro{color:#b8911f}
.top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #C9A227;padding-bottom:12px}
table{width:100%;border-collapse:collapse;margin-top:16px}th,td{padding:8px;border-bottom:1px solid #eee;text-align:left;font-size:14px}
th{background:#f8f5f0}.n{text-align:right}.tot td{border:none;padding:4px 8px}.grande{font-size:18px;font-weight:700}
small{color:#777}.anulada{color:#c00;font-weight:700;font-size:20px;border:2px solid #c00;display:inline-block;padding:4px 12px;margin-top:12px}
@media print{button{display:none}}
</style></head><body>
<div class="top"><div><h1>ESSENCE <span class="oro">DON AIRE</span></h1><small>Perfumería · Antioquia</small></div>
<div style="text-align:right"><div class="grande">Factura ${esc(v.invoice)}</div><small>${fechaHora(v.date)}</small>${v.orderCode ? `<br><small>Pedido ${esc(v.orderCode)}</small>` : ""}</div></div>
${v.status === "anulada" ? `<div class="anulada">ANULADA</div><p><small>Motivo: ${esc(v.cancelReason)}</small></p>` : ""}
<p><b>Cliente:</b> ${esc(v.customer)}${v.customerDocument ? ` · ${esc(v.customerDocument)}` : ""}<br>
${v.customerPhone ? `<b>Celular:</b> ${esc(v.customerPhone)}<br>` : ""}${v.customerAddress ? `<b>Dirección:</b> ${esc(v.customerAddress)}<br>` : ""}
<b>Forma de pago:</b> ${esc(NOMBRES_METODO[v.paymentMethod] ?? v.paymentMethod ?? "—")}${v.seller ? ` · <b>Atendió:</b> ${esc(v.seller)}` : ""}</p>
<table><thead><tr><th>Producto</th><th class="n">Cant.</th><th class="n">Precio</th><th class="n">Subtotal</th></tr></thead><tbody>${filas}</tbody></table>
<table class="tot"><tr><td class="n">Subtotal</td><td class="n" style="width:140px">${dinero(v.subtotal)}</td></tr>
${v.discount ? `<tr><td class="n">Descuento</td><td class="n">-${dinero(v.discount)}</td></tr>` : ""}
<tr><td class="n grande">Total</td><td class="n grande">${dinero(v.total)}</td></tr>
<tr><td class="n">Pagado</td><td class="n">${dinero(v.paid)}</td></tr><tr><td class="n"><b>Saldo</b></td><td class="n"><b>${dinero(v.balance)}</b></td></tr></table>
${pagosHtml ? `<h3>Pagos</h3><table><thead><tr><th>Fecha</th><th>Método</th><th class="n">Monto</th></tr></thead><tbody>${pagosHtml}</tbody></table>` : ""}
<p style="margin-top:32px;text-align:center"><small>Gracias por tu compra.</small></p>
<p style="text-align:center"><button onclick="print()">Imprimir / Guardar PDF</button></p>
</body></html>`);
  w.document.close();
  return true;
}
