import { jsx, jsxs } from "react/jsx-runtime";
function DashboardHeader() {
  return /* @__PURE__ */jsxs("div", {
    children: [/* @__PURE__ */jsx("h1", {
      className: "text-4xl font-bold text-foreground mb-2",
      children: "Dashboard"
    }), /* @__PURE__ */jsx("p", {
      className: "text-muted-foreground",
      children: "Bienvenido a Essence Don Aire - Vista general de tu negocio"
    })]
  });
}
export { DashboardHeader };