import { jsx, jsxs } from "react/jsx-runtime";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../shared/components/ui/Card";
function LowStockAlert({
  products
}) {
  return /* @__PURE__ */jsxs(Card, {
    children: [/* @__PURE__ */jsx(CardHeader, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center gap-2",
        children: [/* @__PURE__ */jsx(AlertCircle, {
          className: "h-5 w-5 text-destructive"
        }), /* @__PURE__ */jsx(CardTitle, {
          children: "Alertas de Stock Bajo"
        })]
      })
    }), /* @__PURE__ */jsx(CardContent, {
      children: /* @__PURE__ */jsx("div", {
        className: "space-y-3",
        children: products.map(product => /* @__PURE__ */jsxs("div", {
          className: "flex items-center justify-between p-3 rounded-xl bg-destructive/5 border border-destructive/10",
          children: [/* @__PURE__ */jsxs("div", {
            children: [/* @__PURE__ */jsx("p", {
              className: "font-medium text-foreground",
              children: product.name
            }), /* @__PURE__ */jsxs("p", {
              className: "text-xs text-muted-foreground",
              children: ["M\xEDnimo: ", product.min, " unidades"]
            })]
          }), /* @__PURE__ */jsxs("div", {
            className: "text-right",
            children: [/* @__PURE__ */jsx("p", {
              className: "text-lg font-bold text-destructive",
              children: product.stock
            }), /* @__PURE__ */jsx("p", {
              className: "text-xs text-destructive",
              children: "Stock actual"
            })]
          })]
        }, product.name))
      })
    })]
  });
}
export { LowStockAlert };