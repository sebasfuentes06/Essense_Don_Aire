import { jsx } from "react/jsx-runtime";
import { ProductCard } from "./ProductCard";
function ProductGrid({
  products,
  onAddToCart
}) {
  return /* @__PURE__ */jsx("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
    children: products.map(product => /* @__PURE__ */jsx(ProductCard, {
      product,
      onAddToCart
    }, product.id))
  });
}
export { ProductGrid };