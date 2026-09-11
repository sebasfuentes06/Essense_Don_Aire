import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "../../../../shared/utils/cn";
import { useAuth } from "../../../../shared/auth";
import { getMenuGroups } from "./menu-items";
import { useSidebar } from "../../hooks/layout/useSidebar";
import { UserProfile } from "./UserProfile";

function Sidebar({ mobileOpen = false, onToggleMobile }) {
  const { collapsed, toggle } = useSidebar();
  const { role, can } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const menuGroups = getMenuGroups(role, can);

  const activeGroupId = menuGroups.find((group) =>
    group.items.some((item) => item.path === pathname)
  )?.id;

  const [expandedGroups, setExpandedGroups] = useState(() =>
    Object.fromEntries(menuGroups.map((group) => [group.id, true]))
  );

  useEffect(() => {
    if (!activeGroupId) return;
    setExpandedGroups((prev) => ({ ...prev, [activeGroupId]: true }));
  }, [activeGroupId]);

  const handleNavigate = (path) => {
    navigate(path);
    onToggleMobile?.();
  };

  const renderNavItem = (item, isSubItem = false) => {
    const Icon = item.icon;
    const isActive = pathname === item.path;

    return (
      <button
        key={item.path}
        type="button"
        title={collapsed ? item.label : undefined}
        onClick={() => handleNavigate(item.path)}
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl transition-all duration-200",
          collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2",
          isActive && "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm",
          !isActive && "text-sidebar-foreground hover:bg-sidebar-accent",
          isSubItem && !collapsed && "ml-2 border-l border-sidebar-border/70 pl-3"
        )}
      >
        <Icon className={cn("h-4 w-4 flex-shrink-0", collapsed && "h-5 w-5")} />
        {!collapsed && (
          <span className={cn("truncate text-sm font-medium", isSubItem ? "text-[13px]" : "text-sm")}>
            {item.label}
          </span>
        )}
      </button>
    );
  };

  const renderGroup = (group) => {
    const isOpen = expandedGroups[group.id] ?? true;
    const isPrincipal = group.id === "principal";

    return (
      <div key={group.id} className="space-y-1.5">
        {!isPrincipal && (
          <button
            type="button"
            onClick={() => setExpandedGroups((prev) => ({ ...prev, [group.id]: !isOpen }))}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/70 transition-colors hover:text-sidebar-foreground",
              collapsed && "justify-center"
            )}
          >
            {!collapsed && <span>{group.label}</span>}
            {!collapsed &&
              (isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />)}
          </button>
        )}

        {(isPrincipal || isOpen) && (
          <div className={cn("space-y-1", collapsed && !isPrincipal && "space-y-1.5")}>
            {group.items.map((item) => renderNavItem(item, !isPrincipal))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/30 transition-opacity duration-200 md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onToggleMobile}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 md:sticky md:top-0",
          collapsed ? "w-20" : "w-64",
          "max-md:shadow-2xl",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-3 sm:px-4">
          <img
            src="/essence_don_aire_logo_wordmark.svg"
            alt="Essence Don Aire"
            className={collapsed ? "h-7 w-7 object-cover object-left" : "h-9 w-auto object-contain"}
          />
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
            onClick={toggle}
            title={collapsed ? "Expandir menú" : "Contraer menú"}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto p-3">
          {menuGroups.map((group) => renderGroup(group))}
        </nav>

        {!collapsed && <UserProfile />}
      </aside>
    </div>
  );
}

export { Sidebar };
