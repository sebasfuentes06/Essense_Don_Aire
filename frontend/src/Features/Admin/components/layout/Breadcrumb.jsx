import { ChevronRight, Home } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../../../shared/auth";
import { getMenuItems } from "./menu-items";

function Breadcrumb() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const currentItem = getMenuItems(role).find((item) => item.path === pathname);
  if (!currentItem || pathname === "/panel") return null;

  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <button
        type="button"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => navigate("/panel")}
      >
        <Home className="h-4 w-4" />
        Inicio
      </button>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
      <span className="font-medium text-foreground">{currentItem.label}</span>
    </nav>
  );
}

export { Breadcrumb };
