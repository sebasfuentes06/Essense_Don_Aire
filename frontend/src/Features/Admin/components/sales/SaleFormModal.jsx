import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/input";
import { Select } from "../../../../shared/components/ui/Select";
import { Button } from "../../../../shared/components/ui/button";
import { FormValidationDialog } from "../../../../shared/components/ui/FormValidationDialog";
import { validateSaleForm } from "../../validations/formValidation";

function SaleFormModal({ isOpen, onClose, saleForm, onFormChange, sellers, onSave }) {
  const cliente = saleForm.id_cliente ?? saleForm.customer ?? "";
  const vendedor = saleForm.id_usuario ?? saleForm.seller ?? "";
  const fechaVenta = saleForm.fecha_venta ?? saleForm.date ?? "";
  const metodoPago = saleForm.id_metodo_pago ?? saleForm.paymentMethod ?? "cash";
  const total = saleForm.total ?? "";
  const [validationOpen, setValidationOpen] = useState(false);

  const errors = validateSaleForm({ cliente, vendedor, fechaVenta, metodoPago, total });
  const validate = () => {
    const nextErrors = validateSaleForm({ cliente, vendedor, fechaVenta, metodoPago, total });
    return Object.values(nextErrors)[0] || "";
  };

  return /* @__PURE__ */jsxs("div", {
    children: [/* @__PURE__ */jsx(Modal, {
      isOpen,
      onClose,
      size: "xl",
      title: "Nueva venta",
      children: /* @__PURE__ */jsxs("div", {
        className: "space-y-5",
        children: [/* @__PURE__ */jsxs("div", {
        className: "grid grid-cols-1 gap-4 md:grid-cols-2",
        children: [/* @__PURE__ */jsx(Input, {
          label: "Cliente",
          value: cliente,
          required: true,
          error: errors.cliente,
          onChange: event => onFormChange({ ...saleForm, id_cliente: event.target.value, customer: event.target.value }),
          placeholder: "Nombre del cliente"
        }), /* @__PURE__ */jsx(Select, {
          label: "Vendedor",
          value: vendedor,
          required: true,
          error: errors.vendedor,
          onChange: event => onFormChange({ ...saleForm, id_usuario: event.target.value, seller: event.target.value }),
          options: [{ value: "", label: "Seleccionar vendedor" }, ...sellers.map(seller => ({ value: String(seller.id ?? seller), label: seller.name ?? seller }))]
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "grid grid-cols-1 gap-4 md:grid-cols-2",
        children: [/* @__PURE__ */jsx(Input, {
          label: "Fecha",
          type: "date",
          value: fechaVenta,
          required: true,
          error: errors.fecha_venta,
          onChange: event => onFormChange({ ...saleForm, fecha_venta: event.target.value, date: event.target.value })
        }), /* @__PURE__ */jsx(Select, {
          label: "Método de pago",
          value: metodoPago,
          required: true,
          error: errors.metodoPago,
          onChange: event => onFormChange({ ...saleForm, id_metodo_pago: Number(event.target.value), paymentMethod: event.target.value }),
          options: [{ value: "1", label: "Efectivo" }, { value: "2", label: "Tarjeta" }, { value: "3", label: "Transferencia" }, { value: "4", label: "Mixto" }]
        })]
      }), /* @__PURE__ */jsx(Input, {
        label: "Total de la venta",
        type: "number",
        min: "0",
        step: "0.01",
        value: total,
        required: true,
        error: errors.total,
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
              setValidationOpen(true);
              return;
            }
            onSave();
          },
          children: "Registrar venta"
        })]
      })]
    })
  }),
  /* @__PURE__ */jsx(FormValidationDialog, {
    isOpen: validationOpen,
    onClose: () => setValidationOpen(false),
    message: validate()
  })
]
  });
}

export { SaleFormModal };