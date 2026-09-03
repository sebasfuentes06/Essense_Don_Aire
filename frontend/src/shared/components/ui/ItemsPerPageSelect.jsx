import { jsx, jsxs } from "react/jsx-runtime";
import { Select } from "./Select";
import { cn } from "../../utils/cn";
function ItemsPerPageSelect({
  value,
  onChange,
  className,
  options = [5, 10, 25, 50, 100]
}) {
  return /* @__PURE__ */jsxs("div", {
    className: cn("flex min-w-[132px] items-center gap-2", className),
    children: [/* @__PURE__ */jsx("span", {
      className: "text-sm text-muted-foreground whitespace-nowrap",
      children: "Mostrar:"
    }), /* @__PURE__ */jsx(Select, {
      wrapperClassName: "flex-1",
      value: value.toString(),
      onChange: e => onChange(Number(e.target.value)),
      options: options.map(opt => ({
        value: opt.toString(),
        label: opt.toString()
      }))
    })]
  });
}
export { ItemsPerPageSelect };