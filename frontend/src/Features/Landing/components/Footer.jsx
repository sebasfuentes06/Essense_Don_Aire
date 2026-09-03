import { jsx, jsxs } from "react/jsx-runtime";
import { Sparkles } from "lucide-react";
const FOOTER_LINKS = ["Privacidad", "T\xE9rminos", "Soporte"];
function Footer() {
  return /* @__PURE__ */ jsx("footer", {
    className: "border-t border-white/10 bg-[#0b0d10]",
    children: /* @__PURE__ */ jsx("div", {
      className: "mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-center md:flex-row md:px-8 md:text-left",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col items-center gap-4 md:flex-row md:items-center",
        children: [
          /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3 text-sm font-medium text-[#f5f1ea]",
            children: [
              /* @__PURE__ */ jsx("div", {
                className: "flex h-8 w-8 items-center justify-center rounded-full border border-[#C9A227]/60 bg-[#C9A227]/10 text-[#C9A227]",
                children: /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4" })
              }),
              /* @__PURE__ */ jsx("span", { children: "Essence Don Aire" })
            ]
          }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-[#d9d2c8]/70", children: "© 2026 Essence Don Aire. Todos los derechos reservados." })
        ]
      })
    })
  });
}
export {
  Footer
};
