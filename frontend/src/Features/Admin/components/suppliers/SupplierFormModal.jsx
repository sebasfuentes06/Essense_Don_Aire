import { jsx, jsxs } from "react/jsx-runtime";
import { Button } from "../../../../shared/components/ui/Button";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/Input";
import { Select } from "../../../../shared/components/ui/Select";
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

  const validate = () => {
    if (!String(nombre).trim()) return "Debe indicar el nombre del proveedor.";
    if (!String(contacto).trim()) return "Debe indicar el nombre del contacto.";
    if (String(supplierForm.email ?? "").trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(supplierForm.email).trim())) return "El correo electrónico no es válido.";
    if (String(telefono).trim() && !/^[+()\d\s-]{7,}$/.test(String(telefono).trim())) return "El teléfono no es válido.";
    if (!String(estadoSelect).trim()) return "Debe seleccionar un estado.";
    return "";
  };

  return /* @__PURE__ */jsx(Modal, {
    isOpen,
    onClose,
    title: isEditing ? "Editar Proveedor" : "Nuevo Proveedor",
    children: /* @__PURE__ */jsxs("div", {
      className: "space-y-6",
      children: [/* @__PURE__ */jsx(Input, {
        label: "Nombre del proveedor",
        value: nombre,
        onChange: e => onFormChange({
          ...supplierForm,
          nombre: e.target.value,
          name: e.target.value
        }),
        placeholder: "Nombre del proveedor"
      }), /* @__PURE__ */jsx(Input, {
        label: "Contacto",
        value: contacto,
        onChange: e => onFormChange({
          ...supplierForm,
          contacto: e.target.value,
          contact: e.target.value
        }),
        placeholder: "Nombre del contacto"
      }), /* @__PURE__ */jsx(Input, {
        label: "Correo electrónico",
        value: supplierForm.email ?? "",
        onChange: e => onFormChange({
          ...supplierForm,
          email: e.target.value
        }),
        placeholder: "contacto@proveedor.com"
      }), /* @__PURE__ */jsxs("div", {
        className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4",
        children: [/* @__PURE__ */jsx(Input, {
          label: "Teléfono",
          value: telefono,
          onChange: e => onFormChange({
            ...supplierForm,
            telefono: e.target.value,
            phone: e.target.value
          }),
          placeholder: "Tel\xE9fono"
        }), /* @__PURE__ */jsx(Input, {
          label: "Ciudad",
          value: ciudad,
          onChange: e => onFormChange({
            ...supplierForm,
            ciudad: e.target.value,
            city: e.target.value
          }),
          placeholder: "Ciudad"
        })]
      }), /* @__PURE__ */jsx(Select, {
        label: "Estado",
        value: estadoSelect,
        onChange: e => {
          const nextEstado = e.target.value === "active";
          onFormChange({
            ...supplierForm,
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
          children: "Guardar"
        })]
      })]
    })
  });
}
export { SupplierFormModal };