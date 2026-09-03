import { jsx, jsxs } from "react/jsx-runtime";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/Input";
import { Select } from "../../../../shared/components/ui/Select";
import { Button } from "../../../../shared/components/ui/Button";
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

  const validate = () => {
    if (!String(nombre).trim()) return "Debe indicar el nombre de la categoría.";
    if (!String(estadoSelect).trim()) return "Debe seleccionar un estado.";
    return "";
  };

  return /* @__PURE__ */jsx(Modal, {
    isOpen,
    onClose,
    title: isEditing ? "Editar Categor\xEDa" : "Nueva Categor\xEDa",
    children: /* @__PURE__ */jsxs("div", {
      className: "space-y-6",
      children: [/* @__PURE__ */jsx(Input, {
        label: "Nombre de la categoría",
        value: nombre,
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
              alert(error);
              return;
            }
            onSave();
          },
          children: "Guardar"
        })]
      })]
    })
  });
}
export { CategoryFormModal };