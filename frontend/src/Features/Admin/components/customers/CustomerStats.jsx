import { jsx, jsxs } from "react/jsx-runtime";
import { Users } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
function CustomerStats({
  customers
}) {
  return /* @__PURE__ */jsxs("div", {
    className: "stats-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4",
    children: [/* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Total Clientes"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-foreground",
            children: customers.length
          })]
        }), /* @__PURE__ */jsx(Users, {
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
            children: customers.filter(c => c.status === "active").length
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
            children: "Total Gastado"
          }), /* @__PURE__ */jsxs("p", {
            className: "text-2xl font-bold text-primary",
            children: ["$", customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)]
          })]
        }), /* @__PURE__ */jsx("div", {
          className: "h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center",
          children: /* @__PURE__ */jsx("span", {
            className: "text-primary",
            children: "$"
          })
        })]
      })
    }), /* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Compras Totales"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-foreground",
            children: customers.reduce((sum, c) => sum + c.totalPurchases, 0)
          })]
        }), /* @__PURE__ */jsx("div", {
          className: "h-8 w-8 rounded-full bg-muted flex items-center justify-center",
          children: /* @__PURE__ */jsx("span", {
            className: "text-foreground",
            children: "\u{1F6CD}"
          })
        })]
      })
    })]
  });
}
export { CustomerStats };