import { jsx, jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../shared/components/ui/Card";
function TopSellersList({
  sellers
}) {
  return /* @__PURE__ */jsxs(Card, {
    children: [/* @__PURE__ */jsx(CardHeader, {
      children: /* @__PURE__ */jsx(CardTitle, {
        children: "Top Vendedores"
      })
    }), /* @__PURE__ */jsx(CardContent, {
      children: /* @__PURE__ */jsx("div", {
        className: "space-y-4",
        children: sellers.map((seller, index) => /* @__PURE__ */jsxs("div", {
          className: "flex items-center gap-4",
          children: [/* @__PURE__ */jsx("div", {
            className: "h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center",
            children: /* @__PURE__ */jsx("span", {
              className: "font-bold text-primary",
              children: index + 1
            })
          }), /* @__PURE__ */jsxs("div", {
            className: "flex-1",
            children: [/* @__PURE__ */jsx("p", {
              className: "font-semibold text-foreground",
              children: seller.name
            }), /* @__PURE__ */jsxs("p", {
              className: "text-sm text-muted-foreground",
              children: [seller.sales, " ventas"]
            })]
          }), /* @__PURE__ */jsx("div", {
            className: "text-right",
            children: /* @__PURE__ */jsxs("p", {
              className: "font-bold text-primary",
              children: ["$", seller.total.toLocaleString()]
            })
          })]
        }, seller.name))
      })
    })]
  });
}
export { TopSellersList };