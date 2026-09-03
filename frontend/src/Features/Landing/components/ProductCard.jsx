import { jsx, jsxs } from "react/jsx-runtime";
import { Star } from "lucide-react";
import { ImageWithFallback } from "../../../shared/components/figma/ImageWithFallback";
function ProductCard({ product }) {
  return /* @__PURE__ */ jsxs("article", {
    className: "group overflow-hidden rounded-[28px] border border-white/10 bg-[#121417] shadow-[0_25px_70px_rgba(0,0,0,0.15)]",
    children: [
      /* @__PURE__ */ jsxs("div", {
        className: "relative h-72 overflow-hidden",
        children: [
          /* @__PURE__ */ jsx(ImageWithFallback, {
            src: product.img,
            alt: product.name,
            className: "h-full w-full object-cover transition duration-700 group-hover:scale-105"
          }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-[#0b0d10]/10 to-transparent" }),
          /* @__PURE__ */ jsx("span", {
            className: "absolute left-4 top-4 rounded-full border border-[#C9A227]/60 bg-[#0b0d10]/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#f5f1ea]",
            children: product.category
          })
        ]
      }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-medium text-[#f5f1ea]", children: product.name }),
        /* @__PURE__ */ jsx("p", { className: "text-sm leading-7 text-[#d9d2c8]/75", children: product.description }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[#d9d2c8]", children: [
          [...Array(5)].map((_, i) => /* @__PURE__ */ jsx(Star, { className: `h-4 w-4 ${i < Math.floor(product.rating) ? "fill-[#C9A227] text-[#C9A227]" : "text-white/20"}` }, i)),
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-[#d9d2c8]/70", children: ["(", product.reviews, ")"] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-white/10 pt-4", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-2xl font-semibold text-[#f5f1ea]", children: ["$", product.price.toFixed(2)] }),
          /* @__PURE__ */ jsx("button", { className: "rounded-full border border-[#C9A227]/60 bg-[#C9A227]/10 px-4 py-2 text-sm font-medium text-[#f5f1ea] transition hover:bg-[#C9A227] hover:text-[#0b0d10]", children: "Ver más" })
        ] })
      ] })
    ]
  });
}
export {
  ProductCard
};
