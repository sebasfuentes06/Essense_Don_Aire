import { jsx, jsxs } from "react/jsx-runtime";
import { Plus, Package } from "lucide-react";
import { Button } from "../../../../shared/components/ui/Button";
function ProductsHeader({
  onNewProduct
}) {
  return /* @__PURE__ */jsxs("div", {
    className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4",
    children: [/* @__PURE__ */jsxs("div", {
      children: [/* @__PURE__ */jsx("h1", {
        className: "text-4xl font-bold text-foreground mb-2",
        children: "Gesti\xF3n de Productos"
      }), /* @__PURE__ */jsx("p", {
        className: "text-muted-foreground",
        children: "Administra tu inventario de fragancias"
      })]
    }), /* @__PURE__ */jsxs("div", {
      className: "flex gap-3",
      children: [/* @__PURE__ */jsxs(Button, {
        children: [/* @__PURE__ */jsx(Package, {
          className: "h-5 w-5"
        }), "Exportar"]
      }), /* @__PURE__ */jsxs(Button, {
        onClick: onNewProduct,
        children: [/* @__PURE__ */jsx(Plus, {
          className: "h-5 w-5"
        }), "Nuevo Producto"]
      })]
    })]
  });
}
export { ProductsHeader };