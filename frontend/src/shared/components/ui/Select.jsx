import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

const Select = forwardRef(({ className, wrapperClassName, label, error, options = [], ...props }, ref) => {
  return (
    <div className={cn("w-full min-w-0 space-y-2", wrapperClassName)}>
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "h-11 w-full appearance-none rounded-xl border border-input bg-input-background px-4 pr-10 text-foreground transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus:ring-destructive",
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
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
});

Select.displayName = "Select";

export { Select };
