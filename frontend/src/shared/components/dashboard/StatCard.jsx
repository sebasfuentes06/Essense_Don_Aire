import { jsx, jsxs } from "react/jsx-runtime";
import { Card, CardContent } from "../ui/Card";
import { cn } from "../../utils/cn";
function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-primary"
}) {
  return /* @__PURE__ */jsx(Card, {
    hover: true,
    className: "overflow-hidden",
    children: /* @__PURE__ */jsx(CardContent, {
      className: "p-6",
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-start justify-between",
        children: [/* @__PURE__ */jsxs("div", {
          className: "flex-1",
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm font-medium text-muted-foreground mb-1",
            children: title
          }), /* @__PURE__ */jsx("h3", {
            className: "text-3xl font-bold text-card-foreground mb-2",
            children: value
          }), change && /* @__PURE__ */jsxs("p", {
            className: cn("text-sm font-medium flex items-center gap-1", changeType === "positive" && "text-success", changeType === "negative" && "text-destructive", changeType === "neutral" && "text-muted-foreground"),
            children: [changeType === "positive" && "\u2191", changeType === "negative" && "\u2193", change]
          })]
        }), /* @__PURE__ */jsx("div", {
          className: cn("p-3 rounded-xl bg-muted/50", iconColor),
          children: /* @__PURE__ */jsx(Icon, {
            className: "h-6 w-6"
          })
        })]
      })
    })
  });
}
export { StatCard };