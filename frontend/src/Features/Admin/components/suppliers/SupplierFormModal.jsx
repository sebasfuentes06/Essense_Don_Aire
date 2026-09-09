import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Button } from "../../../../shared/components/ui/button";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/input";
import { Select } from "../../../../shared/components/ui/Select";
import { FormValidationDialog } from "../../../../shared/components/ui/FormValidationDialog";
import { validateSupplierForm } from "../../validations/formValidation";

function SupplierFormModal({
  isOpen,
  onClose,
  isEditing,
  supplierForm,
  onFormChange,
  onSave
}) {
  const nombre = supplierForm.nombre ?? supplierForm.name ?? "";
  const contacto = supplierForm.contacto ?? supplierForm.contact ?? "";
  const telefono = supplierForm.telefono ?? supplierForm.phone ?? "";
  const ciudad = supplierForm.ciudad ?? supplierForm.city ?? "";
  const estadoValue = supplierForm.estado ?? supplierForm.status ?? true;
  const estadoSelect = estadoValue === true || estadoValue === "true" || estadoValue === "active" ? "active" : "inactive";
  const [validationOpen, setValidationOpen] = useState(false);

  const errors = validateSupplierForm({ nombre, contacto, email: supplierForm.email ?? "", telefono, ciudad });
  const validate = () => {
    const nextErrors = validateSupplierForm({ nombre, contacto, email: supplierForm.email ?? "", telefono, ciudad });
    return Object.values(nextErrors)[0] || "";
  };

  return /* @__PURE__ */jsxs("div", {
    children: [
      /* @__PURE__ */jsx(Modal, {
        isOpen,
        onClose,
        size: "xl",
        title: isEditing ? "Editar Proveedor" : "Nuevo Proveedor",
        children: /* @__PURE__ */jsxs("div", {
          className: "space-y-6",
          children: [
            /* @__PURE__ */jsx(Input, {
              label: "Nombre del proveedor",
              value: nombre,
              required: true,
              error: errors.nombre,
              onChange: e => onFormChange({
                ...supplierForm,
                nombre: e.target.value,
                name: e.target.value
              }),
              placeholder: "Nombre del proveedor"
            }),
            /* @__PURE__ */jsx(Input, {
              label: "Contacto",
              value: contacto,
              required: true,
              error: errors.contacto,
              onChange: e => onFormChange({
                ...supplierForm,
                contacto: e.target.value,
                contact: e.target.value
              }),
              placeholder: "Nombre del contacto"
            }),
            /* @__PURE__ */jsx(Input, {
              label: "Correo electrónico",
              value: supplierForm.email ?? "",
              error: errors.email,
              onChange: e => onFormChange({
                ...supplierForm,
                email: e.target.value
              }),
              placeholder: "contacto@proveedor.com"
            }),
            /* @__PURE__ */jsxs("div", {
              className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4",
              children: [
                /* @__PURE__ */jsx(Input, {
                  label: "Teléfono",
                  value: telefono,
                  error: errors.telefono,
                  onChange: e => onFormChange({
                    ...supplierForm,
                    telefono: e.target.value,
                    phone: e.target.value
                  }),
                  placeholder: "Teléfono"
                }),
                /* @__PURE__ */jsx(Input, {
                  label: "Ciudad",
                  value: ciudad,
                  error: errors.ciudad,
                  onChange: e => onFormChange({
                    ...supplierForm,
                    ciudad: e.target.value,
                    city: e.target.value
                  }),
                  placeholder: "Ciudad"
                })
              ]
            }),
            /* @__PURE__ */jsx(Select, {
              label: "Estado",
              value: estadoSelect,
              required: true,
              onChange: e => {
                const nextEstado = e.target.value === "active";
                onFormChange({
                  ...supplierForm,
                  estado: nextEstado,
                  status: e.target.value
                });
              },
              options: [{ value: "active", label: "Activo" }, { value: "inactive", label: "Inactivo" }]
            }),
            /* @__PURE__ */jsxs("div", {
              className: "flex justify-end gap-3 border-t border-border pt-5",
              children: [
                /* @__PURE__ */jsx(Button, {
                  type: "button",
                  variant: "outline",
                  onClick: onClose,
                  children: "Cancelar"
                }),
                /* @__PURE__ */jsx(Button, {
                  type: "button",
                  onClick: () => {
                    const error = validate();
                    if (error) {
                      setValidationOpen(true);
                      return;
                    }
                    onSave();
                  },
                  children: "Guardar"
                })
              ]
            })
          ]
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

export { SupplierFormModal };