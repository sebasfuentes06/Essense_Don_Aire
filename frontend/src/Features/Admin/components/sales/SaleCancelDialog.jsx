import { jsx } from "react/jsx-runtime";
import { DeleteDialog } from "../../../../shared/components/ui/DeleteDialog";
function SaleCancelDialog({ isOpen, onClose, onConfirm, saleToCancel }) {
  return /* @__PURE__ */ jsx(
    DeleteDialog,
    {
      isOpen,
      onClose,
      onConfirm,
      title: "¿Cancelar esta venta?",
      description: "La venta quedará marcada como cancelada y conservará su historial.",
      itemName: saleToCancel?.folio
    }
  );
}
export {
  SaleCancelDialog
};
