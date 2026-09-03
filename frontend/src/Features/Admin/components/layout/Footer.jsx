import { jsx, jsxs } from "react/jsx-runtime";
function Footer() {
  return /* @__PURE__ */jsx("footer", {
    className: "border-t border-border py-4 px-6",
    children: /* @__PURE__ */jsxs("div", {
      className: "flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground",
      children: [/* @__PURE__ */jsx("p", {
        children: "\xA9 2026 Essence Don Aire. Todos los derechos reservados."
      }), /* @__PURE__ */jsx("p", {
        children: "Panel administrativo v1.0"
      })]
    })
  });
}
export { Footer };