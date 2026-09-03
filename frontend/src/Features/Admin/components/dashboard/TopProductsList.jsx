import { jsx, jsxs } from "react/jsx-runtime";
import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../shared/components/ui/Card";
function TopProductsList({
  products
}) {
  return /* @__PURE__ */jsxs(Card, {
    children: [/* @__PURE__ */jsx(CardHeader, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center gap-2",
        children: [/* @__PURE__ */jsx(Package, {
          className: "h-5 w-5 text-primary"
        }), /* @__PURE__ */jsx(CardTitle, {
          children: "Productos M\xE1s Vendidos"
        })]
      })
    }), /* @__PURE__ */jsx(CardContent, {
      children: /* @__PURE__ */jsx("div", {
        className: "space-y-3",
        children: products.map((product, index) => /* @__PURE__ */jsxs("div", {
          className: "flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors",
          children: [/* @__PURE__ */jsxs("div", {
            className: "flex items-center gap-3",
            children: [/* @__PURE__ */jsx("div", {
              className: "h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center",
              children: /* @__PURE__ */jsx("span", {
                className: "text-sm font-bold text-primary",
                children: index + 1
              })
            }), /* @__PURE__ */jsxs("div", {
              children: [/* @__PURE__ */jsx("p", {
                className: "font-medium text-foreground",
                children: product.name
              }), /* @__PURE__ */jsxs("p", {
                className: "text-sm text-muted-foreground",
                children: [product.sales, " ventas"]
              })]
            })]
          }), /* @__PURE__ */jsx("p", {
            className: "font-semibold text-primary",
            children: product.revenue
          })]
        }, product.name))
      })
    })]
  });
}
export { TopProductsList };