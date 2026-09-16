import { Search } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Select } from "../../../../shared/components/ui/Select";
import { SortSelect } from "../../../../shared/components/ui/SortSelect";
import { ItemsPerPageSelect } from "../../../../shared/components/ui/ItemsPerPageSelect";
import { cn } from "../../../../shared/utils/cn";

function UserFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  roleFilter,
  onRoleFilterChange,
  roleOptions = [],
  sortBy,
  onSortByChange,
  sortDirection,
  onSortDirectionChange,
  sortOptions,
  itemsPerPage,
  onItemsPerPageChange
}) {
  // El filtro por rol solo aparece si la pantalla lo pide: así este componente
  // sigue sirviendo igual donde no se use.
  const mostrarRoles = typeof onRoleFilterChange === "function";

  // Los clientes tienen su propio módulo, así que no se ofrecen aquí.
  const opcionesRol = [
    { value: "Todos", label: "Todos los roles" },
    ...roleOptions
      .filter((rol) => (rol.name ?? rol) !== "Cliente")
      .map((rol) => ({ value: rol.name ?? rol, label: rol.name ?? rol }))
  ];

  return (
    <Card className="p-4 sm:p-5">
      <div
        className={cn(
          "grid grid-cols-1 gap-3 xl:items-center",
          mostrarRoles
            ? "xl:grid-cols-[minmax(0,1fr)_180px_180px_220px_auto]"
            : "xl:grid-cols-[minmax(0,1fr)_200px_220px_auto]"
        )}
      >
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar usuario o correo"
            className={cn(
              "w-full h-11 pl-10 pr-4 rounded-xl bg-background border border-input",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary"
            )}
          />
        </div>

        <div>
          <Select
            wrapperClassName="w-full"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            options={[
              { value: "all", label: "Todos los estados" },
              { value: "active", label: "Activos" },
              { value: "inactive", label: "Inactivos" }
            ]}
          />
        </div>

        {mostrarRoles && (
          <div>
            <Select
              wrapperClassName="w-full"
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value)}
              options={opcionesRol}
            />
          </div>
        )}

        <div>
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
    </Card>
  );
}

export { UserFilters };
