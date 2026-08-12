import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  children: ReactNode;
}

export function FilterPanel({ isOpen, onClose, onReset, children }: FilterPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 lg:relative lg:z-0">
      {/* Backdrop for mobile */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          'absolute right-0 top-0 h-full w-80 bg-card border-l border-border shadow-xl',
          'lg:relative lg:w-full lg:h-auto lg:shadow-none lg:border lg:rounded-xl',
          'transform transition-transform duration-300',
          'animate-in slide-in-from-right lg:animate-none'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Filtros Avanzados</h3>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Filters Content */}
        <div className="p-4 space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto">
          {children}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            className="flex-1"
            onClick={onReset}
          >
            Limpiar
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            className="flex-1"
            onClick={onClose}
          >
            Aplicar
          </Button>
        </div>
      </div>
    </div>
  );
}
