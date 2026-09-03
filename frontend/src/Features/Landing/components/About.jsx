import { jsx, jsxs } from "react/jsx-runtime";
import { Award } from "lucide-react";
import { ImageWithFallback } from "../../../shared/components/figma/ImageWithFallback";
const ABOUT_STATS = [
  { value: "15+", label: "Años de experiencia" },
  { value: "120", label: "Fragancias únicas" },
  { value: "12k", label: "Clientes satisfechos" }
];
function About() {
  return /* @__PURE__ */ jsx("section", {
    className: "mx-auto max-w-7xl px-4 py-24 md:px-8",
    children: /* @__PURE__ */ jsxs("div", {
      className: "grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]",
      children: [
        /* @__PURE__ */ jsxs("div", {
          children: [
            /* @__PURE__ */ jsx("div", {
              className: "mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[#C9A227]",
              children: [
                /* @__PURE__ */ jsx("div", { className: "h-px w-10 bg-[#C9A227]" }),
                /* @__PURE__ */ jsx("span", { children: "Nuestra historia" })
              ]
            }),
            /* @__PURE__ */ jsx("h2", { className: "max-w-xl text-3xl font-medium leading-tight tracking-[-0.04em] text-[#f5f1ea] md:text-5xl", children: "Pasión por las fragancias desde 2009" }),
            /* @__PURE__ */ jsx("p", { className: "mt-6 text-base leading-8 text-[#d9d2c8]/80 md:text-lg", children: "Essence Don Aire nació de la pasión por crear experiencias olfativas que trascienden el tiempo. Durante más de 15 años, hemos combinado técnicas artesanales con los mejores ingredientes naturales del mundo." }),
            /* @__PURE__ */ jsx("p", { className: "mt-4 text-base leading-8 text-[#d9d2c8]/80 md:text-lg", children: "Cada fragancia en nuestra colección es el resultado de meses de investigación y desarrollo, garantizando que cada gota evoque emociones únicas y perdurables." }),
            /* @__PURE__ */ jsx("div", {
              className: "mt-8 grid gap-4 sm:grid-cols-3",
              children: ABOUT_STATS.map((s) => /* @__PURE__ */ jsxs("div", {
                className: "rounded-2xl border border-white/10 bg-white/5 p-4",
                children: [
                  /* @__PURE__ */ jsx("p", { className: "text-2xl font-semibold text-[#f5f1ea]", children: s.value }),
                  /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs uppercase tracking-[0.2em] text-[#d9d2c8]/70", children: s.label })
                ]
              }, s.label))
            })
          ]
        }),
        /* @__PURE__ */ jsxs("div", {
          className: "relative",
          children: [
            /* @__PURE__ */ jsx("div", {
              className: "overflow-hidden rounded-[32px] border border-white/10 bg-[#121417] shadow-[0_30px_80px_rgba(0,0,0,0.25)]",
              children: /* @__PURE__ */ jsx(ImageWithFallback, {
                src: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=1200&q=90",
                alt: "Colección de perfumes de alta gama",
                className: "h-[520px] w-full object-cover"
              })
            }),
            /* @__PURE__ */ jsxs("div", {
              className: "absolute -bottom-4 left-6 flex items-center gap-4 rounded-2xl border border-[#C9A227]/50 bg-[#0b0d10]/80 p-4 shadow-xl backdrop-blur-md",
              children: [
                /* @__PURE__ */ jsx(Award, { className: "h-8 w-8 text-[#C9A227]" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-[#d9d2c8]/70", children: "Premio" }),
                  /* @__PURE__ */ jsx("p", { className: "text-lg font-medium text-[#f5f1ea]", children: "Mejor Marca 2023" })
                ] })
              ]
            })
          ]
        })
      ]
    })
  });
}
export {
  About
};
