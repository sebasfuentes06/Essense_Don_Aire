import { jsx, jsxs } from "react/jsx-runtime";
import { Phone, Mail, MapPin } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const CONTACT_INFO = [
  { title: "Teléfono", icon: Phone, info: "+52 555 1234 5678" },
  { title: "Correo", icon: Mail, info: "contacto@essencedonaire.com" },
  { title: "Ubicación", icon: MapPin, info: "Av. Reforma 456, Ciudad de México" }
];

function Contact() {
  return /* @__PURE__ */ jsx("section", {
    id: "contacto",
    className: "mx-auto max-w-7xl px-4 py-24 md:px-8",
    children: /* @__PURE__ */ jsxs("div", {
      children: [
        /* @__PURE__ */ jsx(SectionHeader, {
          eyebrow: "Contacto",
          title: "Estamos para servirte"
        }),
        /* @__PURE__ */ jsxs("div", {
          className: "grid gap-8 lg:grid-cols-[0.9fr_1.1fr]",
          children: [
            /* @__PURE__ */ jsx("div", {
              className: "space-y-4",
              children: CONTACT_INFO.map(({ icon: Icon, title, info }) => /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5",
                children: [
                  /* @__PURE__ */ jsx("div", {
                    className: "flex h-12 w-12 items-center justify-center rounded-full border border-[#C9A227]/40 bg-[#C9A227]/10 text-[#C9A227]",
                    children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
                  }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm uppercase tracking-[0.2em] text-[#d9d2c8]/65", children: title }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-base text-[#f5f1ea]", children: info })
                  ] })
                ]
              }, title))
            }),
            /* @__PURE__ */ jsx("div", {
              className: "rounded-[28px] border border-white/10 bg-[#121417] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.18)] md:p-8",
              children: /* @__PURE__ */ jsxs("div", {
                className: "space-y-5",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "mb-2 block text-sm text-[#d9d2c8]/75", children: "Nombre" }),
                      /* @__PURE__ */ jsx("input", { className: "h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-[#f5f1ea] placeholder:text-[#d9d2c8]/40 focus:border-[#C9A227] focus:outline-none" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "mb-2 block text-sm text-[#d9d2c8]/75", children: "Email" }),
                      /* @__PURE__ */ jsx("input", { className: "h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-[#f5f1ea] placeholder:text-[#d9d2c8]/40 focus:border-[#C9A227] focus:outline-none" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "mb-2 block text-sm text-[#d9d2c8]/75", children: "Mensaje" }),
                    /* @__PURE__ */ jsx("textarea", {
                      rows: 5,
                      className: "w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#f5f1ea] placeholder:text-[#d9d2c8]/40 focus:border-[#C9A227] focus:outline-none",
                      placeholder: "Escribe tu mensaje..."
                    })
                  ] }),
                  /* @__PURE__ */ jsx("button", {
                    className: "w-full rounded-full bg-[#C9A227] px-6 py-3 text-sm font-medium text-[#0b0d10] transition hover:bg-[#d9b44a]",
                    children: "Enviar Mensaje"
                  })
                ]
              })
            })
          ]
        })
      ]
    })
  });
}

export {
  Contact
};
