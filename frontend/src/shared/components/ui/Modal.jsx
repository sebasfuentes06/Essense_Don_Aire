import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

function Modal({ isOpen, onClose, title, children, size = "md" }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <button
        type="button"
        aria-label="Cerrar modal"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div className={cn("relative z-10 w-full max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl", sizes[size])}>
        {title && (
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-5 py-4 sm:px-6">
            <h2 className="text-lg font-semibold text-card-foreground">{title}</h2>
            <button type="button" onClick={onClose} className="rounded-md p-1 hover:bg-muted">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        )}
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

export { Modal };
