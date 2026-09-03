import { jsx, jsxs } from "react/jsx-runtime";
import { Card } from "../../../../shared/components/ui/Card";
function SummaryCards({
  cards
}) {
  return /* @__PURE__ */jsx("div", {
    className: "grid grid-cols-1 md:grid-cols-4 gap-4",
    children: cards.map(card => {
      const Icon = card.icon;
      return /* @__PURE__ */jsxs(Card, {
        children: [/* @__PURE__ */jsxs("div", {
          className: "flex items-center justify-between mb-3",
          children: [/* @__PURE__ */jsx("div", {
            className: "h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center",
            children: /* @__PURE__ */jsx(Icon, {
              className: "h-5 w-5 text-primary"
            })
          }), /* @__PURE__ */jsx("span", {
            className: "text-sm text-success font-semibold",
            children: card.change
          })]
        }), /* @__PURE__ */jsx("p", {
          className: "text-sm text-muted-foreground mb-1",
          children: card.label
        }), /* @__PURE__ */jsx("p", {
          className: "text-2xl font-bold text-foreground",
          children: card.value
        })]
      }, card.key);
    })
  });
}
export { SummaryCards };