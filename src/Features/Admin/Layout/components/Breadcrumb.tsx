import { ChevronRight, Home } from 'lucide-react';
import { MENU_ITEMS } from '../menu-items';

interface BreadcrumbProps {
  currentPath: string;
  onNavigate?: (path: string) => void;
}

/**
 * Breadcrumb del panel: Inicio / <sección actual>.
 * Deriva el nombre de la sección del menú, así no hay que
 * mantener dos listas de rutas.
 */
export function Breadcrumb({ currentPath, onNavigate }: BreadcrumbProps) {
  const currentItem = MENU_ITEMS.find(item => item.path === currentPath);

  // En el dashboard ('/') no tiene sentido mostrar breadcrumb
  if (!currentItem || currentPath === '/') return null;

  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <button
        onClick={() => onNavigate?.('/')}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        Inicio
      </button>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
      <span className="font-medium text-foreground">{currentItem.label}</span>
    </nav>
  );
}
