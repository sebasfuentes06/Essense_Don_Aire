import { AlertCircle, CreditCard, Ban, Trash2 } from "lucide-react";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Badge } from "../../../../shared/components/ui/Badge";
import { Button } from "../../../../shared/components/ui/button";
import { useAuth } from "../../../../shared/auth";
import { plata, fecha, fechaHora, estadoDe } from "./formato";

/**
 * Ficha de una compra: qué se pidió, qué se ha pagado y qué se puede hacer.
 *
 * Aquí vive el historial de abonos, que es lo que explica el estado. Si la
 * compra dice "Parcial", en esta pantalla se ve exactamente cuánto se abonó,
 * cuándo y por qué medio — en vez de un estado que alguien eligió a mano.
 *
 * Anular un abono está aquí y no en la tabla porque solo tiene sentido
 * mirando el historial: hay que ver cuál de los pagos fue el equivocado.
 */
function PurchaseDetailModal({
  isOpen,
  onClose,
  purchase,
  actionError = "",
  onRegisterPayment,
  onAnularPago,
  onCancelRequest,
  onDeleteRequest
}) {
  const { can } = useAuth();

  if (!purchase) return null;

  const estado = estadoDe(purchase.status);
  const cancelada = purchase.status === "cancelled";
  const saldo = Number(purchase.balance ?? 0);
  const items = Array.isArray(purchase.items) ? purchase.items : [];
  const pagos = Array.isArray(purchase.payments) ? purchase.payments : [];
  const unidades = items.reduce((suma, i) => suma + Number(i.quantity ?? 0), 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={`Compra ${purchase.folio}`}>
      <div className="space-y-5">
        {actionError && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-muted/20 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Proveedor</p>
              <h3 className="mt-2 text-2xl font-semibold text-foreground">{purchase.supplierName}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{fecha(purchase.date)}</p>
            </div>
            <Badge variant={estado.variant}>{estado.label}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Subtotal", plata(purchase.subtotal), "text-foreground"],
            ["Impuesto", plata(purchase.tax), "text-foreground"],
            ["Total", plata(purchase.total), "text-primary"],
            ["Saldo", plata(saldo), !cancelada && saldo > 0 ? "text-destructive" : "text-success"]
          ].map(([etiqueta, valor, color]) => (
            <div key={etiqueta} className="rounded-xl border border-border bg-muted/20 p-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{etiqueta}</p>
              <p className={`mt-2 font-semibold ${color}`}>{valor}</p>
            </div>
          ))}
        </div>

        {/* --------------------------- Ítems --------------------------- */}
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
            <h4 className="text-sm font-semibold text-foreground">Productos</h4>
            <span className="text-xs text-muted-foreground">
              {items.length} {items.length === 1 ? "línea" : "líneas"} · {unidades} unidades
            </span>
          </div>
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Producto</th>
                <th className="px-3 py-2">Cantidad</th>
                <th className="px-3 py-2">Costo</th>
                <th className="px-3 py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={`${item.productId}-${i}`} className="border-t border-border/70">
                  <td className="px-3 py-2.5 font-medium text-foreground">{item.productName}</td>
                  <td className="px-3 py-2.5">{item.quantity}</td>
                  <td className="px-3 py-2.5">{plata(item.unitCost)}</td>
                  <td className="px-3 py-2.5">{plata(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --------------------------- Abonos -------------------------- */}
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
            <h4 className="text-sm font-semibold text-foreground">Abonos al proveedor</h4>
            <span className="text-xs text-muted-foreground">
              {plata(purchase.paid)} de {plata(purchase.total)}
            </span>
          </div>

          {pagos.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Sin abonos registrados. Por eso la compra figura como Pendiente.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Fecha</th>
                  <th className="px-3 py-2">Método</th>
                  <th className="px-3 py-2">Referencia</th>
                  <th className="px-3 py-2">Monto</th>
                  {can("purchases.edit") && <th className="w-[1%] px-3 py-2" />}
                </tr>
              </thead>
              <tbody>
                {pagos.map((pago) => (
                  <tr key={pago.id} className="border-t border-border/70">
                    <td className="whitespace-nowrap px-3 py-2.5">{fechaHora(pago.date)}</td>
                    <td className="px-3 py-2.5">{pago.method}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{pago.reference || "—"}</td>
                    <td className="px-3 py-2.5 font-medium text-foreground">{plata(pago.amount)}</td>
                    {can("purchases.edit") && (
                      <td className="px-3 py-2.5">
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-destructive/10"
                          onClick={() => onAnularPago(purchase, pago)}
                          title={`Anular abono de ${plata(pago.amount)}`}
                          aria-label={`Anular abono de ${plata(pago.amount)}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {cancelada && (
          <div className="rounded-2xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
            Esta compra está cancelada: el stock que había entrado ya se devolvió y no admite
            abonos. Se conserva en el historial como registro de lo que pasó.
          </div>
        )}

        {/* -------------------------- Acciones ------------------------- */}
        <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-5">
          <Button type="button" variant="outline" onClick={onClose}>
            Cerrar
          </Button>

          {can("purchases.delete") && cancelada && (
            <Button type="button" variant="outline" onClick={() => onDeleteRequest(purchase)}>
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          )}

          {can("purchases.edit") && !cancelada && (
            <Button type="button" variant="outline" onClick={() => onCancelRequest(purchase)}>
              <Ban className="h-4 w-4" />
              Cancelar compra
            </Button>
          )}

          {can("purchases.create") && !cancelada && saldo > 0 && (
            <Button type="button" onClick={() => onRegisterPayment(purchase)}>
              <CreditCard className="h-4 w-4" />
              Registrar abono
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

export { PurchaseDetailModal };
