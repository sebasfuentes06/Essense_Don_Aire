import { jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "./button";
import { Modal } from "./Modal";

function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "\xBFEliminar este elemento?",
  description = "Esta acci\xF3n no se puede deshacer. El elemento ser\xE1 eliminado permanentemente.",
  itemName,
  isDeleting = false,
  confirmLabel = "Sí, Eliminar",
  confirmingLabel = "Eliminando...",
  warningText = "⚠️ Esta acción es permanente y no se puede deshacer",
  variant = "destructive"
}) {
  const isWarning = variant === "warning";

  return /* @__PURE__ */jsx(Modal, {
    isOpen,
    onClose,
    children: /* @__PURE__ */jsxs("div", {
      className: "text-center py-4",
      children: [/* @__PURE__ */jsx("div", {
        className: `inline-flex items-center justify-center w-16 h-16 rounded-full ${isWarning ? "bg-primary/10" : "bg-destructive/10"} mb-4`,
        children: /* @__PURE__ */jsx(AlertTriangle, {
          className: `h-8 w-8 ${isWarning ? "text-primary" : "text-destructive"}`
        })
      }), /* @__PURE__ */jsx("h3", {
        className: "text-xl font-bold text-foreground mb-2",
        children: title
      }), itemName && /* @__PURE__ */jsxs("div", {
        className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted mb-3",
        children: [/* @__PURE__ */jsx(Trash2, {
          className: `h-4 w-4 ${isWarning ? "text-primary" : "text-destructive"}`
        }), /* @__PURE__ */jsx("span", {
          className: "font-semibold text-foreground",
          children: itemName
        })]
      }), /* @__PURE__ */jsx("p", {
        className: "text-sm text-muted-foreground mb-6 max-w-sm mx-auto",
        children: description
      }), /* @__PURE__ */jsx("div", {
        className: `p-3 rounded-xl border mb-6 ${isWarning ? "border-primary/20 bg-primary/5" : "border-destructive/20 bg-destructive/5"}`,
        children: /* @__PURE__ */jsx("p", {
          className: `text-sm font-medium ${isWarning ? "text-primary" : "text-destructive"}`,
          children: warningText
        })
      }), /* @__PURE__ */jsxs("div", {
        className: "flex gap-3 justify-center",
        children: [/* @__PURE__ */jsx(Button, {
          variant: "outline",
          onClick: onClose,
          disabled: isDeleting,
          children: "Cancelar"
        }), /* @__PURE__ */jsx(Button, {
          onClick: onConfirm,
          disabled: isDeleting,
          children: isDeleting ? confirmingLabel : confirmLabel
        })]
      })]
    })
  });
}

export { DeleteDialog };