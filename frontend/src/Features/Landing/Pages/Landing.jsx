import { jsx, jsxs } from "react/jsx-runtime";
import {
  Navbar,
  Hero,
  About,
  Catalog,
  Testimonials,
  Contact,
  CTASection,
  Footer
} from "../components";

function Landing({ onLogin }) {
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-[#0b0d10] text-[#f5f1ea]",
    children: [
      /* @__PURE__ */ jsx(Navbar, { onLogin }),
      /* @__PURE__ */ jsx(Hero, { onLogin }),
      /* @__PURE__ */ jsx(About, {}),
      /* @__PURE__ */ jsx(Catalog, { onLogin }),
      /* @__PURE__ */ jsx(Testimonials, {}),
      /* @__PURE__ */ jsx(Contact, {}),
      /* @__PURE__ */ jsx(CTASection, { onLogin }),
      /* @__PURE__ */ jsx(Footer, {})
    ]
  });
}

export {
  Landing
};
