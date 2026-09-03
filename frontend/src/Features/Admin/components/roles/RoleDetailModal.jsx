import { jsx, jsxs } from "react/jsx-runtime";
import { Button } from "../../../../shared/components/ui/Button";
import { Modal } from "../../../../shared/components/ui/Modal";
function RoleDetailModal({
  isOpen,
  onClose,
  roleToView
}) {
  return /* @__PURE__ */jsx(Modal, {
    isOpen,
    onClose,
    children: roleToView && /* @__PURE__ */jsxs("div", {
      className: "space-y-4",
      children: [/* @__PURE__ */jsxs("div", {
        children: [/* @__PURE__ */jsx("h2", {
          className: "text-lg font-semibold",
          children: roleToView.name
        }), /* @__PURE__ */jsx("p", {
          className: "text-sm text-muted-foreground",
          children: roleToView.description
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("span", {
            className: "block text-sm text-muted-foreground",
            children: "Usuarios asignados"
          }), /* @__PURE__ */jsx("p", {
            className: "mt-1 text-foreground",
            children: roleToView.usersCount
          })]
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("span", {
            className: "block text-sm text-muted-foreground",
            children: "Estado"
          }), /* @__PURE__ */jsx("p", {
            className: "mt-1 text-foreground",
            children: roleToView.status === "active" ? "Activo" : "Inactivo"
          })]
        })]
      }), /* @__PURE__ */jsxs("div", {
        children: [/* @__PURE__ */jsx("h3", {
          className: "text-sm font-semibold",
          children: "Permisos"
        }), /* @__PURE__ */jsx("ul", {
          className: "mt-2 space-y-1 list-disc list-inside text-sm text-foreground",
          children: roleToView.permissions.map(permission => /* @__PURE__ */jsx("li", {
            children: permission
          }, permission))
        })]
      }), /* @__PURE__ */jsx("div", {
        className: "flex justify-end",
        children: /* @__PURE__ */jsx(Button, {
          onClick: onClose,
          children: "Cerrar"
        })
      })]
    })
  });
}
export { RoleDetailModal };