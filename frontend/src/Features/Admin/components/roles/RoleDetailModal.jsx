import { Button } from "../../../../shared/components/ui/button";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Badge } from "../../../../shared/components/ui/Badge";

function RoleDetailModal({
  isOpen,
  onClose,
  roleToView,
  availablePermissions = []
}) {
  const moduleOrder = ["Dashboard", "Catálogo", "Productos", "Categorías", "Compras", "Ventas", "Clientes", "Proveedores", "Usuarios", "Roles"];
  const permissionMap = Object.fromEntries(
    availablePermissions.map((permission) => [String(permission.id), permission])
  );

  const rolePermissionIds = [...new Set(
    (roleToView?.permisos ?? roleToView?.permissions ?? [])
      .filter(Boolean)
      .map((permissionId) => String(permissionId))
  )];

  const groupedPermissions = moduleOrder
    .map((module) => ({
      module,
      permissions: rolePermissionIds
        .map((permissionId) => permissionMap[permissionId])
        .filter(Boolean)
        .filter((permission) => permission.module === module)
    }))
    .filter((group) => group.permissions.length > 0);

  const isActive = roleToView?.status === "active" || roleToView?.status === "Activo";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Detalle del rol"
    >
      {roleToView && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-muted/20 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Rol</p>
                <h3 className="mt-2 text-2xl font-semibold text-foreground">{roleToView.name}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className={`inline-flex h-2.5 w-2.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                <Badge variant={isActive ? "success" : "danger"}>
                  {isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              {roleToView.description || "Sin descripción disponible."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-muted/20 p-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Usuarios asignados</p>
              <p className="mt-2 font-medium text-foreground">{roleToView.usersCount ?? 0}</p>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Estado</p>
              <p className="mt-2 font-medium text-foreground">{isActive ? "Activo" : "Inactivo"}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Permisos</p>
            <div className="mt-3 space-y-4">
              {groupedPermissions.length > 0 ? (
                groupedPermissions.map((group) => (
                  <section key={group.module} className="overflow-hidden rounded-xl border border-border bg-background/40">
                    <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
                      <h4 className="text-sm font-semibold text-primary">{group.module}</h4>
                    </div>

                    <table className="w-full text-sm">
                      <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <tr>
                          <th className="w-12 px-3 py-2" />
                          <th className="px-3 py-2">Permiso</th>
                          <th className="px-3 py-2">Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.permissions.map((permission) => (
                          <tr key={permission.id} className="border-t border-border/70 transition-colors hover:bg-muted/30">
                            <td className="px-3 py-2.5">
                              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                            </td>
                            <td className="px-3 py-2.5 font-medium text-foreground">{permission.name}</td>
                            <td className="px-3 py-2.5 text-muted-foreground">{permission.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Sin permisos asignados.</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>Cerrar</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export { RoleDetailModal };