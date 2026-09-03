import { jsx, jsxs } from "react/jsx-runtime";
import { Shield, CheckCircle } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
function RoleStats({
  roles,
  availablePermissions
}) {
  return /* @__PURE__ */jsxs("div", {
    className: "stats-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4",
    children: [/* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Total Roles"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-foreground",
            children: roles.length
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
            children: "Roles Activos"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-success",
            children: roles.filter(r => r.status === "active").length
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
            children: "Usuarios Asignados"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-primary",
            children: roles.reduce((sum, r) => sum + r.usersCount, 0)
          })]
        }), /* @__PURE__ */jsx("div", {
          className: "h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center",
          children: /* @__PURE__ */jsx("span", {
            className: "text-primary",
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
            children: "Permisos Totales"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-foreground",
            children: availablePermissions.length
          })]
        }), /* @__PURE__ */jsx("div", {
          className: "h-8 w-8 rounded-full bg-muted flex items-center justify-center",
          children: /* @__PURE__ */jsx("span", {
            className: "text-foreground",
            children: "\u{1F510}"
          })
        })]
      })
    })]
  });
}
export { RoleStats };