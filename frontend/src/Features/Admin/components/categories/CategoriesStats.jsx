import { jsx, jsxs } from "react/jsx-runtime";
import { Tag } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
function CategoriesStats({
  categories
}) {
  return /* @__PURE__ */jsxs("div", {
    className: "stats-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4",
    children: [/* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Total Categor\xEDas"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-foreground",
            children: categories.length
          })]
        }), /* @__PURE__ */jsx(Tag, {
          className: "h-8 w-8 text-primary"
        })]
      })
    }), /* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Activas"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-success",
            children: categories.filter(c => c.status === "active").length
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
            children: "Productos Totales"
          }), /* @__PURE__ */jsx("p", {
            className: "text-2xl font-bold text-primary",
            children: categories.reduce((sum, c) => sum + c.productCount, 0)
          })]
        }), /* @__PURE__ */jsx("div", {
          className: "h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center",
          children: /* @__PURE__ */jsx("span", {
            className: "text-primary",
            children: "#"
          })
        })]
      })
    })]
  });
}
export { CategoriesStats };