import { Search } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface SearchBarProps {
  placeholder?: string;
}

/**
 * Buscador global del panel admin.
 * Cuando se implemente la búsqueda real, agregar value/onChange.
 */
export function SearchBar({ placeholder = 'Buscar productos, clientes, ventas...' }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder}
        className={cn(
          'w-full h-10 pl-10 pr-4 rounded-xl bg-muted/50 border border-transparent',
          'text-sm text-foreground placeholder:text-muted-foreground',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background'
        )}
      />
    </div>
  );
}
