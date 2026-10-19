import { Search } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Select } from "../../../../shared/components/ui/Select";
import { SortSelect } from "../../../../shared/components/ui/SortSelect";
import { ItemsPerPageSelect } from "../../../../shared/components/ui/ItemsPerPageSelect";

function CustomerFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  balanceFilter,
  onBalanceFilterChange,
  sortBy,
  onSortByChange,
  sortOptions,
  sortDirection,
  onSortDirectionChange,
  itemsPerPage,
  onItemsPerPageChange
}) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_190px_210px_220px_auto] xl:items-center">
        <div className="relative min-w-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, documento, celular o correo..."
            aria-label="Buscar clientes"
            className="h-10 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Select
          aria-label="Estado"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          options={[
            { value: "all", label: "Todos los estados" },
            { value: "active", label: "Activos" },
            { value: "inactive", label: "Inactivos" }
          ]}
        />
        <Select
          aria-label="Saldo"
          value={balanceFilter}
          onChange={(e) => onBalanceFilterChange(e.target.value)}
          options={[
            { value: "all", label: "Con y sin saldo" },
            { value: "debt", label: "Con saldo pendiente" },
            { value: "clear", label: "Al día" }
          ]}
        />
        <SortSelect value={sortBy} onChange={onSortByChange} options={sortOptions} direction={sortDirection} onDirectionChange={onSortDirectionChange} />
        <ItemsPerPageSelect value={itemsPerPage} onChange={onItemsPerPageChange} />
      </div>
    </Card>
  );
}

export { CustomerFilters };
