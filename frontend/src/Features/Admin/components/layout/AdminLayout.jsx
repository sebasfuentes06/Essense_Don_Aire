import { jsx, jsxs } from "react/jsx-runtime";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Breadcrumb } from "./Breadcrumb";
import { Footer } from "./Footer";
function AdminLayout({
  currentPath,
  onNavigate,
  onLogout,
  children
}) {
  return /* @__PURE__ */jsxs("div", {
    className: "flex h-screen min-w-0 overflow-hidden bg-background",
    children: [/* @__PURE__ */jsx(Sidebar, {
      currentPath,
      onNavigate,
      onLogout
    }), /* @__PURE__ */jsxs("div", {
      className: "flex min-w-0 flex-1 flex-col overflow-hidden",
      children: [/* @__PURE__ */jsx(Header, {}), /* @__PURE__ */jsx("main", {
          className: "min-w-0 flex-1 overflow-y-auto",
        children: /* @__PURE__ */jsxs("div", {
          className: "mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8",
          children: [/* @__PURE__ */jsx(Breadcrumb, {
            currentPath,
            onNavigate
          }), children]
        })
      }), /* @__PURE__ */jsx(Footer, {})]
    })]
  });
}
export { AdminLayout };