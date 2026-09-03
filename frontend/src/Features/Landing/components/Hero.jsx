import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../../../shared/components/figma/ImageWithFallback";
function Hero({ onLogin }) {
  return /* @__PURE__ */ jsxs("section", {
    className: "relative min-h-[calc(100vh-52px)] overflow-hidden bg-[#0d0f12]",
    children: [
      /* @__PURE__ */ jsx(ImageWithFallback, {
        src: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=2200&q=90",
        alt: "Frasco de perfume de Essence Don Aire",
        className: "absolute inset-0 h-full w-full object-cover opacity-45"
      }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-[#0d0f12] via-[#0d0f12]/85 to-[#0d0f12]/30" }),
      /* @__PURE__ */ jsx("div", {
        className: "relative mx-auto flex min-h-[calc(100vh-52px)] max-w-[1600px] flex-col justify-center px-4 py-8 md:px-8",
        children: /* @__PURE__ */ jsxs("div", {
          className: "max-w-[860px] text-[#f5f1ea]",
          children: [
            /* @__PURE__ */ jsxs("div", {
              className: "mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c9a227]",
              children: [
                /* @__PURE__ */ jsx("div", { className: "h-px w-12 bg-[#c9a227]" }),
                /* @__PURE__ */ jsx("span", { children: "Lujo & Exclusividad" })
              ]
            }),
            /* @__PURE__ */ jsxs("h1", {
              className: "text-4xl font-medium leading-[0.95] tracking-[-0.06em] text-[#f5f1ea] md:text-6xl",
              children: [
                "Fragancias que",
                /* @__PURE__ */ jsx("br", {}),
                /* @__PURE__ */ jsx("span", { children: "dejan huella" })
              ]
            }),
            /* @__PURE__ */ jsx("p", {
              className: "mt-6 max-w-[900px] text-base leading-8 text-[#f5f1ea]/80 md:text-xl",
              children: "Descubre nuestra colección exclusiva de perfumes y lociones premium, elaborados con los mejores ingredientes del mundo para momentos inolvidables."
            }),
            /* @__PURE__ */ jsxs("div", {
              className: "mt-8 flex flex-wrap items-center gap-4 text-base text-[#f5f1ea]",
              children: [
                /* @__PURE__ */ jsxs("a", {
                  href: "#catalogo",
                  className: "inline-flex items-center gap-2 text-[#f5f1ea] transition hover:text-[#c9a227]",
                  children: ["Ver Catálogo", /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })]
                }),
                /* @__PURE__ */ jsx("button", {
                  onClick: onLogin,
                  className: "text-left text-[#f5f1ea] transition hover:text-[#c9a227]",
                  children: "Acceder al Sistema"
                })
              ]
            }),
            /* @__PURE__ */ jsxs("div", {
              className: "mt-10 flex flex-wrap items-center gap-8",
              children: [
                /* @__PURE__ */ jsxs("div", {
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "text-3xl font-semibold text-[#c9a227]", children: "500+" }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-[#f5f1ea]/60", children: "Productos" })
                  ]
                }),
                /* @__PURE__ */ jsxs("div", {
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "text-3xl font-semibold text-[#c9a227]", children: "10K+" }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-[#f5f1ea]/60", children: "Clientes" })
                  ]
                }),
                /* @__PURE__ */ jsxs("div", {
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "text-3xl font-semibold text-[#c9a227]", children: "15+" }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-[#f5f1ea]/60", children: "Años" })
                  ]
                })
              ]
            })
          ]
        })
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#f5f1ea]/40",
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-widest", children: "Scroll" }),
          /* @__PURE__ */ jsx("div", { className: "h-12 w-px bg-gradient-to-b from-[#f5f1ea]/40 to-transparent" })
        ]
      })
    ]
  });
}
export {
  Hero
};
