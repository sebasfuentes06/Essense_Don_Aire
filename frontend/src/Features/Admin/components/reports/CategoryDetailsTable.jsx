import { jsx, jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../shared/components/ui/Card";
function CategoryDetailsTable({
  categories
}) {
  return /* @__PURE__ */jsxs(Card, {
    children: [/* @__PURE__ */jsx(CardHeader, {
      children: /* @__PURE__ */jsx(CardTitle, {
        children: "Detalle por Categor\xEDa"
      })
    }), /* @__PURE__ */jsx(CardContent, {
      children: /* @__PURE__ */jsx("div", {
        className: "overflow-x-auto",
        children: /* @__PURE__ */jsxs("table", {
          className: "w-full",
          children: [/* @__PURE__ */jsx("thead", {
            className: "bg-muted/50",
            children: /* @__PURE__ */jsxs("tr", {
              children: [/* @__PURE__ */jsx("th", {
                className: "text-left p-4 font-semibold text-foreground",
                children: "Categor\xEDa"
              }), /* @__PURE__ */jsx("th", {
                className: "text-left p-4 font-semibold text-foreground",
                children: "Ventas"
              }), /* @__PURE__ */jsx("th", {
                className: "text-left p-4 font-semibold text-foreground",
                children: "Monto"
              }), /* @__PURE__ */jsx("th", {
                className: "text-left p-4 font-semibold text-foreground",
                children: "% Total"
              }), /* @__PURE__ */jsx("th", {
                className: "text-left p-4 font-semibold text-foreground",
                children: "Tendencia"
              })]
            })
          }), /* @__PURE__ */jsx("tbody", {
            children: categories.map(category => {
              const totalAmount = categories.reduce((sum, c) => sum + c.amount, 0);
              const percentage = (category.amount / totalAmount * 100).toFixed(1);
              return /* @__PURE__ */jsxs("tr", {
                className: "border-b border-border",
                children: [/* @__PURE__ */jsx("td", {
                  className: "p-4 text-foreground font-medium",
                  children: category.name
                }), /* @__PURE__ */jsxs("td", {
                  className: "p-4 text-foreground",
                  children: [category.value, " productos"]
                }), /* @__PURE__ */jsxs("td", {
                  className: "p-4 text-primary font-semibold",
                  children: ["$", category.amount.toLocaleString()]
                }), /* @__PURE__ */jsxs("td", {
                  className: "p-4 text-foreground",
                  children: [percentage, "%"]
                }), /* @__PURE__ */jsx("td", {
                  className: "p-4",
                  children: /* @__PURE__ */jsx("span", {
                    className: "text-success",
                    children: "\u2191 12%"
                  })
                })]
              }, category.name);
            })
          })]
        })
      })
    })]
  });
}
export { CategoryDetailsTable };