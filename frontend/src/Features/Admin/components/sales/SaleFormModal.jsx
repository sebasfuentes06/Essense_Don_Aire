import { jsx, jsxs } from "react/jsx-runtime";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/Input";
import { Select } from "../../../../shared/components/ui/Select";
import { Button } from "../../../../shared/components/ui/Button";

function SaleFormModal({ isOpen, onClose, saleForm, onFormChange, sellers, onSave }) {
  const cliente = saleForm.id_cliente ?? saleForm.customer ?? "";
  const vendedor = saleForm.id_usuario ?? saleForm.seller ?? "";
  const fechaVenta = saleForm.fecha_venta ?? saleForm.date ?? "";
  const metodoPago = saleForm.id_metodo_pago ?? saleForm.paymentMethod ?? "cash";
  const total = saleForm.total ?? "";

  const validate = () => {
    if (!String(cliente).trim() || Number(cliente) <= 0) return "Debe indicar un cliente válido.";
    if (!String(vendedor).trim() || Number(vendedor) <= 0) return "Debe seleccionar un vendedor válido.";
    if (!fechaVenta) return "Debe indicar una fecha.";
    if (!String(metodoPago).trim() || Number(metodoPago) <= 0) return "Debe seleccionar un método de pago.";
    if (!total || Number(total) <= 0) return "El total debe ser mayor a 0.";
    return "";
  };

  return /* @__PURE__ */jsx(Modal, {
    isOpen,
    onClose,
    size: "lg",
    title: "Nueva venta",
    children: /* @__PURE__ */jsxs("div", {
      className: "space-y-5",
      children: [/* @__PURE__ */jsxs("div", {
        className: "grid grid-cols-1 gap-4 md:grid-cols-2",
        children: [/* @__PURE__ */jsx(Input, {
          label: "Cliente",
          value: cliente,
          onChange: event => onFormChange({ ...saleForm, id_cliente: event.target.value, customer: event.target.value }),
          placeholder: "Nombre del cliente"
        }), /* @__PURE__ */jsx(Select, {
          label: "Vendedor",
          value: vendedor,
          onChange: event => onFormChange({ ...saleForm, id_usuario: event.target.value, seller: event.target.value }),
          options: [{ value: "", label: "Seleccionar vendedor" }, ...sellers.map(seller => ({ value: String(seller.id ?? seller), label: seller.name ?? seller }))]
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "grid grid-cols-1 gap-4 md:grid-cols-2",
        children: [/* @__PURE__ */jsx(Input, {
          label: "Fecha",
          type: "date",
          value: fechaVenta,
          onChange: event => onFormChange({ ...saleForm, fecha_venta: event.target.value, date: event.target.value })
        }), /* @__PURE__ */jsx(Select, {
          label: "Método de pago",
          value: metodoPago,
          onChange: event => onFormChange({ ...saleForm, id_metodo_pago: Number(event.target.value), paymentMethod: event.target.value }),
          options: [{ value: "1", label: "Efectivo" }, { value: "2", label: "Tarjeta" }, { value: "3", label: "Transferencia" }, { value: "4", label: "Mixto" }]
        })]
      }), /* @__PURE__ */jsx(Input, {
        label: "Total de la venta",
        type: "number",
        min: "0",
        step: "0.01",
        value: total,
        onChange: event => onFormChange({ ...saleForm, total: event.target.value }),
        placeholder: "0.00"
      }), /* @__PURE__ */jsx("p", {
        className: "text-xs text-muted-foreground",
        children: "La venta se registrará como completada y recibirá un folio consecutivo."
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
          children: "Registrar venta"
        })]
      })]
    })
  });
}

export { SaleFormModal };
