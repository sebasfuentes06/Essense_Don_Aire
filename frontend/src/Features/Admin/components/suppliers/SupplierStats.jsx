import { jsx, jsxs } from "react/jsx-runtime";
import { Package, DollarSign, TrendingUp, Star } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
function SupplierStats({
  totalSuppliers,
  activeSuppliers,
  totalProducts,
  avgRating
}) {
  return /* @__PURE__ */jsxs("div", {
    className: "stats-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4",
    children: [/* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Total Proveedores"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-foreground",
            children: totalSuppliers
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
            children: "Proveedores Activos"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-success",
            children: activeSuppliers
          })]
        }), /* @__PURE__ */jsx(TrendingUp, {
          className: "h-8 w-8 text-success"
        })]
      })
    }), /* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Productos \xDAnicos"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-primary",
            children: totalProducts
          })]
        }), /* @__PURE__ */jsx(DollarSign, {
          className: "h-8 w-8 text-primary"
        })]
      })
    }), /* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Calificaci\xF3n Promedio"
          }), /* @__PURE__ */jsxs("p", {
            className: "text-2xl font-bold text-foreground",
            children: [avgRating, " \u2B50"]
          })]
        }), /* @__PURE__ */jsx(Star, {
          className: "h-8 w-8 text-primary"
        })]
      })
    })]
  });
}
export { SupplierStats };