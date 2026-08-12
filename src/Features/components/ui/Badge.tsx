import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-muted text-foreground',
      success: 'bg-success/10 text-success border-success/20',
      warning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20',
      danger: 'bg-destructive/10 text-destructive border-destructive/20',
      info: 'bg-primary/10 text-primary border-primary/20'
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
