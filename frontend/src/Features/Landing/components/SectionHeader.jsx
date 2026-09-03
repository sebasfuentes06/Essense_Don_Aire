import { jsx, jsxs } from "react/jsx-runtime";
function SectionHeader({ eyebrow = "Essence Don Aire", title, subtitle }) {
  return /* @__PURE__ */ jsxs("div", {
    className: "mb-10 flex flex-col items-start gap-4",
    children: [
      /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#C9A227]",
        children: [
          /* @__PURE__ */ jsx("div", { className: "h-px w-10 bg-[#C9A227]" }),
          /* @__PURE__ */ jsx("span", { children: eyebrow }),
          /* @__PURE__ */ jsx("div", { className: "h-px w-10 bg-[#C9A227]" })
        ]
      }),
      title && /* @__PURE__ */ jsx("h2", {
        className: "max-w-2xl text-3xl font-medium leading-tight tracking-[-0.04em] text-[#f5f1ea] md:text-5xl",
        children: title
      }),
      subtitle && /* @__PURE__ */ jsx("p", {
        className: "max-w-3xl text-base leading-7 text-[#e7e1d9]/80 md:text-lg",
        children: subtitle
      })
    ]
  });
}
export {
  SectionHeader
};
