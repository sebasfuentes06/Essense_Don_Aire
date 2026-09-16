import { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

const Select = forwardRef(({ className, wrapperClassName, label, id, error, options = [], required, ...props }, ref) => {
  // Igual que en Input: solo se pinta el mensaje si viene como texto.
  const mensajeError = typeof error === "string" && error.trim() ? error : null;
  // La etiqueta ni siquiera tenía htmlFor, así que no apuntaba al desplegable:
  // un lector de pantalla lo anunciaba sin nombre.
  const generatedId = useId();
  const selectId = id || props.name || generatedId;

  return (
    <div className={cn("w-full min-w-0 space-y-2", wrapperClassName)}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-muted-foreground">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-required={required || undefined}
          aria-invalid={error ? "true" : undefined}
          className={cn(
            "h-11 w-full appearance-none rounded-xl border border-input bg-input-background px-4 pr-10 text-foreground transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus:ring-destructive/40",
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value ?? option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
      {mensajeError && <p className="text-xs font-medium text-destructive">{mensajeError}</p>}
    </div>
  );
});

Select.displayName = "Select";

export { Select };
