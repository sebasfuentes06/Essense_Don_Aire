import { jsx, jsxs } from "react/jsx-runtime";
import { Sparkles, ArrowRight } from "lucide-react";
function CTASection({ onLogin }) {
  return /* @__PURE__ */ jsx("section", {
    className: "mx-auto max-w-7xl px-4 py-24 md:px-8",
    children: /* @__PURE__ */ jsxs("div", {
      className: "rounded-[32px] border border-[#C9A227]/40 bg-[radial-gradient(circle_at_center,_rgba(201,162,39,0.18),transparent_45%),linear-gradient(135deg,#111417,#171b1f)] px-6 py-14 text-center shadow-[0_25px_70px_rgba(0,0,0,0.2)] md:px-12",
      children: [
        /* @__PURE__ */ jsx("div", {
          className: "mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#C9A227]/60 bg-[#C9A227]/10 text-[#C9A227]",
          children: /* @__PURE__ */ jsx(Sparkles, { className: "h-6 w-6" })
        }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-medium tracking-[-0.04em] text-[#f5f1ea] md:text-5xl", children: "¿Listo para administrar tu tienda?" }),
        /* @__PURE__ */ jsx("p", { className: "mx-auto mt-5 max-w-2xl text-base leading-8 text-[#d9d2c8]/75 md:text-lg", children: "Accede al panel de administración y gestiona todos tus productos, ventas y clientes." }),
        /* @__PURE__ */ jsx("button", {
          onClick: onLogin,
          className: "mt-8 inline-flex items-center gap-2 rounded-full bg-[#C9A227] px-7 py-3 text-sm font-medium text-[#0b0d10] transition hover:bg-[#d9b44a]",
          children: [
            "Acceder al Sistema",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
          ]
        })
      ]
    })
  });
}
export {
  CTASection
};
