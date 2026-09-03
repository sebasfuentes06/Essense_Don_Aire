import { jsx, jsxs } from "react/jsx-runtime";
import { Bell } from "lucide-react";
import { useNotifications } from "../../hooks/layout/useNotifications";
function NotificationsDropdown() {
  const {
    isOpen,
    toggle,
    containerRef,
    notifications,
    hasUnread
  } = useNotifications();
  return /* @__PURE__ */jsxs("div", {
    className: "relative",
    ref: containerRef,
    children: [/* @__PURE__ */jsxs("button", {
      className: "h-10 w-10 rounded-xl hover:bg-muted transition-colors flex items-center justify-center relative",
      onClick: toggle,
      children: [/* @__PURE__ */jsx(Bell, {
        className: "h-5 w-5 text-foreground"
      }), hasUnread && /* @__PURE__ */jsx("span", {
        className: "absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full ring-2 ring-card"
      })]
    }), isOpen && /* @__PURE__ */jsxs("div", {
      className: "absolute right-0 mt-2 w-80 bg-card rounded-2xl border border-border shadow-lg p-4",
      children: [/* @__PURE__ */jsx("h3", {
        className: "font-semibold mb-3 text-card-foreground",
        children: "Notificaciones"
      }), /* @__PURE__ */jsxs("div", {
        className: "space-y-3",
        children: [notifications.map(n => /* @__PURE__ */jsxs("div", {
          className: "p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer",
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm font-medium text-foreground",
            children: n.title
          }), /* @__PURE__ */jsx("p", {
            className: "text-xs text-muted-foreground mt-1",
            children: n.description
          })]
        }, n.id)), notifications.length === 0 && /* @__PURE__ */jsx("p", {
          className: "text-sm text-muted-foreground text-center py-4",
          children: "No tienes notificaciones"
        })]
      })]
    })]
  });
}
export { NotificationsDropdown };