import { jsx, jsxs } from "react/jsx-runtime";
import { ShoppingCart, DollarSign, TrendingUp, CreditCard } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
function SalesStats({
  completedCount,
  totalRevenue,
  todayCount,
  avgTicket
}) {
  return /* @__PURE__ */jsxs("div", {
    className: "stats-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4",
    children: [/* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Ventas Completadas"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-foreground",
            children: completedCount
          })]
        }), /* @__PURE__ */jsx(ShoppingCart, {
          className: "h-8 w-8 text-primary"
        })]
      })
    }), /* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Ingresos Totales"
          }), /* @__PURE__ */jsxs("p", {
            className: "text-2xl font-bold text-primary",
            children: ["$", totalRevenue.toFixed(2)]
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
            children: "Ventas Hoy"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-success",
            children: todayCount
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
            children: "Ticket Promedio"
          }), /* @__PURE__ */jsxs("p", {
            className: "text-2xl font-bold text-foreground",
            children: ["$", avgTicket.toFixed(2)]
          })]
        }), /* @__PURE__ */jsx(CreditCard, {
          className: "h-8 w-8 text-muted-foreground"
        })]
      })
    })]
  });
}
export { SalesStats };