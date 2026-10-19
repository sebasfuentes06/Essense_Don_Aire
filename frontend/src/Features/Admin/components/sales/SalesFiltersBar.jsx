import { Search } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Select } from "../../../../shared/components/ui/Select";
import { SortSelect } from "../../../../shared/components/ui/SortSelect";
import { ItemsPerPageSelect } from "../../../../shared/components/ui/ItemsPerPageSelect";

function SalesFiltersBar(p) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_190px_190px_220px_auto] xl:items-center">
        <div className="relative min-w-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={p.searchQuery}
            onChange={(e) => p.onSearchChange(e.target.value)}
            placeholder="Buscar por factura, cliente o pedido..."
            aria-label="Buscar ventas"
            className="h-10 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Select
          aria-label="Estado de pago"
          value={p.statusFilter}
          onChange={(e) => p.onStatusFilterChange(e.target.value)}
          options={[
            { value: "all", label: "Todos los estados" },
            { value: "pendiente", label: "Pendientes de pago" },
            { value: "parcial", label: "Abonadas" },
            { value: "pagada", label: "Pagadas" },
            { value: "anulada", label: "Anuladas" }
          ]}
        />
        <Select
          aria-label="Canal"
          value={p.channelFilter}
          onChange={(e) => p.onChannelFilterChange(e.target.value)}
          options={[
            { value: "all", label: "Todos los canales" },
            { value: "app", label: "App / Web" },
            { value: "whatsapp", label: "WhatsApp" },
            { value: "punto_fisico", label: "Punto físico" }
          ]}
        />
        <SortSelect value={p.sortBy} onChange={p.onSortByChange} options={p.sortOptions} direction={p.sortDirection} onDirectionChange={p.onSortDirectionChange} />
        <ItemsPerPageSelect value={p.itemsPerPage} onChange={p.onItemsPerPageChange} />
      </div>
    </Card>
  );
}

export { SalesFiltersBar };
