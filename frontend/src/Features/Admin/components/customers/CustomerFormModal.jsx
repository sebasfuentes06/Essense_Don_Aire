import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Button } from "../../../../shared/components/ui/button";
import { Input } from "../../../../shared/components/ui/input";
import { Select } from "../../../../shared/components/ui/Select";
import { FormValidationDialog } from "../../../../shared/components/ui/FormValidationDialog";
import { validateCustomerForm } from "../../validations/formValidation";
function CustomerFormModal({
  isOpen,
  onClose,
  isEditing,
  customerForm,
  onFieldChange,
  onSave
}) {
  const nombre = customerForm.nombre ?? customerForm.name ?? "";
  const correo = customerForm.correo ?? customerForm.email ?? "";
  const contrasena = customerForm.contrasena ?? customerForm.password ?? "";
  const telefono = customerForm.telefono ?? customerForm.phone ?? "";
  const ciudad = customerForm.ciudad ?? customerForm.city ?? "";
  const estadoValue = customerForm.estado ?? customerForm.status ?? true;
  const estadoSelect = estadoValue === true || estadoValue === "true" || estadoValue === "active" ? "active" : "inactive";
  const [validationOpen, setValidationOpen] = useState(false);

  const errors = validateCustomerForm({ nombre, correo, contrasena, telefono, ciudad, isEditing });
  const validate = () => {
    const nextErrors = validateCustomerForm({ nombre, correo, contrasena, telefono, ciudad, isEditing });
    return Object.values(nextErrors)[0] || "";
  };

  return /* @__PURE__ */jsxs("div", {
    children: [/* @__PURE__ */jsx(Modal, {
      isOpen,
      onClose,
      size: "xl",
      title: isEditing ? "Editar Cliente" : "Nuevo Cliente",
      children: /* @__PURE__ */jsxs("div", {
        className: "space-y-6",
        children: [/* @__PURE__ */jsx(Input, {
          label: "Nombre completo",
          value: nombre,
          required: true,
          error: errors.nombre,
          onChange: e => {
            onFieldChange("name", e.target.value);
            onFieldChange("nombre", e.target.value);
          },
          placeholder: "Nombre completo"
        }), /* @__PURE__ */jsx(Input, {
          label: "Correo electrónico",
          value: correo,
          required: true,
          error: errors.correo,
          onChange: e => {
            onFieldChange("email", e.target.value);
            onFieldChange("correo", e.target.value);
          },
          placeholder: "correo@ejemplo.com"
        }), /* @__PURE__ */jsx(Input, {
          label: isEditing ? "Nueva contraseña (opcional)" : "Contraseña",
          type: "password",
          required: !isEditing,
          error: errors.contrasena,
          value: contrasena,
          onChange: e => {
            onFieldChange("password", e.target.value);
            onFieldChange("contrasena", e.target.value);
          },
          placeholder: isEditing ? "Dejar vacío para conservarla" : "Contraseña segura"
        }), /* @__PURE__ */jsx(Input, {
          label: "Teléfono",
          type: "text",
          inputMode: "numeric",
          value: telefono,
          error: errors.telefono,
          onChange: e => {
            const nextValue = e.target.value.replace(/[^\d\s()+-]/g, "");
            onFieldChange("phone", nextValue);
            onFieldChange("telefono", nextValue);
          },
          placeholder: "+52 1 555 555 5555"
        }), /* @__PURE__ */jsx(Input, {
          label: "Ciudad",
          value: ciudad,
          required: true,
          error: errors.ciudad,
          onChange: e => {
            onFieldChange("city", e.target.value);
            onFieldChange("ciudad", e.target.value);
          },
          placeholder: "Ciudad"
        }), /* @__PURE__ */jsx(Select, {
          label: "Estado",
          value: estadoSelect,
          required: true,
          onChange: e => {
            const nextEstado = e.target.value === "active";
            onFieldChange("status", e.target.value);
            onFieldChange("estado", nextEstado);
          },
          options: [{
            value: "active",
            label: "Activo"
          }, {
            value: "inactive",
            label: "Inactivo"
          }]
        }), /* @__PURE__ */jsxs("div", {
          className: "flex justify-end gap-3 border-t border-border pt-5",
          children: [/* @__PURE__ */jsx(Button, {
            variant: "outline",
            onClick: onClose,
            children: "Cancelar"
          }), /* @__PURE__ */jsx(Button, {
            onClick: () => {
              const error = validate();
              if (error) {
                setValidationOpen(true);
                return;
              }
              onSave();
            },
            children: "Guardar"
          })]
        })]
      })
    }), /* @__PURE__ */jsx(FormValidationDialog, {
      isOpen: validationOpen,
      onClose: () => setValidationOpen(false),
      message: validate()
    })]
  });
}
export { CustomerFormModal };