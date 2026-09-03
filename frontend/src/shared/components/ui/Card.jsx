import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Card = forwardRef(({ className, hover, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-card rounded-2xl border border-border/80 shadow-sm transition-all duration-200 overflow-hidden",
        hover && "hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/25",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = "Card";

const CardHeader = forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("p-6 pb-4", className)} {...props} />;
});
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(({ className, ...props }, ref) => {
  return <h3 ref={ref} className={cn("font-semibold text-card-foreground", className)} {...props} />;
});
CardTitle.displayName = "CardTitle";

const CardContent = forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />;
});
CardContent.displayName = "CardContent";

export { Card, CardContent, CardHeader, CardTitle };
