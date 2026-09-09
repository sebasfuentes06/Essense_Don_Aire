import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/input";
import { Select } from "../../../../shared/components/ui/Select";
import { Button } from "../../../../shared/components/ui/button";
import { FormValidationDialog } from "../../../../shared/components/ui/FormValidationDialog";
import { validateCategoryForm } from "../../validations/formValidation";
function CategoryFormModal({
  isOpen,
  onClose,
  isEditing,
  categoryForm,
  onCategoryFormChange,
  onSave
}) {
  const nombre = categoryForm.nombre ?? categoryForm.name ?? "";
  const descripcion = categoryForm.descripcion ?? categoryForm.description ?? "";
  const estadoValue = categoryForm.estado ?? categoryForm.status ?? true;
  const estadoSelect = estadoValue === true || estadoValue === "true" || estadoValue === "active" ? "active" : "inactive";
  const [validationOpen, setValidationOpen] = useState(false);
  const errors = validateCategoryForm({ nombre, descripcion });

  const validate = () => {
    const nextErrors = validateCategoryForm({ nombre, descripcion });
    return Object.values(nextErrors)[0] || "";
  };

  return /* @__PURE__ */jsxs("div", {
    children: [/* @__PURE__ */jsx(Modal, {
      isOpen,
      onClose,
      size: "xl",
      title: isEditing ? "Editar Categor\xEDa" : "Nueva Categor\xEDa",
      children: /* @__PURE__ */jsxs("div", {
        className: "space-y-6",
        children: [/* @__PURE__ */jsx(Input, {
          label: "Nombre de la categoría",
          value: nombre,
          required: true,
          error: errors.nombre,
          onChange: e => onCategoryFormChange({
            ...categoryForm,
            nombre: e.target.value,
            name: e.target.value
          }),
          placeholder: "Nombre de la categor\xEDa"
        }), /* @__PURE__ */jsx(Input, {
          label: "Descripción",
          value: descripcion,
          onChange: e => onCategoryFormChange({
            ...categoryForm,
            descripcion: e.target.value,
            description: e.target.value
          }),
          placeholder: "Descripci\xF3n breve"
        }), /* @__PURE__ */jsx(Select, {
          label: "Estado",
          value: estadoSelect,
          onChange: e => {
            const nextEstado = e.target.value === "active";
            onCategoryFormChange({
              ...categoryForm,
              estado: nextEstado,
              status: e.target.value
            });
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
export { CategoryFormModal };