import { Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

/**
 * Campana + dropdown de notificaciones.
 * Se cierra solo al hacer clic fuera (via useClickOutside dentro del hook).
 */
export function NotificationsDropdown() {
  const { isOpen, toggle, containerRef, notifications, hasUnread } = useNotifications();

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={toggle}
        className="h-10 w-10 rounded-xl hover:bg-muted transition-colors flex items-center justify-center relative"
      >
        <Bell className="h-5 w-5 text-foreground" />
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full ring-2 ring-card" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card rounded-2xl border border-border shadow-lg p-4">
          <h3 className="font-semibold mb-3 text-card-foreground">Notificaciones</h3>
          <div className="space-y-3">
            {notifications.map(n => (
              <div
                key={n.id}
                className="p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.description}</p>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No tienes notificaciones
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
