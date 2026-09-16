import { Search } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Select } from "../../../../shared/components/ui/Select";
import { SortSelect } from "../../../../shared/components/ui/SortSelect";
import { ItemsPerPageSelect } from "../../../../shared/components/ui/ItemsPerPageSelect";
import { cn } from "../../../../shared/utils/cn";

/**
 * Filtros de Proveedores.
 *
 * Ojo con las opciones del desplegable de estado: antes eran
 * [{ label: "Todos" }, { label: "Activos" }, { label: "Inactivos" }], SIN
 * `value`. Un <option> sin atributo value toma como valor su propio texto,
 * así que el filtro mandaba "Activos" donde el código esperaba "active" y no
 * coincidía con nada: elegir cualquier opción no cambiaba la tabla. El fallo
 * era invisible porque no daba error, simplemente no hacía nada.
 */
function SupplierFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  cityFilter,
  onCityFilterChange,
  cities = [],
  sortBy,
  onSortByChange,
  sortOptions,
  sortDirection,
  onSortDirectionChange,
  itemsPerPage,
  onItemsPerPageChange
}) {
  const opcionesCiudad = [
    { value: "all", label: "Todas las ciudades" },
    ...cities.map((ciudad) => ({ value: ciudad, label: ciudad }))
  ];

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="flex min-w-0 flex-1 flex-wrap gap-3">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nombre, contacto, correo o ciudad"
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
              { value: "active", label: "Activos" },
              { value: "inactive", label: "Inactivos" }
            ]}
          />

          {cities.length > 0 && (
            <Select
              wrapperClassName="min-w-[180px] flex-[0_0_180px]"
              value={cityFilter}
              onChange={(e) => onCityFilterChange(e.target.value)}
              options={opcionesCiudad}
            />
          )}
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

export { SupplierFilters };
