import { jsx, jsxs } from "react/jsx-runtime";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/Input";
import { Select } from "../../../../shared/components/ui/Select";
import { Button } from "../../../../shared/components/ui/Button";
function ProductFormModal({
  isOpen,
  onClose,
  isEditing,
  productForm,
  onProductFormChange,
  categories,
  suppliers,
  onSave
}) {
  const nombre = productForm.nombre ?? productForm.name ?? "";
  const descripcion = productForm.descripcion ?? productForm.description ?? "";
  const precio = productForm.precio ?? productForm.price ?? "";
  const stock = productForm.stock ?? "";
  const stockMinimo = productForm.stock_minimo ?? productForm.minStock ?? "";
  const sku = productForm.sku ?? "";
  const imageUrl = productForm.imageUrl ?? productForm.imagen ?? "";
  const estadoValue = productForm.estado ?? productForm.status ?? true;
  const estadoSelect = estadoValue === true || estadoValue === "true" || estadoValue === "active" ? "active" : "inactive";
  const categoriaValue = String(productForm.id_categoria ?? productForm.category ?? "");
  const proveedorValue = String(productForm.id_proveedor ?? productForm.supplier ?? "");

  const validate = () => {
    if (!String(nombre).trim()) return "Debe indicar el nombre del producto.";
    if (!String(sku).trim()) return "Debe indicar el SKU del producto.";
    if (!String(categoriaValue).trim() || Number(categoriaValue) <= 0) return "Debe seleccionar una categoría.";
    if (!String(proveedorValue).trim() || Number(proveedorValue) <= 0) return "Debe seleccionar un proveedor.";
    if (Number(precio) <= 0) return "El precio debe ser mayor a 0.";
    if (Number(stock) < 0) return "El stock no puede ser negativo.";
    if (Number(stockMinimo) < 0) return "El stock mínimo no puede ser negativo.";
    return "";
  };

  const handleLocalImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onProductFormChange({
        ...productForm,
        imageUrl: reader.result,
        imagen: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  return /* @__PURE__ */jsx(Modal, {
    isOpen,
    onClose,
    size: "xl",
    title: isEditing ? "Editar Producto" : "Nuevo Producto",
    children: /* @__PURE__ */jsxs("div", {
      className: "space-y-5",
      children: [/* @__PURE__ */jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        children: [/* @__PURE__ */jsx(Input, {
          label: "Nombre del producto",
          value: nombre,
          onChange: e => onProductFormChange({
            ...productForm,
            nombre: e.target.value,
            name: e.target.value
          }),
          placeholder: "Ej. Essence Royale"
        }), /* @__PURE__ */jsx(Input, {
          label: "Código SKU",
          value: sku,
          onChange: e => onProductFormChange({
            ...productForm,
            sku: e.target.value
          }),
          placeholder: "Ej. ESS-ROY-001"
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        children: [/* @__PURE__ */jsx(Input, {
          label: "Descripción",
          value: descripcion || "",
          onChange: e => onProductFormChange({
            ...productForm,
            descripcion: e.target.value,
            description: e.target.value
          }),
          placeholder: "Descripción breve"
        }), /* @__PURE__ */jsx(Input, {
          label: "Imagen (URL)",
          value: imageUrl,
          onChange: e => onProductFormChange({
            ...productForm,
            imageUrl: e.target.value,
            imagen: e.target.value
          }),
          placeholder: "https://..."
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "rounded-2xl border border-dashed border-border bg-muted/30 p-4",
        children: [/* @__PURE__ */jsxs("div", {
          className: "flex items-center justify-between gap-3",
          children: [/* @__PURE__ */jsx("span", {
            className: "text-sm font-medium text-foreground",
            children: "Vista previa de imagen"
          }), /* @__PURE__ */jsx("label", {
            className: "inline-flex cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted",
            children: ["Subir imagen local", /* @__PURE__ */jsx("input", {
              type: "file",
              accept: "image/*",
              className: "hidden",
              onChange: handleLocalImageUpload
            })]
          })]
        }), imageUrl ? /* @__PURE__ */jsx("img", {
          src: imageUrl,
          alt: "Vista previa",
          className: "mt-4 h-52 w-full rounded-xl border border-border object-cover"
        }) : /* @__PURE__ */jsx("div", {
          className: "mt-4 flex h-40 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground",
          children: "No hay imagen disponible aún"
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        children: [/* @__PURE__ */jsx(Input, {
          label: "Precio",
          value: precio,
          type: "number",
          min: "0",
          step: "0.01",
          onChange: e => onProductFormChange({
            ...productForm,
            precio: e.target.value,
            price: e.target.value
          }),
          placeholder: "0.00"
        }), /* @__PURE__ */jsx(Input, {
          label: "Cantidad en stock",
          value: stock,
          type: "number",
          min: "0",
          onChange: e => onProductFormChange({
            ...productForm,
            stock: e.target.value
          }),
          placeholder: "Cantidad"
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        children: [/* @__PURE__ */jsx(Input, {
          label: "Stock mínimo",
          value: stockMinimo,
          type: "number",
          min: "0",
          onChange: e => onProductFormChange({
            ...productForm,
            stock_minimo: e.target.value,
            minStock: e.target.value
          }),
          placeholder: "10"
        }), /* @__PURE__ */jsx(Select, {
          label: "Estado",
          value: estadoSelect,
          onChange: e => {
            const nextEstado = e.target.value === "active";
            onProductFormChange({
              ...productForm,
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
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        children: [/* @__PURE__ */jsx(Select, {
          label: "Categoría",
          value: categoriaValue,
          onChange: e => onProductFormChange({
            ...productForm,
            id_categoria: Number(e.target.value),
            category: e.target.value
          }),
          options: categories.map(category => ({
            value: String(category.id ?? category),
            label: category.name ?? category
          }))
        }), /* @__PURE__ */jsx(Select, {
          label: "Proveedor",
          value: proveedorValue,
          onChange: e => onProductFormChange({
            ...productForm,
            id_proveedor: Number(e.target.value),
            supplier: e.target.value
          }),
          options: [{
            value: "",
            label: "Seleccionar proveedor"
          }, ...suppliers.map(supplier => ({
            value: String(supplier.id ?? supplier),
            label: supplier.name ?? supplier
          }))]
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
export { ProductFormModal };