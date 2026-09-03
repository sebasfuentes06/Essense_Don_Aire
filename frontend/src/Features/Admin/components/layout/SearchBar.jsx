import { jsx, jsxs } from "react/jsx-runtime";
import { Search } from "lucide-react";
import { cn } from "../../../../shared/utils/cn";
function SearchBar({
  placeholder = "Buscar productos, clientes, ventas..."
}) {
  return /* @__PURE__ */jsxs("div", {
    className: "relative w-full",
    children: [/* @__PURE__ */jsx(Search, {
      className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
    }), /* @__PURE__ */jsx("input", {
      placeholder,
      type: "search",
      "aria-label": placeholder,
      className: cn("w-full h-11 pl-10 pr-4 rounded-xl bg-muted/50 border border-border/60", "text-sm text-foreground placeholder:text-muted-foreground", "transition-all duration-200", "focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background")
    })]
  });
}
export { SearchBar };