import * as React from "react";
import { cn } from "./utils";

function Input({ className, type, label, id, error, wrapperClassName, required, onKeyDown, onPaste, ...props }) {
  const inputId = id || props.name || undefined;
  const isNumericInput = type === "number" || props.inputMode === "numeric" || props.inputMode === "decimal";

  const handleKeyDown = (event) => {
    if (!isNumericInput) {
      onKeyDown?.(event);
      return;
    }

    const allowedKeys = [
      "Backspace",
      "Tab",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
      "Enter",
      "Escape"
    ];

    if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey || event.altKey) {
      onKeyDown?.(event);
      return;
    }

    const isNumberKey = /[0-9]/.test(event.key);
    const isDecimalKey = event.key === "." || event.key === ",";
    const isNegativeKey = event.key === "-" && (props.min === undefined || Number(props.min) < 0);

    if (!isNumberKey && !isDecimalKey && !isNegativeKey) {
      event.preventDefault();
      return;
    }

    onKeyDown?.(event);
  };

  const handlePaste = (event) => {
    if (!isNumericInput) {
      onPaste?.(event);
      return;
    }

    const pastedText = event.clipboardData.getData("text");
    if (!/^[0-9]*([.,]?[0-9]*)?$/.test(pastedText)) {
      event.preventDefault();
      return;
    }

    onPaste?.(event);
  };

  return (
    <div className={cn("w-full min-w-0 space-y-2", wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-muted-foreground">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        data-slot="input"
        aria-invalid={error ? "true" : undefined}
        aria-required={required || undefined}
        required={required}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          className
        )}
        {...props}
      />
    </div>
  );
}

export { Input };
