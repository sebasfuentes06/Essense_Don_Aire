import { jsx, jsxs } from "react/jsx-runtime";
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
  sortBy,
  onSortByChange,
  sortDirection,
  onSortDirectionChange,
  sortOptions,
  itemsPerPage,
  onItemsPerPageChange
}) {
  return /* @__PURE__ */jsx(Card, {
    className: "p-4 sm:p-5",
    children: /* @__PURE__ */jsxs("div", {
      className: "grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_200px_220px_auto] xl:items-center",
      children: [/* @__PURE__ */jsxs("div", {
        className: "relative min-w-0 flex-1",
        children: [/* @__PURE__ */jsx(Search, {
          className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        }), /* @__PURE__ */jsx("input", {
          value: searchQuery,
          onChange: e => onSearchChange(e.target.value),
          placeholder: "Buscar usuario o correo",
          className: cn("w-full h-11 pl-10 pr-4 rounded-xl bg-background border border-input", "text-foreground placeholder:text-muted-foreground", "focus:outline-none focus:ring-2 focus:ring-primary")
        })]
      }), /* @__PURE__ */jsx("div", {
        children: /* @__PURE__ */jsx(Select, {
          wrapperClassName: "w-full",
          value: statusFilter,
          onChange: e => onStatusFilterChange(e.target.value),
          options: [{
            value: "all",
            label: "Todos los estados"
          }, {
            value: "active",
            label: "Activos"
          }, {
            value: "inactive",
            label: "Inactivos"
          }]
        })
      }), /* @__PURE__ */jsx("div", {
        children: /* @__PURE__ */jsx(SortSelect, {
          value: sortBy,
          onChange: onSortByChange,
          options: sortOptions,
          direction: sortDirection,
          onDirectionChange: onSortDirectionChange
        })
      }), /* @__PURE__ */jsx(ItemsPerPageSelect, {
        value: itemsPerPage,
        onChange: onItemsPerPageChange
      })]
    })
  });
}
export { UserFilters };