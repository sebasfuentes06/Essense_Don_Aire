import { Select } from './Select';

interface ItemsPerPageSelectProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
}

export function ItemsPerPageSelect({
  value,
  onChange,
  options = [5, 10, 25, 50, 100]
}: ItemsPerPageSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        Mostrar:
      </span>
      <Select
        value={value.toString()}
        onChange={(e) => onChange(Number(e.target.value))}
        options={options.map(opt => ({
          value: opt.toString(),
          label: opt.toString()
        }))}
      />
    </div>
  );
}
