import { Search } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Select } from "../../../../shared/components/ui/Select";
import { ItemsPerPageSelect } from "../../../../shared/components/ui/ItemsPerPageSelect";
import { NOMBRES_METODO, NOMBRES_ESTADO_PAGO } from "../../../../shared/negocio";

const methodOptions = [
  { value: "all", label: "Todos los métodos" },
  ...Object.entries(NOMBRES_METODO).map(([value, label]) => ({ value, label }))
];
const statusOptions = [
  { value: "all", label: "Todos los estados" },
  ...Object.entries(NOMBRES_ESTADO_PAGO).map(([value, label]) => ({ value, label }))
];

function PaymentsFiltersBar({
  searchQuery,
  onSearchChange,
  methodFilter,
  onMethodFilterChange,
  statusFilter,
  onStatusFilterChange,
  itemsPerPage,
  onItemsPerPageChange
}) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_220px_220px_auto] xl:items-center">
        <div className="relative min-w-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por factura, cliente o referencia..."
            aria-label="Buscar"
            className="h-10 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Select
          aria-label="Filtrar por estado"
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
          options={statusOptions}
        />
        <Select
          aria-label="Filtrar por método"
          value={methodFilter}
          onChange={(event) => onMethodFilterChange(event.target.value)}
          options={methodOptions}
        />
        <ItemsPerPageSelect value={itemsPerPage} onChange={onItemsPerPageChange} />
      </div>
    </Card>
  );
}

export { PaymentsFiltersBar };
