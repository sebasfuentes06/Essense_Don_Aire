import { jsx, jsxs } from "react/jsx-runtime";
import { LogOut } from "lucide-react";
function UserProfile({
  name = "Admin",
  email = "admin@essence.com",
  onLogout
}) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return /* @__PURE__ */jsx("div", {
    className: "absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border max-md:hidden",
    children: /* @__PURE__ */jsxs("div", {
      className: "flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent",
      children: [/* @__PURE__ */jsx("div", {
        className: "h-10 w-10 rounded-full bg-primary flex items-center justify-center",
        children: /* @__PURE__ */jsx("span", {
          className: "text-primary-foreground font-semibold",
          children: initials
        })
      }), /* @__PURE__ */jsxs("div", {
        className: "flex-1 min-w-0",
        children: [/* @__PURE__ */jsx("p", {
          className: "text-sm font-medium text-sidebar-foreground truncate",
          children: name
        }), /* @__PURE__ */jsx("p", {
          className: "text-xs text-muted-foreground truncate",
          children: email
        })]
      }), /* @__PURE__ */jsx("button", {
        type: "button",
        onClick: onLogout,
        className: "h-9 w-9 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex items-center justify-center",
        title: "Cerrar sesión",
        "aria-label": "Cerrar sesión",
        children: /* @__PURE__ */jsx(LogOut, {
          className: "h-4 w-4"
        })
      })]
    })
  });
}
export { UserProfile };