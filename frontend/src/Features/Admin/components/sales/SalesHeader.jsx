import { jsx, jsxs } from "react/jsx-runtime";
import { Download, ShoppingCart } from "lucide-react";
import { Button } from "../../../../shared/components/ui/Button";
function SalesHeader({ onNewSale }) {
  return /* @__PURE__ */jsxs("div", {
    className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4",
    children: [/* @__PURE__ */jsxs("div", {
      children: [/* @__PURE__ */jsx("h1", {
        className: "text-4xl font-bold text-foreground mb-2",
        children: "Ventas"
      }), /* @__PURE__ */jsx("p", {
        className: "text-muted-foreground",
        children: "Historial completo de ventas y gesti\xF3n"
      })]
    }), /* @__PURE__ */jsxs("div", {
      className: "flex gap-3",
      children: [/* @__PURE__ */jsxs(Button, {
        children: [/* @__PURE__ */jsx(Download, {
          className: "h-5 w-5"
        }), "Exportar Excel"]
      }), /* @__PURE__ */jsxs(Button, {
        onClick: onNewSale,
        children: [/* @__PURE__ */jsx(ShoppingCart, {
          className: "h-5 w-5"
        }), "Nueva Venta (POS)"]
      })]
    })]
  });
}
export { SalesHeader };