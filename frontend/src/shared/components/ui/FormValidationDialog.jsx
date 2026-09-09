import { jsx } from "react/jsx-runtime";
import { DeleteDialog } from "./DeleteDialog";

function FormValidationDialog({
  isOpen,
  onClose,
  message = "Completa los campos obligatorios antes de guardar."
}) {
  return (
    /* @__PURE__ */jsx(DeleteDialog, {
      isOpen,
      onClose,
      onConfirm: onClose,
      title: "Campos obligatorios",
      description: message,
      confirmLabel: "Entendido",
      confirmingLabel: "Entendido",
      warningText: "Los campos marcados con * son obligatorios.",
      itemName: null,
      variant: "warning"
    })
  );
}

export { FormValidationDialog };
