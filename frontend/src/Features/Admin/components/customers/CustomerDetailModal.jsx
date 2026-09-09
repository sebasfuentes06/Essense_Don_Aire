import { Modal } from "../../../../shared/components/ui/Modal";
import { Button } from "../../../../shared/components/ui/button";
import { Badge } from "../../../../shared/components/ui/Badge";

function CustomerDetailModal({ isOpen, onClose, customerForm }) {
  const isActive = customerForm?.status === "active" || customerForm?.status === "Activo";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Detalles del cliente">
      {customerForm && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-muted/20 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Cliente</p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">{customerForm.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{customerForm.email || "Sin correo"}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`inline-flex h-2.5 w-2.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                <Badge variant={isActive ? "success" : "danger"}>
                  {isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-border bg-muted/20 p-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">ID</p>
              <p className="mt-2 font-medium text-foreground">{customerForm.id}</p>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Teléfono</p>
              <p className="mt-2 font-medium text-foreground">{customerForm.phone || "No disponible"}</p>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Ciudad</p>
              <p className="mt-2 font-medium text-foreground">{customerForm.city || "No disponible"}</p>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Total gastado</p>
              <p className="mt-2 font-medium text-foreground">${Number(customerForm.totalSpent ?? 0).toFixed(2)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Compras totales</p>
            <p className="mt-3 text-lg font-semibold text-foreground">{customerForm.totalPurchases ?? 0}</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button onClick={onClose}>Cerrar</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export { CustomerDetailModal };