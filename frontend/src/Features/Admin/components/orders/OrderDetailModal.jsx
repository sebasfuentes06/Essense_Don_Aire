import { Modal } from "../../../../shared/components/ui/Modal";
import { Badge } from "../../../../shared/components/ui/Badge";
import { STATUS_LABELS, STATUS_VARIANTS, CHANNEL_LABELS } from "../../../../shared/orders";

function Row({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
    </div>
  );
}

function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  return (
    <Modal isOpen={Boolean(order)} onClose={onClose} size="lg" title={`Pedido ${order.folio}`}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={STATUS_VARIANTS[order.status]}>{STATUS_LABELS[order.status]}</Badge>
          <Badge variant="info">{CHANNEL_LABELS[order.channel] ?? order.channel}</Badge>
          {order.saleId && <Badge variant="success">Convertido en venta</Badge>}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Row label="Cliente" value={order.customer} />
          <Row label="Vendedor" value={order.seller ?? "Sin asignar"} />
          <Row label="Fecha" value={order.date} />
          <Row label="Entrega" value={order.deliveryDate ?? "Sin definir"} />
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground mb-3">Productos</p>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between gap-3 rounded-xl border border-border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} × ${item.unitPrice.toFixed(2)}
                    {item.discount > 0 && ` · desc. $${item.discount.toFixed(2)}`}
                  </p>
                </div>
                <p className="font-medium text-foreground whitespace-nowrap">
                  ${item.subtotal.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {order.notes && (
          <div className="rounded-xl bg-muted/50 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Observaciones</p>
            <p className="text-sm text-foreground">{order.notes}</p>
          </div>
        )}

        <div className="border-t border-border pt-4 space-y-1.5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Descuento</span>
              <span>−${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="text-lg font-semibold text-foreground">Total</span>
            <span className="text-xl font-bold text-primary">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export { OrderDetailModal };
