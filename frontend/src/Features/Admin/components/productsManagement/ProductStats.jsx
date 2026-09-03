import { jsx, jsxs } from "react/jsx-runtime";
import { Package, AlertCircle } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
function ProductStats({
  products,
  lowStockCount
}) {
  return /* @__PURE__ */jsxs("div", {
    className: "stats-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4",
    children: [/* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Total Productos"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-foreground",
            children: products.length
          })]
        }), /* @__PURE__ */jsx(Package, {
          className: "h-8 w-8 text-primary"
        })]
      })
    }), /* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Activos"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-success",
            children: products.filter(p => p.status === "active").length
          })]
        }), /* @__PURE__ */jsx("div", {
          className: "h-8 w-8 rounded-full bg-success/10 flex items-center justify-center",
          children: /* @__PURE__ */jsx("span", {
            className: "text-success",
            children: "\u2713"
          })
        })]
      })
    }), /* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Stock Bajo"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-destructive",
            children: lowStockCount
          })]
        }), /* @__PURE__ */jsx(AlertCircle, {
          className: "h-8 w-8 text-destructive"
        })]
      })
    }), /* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Valor Total"
          }), /* @__PURE__ */jsxs("p", {
            className: "text-2xl font-bold text-primary",
            children: ["$", products.reduce((sum, p) => sum + p.price * p.stock, 0).toFixed(2)]
          })]
        }), /* @__PURE__ */jsx("div", {
          className: "h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center",
          children: /* @__PURE__ */jsx("span", {
            className: "text-primary",
            children: "$"
          })
        })]
      })
    })]
  });
}
export { ProductStats };