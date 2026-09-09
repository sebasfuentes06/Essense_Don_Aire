import { Modal } from "../../../../shared/components/ui/Modal";
import { Badge } from "../../../../shared/components/ui/Badge";
import { Button } from "../../../../shared/components/ui/button";

const statusConfig = {
  pending: { label: "Pendiente", variant: "warning" },
  partial: { label: "Parcial", variant: "info" },
  paid: { label: "Pagado", variant: "success" },
  cancelled: { label: "Cancelado", variant: "danger" }
};

function PurchaseDetailModal({ isOpen, onClose, purchase, onCancel }) {
  if (!purchase) return null;

  const status = statusConfig[purchase.status] || { label: purchase.status, variant: "default" };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={`Detalle de ${purchase.folio}`}>
      <div className="space-y-5">
        <div className="rounded-2xl border border-border bg-muted/20 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Compra</p>
              <h3 className="mt-2 text-2xl font-semibold text-foreground">{purchase.folio}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{purchase.supplierName}</p>
            </div>

            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Fecha</p>
            <p className="mt-2 font-medium text-foreground">{new Date(purchase.date).toLocaleDateString()}</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Total</p>
            <p className="mt-2 font-medium text-foreground">${purchase.total?.toFixed(2) ?? "0.00"}</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Pagado</p>
            <p className="mt-2 font-medium text-foreground">${purchase.paid?.toFixed(2) ?? "0.00"}</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Saldo</p>
            <p className="mt-2 font-medium text-foreground">${purchase.balance?.toFixed(2) ?? "0.00"}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-muted/20 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Productos</p>
          <div className="mt-3 space-y-2">
            {purchase.items?.map((item, index) => (
              <div key={`${item.productName}-${index}`} className="flex items-center justify-between rounded-xl border border-border bg-background/30 px-3 py-2">
                <div>
                  <p className="font-medium text-foreground">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                </div>
                <p className="font-medium text-foreground">${((item.unitCost ?? 0) * (item.quantity ?? 0)).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {purchase.status !== "cancelled" && (
          <div className="flex justify-end border-t border-border pt-4">
            <Button type="button" variant="destructive" onClick={() => onCancel(purchase)}>
              Cancelar compra
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export { PurchaseDetailModal };
