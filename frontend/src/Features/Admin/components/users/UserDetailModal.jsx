import { Modal } from "../../../../shared/components/ui/Modal";
import { Badge } from "../../../../shared/components/ui/Badge";

function UserDetailModal({ isOpen, onClose, user }) {
  if (!user) return null;

  const initials = user.name?.trim()?.[0] || "U";
  const isActive = user.status === "active" || user.status === "Activo";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={user.id ? `Detalles del usuario ID #${user.id}` : "Detalles del usuario"}
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-border bg-muted/20 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                {initials}
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-foreground">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`inline-flex h-2.5 w-2.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`} />
              <Badge variant={isActive ? "success" : "danger"}>
                {isActive ? "Cuenta activa" : "Cuenta inactiva"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Rol</p>
            <p className="mt-2 font-medium text-foreground">{user.role || "Sin rol"}</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Teléfono</p>
            <p className="mt-2 font-medium text-foreground">{user.phone || "No disponible"}</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Último acceso</p>
            <p className="mt-2 font-medium text-foreground">
              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Sin registro"}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Fecha ingreso</p>
            <p className="mt-2 font-medium text-foreground">
              {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : "Sin registro"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-muted/20 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Última actividad registrada</p>
          <div className="mt-3 flex items-start gap-2">
            <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-primary" />
            <div>
              <p className="font-medium text-foreground">Sesión iniciada</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Sin información disponible"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export { UserDetailModal };
