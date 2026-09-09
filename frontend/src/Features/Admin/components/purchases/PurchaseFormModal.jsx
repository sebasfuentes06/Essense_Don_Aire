import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/input";
import { Select } from "../../../../shared/components/ui/Select";
import { Button } from "../../../../shared/components/ui/button";
import { FormValidationDialog } from "../../../../shared/components/ui/FormValidationDialog";
import { validatePurchaseForm } from "../../validations/formValidation";

function PurchaseFormModal({
  isOpen,
  onClose,
  isEditing,
  purchaseForm,
  onFormChange,
  suppliers,
  products = [],
  onSave
}) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const folio = purchaseForm.folio ?? "";
  const idProveedor = purchaseForm.id_proveedor ?? purchaseForm.supplierId ?? "";
  const fechaCompra = purchaseForm.fecha_compra ?? purchaseForm.date ?? "";
  const estado = purchaseForm.estado ?? purchaseForm.status ?? "pending";
  const subtotal = Number(purchaseForm.subtotal ?? 0);
  const impuesto = Number(purchaseForm.impuesto ?? purchaseForm.tax ?? 0);
  const total = Number(purchaseForm.total ?? subtotal + impuesto);
  const items = Array.isArray(purchaseForm.items) ? purchaseForm.items : [];
  const totalItems = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const [validationOpen, setValidationOpen] = useState(false);

  const errors = validatePurchaseForm({ folio, idProveedor, fechaCompra, estado, items, subtotal, impuesto, total });
  const validate = () => {
    const nextErrors = validatePurchaseForm({ folio, idProveedor, fechaCompra, estado, items, subtotal, impuesto, total });
    return Object.values(nextErrors)[0] || "";
  };

  const addItem = () => {
    const productId = Number(selectedProductId);
    if (!productId || Number(selectedQuantity) <= 0) return;

    const selectedProduct = products.find((product) => Number(product.id) === productId);
    if (!selectedProduct) return;

    const existingItem = items.find((item) => Number(item.productId) === Number(selectedProduct.id));
    const nextItems = existingItem
      ? items.map((item) => Number(item.productId) === Number(selectedProduct.id)
        ? { ...item, quantity: Number(item.quantity) + Number(selectedQuantity) }
        : item)
      : [...items, {
        productId: Number(selectedProduct.id),
        productName: selectedProduct.name,
        quantity: Number(selectedQuantity),
        unitCost: Number(selectedProduct.price)
      }];

    const nextSubtotal = nextItems.reduce((sum, item) => sum + Number(item.unitCost || 0) * Number(item.quantity || 0), 0);
    const nextTax = Number(purchaseForm.impuesto ?? purchaseForm.tax ?? 0);
    const nextTotal = nextSubtotal + nextTax;

    onFormChange({
      ...purchaseForm,
      items: nextItems,
      subtotal: nextSubtotal,
      total: nextTotal,
      impuesto: nextTax,
      tax: nextTax
    });
    setSelectedProductId("");
    setSelectedQuantity(1);
  };

  return /* @__PURE__ */jsxs("div", {
    children: [/* @__PURE__ */jsx(Modal, {
      isOpen,
      onClose,
      size: "xl",
      title: isEditing ? "Editar compra" : "Nueva compra",
      children: /* @__PURE__ */jsxs("div", {
        className: "space-y-5",
        children: [/* @__PURE__ */jsxs("div", {
        className: "grid grid-cols-1 gap-4 md:grid-cols-2",
        children: [/* @__PURE__ */jsx(Input, {
          label: "Folio",
          value: folio,
          onChange: e => onFormChange({ ...purchaseForm, folio: e.target.value }),
          placeholder: "OC-00X",
          required: true,
          error: errors.folio
        }), /* @__PURE__ */jsx(Select, {
          label: "Proveedor",
          value: String(idProveedor || ""),
          onChange: e => onFormChange({ ...purchaseForm, id_proveedor: Number(e.target.value), supplierId: Number(e.target.value) }),
          options: [{ value: "", label: "Seleccionar proveedor" }, ...suppliers.map((supplier) => ({ value: String(supplier.id ?? supplier), label: supplier.name ?? supplier }))],
          required: true,
          error: errors.id_proveedor
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "grid grid-cols-1 gap-4 md:grid-cols-2",
        children: [/* @__PURE__ */jsx(Input, {
          label: "Fecha",
          type: "date",
          value: fechaCompra,
          onChange: e => onFormChange({ ...purchaseForm, fecha_compra: e.target.value, date: e.target.value }),
          required: true,
          error: errors.fecha_compra
        }), /* @__PURE__ */jsx(Select, {
          label: "Estado",
          value: estado,
          onChange: e => onFormChange({ ...purchaseForm, estado: e.target.value, status: e.target.value }),
          options: [{ value: "pending", label: "Pendiente" }, { value: "partial", label: "Parcial" }, { value: "paid", label: "Pagado" }, { value: "cancelled", label: "Cancelado" }],
          required: true,
          error: errors.estado
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "space-y-3 rounded-2xl border border-border bg-muted/20 p-4",
        children: [/* @__PURE__ */jsxs("div", {
          className: "grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_140px_auto]",
          children: [/* @__PURE__ */jsx(Select, {
            label: "Producto disponible",
            value: selectedProductId,
            onChange: e => setSelectedProductId(e.target.value),
            options: [{ value: "", label: "Seleccionar producto" }, ...products.map((product) => ({ value: String(product.id), label: `${product.name} - $${product.price.toFixed(2)}` }))]
          }), /* @__PURE__ */jsx(Input, {
            label: "Cantidad",
            type: "number",
            min: "1",
            value: selectedQuantity,
            onChange: e => setSelectedQuantity(Number(e.target.value) || 1)
          }), /* @__PURE__ */jsx("div", {
            className: "flex items-end",
            children: /* @__PURE__ */jsx(Button, {
              type: "button",
              onClick: addItem,
              children: "Agregar"
            })
          })]
        }), /* @__PURE__ */jsx("p", {
          className: "text-sm text-destructive",
          children: errors.items
        }), /* @__PURE__ */jsxs("div", {
          className: "rounded-xl border border-border bg-background/40 p-3",
          children: [/* @__PURE__ */jsxs("div", {
            className: "mb-2 flex items-center justify-between gap-2",
            children: [/* @__PURE__ */jsx("p", {
              className: "text-sm font-medium text-foreground",
              children: "Ítems agregados"
            }), /* @__PURE__ */jsx("span", {
              className: "text-xs text-muted-foreground",
              children: [`Total: ${totalItems} item${totalItems === 1 ? "" : "s"}`]
            })]
          }), items.length > 0 ? /* @__PURE__ */jsx("div", {
            className: "space-y-2",
            children: items.map((item, index) => /* @__PURE__ */jsxs("div", {
              className: "flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2",
              children: [/* @__PURE__ */jsxs("div", {
                children: [/* @__PURE__ */jsx("p", {
                  className: "font-medium text-foreground",
                  children: item.productName
                }), /* @__PURE__ */jsx("p", {
                  className: "text-xs text-muted-foreground",
                  children: [`Cantidad: ${item.quantity}`]
                })]
              }), /* @__PURE__ */jsx("p", {
                className: "text-sm font-medium text-foreground",
                children: [`$${((Number(item.unitCost) || 0) * Number(item.quantity || 0)).toFixed(2)}`]
              })]
            }, `${item.productId ?? index}`))
          }) : /* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "No hay productos agregados todavía."
          })]
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "grid grid-cols-1 gap-4 md:grid-cols-3",
        children: [/* @__PURE__ */jsx(Input, {
          label: "Subtotal",
          type: "number",
          min: "0",
          step: "0.01",
          value: subtotal,
          error: errors.subtotal,
          onChange: e => {
            const nextSubtotal = Number(e.target.value) || 0;
            onFormChange({ ...purchaseForm, subtotal: nextSubtotal, total: nextSubtotal + Number(purchaseForm.impuesto ?? purchaseForm.tax ?? 0) });
          },
          required: true
        }), /* @__PURE__ */jsx(Input, {
          label: "Impuesto",
          type: "number",
          min: "0",
          step: "0.01",
          value: impuesto,
          error: errors.impuesto,
          onChange: e => {
            const nextTax = Number(e.target.value) || 0;
            onFormChange({ ...purchaseForm, impuesto: nextTax, tax: nextTax, total: Number(purchaseForm.subtotal ?? 0) + nextTax });
          }
        }), /* @__PURE__ */jsx(Input, {
          label: "Total",
          type: "number",
          min: "0",
          step: "0.01",
          value: total,
          error: errors.total,
          onChange: e => onFormChange({ ...purchaseForm, total: Number(e.target.value) || 0 })
        })]
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
          children: isEditing ? "Guardar cambios" : "Guardar compra"
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

export { PurchaseFormModal };
