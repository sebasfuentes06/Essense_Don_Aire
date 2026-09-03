import { jsx, jsxs } from "react/jsx-runtime";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Badge } from "../../../../shared/components/ui/Badge";

function UserDetailModal({ isOpen, onClose, user }) {
  if (!user) return null;

  return /* @__PURE__ */jsx(Modal, {
    isOpen,
    onClose,
    size: "md",
    title: "Detalles del usuario",
    children: /* @__PURE__ */jsxs("div", {
      className: "space-y-5",
      children: [/* @__PURE__ */jsxs("div", {
        className: "flex items-center gap-4 rounded-2xl bg-muted/40 p-4",
        children: [/* @__PURE__ */jsx("div", {
          className: "flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary",
          children: user.name?.[0] || "U"
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("h3", {
            className: "text-lg font-semibold text-foreground",
            children: user.name
          }), /* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: user.email
          })]
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "grid grid-cols-1 gap-4 md:grid-cols-2",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "ID"
          }), /* @__PURE__ */jsx("p", {
            className: "font-medium text-foreground",
            children: user.id
          })]
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "Rol"
          }), /* @__PURE__ */jsx(Badge, {
            variant: user.role === "Administrador" ? "danger" : "default",
            children: user.role
          })]
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "Teléfono"
          }), /* @__PURE__ */jsx("p", {
            className: "font-medium text-foreground",
            children: user.phone
          })]
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "Estado"
          }), /* @__PURE__ */jsx(Badge, {
            variant: user.status === "active" ? "success" : "danger",
            children: user.status === "active" ? "Activo" : "Inactivo"
          })]
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "Último acceso"
          }), /* @__PURE__ */jsx("p", {
            className: "font-medium text-foreground",
            children: new Date(user.lastLogin).toLocaleDateString()
          })]
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "Fecha de ingreso"
          }), /* @__PURE__ */jsx("p", {
            className: "font-medium text-foreground",
            children: new Date(user.joinDate).toLocaleDateString()
          })]
        })]
      })]
    })
  });
}

export { UserDetailModal };
