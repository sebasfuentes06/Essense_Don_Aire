import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { Select } from "./Select";
import { cn } from "../../utils/cn";
function SortSelect({
  value,
  onChange,
  options,
  direction,
  onDirectionChange
}) {
  return /* @__PURE__ */jsxs("div", {
    className: "flex w-full min-w-0 gap-2",
    children: [/* @__PURE__ */jsx("div", {
      className: "flex-1",
      children: /* @__PURE__ */jsx(Select, {
        value,
        onChange: e => onChange(e.target.value),
        options
      })
    }), /* @__PURE__ */jsx("button", {
      onClick: () => onDirectionChange(direction === "asc" ? "desc" : "asc"),
      type: "button",
      className: cn("h-11 w-11 shrink-0 rounded-xl border border-input bg-background", "hover:bg-muted transition-colors flex items-center justify-center", "text-foreground"),
      title: direction === "asc" ? "Ascendente" : "Descendente",
      children: direction === "asc" ? /* @__PURE__ */jsx(ArrowDownAZ, {
        className: "h-5 w-5"
      }) : /* @__PURE__ */jsx(ArrowUpAZ, {
        className: "h-5 w-5"
      })
    })]
  });
}
export { SortSelect };