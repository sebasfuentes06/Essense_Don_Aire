import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/input";
import { FormValidationDialog } from "../../../../shared/components/ui/FormValidationDialog";
import { validateRoleForm } from "../../validations/formValidation";

/**
 * Formulario de un rol, con la matriz de permisos.
 *
 * El orden de los módulos se deduce del propio catálogo que llega de la API,
 * no de una lista escrita aquí. Antes había una lista fija de diez módulos y
 * la base tiene catorce: los permisos de Pedidos, Pagos y Abonos, Mi cuenta y
 * Sistema no aparecían en ninguna parte, así que no se podían asignar. Al
 * deducirlo de los datos, agregar un módulo nuevo a la base lo hace aparecer
 * aquí sin tocar este archivo.
 */
function RoleFormModal({
  isOpen,
  onClose,
  isEditing,
  roleForm,
  onRoleFormChange,
  availablePermissions = [],
  serverError = "",
  serverFieldErrors = {},
  onSave
}) {
  const [validationOpen, setValidationOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const nombre = roleForm.nombre ?? roleForm.name ?? "";
  const descripcion = roleForm.descripcion ?? roleForm.description ?? "";
  const permisos = roleForm.permisos ?? roleForm.permissions ?? [];

  const errors = { ...validateRoleForm({ nombre, permisos }), ...(serverFieldErrors ?? {}) };
  const validate = () => Object.values(validateRoleForm({ nombre, permisos }))[0] || "";

  // Los módulos, en el orden en que los devuelve la API.
  const grupos = [];
  for (const permiso of availablePermissions) {
    let grupo = grupos.find((g) => g.module === permiso.module);
    if (!grupo) {
      grupo = { module: permiso.module, permissions: [] };
      grupos.push(grupo);
    }
    grupo.permissions.push(permiso);
  }

  const cambiar = (siguientes) =>
    onRoleFormChange({ ...roleForm, permisos: siguientes, permissions: siguientes });

  const alternarPermiso = (id, marcado) =>
    cambiar(marcado ? [...permisos, id] : permisos.filter((p) => p !== id));

  const alternarModulo = (permisosDelModulo, marcado) => {
    const ids = permisosDelModulo.map((p) => p.id);
    cambiar(
      marcado
        ? [...new Set([...permisos, ...ids])]
        : permisos.filter((id) => !ids.includes(id))
    );
  };

  const todos = availablePermissions.map((p) => p.id);
  const todosMarcados = todos.length > 0 && todos.every((id) => permisos.includes(id));

  const guardar = async () => {
    const error = validate();
    if (error) {
      setValidationOpen(true);
      return;
    }
    setGuardando(true);
    try {
      await onSave();
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        title={isEditing ? "Editar Rol" : "Nuevo Rol"}
      >
        <div className="space-y-6">
          {serverError && (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <Input
            label="Nombre del rol"
            value={nombre}
            required
            error={errors.nombre}
            onChange={(e) =>
              onRoleFormChange({ ...roleForm, nombre: e.target.value, name: e.target.value })
            }
            placeholder="Nombre del rol"
          />

          <Input
            label="Descripción"
            value={descripcion}
            error={errors.descripcion}
            onChange={(e) =>
              onRoleFormChange({
                ...roleForm,
                descripcion: e.target.value,
                description: e.target.value
              })
            }
            placeholder="Para qué sirve este rol"
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-foreground">
                Permisos <span className="ml-1 text-muted-foreground">*</span>
              </label>
              {availablePermissions.length > 0 && (
                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={todosMarcados}
                    onChange={(e) => cambiar(e.target.checked ? todos : [])}
                    className="h-4 w-4 accent-primary"
                  />
                  Seleccionar todos
                </label>
              )}
            </div>

            {errors.permisos && (
              <p className="text-xs font-medium text-destructive">{errors.permisos}</p>
            )}

            <details
              className="group rounded-xl border border-input bg-input-background"
              open
            >
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
                <span>
                  {permisos.length > 0
                    ? `${permisos.length} de ${availablePermissions.length} permisos seleccionados`
                    : "Seleccionar permisos"}
                </span>
                <span className="text-muted-foreground transition-transform group-open:rotate-180">
                  ⌄
                </span>
              </summary>

              <div className="max-h-96 space-y-4 overflow-y-auto border-t border-border p-3">
                {grupos.length === 0 ? (
                  <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                    No se pudo cargar el catálogo de permisos.
                  </p>
                ) : (
                  grupos.map((grupo) => {
                    const marcados = grupo.permissions.filter((p) => permisos.includes(p.id)).length;
                    const completo = marcados === grupo.permissions.length;

                    return (
                      <section
                        key={grupo.module}
                        className="overflow-hidden rounded-xl border border-border bg-background/40"
                      >
                        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
                          <h4 className="text-sm font-semibold text-primary">
                            {grupo.module}
                            <span className="ml-2 text-xs font-normal text-muted-foreground">
                              {marcados}/{grupo.permissions.length}
                            </span>
                          </h4>
                          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground">
                            <input
                              type="checkbox"
                              checked={completo}
                              onChange={(e) => alternarModulo(grupo.permissions, e.target.checked)}
                              className="h-4 w-4 accent-primary"
                            />
                            Todos
                          </label>
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
                            {grupo.permissions.map((permiso) => (
                              <tr
                                key={permiso.id}
                                className="border-t border-border/70 transition-colors hover:bg-muted/30"
                              >
                                <td className="px-3 py-2.5">
                                  <input
                                    type="checkbox"
                                    checked={permisos.includes(permiso.id)}
                                    onChange={(e) => alternarPermiso(permiso.id, e.target.checked)}
                                    className="h-4 w-4 accent-primary"
                                  />
                                </td>
                                <td className="px-3 py-2.5 font-medium text-foreground">
                                  {permiso.name}
                                  <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                                    {permiso.id}
                                  </span>
                                </td>
                                <td className="px-3 py-2.5 text-muted-foreground">
                                  {permiso.description}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </section>
                    );
                  })
                )}
              </div>
            </details>
          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <Button type="button" variant="outline" onClick={onClose} disabled={guardando}>
              Cancelar
            </Button>
            <Button type="button" onClick={guardar} disabled={guardando}>
              {guardando ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        </div>
      </Modal>

      <FormValidationDialog
        isOpen={validationOpen}
        onClose={() => setValidationOpen(false)}
        message={validate()}
      />
    </div>
  );
}

export { RoleFormModal };
