import { Search } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Select } from "../../../../shared/components/ui/Select";
import { SortSelect } from "../../../../shared/components/ui/SortSelect";
import { ItemsPerPageSelect } from "../../../../shared/components/ui/ItemsPerPageSelect";
import { cn } from "../../../../shared/utils/cn";

/**
 * Filtros de Roles.
 *
 * El desplegable de estado tenía el mismo fallo que el de Proveedores: sus
 * opciones venían sin `value`, y un <option> sin ese atributo toma como valor
 * el texto que muestra. El filtro mandaba "Activos" donde la API espera
 * "active", así que no coincidía con ninguna rama y la lista salía completa
 * sin importar qué se eligiera. No daba error: simplemente no filtraba.
 */
function RoleFilters({
  searchQuery,
  onSearchChange,
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
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="flex min-w-0 flex-1 flex-wrap gap-3">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar rol"
              className={cn(
                "w-full h-11 pl-11 pr-4 rounded-xl bg-background border border-input",
                "text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary"
              )}
            />
          </div>

          <Select
            wrapperClassName="min-w-[200px] flex-[0_0_200px]"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            options={[
              { value: "all", label: "Todos los estados" },
              { value: "active", label: "Activos" },
              { value: "inactive", label: "Inactivos" }
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
    </Card>
  );
}

export { RoleFilters };
