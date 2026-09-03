import { jsx, jsxs } from "react/jsx-runtime";
import { Search, Bell, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/cn";
function Navbar({
  onToggleTheme,
  isDark
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  return /* @__PURE__ */jsx("header", {
    className: "h-16 bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-card/80",
    children: /* @__PURE__ */jsxs("div", {
      className: "h-full px-6 flex items-center justify-between gap-4",
      children: [/* @__PURE__ */jsx("div", {
        className: "flex-1 max-w-md",
        children: /* @__PURE__ */jsxs("div", {
          className: "relative",
          children: [/* @__PURE__ */jsx(Search, {
            className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          }), /* @__PURE__ */jsx("input", {
            className: cn("w-full h-10 pl-10 pr-4 rounded-xl bg-muted/50 border border-transparent", "text-sm text-foreground placeholder:text-muted-foreground", "transition-all duration-200", "focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background")
          })]
        })
      }), /* @__PURE__ */jsxs("div", {
        className: "flex items-center gap-2",
        children: [/* @__PURE__ */jsx("button", {
          className: "h-10 w-10 rounded-xl hover:bg-muted transition-colors flex items-center justify-center",
          onClick: onToggleTheme,
          children: isDark ? /* @__PURE__ */jsx(Sun, {
            className: "h-5 w-5 text-foreground"
          }) : /* @__PURE__ */jsx(Moon, {
            className: "h-5 w-5 text-foreground"
          })
        }), /* @__PURE__ */jsxs("div", {
          className: "relative",
          children: [/* @__PURE__ */jsxs("button", {
            className: "h-10 w-10 rounded-xl hover:bg-muted transition-colors flex items-center justify-center relative",
            onClick: () => setShowNotifications(!showNotifications),
            children: [/* @__PURE__ */jsx(Bell, {
              className: "h-5 w-5 text-foreground"
            }), /* @__PURE__ */jsx("span", {
              className: "absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full ring-2 ring-card"
            })]
          }), showNotifications && /* @__PURE__ */jsxs("div", {
            className: "absolute right-0 mt-2 w-80 bg-card rounded-2xl border border-border shadow-lg p-4",
            children: [/* @__PURE__ */jsx("h3", {
              className: "font-semibold mb-3 text-card-foreground",
              children: "Notificaciones"
            }), /* @__PURE__ */jsxs("div", {
              className: "space-y-3",
              children: [/* @__PURE__ */jsxs("div", {
                className: "p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer",
                children: [/* @__PURE__ */jsx("p", {
                  className: "text-sm font-medium text-foreground",
                  children: "Stock bajo detectado"
                }), /* @__PURE__ */jsx("p", {
                  className: "text-xs text-muted-foreground mt-1",
                  children: "3 productos necesitan reabastecimiento"
                })]
              }), /* @__PURE__ */jsxs("div", {
                className: "p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer",
                children: [/* @__PURE__ */jsx("p", {
                  className: "text-sm font-medium text-foreground",
                  children: "Nueva venta registrada"
                }), /* @__PURE__ */jsx("p", {
                  className: "text-xs text-muted-foreground mt-1",
                  children: "Venta #1234 - $150.00"
                })]
              })]
            })]
          })]
        })]
      })]
    })
  });
}
export { Navbar };