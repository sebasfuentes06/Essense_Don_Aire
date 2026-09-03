import { jsx, jsxs } from "react/jsx-runtime";
import { ShoppingBag, DollarSign, CreditCard, TrendingUp } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
function PurchasesStats({
  totalOrders,
  totalPurchased,
  totalBalance,
  pendingCount
}) {
  return /* @__PURE__ */jsxs("div", {
    className: "stats-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4",
    children: [/* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Total \xD3rdenes"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-foreground",
            children: totalOrders
          })]
        }), /* @__PURE__ */jsx(ShoppingBag, {
          className: "h-8 w-8 text-primary"
        })]
      })
    }), /* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Total Comprado"
          }), /* @__PURE__ */jsxs("p", {
            className: "text-2xl font-bold text-primary",
            children: ["$", totalPurchased.toFixed(2)]
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
            children: "Saldo Pendiente"
          }), /* @__PURE__ */jsxs("p", {
            className: "text-2xl font-bold text-destructive",
            children: ["$", totalBalance.toFixed(2)]
          })]
        }), /* @__PURE__ */jsx(CreditCard, {
          className: "h-8 w-8 text-destructive"
        })]
      })
    }), /* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Por Liquidar"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-warning",
            children: pendingCount
          })]
        }), /* @__PURE__ */jsx(TrendingUp, {
          className: "h-8 w-8 text-warning"
        })]
      })
    })]
  });
}
export { PurchasesStats };