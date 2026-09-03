import { jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "./Button";
import { Modal } from "./Modal";
function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "\xBFEliminar este elemento?",
  description = "Esta acci\xF3n no se puede deshacer. El elemento ser\xE1 eliminado permanentemente.",
  itemName,
  isDeleting = false
}) {
  return /* @__PURE__ */jsx(Modal, {
    isOpen,
    onClose,
    children: /* @__PURE__ */jsxs("div", {
      className: "text-center py-4",
      children: [/* @__PURE__ */jsx("div", {
        className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4",
        children: /* @__PURE__ */jsx(AlertTriangle, {
          className: "h-8 w-8 text-destructive"
        })
      }), /* @__PURE__ */jsx("h3", {
        className: "text-xl font-bold text-foreground mb-2",
        children: title
      }), itemName && /* @__PURE__ */jsxs("div", {
        className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted mb-3",
        children: [/* @__PURE__ */jsx(Trash2, {
          className: "h-4 w-4 text-destructive"
        }), /* @__PURE__ */jsx("span", {
          className: "font-semibold text-foreground",
          children: itemName
        })]
      }), /* @__PURE__ */jsx("p", {
        className: "text-sm text-muted-foreground mb-6 max-w-sm mx-auto",
        children: description
      }), /* @__PURE__ */jsx("div", {
        className: "p-3 rounded-xl bg-destructive/5 border border-destructive/20 mb-6",
        children: /* @__PURE__ */jsx("p", {
          className: "text-sm text-destructive font-medium",
          children: "\u26A0\uFE0F Esta acci\xF3n es permanente y no se puede deshacer"
        })
      }), /* @__PURE__ */jsxs("div", {
        className: "flex gap-3",
        children: [/* @__PURE__ */jsx(Button, {
          variant: "outline",
          onClick: onClose,
          disabled: isDeleting,
          children: "Cancelar"
        }), /* @__PURE__ */jsx(Button, {
          onClick: onConfirm,
          loading: isDeleting,
          children: isDeleting ? "Eliminando..." : "S\xED, Eliminar"
        })]
      })]
    })
  });
}
export { DeleteDialog };