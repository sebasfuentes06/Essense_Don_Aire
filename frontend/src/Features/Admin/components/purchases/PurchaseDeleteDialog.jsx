import { jsx } from "react/jsx-runtime";
import { DeleteDialog } from "../../../../shared/components/ui/DeleteDialog";
function PurchaseDeleteDialog({ isOpen, onClose, onConfirm, purchaseToDelete }) {
  return /* @__PURE__ */ jsx(
    DeleteDialog,
    {
      isOpen,
      onClose,
      onConfirm,
      itemName: purchaseToDelete?.folio
    }
  );
}
export {
  PurchaseDeleteDialog
};
