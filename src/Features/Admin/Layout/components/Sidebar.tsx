import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { MENU_ITEMS } from '../menu-items';
import { useSidebar } from '../hooks/useSidebar';
import { UserProfile } from './UserProfile';

interface SidebarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export function Sidebar({ currentPath = '/', onNavigate }: SidebarProps) {
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        'h-screen bg-sidebar border-r border-sidebar-border sticky top-0 transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Encabezado */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-heading text-xl font-semibold text-sidebar-foreground">
              Essence
            </span>
          </div>
        )}
        <button
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-sidebar-foreground" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-sidebar-foreground" />
          )}
        </button>
      </div>

      {/* Navegación */}
      <nav className="p-3 space-y-1">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate?.(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                'hover:bg-sidebar-accent group',
                isActive && 'bg-sidebar-primary text-sidebar-primary-foreground',
                !isActive && 'text-sidebar-foreground'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Perfil de usuario */}
      {!collapsed && <UserProfile />}
    </aside>
  );
}
