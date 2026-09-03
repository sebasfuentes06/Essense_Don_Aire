import { jsx, jsxs } from "react/jsx-runtime";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Badge } from "../../../../shared/components/ui/Badge";

function CategoryDetailModal({ isOpen, onClose, category }) {
  if (!category) return null;

  return /* @__PURE__ */jsx(Modal, {
    isOpen,
    onClose,
    size: "md",
    title: "Detalles de la categoría",
    children: /* @__PURE__ */jsxs("div", {
      className: "space-y-5",
      children: [/* @__PURE__ */jsxs("div", {
        className: "rounded-2xl bg-muted/40 p-4",
        children: [/* @__PURE__ */jsx("p", {
          className: "text-xs uppercase tracking-wide text-muted-foreground",
          children: "Categoría"
        }), /* @__PURE__ */jsx("h3", {
          className: "mt-2 text-xl font-semibold text-foreground",
          children: category.name
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "grid grid-cols-1 gap-4 md:grid-cols-2",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "ID"
          }), /* @__PURE__ */jsx("p", {
            className: "font-medium text-foreground",
            children: category.id
          })]
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "Estado"
          }), /* @__PURE__ */jsx(Badge, {
            variant: category.status === "active" ? "success" : "danger",
            children: category.status === "active" ? "Activa" : "Inactiva"
          })]
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "Productos"
          }), /* @__PURE__ */jsx("p", {
            className: "font-medium text-foreground",
            children: category.productCount
          })]
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "Creada"
          }), /* @__PURE__ */jsx("p", {
            className: "font-medium text-foreground",
            children: new Date(category.createdAt).toLocaleDateString()
          })]
        })]
      }), /* @__PURE__ */jsxs("div", {
        children: [/* @__PURE__ */jsx("p", {
          className: "text-xs uppercase tracking-wide text-muted-foreground",
          children: "Descripción"
        }), /* @__PURE__ */jsx("p", {
          className: "mt-2 text-sm text-foreground",
          children: category.description || "Sin descripción disponible."
        })]
      })]
    })
  });
}

export { CategoryDetailModal };
