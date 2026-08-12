import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Card = forwardRef(
  ({ className, hover, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-card rounded-2xl border border-border shadow-sm',
          'transition-all duration-200',
          hover && 'hover:shadow-md hover:border-primary/20',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-6 pb-4', className)}
        {...props}
      />
    );
  }
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('font-semibold text-card-foreground', className)}
        {...props}
      />
    );
  }
);

CardTitle.displayName = 'CardTitle';

export const CardContent = forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-6 pt-0', className)}
        {...props}
      />
    );
  }
);

CardContent.displayName = 'CardContent';
