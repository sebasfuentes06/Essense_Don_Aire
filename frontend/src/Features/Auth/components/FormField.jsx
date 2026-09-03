import { jsx, jsxs } from "react/jsx-runtime";
function FormField({
  icon: Icon,
  error,
  hasTrailingButton = false,
  children,
  ...inputProps
}) {
  return /* @__PURE__ */jsxs("div", {
    children: [/* @__PURE__ */jsxs("div", {
      className: "relative",
      children: [/* @__PURE__ */jsx(Icon, {
        className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10"
      }), /* @__PURE__ */jsx("input", {
        ...inputProps,
        className: `w-full h-12 pl-11 ${hasTrailingButton ? "pr-11" : "pr-4"} rounded-xl bg-input-background border ${error ? "border-destructive" : "border-input"} text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`
      }), children]
    }), error && /* @__PURE__ */jsx("p", {
      className: "mt-1.5 text-sm text-destructive",
      children: error
    })]
  });
}
export { FormField };