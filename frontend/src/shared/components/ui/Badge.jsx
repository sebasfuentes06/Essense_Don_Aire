import { jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { cn } from "../../utils/cn";
const Badge = forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-muted text-foreground border-border",
      info: "bg-primary/10 text-primary border-primary/20",
      success: "bg-success/10 text-success border-success/20",
      warning: "bg-primary/10 text-primary border-primary/20",
      danger: "bg-destructive/10 text-destructive border-destructive/20"
    };
    return /* @__PURE__ */ jsx(
      "span",
      {
        ref,
        className: cn(
          "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors",
          variants[variant],
          className
        ),
        ...props
      }
    );
  }
);
Badge.displayName = "Badge";
export {
  Badge
};
