import { jsx, jsxs } from "react/jsx-runtime";
import { Button } from "../../../../shared/components/ui/Button";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/Input";
function RoleFormModal({
  isOpen,
  onClose,
  isEditing,
  roleForm,
  onRoleFormChange,
  availablePermissions,
  onSave
}) {
  const nombre = roleForm.nombre ?? roleForm.name ?? "";
  const descripcion = roleForm.descripcion ?? roleForm.description ?? "";
  const permisos = roleForm.permisos ?? roleForm.permissions ?? [];
  const moduleOrder = ["Dashboard", "Productos", "Ventas", "Clientes", "Usuarios"];

  const validate = () => {
    if (!String(nombre).trim()) return "Debe indicar el nombre del rol.";
    if (!Array.isArray(permisos) || permisos.length === 0) return "Debe seleccionar al menos un permiso.";
    return "";
  };
  const groupedPermissions = moduleOrder.map(module => ({
    module,
    permissions: availablePermissions.filter(permission => permission.module === module)
  })).filter(group => group.permissions.length > 0);

  const updatePermission = (permissionId, checked) => {
    const nextPermisos = checked
      ? [...permisos, permissionId]
      : permisos.filter(selected => selected !== permissionId);
    onRoleFormChange({
      ...roleForm,
      permisos: nextPermisos,
      permissions: nextPermisos
    });
  };

  const updateModulePermissions = (permissions, checked) => {
    const modulePermissionIds = permissions.map(permission => permission.id);
    const nextPermisos = checked
      ? [...new Set([...permisos, ...modulePermissionIds])]
      : permisos.filter(permissionId => !modulePermissionIds.includes(permissionId));
    onRoleFormChange({
      ...roleForm,
      permisos: nextPermisos,
      permissions: nextPermisos
    });
  };

  return /* @__PURE__ */jsx(Modal, {
    isOpen,
    onClose,
    title: isEditing ? "Editar Rol" : "Nuevo Rol",
    children: /* @__PURE__ */jsxs("div", {
      className: "space-y-6",
      children: [/* @__PURE__ */jsx(Input, {
        label: "Nombre del rol",
        value: nombre,
        onChange: e => onRoleFormChange({
          ...roleForm,
          nombre: e.target.value,
          name: e.target.value
        }),
        placeholder: "Nombre del rol"
      }), /* @__PURE__ */jsx(Input, {
        label: "Descripción",
        value: descripcion,
        onChange: e => onRoleFormChange({
          ...roleForm,
          descripcion: e.target.value,
          description: e.target.value
        }),
        placeholder: "Descripci\xF3n del rol"
      }), /* @__PURE__ */jsxs("div", {
        className: "space-y-2",
        children: [/* @__PURE__ */jsx("label", {
          className: "text-sm font-medium text-foreground",
          children: "Permisos"
        }), /* @__PURE__ */jsxs("details", {
          className: "group rounded-xl border border-input bg-input-background",
          children: [/* @__PURE__ */jsx("summary", {
            className: "flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden",
            children: [/* @__PURE__ */jsx("span", {
              children: permisos.length > 0 ? `${permisos.length} permisos seleccionados` : "Seleccionar permisos"
            }), /* @__PURE__ */jsx("span", {
              className: "text-muted-foreground transition-transform group-open:rotate-180",
              children: "⌄"
            })]
          }), /* @__PURE__ */jsx("div", {
            className: "max-h-96 space-y-4 overflow-y-auto border-t border-border p-3",
            children: groupedPermissions.map(group => {
              const selectedCount = group.permissions.filter(permission => permisos.includes(permission.id)).length;
              const allSelected = selectedCount === group.permissions.length;
              return /* @__PURE__ */jsxs("section", {
                className: "overflow-hidden rounded-xl border border-border bg-background/40",
                children: [/* @__PURE__ */jsxs("div", {
                  className: "flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2",
                  children: [/* @__PURE__ */jsx("h4", {
                    className: "text-sm font-semibold text-primary",
                    children: group.module
                  }), /* @__PURE__ */jsxs("label", {
                    className: "flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground",
                    children: [/* @__PURE__ */jsx("input", {
                      type: "checkbox",
                      checked: allSelected,
                      onChange: event => updateModulePermissions(group.permissions, event.target.checked),
                      className: "h-4 w-4 accent-primary"
                    }), "Seleccionar todos"]
                  })]
                }), /* @__PURE__ */jsxs("table", {
                  className: "w-full text-sm",
                  children: [/* @__PURE__ */jsx("thead", {
                    className: "text-left text-xs uppercase tracking-wide text-muted-foreground",
                    children: /* @__PURE__ */jsxs("tr", {
                      children: [/* @__PURE__ */jsx("th", {
                        className: "w-12 px-3 py-2",
                        children: ""
                      }), /* @__PURE__ */jsx("th", {
                        className: "px-3 py-2",
                        children: "Permiso"
                      }), /* @__PURE__ */jsx("th", {
                        className: "px-3 py-2",
                        children: "Descripción"
                      })]
                    })
                  }), /* @__PURE__ */jsx("tbody", {
                    children: group.permissions.map(permission => /* @__PURE__ */jsxs("tr", {
                      className: "border-t border-border/70 transition-colors hover:bg-muted/30",
                      children: [/* @__PURE__ */jsx("td", {
                        className: "px-3 py-2.5",
                        children: /* @__PURE__ */jsx("input", {
                          type: "checkbox",
                          checked: permisos.includes(permission.id),
                          onChange: event => updatePermission(permission.id, event.target.checked),
                          className: "h-4 w-4 accent-primary"
                        })
                      }), /* @__PURE__ */jsx("td", {
                        className: "px-3 py-2.5 font-medium text-foreground",
                        children: permission.name
                      }), /* @__PURE__ */jsx("td", {
                        className: "px-3 py-2.5 text-muted-foreground",
                        children: permission.description
                      })]
                    }, permission.id))
                  })]
                })]
              }, group.module);
            })
          })]
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "flex justify-end gap-3 border-t border-border pt-5",
        children: [/* @__PURE__ */jsx(Button, {
          variant: "outline",
          onClick: onClose,
          children: "Cancelar"
        }), /* @__PURE__ */jsx(Button, {
          onClick: () => {
            const error = validate();
            if (error) {
              alert(error);
              return;
            }
            onSave();
          },
          children: "Guardar"
        })]
      })]
    })
  });
}
export { RoleFormModal };