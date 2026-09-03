import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { ProductCard } from "./ProductCard";
const PRODUCTS = [
  {
    id: 1,
    name: "Noir Éclat",
    category: "Oriental",
    description: "Notas cálidas con sándalo, vainilla y un toque de ámbar dorado.",
    price: 89.99,
    rating: 4.9,
    reviews: 128,
    img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=1000&fit=crop"
  },
  {
    id: 2,
    name: "Velvet Bloom",
    category: "Floral",
    description: "Un equilibrio elegante entre rosa, jazmín y madera suave.",
    price: 74.99,
    rating: 4.7,
    reviews: 94,
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&h=1000&fit=crop"
  },
  {
    id: 3,
    name: "Soleil Blanc",
    category: "Fresh",
    description: "Una experiencia cítrica luminosa con un final sedoso y limpio.",
    price: 79.99,
    rating: 4.8,
    reviews: 76,
    img: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&h=1000&fit=crop"
  }
];
function Catalog({ onLogin }) {
  return /* @__PURE__ */ jsx("section", {
    id: "catalogo",
    className: "mx-auto max-w-7xl px-4 py-24 md:px-8",
    children: /* @__PURE__ */ jsxs("div", {
      children: [
        /* @__PURE__ */ jsx(SectionHeader, {
          eyebrow: "Nuestra colección",
          subtitle: "Cada fragancia es una obra de arte creada para despertar emociones únicas."
        }),
        /* @__PURE__ */ jsx("div", {
          className: "grid gap-8 md:grid-cols-2 xl:grid-cols-3",
          children: PRODUCTS.map((product) => /* @__PURE__ */ jsx(ProductCard, { product }, product.id))
        }),
        /* @__PURE__ */ jsx("div", {
          className: "mt-10 flex justify-center",
          children: /* @__PURE__ */ jsxs("button", {
            onClick: onLogin,
            className: "inline-flex items-center gap-2 rounded-full border border-[#C9A227]/60 bg-[#C9A227]/10 px-6 py-3 text-sm font-medium text-[#f5f1ea] transition hover:bg-[#C9A227] hover:text-[#0b0d10]",
            children: [
              "Ver catálogo completo",
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
            ]
          })
        })
      ]
    })
  });
}
export {
  Catalog
};
