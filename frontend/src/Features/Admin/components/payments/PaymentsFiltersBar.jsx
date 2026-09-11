import { Search } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Select } from "../../../../shared/components/ui/Select";
import { SortSelect } from "../../../../shared/components/ui/SortSelect";
import { ItemsPerPageSelect } from "../../../../shared/components/ui/ItemsPerPageSelect";
import { METHOD_OPTIONS } from "../../../../shared/payments";

const methodOptions = [{ value: "all", label: "Todos los métodos" }, ...METHOD_OPTIONS];

const statusOptions = [
  { value: "all", label: "Todos los clientes" },
  { value: "pending", label: "Solo con saldo pendiente" },
  { value: "settled", label: "Solo al día" }
];

function PaymentsFiltersBar({
  tab,
  searchQuery,
  onSearchChange,
  methodFilter,
  onMethodFilterChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  sortDirection,
  onSortDirectionChange,
  sortOptions,
  itemsPerPage,
  onItemsPerPageChange
}) {
  const isPaymentsTab = tab === "abonos";

  return (
    <Card className="p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_230px_220px_auto] xl:items-center">
        <div className="relative min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={isPaymentsTab ? "Buscar por abono, venta o cliente..." : "Buscar cliente..."}
            aria-label="Buscar"
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        {isPaymentsTab ? (
          <Select
            wrapperClassName="w-full"
            aria-label="Filtrar por método de pago"
            value={methodFilter}
            onChange={(event) => onMethodFilterChange(event.target.value)}
            options={methodOptions}
          />
        ) : (
          <Select
            wrapperClassName="w-full"
            aria-label="Filtrar por saldo"
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value)}
            options={statusOptions}
          />
        )}

        {isPaymentsTab ? (
          <SortSelect
            value={sortBy}
            onChange={onSortByChange}
            options={sortOptions}
            direction={sortDirection}
            onDirectionChange={onSortDirectionChange}
          />
        ) : (
          <div />
        )}

        {isPaymentsTab ? <ItemsPerPageSelect value={itemsPerPage} onChange={onItemsPerPageChange} /> : <div />}
      </div>
    </Card>
  );
}

export { PaymentsFiltersBar };
