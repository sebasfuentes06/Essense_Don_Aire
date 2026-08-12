interface UserProfileProps {
  name?: string;
  email?: string;
}

/**
 * Tarjeta de usuario al pie del sidebar.
 * Los defaults son placeholder — al conectar la autenticación real,
 * pasar el usuario logueado desde el contexto de auth.
 */
export function UserProfile({ name = 'Admin', email = 'admin@essence.com' }: UserProfileProps) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
      <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent">
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-semibold">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-sidebar-foreground truncate">{name}</p>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
        </div>
      </div>
    </div>
  );
}
