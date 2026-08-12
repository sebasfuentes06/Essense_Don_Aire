import { useState } from 'react';
import {
  Users,
  Package,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  UserCircle,
  TrendingUp,
  Tag,
  Truck,
  Shield,
  ShoppingBag
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

const menuItems = [
  { icon: TrendingUp, label: 'Dashboard', path: '/' },
  { icon: Sparkles, label: 'Catálogo', path: '/catalogo' },
  { icon: Package, label: 'Productos', path: '/productos' },
  { icon: Tag, label: 'Categorías', path: '/categorias' },
  { icon: ShoppingCart, label: 'Ventas', path: '/ventas' },
  { icon: Users, label: 'Clientes', path: '/clientes' },
  { icon: Truck, label: 'Proveedores', path: '/proveedores' },
  { icon: ShoppingBag, label: 'Compras', path: '/compras' },
  { icon: UserCircle, label: 'Usuarios', path: '/usuarios' },
  { icon: Shield, label: 'Roles', path: '/roles' },
];

export function Sidebar({ currentPath = '/', onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'h-screen bg-sidebar border-r border-sidebar-border sticky top-0 transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header */}
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
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-sidebar-foreground" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-sidebar-foreground" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {menuItems.map((item) => {
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
              <Icon className={cn('h-5 w-5 flex-shrink-0')} />
              {!collapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                Admin
              </p>
              <p className="text-xs text-muted-foreground truncate">
                admin@essence.com
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
