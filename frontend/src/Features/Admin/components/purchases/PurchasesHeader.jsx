import { jsx, jsxs } from "react/jsx-runtime";
import { Download, Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
function PurchasesHeader({ onNewPurchase }) {
  return /* @__PURE__ */jsxs("div", {
    className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4",
    children: [/* @__PURE__ */jsxs("div", {
      children: [/* @__PURE__ */jsx("h1", {
        className: "text-4xl font-bold text-foreground mb-2",
        children: "Compras"
      }), /* @__PURE__ */jsx("p", {
        className: "text-muted-foreground",
        children: "Gesti\xF3n de pedidos y abonos a proveedores"
      })]
    }), /* @__PURE__ */jsxs("div", {
      className: "flex gap-3",
      children: [/* @__PURE__ */jsxs(Button, {
        children: [/* @__PURE__ */jsx(Download, {
          className: "h-5 w-5"
        }), "Exportar"]
      }), /* @__PURE__ */jsxs(Button, {
        onClick: onNewPurchase,
        children: [/* @__PURE__ */jsx(Plus, {
          className: "h-5 w-5"
        }), "Nueva Orden de Compra"]
      })]
    })]
  });
}
export { PurchasesHeader };