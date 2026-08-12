import { Moon, Sun } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { NotificationsDropdown } from './NotificationsDropdown';
import { useTheme } from '../../../contexts/ThemeContext';

/**
 * Header del panel administrativo (antes "Navbar"):
 * buscador global, toggle de tema y notificaciones.
 * Consume el tema directo del ThemeContext — ya no necesita props.
 */
export function Header() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className="h-16 bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-card/80">
      <div className="h-full px-6 flex items-center justify-between gap-4">
        {/* Buscador */}
        <div className="flex-1 max-w-md">
          <SearchBar />
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          {/* Toggle de tema */}
          <button
            onClick={toggleTheme}
            className="h-10 w-10 rounded-xl hover:bg-muted transition-colors flex items-center justify-center"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-foreground" />
            ) : (
              <Moon className="h-5 w-5 text-foreground" />
            )}
          </button>

          {/* Notificaciones */}
          <NotificationsDropdown />
        </div>
      </div>
    </header>
  );
}
