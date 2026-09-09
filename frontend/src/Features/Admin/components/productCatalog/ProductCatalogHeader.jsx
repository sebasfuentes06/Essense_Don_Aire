import { jsx, jsxs } from "react/jsx-runtime";
import { ShoppingCart } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
function ProductCatalogHeader({ cartItemCount, onViewCart }) {
  return /* @__PURE__ */jsxs("div", {
    className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4",
    children: [/* @__PURE__ */jsxs("div", {
      children: [/* @__PURE__ */jsx("h1", {
        className: "text-4xl font-bold text-foreground mb-2",
        children: "Cat\xE1logo de Fragancias"
      }), /* @__PURE__ */jsx("p", {
        className: "text-muted-foreground",
        children: "Descubre nuestra colecci\xF3n exclusiva de perfumes premium"
      })]
    }), /* @__PURE__ */jsxs(Button, {
      onClick: onViewCart,
      children: [/* @__PURE__ */jsx(ShoppingCart, {
        className: "h-5 w-5"
      }), `Ver Carrito (${cartItemCount})`]
    })]
  });
}
export { ProductCatalogHeader };