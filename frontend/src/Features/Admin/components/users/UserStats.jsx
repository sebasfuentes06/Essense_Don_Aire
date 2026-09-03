import { jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle, Shield, XCircle } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
function UserStats({
  totalUsers,
  activeUsers,
  adminCount,
  inactiveUsers
}) {
  return /* @__PURE__ */jsxs("div", {
    className: "stats-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4",
    children: [/* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Total Usuarios"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-foreground",
            children: totalUsers
          })]
        }), /* @__PURE__ */jsx("div", {
          className: "h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center",
          children: /* @__PURE__ */jsx("span", {
            className: "text-lg",
            children: "\u{1F465}"
          })
        })]
      })
    }), /* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Usuarios Activos"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-success",
            children: activeUsers
          })]
        }), /* @__PURE__ */jsx(CheckCircle, {
          className: "h-8 w-8 text-success"
        })]
      })
    }), /* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Administradores"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-primary",
            children: adminCount
          })]
        }), /* @__PURE__ */jsx(Shield, {
          className: "h-8 w-8 text-primary"
        })]
      })
    }), /* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Inactivos"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-destructive",
            children: inactiveUsers
          })]
        }), /* @__PURE__ */jsx(XCircle, {
          className: "h-8 w-8 text-destructive"
        })]
      })
    })]
  });
}
export { UserStats };