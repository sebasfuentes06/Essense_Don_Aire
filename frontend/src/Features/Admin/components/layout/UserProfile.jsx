import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../shared/auth";

function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const name = user?.name ?? "Invitado";
  const email = user?.email ?? "";
  const role = user?.role ?? "";

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border max-md:hidden">
      <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent">
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-semibold">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-sidebar-foreground truncate">{name}</p>
          <p className="text-xs text-muted-foreground truncate">{role || email}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="h-9 w-9 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex items-center justify-center"
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export { UserProfile };
