import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Leaf, Star, Award } from "lucide-react";
import { ImageWithFallback } from "../../../shared/components/figma/ImageWithFallback";
const FEATURE_PILLS = [{
  icon: Leaf,
  label: /* @__PURE__ */jsxs(Fragment, {
    children: ["Ingredientes", /* @__PURE__ */jsx("br", {}), "de alta calidad"]
  })
}, {
  icon: Star,
  label: /* @__PURE__ */jsxs(Fragment, {
    children: ["Fragancias", /* @__PURE__ */jsx("br", {}), "exclusivas"]
  })
}, {
  icon: Award,
  label: /* @__PURE__ */jsxs(Fragment, {
    children: ["Experiencias", /* @__PURE__ */jsx("br", {}), "inolvidables"]
  })
}];
function BrandPanel() {
  return /* @__PURE__ */jsxs("div", {
    className: "hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden",
    children: [/* @__PURE__ */jsx(ImageWithFallback, {
      src: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1800&q=85",
      alt: "Frasco de perfume de Essence Don Aire",
      className: "absolute inset-0 w-full h-full object-cover"
    }), /* @__PURE__ */jsx("div", {
      className: "absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-[#C9A227]/30"
    }), /* @__PURE__ */jsx("div", {
      className: "relative z-10",
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center gap-3",
        children: /* @__PURE__ */jsx("img", {
          src: "/essence_don_aire_logo_wordmark.svg",
          alt: "Essence Don Aire",
          className: "h-12 w-auto rounded-md bg-white p-1.5"
        })
      })
    }), /* @__PURE__ */jsxs("div", {
      className: "relative z-10",
      children: [/* @__PURE__ */jsxs("h2", {
        className: "text-5xl font-serif text-white leading-tight mb-4",
        children: ["Fragancias que", /* @__PURE__ */jsx("br", {}), "dejan ", /* @__PURE__ */jsx("span", {
          className: "text-[#C9A227]",
          children: "huella"
        })]
      }), /* @__PURE__ */jsx("p", {
        className: "text-white/60 mb-10",
        children: "Fragancias premium para momentos inolvidables."
      }), /* @__PURE__ */jsx("div", {
        className: "flex gap-6",
        children: FEATURE_PILLS.map(({
          icon: Icon,
          label
        }, i) => /* @__PURE__ */jsxs("div", {
          className: "flex flex-col items-center gap-2",
          children: [/* @__PURE__ */jsx("div", {
            className: "w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center",
            children: /* @__PURE__ */jsx(Icon, {
              className: "h-4 w-4 text-[#C9A227]"
            })
          }), /* @__PURE__ */jsx("span", {
            className: "text-white/70 text-xs text-center",
            children: label
          })]
        }, i))
      })]
    })]
  });
}
export { BrandPanel };