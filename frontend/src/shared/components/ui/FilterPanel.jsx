import { X } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../../utils/cn";

function FilterPanel({ isOpen, onClose, onReset, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/20">
      <button type="button" aria-label="Cerrar filtros" className="flex-1" onClick={onClose} />
      <div className={cn(
        "h-full w-full max-w-md border-l border-border bg-card p-5 shadow-xl",
        "lg:relative lg:max-w-full lg:border lg:rounded-xl lg:shadow-none",
      )}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filtros Avanzados</h3>
          <button type="button" onClick={onClose} className="rounded-md p-1 hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">{children}</div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onReset}>Limpiar</Button>
          <Button onClick={onClose}>Aplicar</Button>
        </div>
      </div>
    </div>
  );
}

export { FilterPanel };
