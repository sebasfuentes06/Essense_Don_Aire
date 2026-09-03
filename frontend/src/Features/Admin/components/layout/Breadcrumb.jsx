import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronRight, Home } from "lucide-react";
import { MENU_ITEMS } from "./menu-items";
function Breadcrumb({
  currentPath,
  onNavigate
}) {
  const currentItem = MENU_ITEMS.find(item => item.path === currentPath);
  if (!currentItem || currentPath === "/") return null;
  return /* @__PURE__ */jsxs("nav", {
    className: "flex items-center gap-2 text-sm mb-6",
    children: [/* @__PURE__ */jsxs("button", {
      className: "flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors",
      onClick: () => onNavigate?.("/"),
      children: [/* @__PURE__ */jsx(Home, {
        className: "h-4 w-4"
      }), "Inicio"]
    }), /* @__PURE__ */jsx(ChevronRight, {
      className: "h-4 w-4 text-muted-foreground"
    }), /* @__PURE__ */jsx("span", {
      className: "font-medium text-foreground",
      children: currentItem.label
    })]
  });
}
export { Breadcrumb };