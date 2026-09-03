import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../../../shared/utils/cn";
import { MENU_ITEMS } from "./menu-items";
import { useSidebar } from "../../hooks/layout/useSidebar";
import { UserProfile } from "./UserProfile";
function Sidebar({
  currentPath = "/",
  onNavigate,
  onLogout
}) {
  const {
    collapsed,
    toggle
  } = useSidebar();
  return /* @__PURE__ */jsxs("aside", {
    className: cn("relative h-screen shrink-0 bg-sidebar border-r border-sidebar-border sticky top-0 transition-all duration-300 max-md:w-20", collapsed ? "w-20" : "w-64"),
    children: [/* @__PURE__ */jsxs("div", {
      className: "h-16 flex items-center justify-between px-3 sm:px-4 border-b border-sidebar-border",
      children: [!collapsed && /* @__PURE__ */jsxs("div", {
          className: "flex items-center max-md:hidden",
        children: /* @__PURE__ */jsx("img", {
          src: "/essence_don_aire_logo_wordmark.svg",
          alt: "Essence Don Aire",
          className: "h-9 w-auto object-contain"
        })
      }), collapsed && /* @__PURE__ */jsx("img", {
        src: "/essence_don_aire_logo_wordmark.svg",
        alt: "Essence Don Aire",
        className: "h-8 w-8 object-cover object-left"
      }), /* @__PURE__ */jsx("button", {
        className: "p-2 rounded-lg hover:bg-sidebar-accent transition-colors",
        onClick: toggle,
        children: collapsed ? /* @__PURE__ */jsx(ChevronRight, {
          className: "h-5 w-5 text-sidebar-foreground"
        }) : /* @__PURE__ */jsx(ChevronLeft, {
          className: "h-5 w-5 text-sidebar-foreground"
        })
      })]
    }), /* @__PURE__ */jsx("nav", {
      className: "p-3 space-y-1",
      children: MENU_ITEMS.map(item => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        return /* @__PURE__ */jsxs("button", {
          onClick: () => onNavigate?.(item.path),
          className: cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 max-md:justify-center max-md:px-2", "hover:bg-sidebar-accent group", isActive && "bg-sidebar-primary text-sidebar-primary-foreground", !isActive && "text-sidebar-foreground"),
          children: [/* @__PURE__ */jsx(Icon, {
            className: "h-5 w-5 flex-shrink-0"
          }), !collapsed && /* @__PURE__ */jsx("span", {
            className: "font-medium text-sm max-md:hidden",
            children: item.label
          })]
        }, item.path);
      })
          }), !collapsed && /* @__PURE__ */jsx(UserProfile, { onLogout })]
  });
}
export { Sidebar };