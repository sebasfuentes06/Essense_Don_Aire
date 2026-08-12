import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react';
import { Select } from './Select';
import { cn } from '../../utils/cn';

export interface SortOption {
  value: string;
  label: string;
}

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SortOption[];
  direction: 'asc' | 'desc';
  onDirectionChange: (direction: 'asc' | 'desc') => void;
}

export function SortSelect({
  value,
  onChange,
  options,
  direction,
  onDirectionChange
}: SortSelectProps) {
  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          options={options}
        />
      </div>
      <button
        type="button"
        onClick={() => onDirectionChange(direction === 'asc' ? 'desc' : 'asc')}
        className={cn(
          'h-11 w-11 rounded-xl border border-input bg-background',
          'hover:bg-muted transition-colors flex items-center justify-center',
          'text-foreground'
        )}
        title={direction === 'asc' ? 'Ascendente' : 'Descendente'}
      >
        {direction === 'asc' ? (
          <ArrowDownAZ className="h-5 w-5" />
        ) : (
          <ArrowUpAZ className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
