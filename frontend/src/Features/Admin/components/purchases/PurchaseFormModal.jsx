import { jsx, jsxs } from "react/jsx-runtime";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/Input";
import { Select } from "../../../../shared/components/ui/Select";
import { Button } from "../../../../shared/components/ui/Button";

function PurchaseFormModal({
  isOpen,
  onClose,
  isEditing,
  purchaseForm,
  onFormChange,
  suppliers,
  onSave
}) {
  const folio = purchaseForm.folio ?? "";
  const idProveedor = purchaseForm.id_proveedor ?? purchaseForm.supplierId ?? "";
  const fechaCompra = purchaseForm.fecha_compra ?? purchaseForm.date ?? "";
  const estado = purchaseForm.estado ?? purchaseForm.status ?? "pending";
  const subtotal = purchaseForm.subtotal ?? "";
  const impuesto = purchaseForm.impuesto ?? purchaseForm.tax ?? "";
  const total = purchaseForm.total ?? "";

  const validate = () => {
    if (!String(folio).trim()) return "Debe indicar un folio.";
    if (!String(idProveedor).trim() || Number(idProveedor) <= 0) return "Debe seleccionar un proveedor.";
    if (!fechaCompra) return "Debe indicar una fecha.";
    if (!String(estado).trim()) return "Debe seleccionar un estado.";
    if (!String(subtotal).trim() || Number(subtotal) < 0) return "El subtotal no puede ser negativo.";
    if (!String(impuesto).trim() || Number(impuesto) < 0) return "El impuesto no puede ser negativo.";
    if (!String(total).trim() || Number(total) <= 0) return "El total debe ser mayor a 0.";
    return "";
  };

  return /* @__PURE__ */jsx(Modal, {
    isOpen,
    onClose,
    size: "lg",
    title: isEditing ? "Editar compra" : "Nueva compra",
    children: /* @__PURE__ */jsxs("div", {
      className: "space-y-5",
      children: [/* @__PURE__ */jsxs("div", {
        className: "grid grid-cols-1 gap-4 md:grid-cols-2",
        children: [/* @__PURE__ */jsx(Input, {
          label: "Folio",
          value: folio,
          onChange: e => onFormChange({ ...purchaseForm, folio: e.target.value }),
          placeholder: "OC-00X"
        }), /* @__PURE__ */jsx(Select, {
          label: "Proveedor",
          value: String(idProveedor || ""),
          onChange: e => onFormChange({ ...purchaseForm, id_proveedor: Number(e.target.value), supplierId: Number(e.target.value) }),
          options: [{ value: "", label: "Seleccionar proveedor" }, ...suppliers.map((supplier) => ({ value: String(supplier.id ?? supplier), label: supplier.name ?? supplier }))]
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "grid grid-cols-1 gap-4 md:grid-cols-2",
        children: [/* @__PURE__ */jsx(Input, {
          label: "Fecha",
          type: "date",
          value: fechaCompra,
          onChange: e => onFormChange({ ...purchaseForm, fecha_compra: e.target.value, date: e.target.value })
        }), /* @__PURE__ */jsx(Select, {
          label: "Estado",
          value: estado,
          onChange: e => onFormChange({ ...purchaseForm, estado: e.target.value, status: e.target.value }),
          options: [{ value: "pending", label: "Pendiente" }, { value: "partial", label: "Parcial" }, { value: "paid", label: "Pagado" }, { value: "cancelled", label: "Cancelado" }]
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "grid grid-cols-1 gap-4 md:grid-cols-3",
        children: [/* @__PURE__ */jsx(Input, {
          label: "Subtotal",
          type: "number",
          min: "0",
          step: "0.01",
          value: subtotal,
          onChange: e => onFormChange({ ...purchaseForm, subtotal: Number(e.target.value) || 0, subtotal_db: Number(e.target.value) || 0 })
        }), /* @__PURE__ */jsx(Input, {
          label: "Impuesto",
          type: "number",
          min: "0",
          step: "0.01",
          value: impuesto,
          onChange: e => onFormChange({ ...purchaseForm, impuesto: Number(e.target.value) || 0, tax: Number(e.target.value) || 0 })
        }), /* @__PURE__ */jsx(Input, {
          label: "Total",
          type: "number",
          min: "0",
          step: "0.01",
          value: total,
          onChange: e => onFormChange({ ...purchaseForm, total: Number(e.target.value) || 0 })
        })]
      }), /* @__PURE__ */jsx(Input, {
        label: "Items",
        value: purchaseForm.items?.length ? purchaseForm.items.map((item) => `${item.productName} (${item.quantity})`).join(", ") : "",
        onChange: () => null,
        placeholder: "Se llenará desde el listado de productos",
        readOnly: true
      }), /* @__PURE__ */jsx("p", {
        className: "text-xs text-muted-foreground",
        children: "Los artículos de la compra se gestionan desde la orden, y el sistema valida los datos mínimos requeridos antes de guardar."
      }), /* @__PURE__ */jsxs("div", {
        className: "flex justify-end gap-3 border-t border-border pt-5",
        children: [/* @__PURE__ */jsx(Button, {
          type: "button",
          variant: "outline",
          onClick: onClose,
          children: "Cancelar"
        }), /* @__PURE__ */jsx(Button, {
          type: "button",
          onClick: () => {
            const error = validate();
            if (error) {
              alert(error);
              return;
            }
            onSave();
          },
          children: isEditing ? "Guardar cambios" : "Guardar compra"
        })]
      })]
    })
  });
}

export { PurchaseFormModal };
