import { jsx, jsxs } from "react/jsx-runtime";
function AuthLayout({
  tagline,
  children
}) {
  return /* @__PURE__ */jsxs("div", {
    className: "min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/30",
    children: [/* @__PURE__ */jsxs("div", {
      className: "absolute inset-0 overflow-hidden pointer-events-none",
      children: [/* @__PURE__ */jsx("img", {
        src: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1800&q=85",
        alt: "",
        className: "h-full w-full object-cover opacity-[0.08]"
      }), /* @__PURE__ */jsx("div", {
        className: "absolute inset-0 bg-background/80"
      })]
    }), /* @__PURE__ */jsxs("div", {
      className: "w-full max-w-md relative",
      children: [/* @__PURE__ */jsxs("div", {
        className: "text-center mb-8",
        children: [/* @__PURE__ */jsx("img", {
          src: "/essence_don_aire_logo_wordmark.svg",
          alt: "Essence Don Aire",
          className: "mx-auto mb-4 h-16 w-auto object-contain"
        }), /* @__PURE__ */jsx("h1", {
          className: "sr-only",
          children: "Essence Don Aire"
        }), /* @__PURE__ */jsx("p", {
          className: "text-muted-foreground",
          children: tagline
        })]
      }), children, /* @__PURE__ */jsx("p", {
        className: "text-center text-sm text-muted-foreground mt-8",
        children: "\xA9 2026 Essence Don Aire. Todos los derechos reservados."
      })]
    })]
  });
}
export { AuthLayout };