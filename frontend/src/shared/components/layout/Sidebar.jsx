import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Users, Package, ShoppingCart, ChevronLeft, ChevronRight, Sparkles, UserCircle, TrendingUp, Tag, Truck, Shield, ShoppingBag } from "lucide-react";
import { cn } from "../../utils/cn";
const menuItems = [{
  icon: TrendingUp,
  path: "/"
}, {
  icon: Sparkles,
  path: "/catalogo"
}, {
  icon: Package,
  path: "/productos"
}, {
  icon: Tag,
  path: "/categorias"
}, {
  icon: ShoppingCart,
  path: "/ventas"
}, {
  icon: Users,
  path: "/clientes"
}, {
  icon: Truck,
  path: "/proveedores"
}, {
  icon: ShoppingBag,
  path: "/compras"
}, {
  icon: UserCircle,
  path: "/usuarios"
}, {
  icon: Shield,
  path: "/roles"
}];
function Sidebar({
  currentPath = "/",
  onNavigate
}) {
  const [collapsed, setCollapsed] = useState(false);
  return /* @__PURE__ */jsxs("aside", {
    className: cn("h-screen bg-sidebar border-r border-sidebar-border sticky top-0 transition-all duration-300", collapsed ? "w-20" : "w-64"),
    children: [/* @__PURE__ */jsxs("div", {
      className: "h-16 flex items-center justify-between px-4 border-b border-sidebar-border",
      children: [!collapsed && /* @__PURE__ */jsxs("div", {
        className: "flex items-center gap-2",
        children: [/* @__PURE__ */jsx("img", {
          src: "/essence_don_aire_logo_wordmark.svg",
          alt: "Essence Don Aire",
          className: "h-8 w-auto object-contain"
        })]
      }), collapsed && /* @__PURE__ */jsx("img", {
        src: "/essence_don_aire_logo_wordmark.svg",
        alt: "Essence Don Aire",
        className: "h-7 w-auto object-contain"
      }), /* @__PURE__ */jsx("button", {
        className: "p-2 rounded-lg hover:bg-sidebar-accent transition-colors",
        onClick: () => setCollapsed(!collapsed),
        children: collapsed ? /* @__PURE__ */jsx(ChevronRight, {
          className: "h-5 w-5 text-sidebar-foreground"
        }) : /* @__PURE__ */jsx(ChevronLeft, {
          className: "h-5 w-5 text-sidebar-foreground"
        })
      })]
    }), /* @__PURE__ */jsx("nav", {
      className: "p-3 space-y-1",
      children: menuItems.map(item => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        return /* @__PURE__ */jsxs("button", {
          onClick: () => onNavigate?.(item.path),
          className: cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200", "hover:bg-sidebar-accent group", isActive && "bg-sidebar-primary text-sidebar-primary-foreground", !isActive && "text-sidebar-foreground"),
          children: [/* @__PURE__ */jsx(Icon, {
            className: cn("h-5 w-5 flex-shrink-0")
          }), !collapsed && /* @__PURE__ */jsx("span", {
            className: "font-medium text-sm",
            children: item.label
          })]
        }, item.path);
      })
    }), !collapsed && /* @__PURE__ */jsx("div", {
      className: "absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border",
      children: /* @__PURE__ */jsxs("div", {
        className: "flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent",
        children: [/* @__PURE__ */jsx("div", {
          className: "h-10 w-10 rounded-full bg-primary flex items-center justify-center",
          children: /* @__PURE__ */jsx("span", {
            className: "text-primary-foreground font-semibold",
            children: "AD"
          })
        }), /* @__PURE__ */jsxs("div", {
          className: "flex-1 min-w-0",
          children: [/* @__PURE__ */jsx("p", {
            className: "text-sm font-medium text-sidebar-foreground truncate",
            children: "Admin"
          }), /* @__PURE__ */jsx("p", {
            className: "text-xs text-muted-foreground truncate",
            children: "admin@essence.com"
          })]
        })]
      })
    })]
  });
}
export { Sidebar };