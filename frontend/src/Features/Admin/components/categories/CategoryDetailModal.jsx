import { Modal } from "../../../../shared/components/ui/Modal";
import { Badge } from "../../../../shared/components/ui/Badge";

function CategoryDetailModal({ isOpen, onClose, category }) {
  if (!category) return null;

  const isActive = category.status === "active" || category.status === "Activa";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Detalles de la categoría"
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-border bg-muted/20 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Categoría</p>
              <h3 className="mt-2 text-2xl font-semibold text-foreground">{category.name}</h3>
            </div>

            <div className="flex items-center gap-2">
              <span className={`inline-flex h-2.5 w-2.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`} />
              <Badge variant={isActive ? "success" : "danger"}>
                {isActive ? "Activa" : "Inactiva"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">ID</p>
            <p className="mt-2 font-medium text-foreground">{category.id}</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Productos</p>
            <p className="mt-2 font-medium text-foreground">{category.productCount ?? 0}</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Estado</p>
            <p className="mt-2 font-medium text-foreground">{isActive ? "Activa" : "Inactiva"}</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Creada</p>
            <p className="mt-2 font-medium text-foreground">
              {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : "No disponible"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-muted/20 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Descripción</p>
          <p className="mt-3 text-sm text-foreground">{category.description || "Sin descripción disponible."}</p>
        </div>
      </div>
    </Modal>
  );
}

export { CategoryDetailModal };
