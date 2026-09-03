import { jsx, jsxs } from "react/jsx-runtime";
import { Heart, Star } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Button } from "../../../../shared/components/ui/Button";
function ProductCard({
  product,
  onAddToCart
}) {
  return /* @__PURE__ */jsxs(Card, {
    hover: true,
    className: "overflow-hidden group",
    children: [/* @__PURE__ */jsxs("div", {
      className: "relative aspect-[4/5] overflow-hidden bg-muted",
      children: [/* @__PURE__ */jsx("img", {
        src: product.image,
        alt: product.name,
        className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      }), product.featured && /* @__PURE__ */jsx("div", {
        className: "absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold",
        children: "Destacado"
      }), !product.inStock && /* @__PURE__ */jsx("div", {
        className: "absolute inset-0 bg-black/50 flex items-center justify-center",
        children: /* @__PURE__ */jsx("span", {
          className: "px-4 py-2 rounded-full bg-destructive text-destructive-foreground font-semibold",
          children: "Agotado"
        })
      }), /* @__PURE__ */jsx("button", {
        className: "absolute top-3 right-3 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white",
        children: /* @__PURE__ */jsx(Heart, {
          className: "h-5 w-5 text-foreground"
        })
      })]
    }), /* @__PURE__ */jsxs("div", {
      className: "p-5",
      children: [/* @__PURE__ */jsxs("div", {
        className: "mb-3",
        children: [/* @__PURE__ */jsx("span", {
          className: "text-xs font-medium text-primary uppercase tracking-wide",
          children: product.category
        }), /* @__PURE__ */jsx("h3", {
          className: "text-xl font-semibold text-foreground mt-1 mb-2",
          children: product.name
        }), /* @__PURE__ */jsxs("div", {
          className: "flex items-center gap-2",
          children: [/* @__PURE__ */jsxs("div", {
            className: "flex items-center gap-1",
            children: [/* @__PURE__ */jsx(Star, {
              className: "h-4 w-4 fill-primary text-primary"
            }), /* @__PURE__ */jsx("span", {
              className: "text-sm font-semibold text-foreground",
              children: product.rating
            })]
          }), /* @__PURE__ */jsxs("span", {
            className: "text-sm text-muted-foreground",
            children: ["(", product.reviews, " rese\xF1as)"]
          })]
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsxs("p", {
            className: "text-2xl font-bold text-primary",
            children: ["$", product.price]
          }), /* @__PURE__ */jsx("p", {
            className: "text-xs text-muted-foreground",
            children: "100ml"
          })]
        }), /* @__PURE__ */jsx(Button, {
          disabled: !product.inStock,
          onClick: () => onAddToCart(product),
          children: product.inStock ? "Agregar" : "Agotado"
        })]
      })]
    })]
  });
}
export { ProductCard };