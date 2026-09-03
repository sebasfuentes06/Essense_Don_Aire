import { jsx, jsxs } from "react/jsx-runtime";
import { Leaf, Shield, Truck, Heart } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
const FEATURES = [
  { icon: Leaf, title: "Ingredientes premium", desc: "Seleccionamos los mejores ingredientes del mundo para cada fragancia." },
  { icon: Shield, title: "Calidad garantizada", desc: "Todos nuestros productos pasan rigurosos controles de calidad." },
  { icon: Truck, title: "Entrega exclusiva", desc: "Entrega rápida y segura con empaque de lujo a tu puerta." },
  { icon: Heart, title: "Hecho con pasión", desc: "Cada fragancia es creada con pasión y dedicación artesanal." }
];
function Features() {
  return /* @__PURE__ */ jsx("section", {
    id: "nosotros",
    className: "mx-auto max-w-7xl px-4 py-24 md:px-8",
    children: /* @__PURE__ */ jsxs("div", {
      children: [
        /* @__PURE__ */ jsx(SectionHeader, {
          eyebrow: "Nuestra esencia",
          subtitle: "Nos dedicamos a crear experiencias olfativas únicas que perduran en la memoria y el corazón."
        }),
        /* @__PURE__ */ jsx("div", {
          className: "grid gap-6 md:grid-cols-2 xl:grid-cols-4",
          children: FEATURES.map(({ icon: Icon, title, desc }) => /* @__PURE__ */ jsxs("div", {
            className: "rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-sm transition hover:-translate-y-1 hover:border-[#C9A227]/50",
            children: [
              /* @__PURE__ */ jsx("div", {
                className: "mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#C9A227]/40 bg-[#C9A227]/10 text-[#C9A227]",
                children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
              }),
              /* @__PURE__ */ jsx("h3", { className: "mb-3 text-xl font-medium text-[#f5f1ea]", children: title }),
              /* @__PURE__ */ jsx("p", { className: "text-sm leading-7 text-[#d9d2c8]/75", children: desc })
            ]
          }, title))
        })
      ]
    })
  });
}
export {
  Features
};
