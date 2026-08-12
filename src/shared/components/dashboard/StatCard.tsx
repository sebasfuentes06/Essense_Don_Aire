import type { ComponentType, SVGProps } from 'react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-primary'
}: StatCardProps) {
  return (
    <Card hover className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <h3 className="text-3xl font-bold text-card-foreground mb-2">
              {value}
            </h3>
            {change && (
              <p
                className={cn(
                  'text-sm font-medium flex items-center gap-1',
                  changeType === 'positive' && 'text-success',
                  changeType === 'negative' && 'text-destructive',
                  changeType === 'neutral' && 'text-muted-foreground'
                )}
              >
                {changeType === 'positive' && '↑'}
                {changeType === 'negative' && '↓'}
                {change}
              </p>
            )}
          </div>
          <div className={cn('p-3 rounded-xl bg-muted/50', iconColor)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
