import { Search } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Select } from "../../../../shared/components/ui/Select";
import { SortSelect } from "../../../../shared/components/ui/SortSelect";
import { ItemsPerPageSelect } from "../../../../shared/components/ui/ItemsPerPageSelect";

const statusOptions = [
  { value: "all", label: "Todos los estados" },
  { value: "pending", label: "Pendientes" },
  { value: "confirmed", label: "Confirmados" },
  { value: "cancelled", label: "Cancelados" }
];

const channelOptions = [
  { value: "all", label: "Todos los canales" },
  { value: "web", label: "Web" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "fisico", label: "Punto físico" }
];

function OrdersFiltersBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  channelFilter,
  onChannelFilterChange,
  sortBy,
  onSortByChange,
  sortDirection,
  onSortDirectionChange,
  sortOptions,
  itemsPerPage,
  onItemsPerPageChange
}) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_200px_200px_220px_auto] xl:items-center">
        <div className="relative min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por folio o cliente..."
            aria-label="Buscar pedidos"
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        <Select
          wrapperClassName="w-full"
          aria-label="Filtrar por estado"
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
          options={statusOptions}
        />

        <Select
          wrapperClassName="w-full"
          aria-label="Filtrar por canal"
          value={channelFilter}
          onChange={(event) => onChannelFilterChange(event.target.value)}
          options={channelOptions}
        />

        <SortSelect
          value={sortBy}
          onChange={onSortByChange}
          options={sortOptions}
          direction={sortDirection}
          onDirectionChange={onSortDirectionChange}
        />

        <ItemsPerPageSelect value={itemsPerPage} onChange={onItemsPerPageChange} />
      </div>
    </Card>
  );
}

export { OrdersFiltersBar };
