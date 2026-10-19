import { Ban, Copy, ExternalLink, Link2, Plus, Printer } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Button } from "../../../../shared/components/ui/button";
import { Badge } from "../../../../shared/components/ui/Badge";
import { dinero, fechaHora, imprimirFactura, NOMBRES_METODO, NOMBRES_CANAL, NOMBRES_ESTADO_PAGO } from "../../../../shared/negocio";
import { ESTADO_VENTA } from "./SalesTable";

/** Detalle de la venta: productos, pagos, links de Wompi, factura y acciones. */
function SaleDetailModal({ sale, onClose, onPay, onCancel, onWompi, isAdmin }) {
  if (!sale) return null;
  const v = sale;
  const [label, variant] = ESTADO_VENTA[v.paymentStatus] ?? [v.paymentStatus, "default"];
  const vigente = v.status !== "anulada";

  const copiar = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado.");
    } catch {
      toast.error("No se pudo copiar.");
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="lg" title={`Venta ${v.invoice}`}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={variant}>{label}</Badge>
          <Badge variant="info">{NOMBRES_CANAL[v.channel] ?? v.channel}</Badge>
          {v.orderCode && <Badge>Pedido {v.orderCode}</Badge>}
          <span className="ml-auto text-sm text-muted-foreground">{fechaHora(v.date)}</span>
        </div>

        <div className="grid gap-1 rounded-xl border border-border p-4 text-sm sm:grid-cols-2">
          <p><span className="text-muted-foreground">Cliente:</span> <b>{v.customer}</b></p>
          <p><span className="text-muted-foreground">Celular:</span> {v.customerPhone || "—"}</p>
          <p><span className="text-muted-foreground">Forma de pago:</span> {NOMBRES_METODO[v.paymentMethod] ?? v.paymentMethod ?? "—"}</p>
          <p><span className="text-muted-foreground">Atendió:</span> {v.seller || "—"}</p>
          {v.notes && <p className="sm:col-span-2"><span className="text-muted-foreground">Notas:</span> {v.notes}</p>}
          {!vigente && <p className="text-destructive sm:col-span-2">Anulada: {v.cancelReason}</p>}
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold">Productos</p>
          {!v.hasDetail ? (
            <div className="h-20 animate-pulse rounded-xl bg-muted" />
          ) : (
            <div className="divide-y divide-border rounded-xl border border-border">
              {v.items.map((i) => (
                <div key={i.productId} className="flex justify-between gap-3 p-3 text-sm">
                  <span>{i.quantity} × {i.productName}</span>
                  <span className="whitespace-nowrap">{dinero(i.subtotal)}</span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 space-y-1 text-sm">
            {v.discount > 0 && <p className="flex justify-between"><span>Descuento</span><span>-{dinero(v.discount)}</span></p>}
            <p className="flex justify-between text-base font-bold"><span>Total</span><span className="text-primary">{dinero(v.total)}</span></p>
            <p className="flex justify-between"><span>Pagado</span><span className="text-success">{dinero(v.paid)}</span></p>
            {vigente && <p className="flex justify-between font-semibold"><span>Saldo</span><span className={v.balance > 0 ? "text-destructive" : ""}>{dinero(v.balance)}</span></p>}
          </div>
        </div>

        {v.payments.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-semibold">Pagos</p>
            <div className="divide-y divide-border rounded-xl border border-border">
              {v.payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                  <div>
                    <p className="font-medium">{dinero(p.amount)} · {NOMBRES_METODO[p.method] ?? p.method}</p>
                    <p className="text-xs text-muted-foreground">{fechaHora(p.date)}{p.reference ? ` · ${p.reference}` : ""}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{NOMBRES_ESTADO_PAGO[p.status] ?? p.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {v.wompiLinks.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-semibold">Links de Wompi</p>
            <div className="space-y-2">
              {v.wompiLinks.map((l) => (
                <div key={l.id} className="flex items-center justify-between gap-2 rounded-xl border border-border p-3 text-sm">
                  <span>{dinero(l.amount)} · {l.status ?? "activo"}</span>
                  <span className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => copiar(l.url)}><Copy /> Copiar</Button>
                    <Button size="sm" variant="ghost" asChild><a href={l.url} target="_blank" rel="noreferrer"><ExternalLink /> Abrir</a></Button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
          {isAdmin && vigente && (
            <Button variant="outline" className="text-destructive" onClick={() => onCancel(v)}>
              <Ban /> Anular
            </Button>
          )}
          <Button variant="outline" disabled={!v.hasDetail} onClick={() => imprimirFactura(v) || toast.error("Permite las ventanas emergentes para ver la factura.")}>
            <Printer /> Factura
          </Button>
          {vigente && v.balance > 0 && (
            <>
              <Button variant="outline" onClick={() => onWompi(v)}>
                <Link2 /> Link Wompi
              </Button>
              <Button onClick={() => onPay(v)}>
                <Plus /> Registrar abono
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

export { SaleDetailModal };
