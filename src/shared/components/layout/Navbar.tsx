import { Search, Bell, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../ui/Input';
import { cn } from '../../utils/cn';

interface NavbarProps {
  onToggleTheme?: () => void;
  isDark?: boolean;
}

export function Navbar({ onToggleTheme, isDark }: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-card/80">
      <div className="h-full px-6 flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar productos, clientes, ventas..."
              className={cn(
                'w-full h-10 pl-10 pr-4 rounded-xl bg-muted/50 border border-transparent',
                'text-sm text-foreground placeholder:text-muted-foreground',
                'transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background'
              )}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="h-10 w-10 rounded-xl hover:bg-muted transition-colors flex items-center justify-center"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-foreground" />
            ) : (
              <Moon className="h-5 w-5 text-foreground" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="h-10 w-10 rounded-xl hover:bg-muted transition-colors flex items-center justify-center relative"
            >
              <Bell className="h-5 w-5 text-foreground" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full ring-2 ring-card" />
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-card rounded-2xl border border-border shadow-lg p-4">
                <h3 className="font-semibold mb-3 text-card-foreground">Notificaciones</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                    <p className="text-sm font-medium text-foreground">Stock bajo detectado</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      3 productos necesitan reabastecimiento
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                    <p className="text-sm font-medium text-foreground">Nueva venta registrada</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Venta #1234 - $150.00
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
