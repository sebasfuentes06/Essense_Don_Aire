import { Search } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Select } from "../../../../shared/components/ui/Select";
import { Input } from "../../../../shared/components/ui/input";
import { SortSelect } from "../../../../shared/components/ui/SortSelect";
import { ItemsPerPageSelect } from "../../../../shared/components/ui/ItemsPerPageSelect";
import { cn } from "../../../../shared/utils/cn";

/**
 * Filtros de Compras.
 *
 * El filtro de proveedor ahora manda el ID, no el nombre. Antes comparaba
 * `p.supplierName === supplierFilter`, así que dos proveedores con nombres
 * parecidos —o uno al que le corrigieran una tilde— dejaban de coincidir.
 *
 * "Por pagar" no es un estado de la base: agrupa pendientes y parciales. Es
 * lo que de verdad se quiere ver cuando alguien pregunta qué falta pagarles a
 * los proveedores, y tenerlo en un clic evita revisar dos filtros.
 */
function PurchasesFiltersBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  supplierFilter,
  onSupplierFilterChange,
  suppliers = [],
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  sortBy,
  onSortByChange,
  sortDirection,
  onSortDirectionChange,
  sortOptions,
  itemsPerPage,
  onItemsPerPageChange
}) {
  return (
    <Card className="space-y-3 p-4 sm:p-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="flex min-w-0 flex-1 flex-wrap gap-3">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por folio o proveedor"
              className={cn(
                "w-full h-11 pl-11 pr-4 rounded-xl bg-background border border-input",
                "text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary"
              )}
            />
          </div>

          <Select
            wrapperClassName="min-w-[180px] flex-[0_0_180px]"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            options={[
              { value: "all", label: "Todos los estados" },
              { value: "unpaid", label: "Por pagar" },
              { value: "pending", label: "Pendientes" },
              { value: "partial", label: "Parciales" },
              { value: "paid", label: "Pagadas" },
              { value: "cancelled", label: "Canceladas" }
            ]}
          />

          <Select
            wrapperClassName="min-w-[200px] flex-[0_0_200px]"
            value={String(supplierFilter)}
            onChange={(e) => onSupplierFilterChange(e.target.value)}
            options={[
              { value: "all", label: "Todos los proveedores" },
              ...suppliers.map((s) => ({ value: String(s.id), label: s.nombre }))
            ]}
          />
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
          <div className="min-w-[220px] flex-1 xl:flex-none">
            <SortSelect
              value={sortBy}
              onChange={onSortByChange}
              options={sortOptions}
              direction={sortDirection}
              onDirectionChange={onSortDirectionChange}
            />
          </div>
          <ItemsPerPageSelect value={itemsPerPage} onChange={onItemsPerPageChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:max-w-lg">
        <Input
          label="Desde"
          type="date"
          value={dateFrom}
          max={dateTo || undefined}
          onChange={(e) => onDateFromChange(e.target.value)}
        />
        <Input
          label="Hasta"
          type="date"
          value={dateTo}
          min={dateFrom || undefined}
          onChange={(e) => onDateToChange(e.target.value)}
        />
      </div>
    </Card>
  );
}

export { PurchasesFiltersBar };
