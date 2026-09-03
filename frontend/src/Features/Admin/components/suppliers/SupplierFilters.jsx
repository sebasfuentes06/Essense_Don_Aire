import { jsx, jsxs } from "react/jsx-runtime";
import { Search } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Select } from "../../../../shared/components/ui/Select";
import { SortSelect } from "../../../../shared/components/ui/SortSelect";
import { ItemsPerPageSelect } from "../../../../shared/components/ui/ItemsPerPageSelect";
import { cn } from "../../../../shared/utils/cn";
function SupplierFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  sortOptions,
  sortDirection,
  onSortDirectionChange,
  itemsPerPage,
  onItemsPerPageChange
}) {
  return /* @__PURE__ */jsx(Card, {
    className: "p-4 sm:p-5",
    children: /* @__PURE__ */jsxs("div", {
      className: "flex flex-col gap-3 xl:flex-row xl:items-center",
      children: [/* @__PURE__ */jsxs("div", {
        className: "flex min-w-0 flex-1 flex-wrap gap-3",
        children: [/* @__PURE__ */jsxs("div", {
          className: "relative min-w-0 flex-1",
          children: [/* @__PURE__ */jsx(Search, {
            className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
          }), /* @__PURE__ */jsx("input", {
            value: searchQuery,
            onChange: e => onSearchChange(e.target.value),
            placeholder: "Buscar proveedor",
            className: cn("w-full h-11 pl-11 pr-4 rounded-xl bg-background border border-input", "text-foreground placeholder:text-muted-foreground", "focus:outline-none focus:ring-2 focus:ring-primary")
          })]
        }), /* @__PURE__ */jsx(Select, {
          wrapperClassName: "min-w-[200px] flex-[0_0_200px]",
          value: statusFilter,
          onChange: e => onStatusFilterChange(e.target.value),
          options: [{
            label: "Todos"
          }, {
            label: "Activos"
          }, {
            label: "Inactivos"
          }]
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "flex w-full flex-col gap-3 sm:flex-row xl:w-auto",
        children: [/* @__PURE__ */jsx("div", {
          className: "min-w-[220px] flex-1 xl:flex-none",
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
      })]
    })
  });
}
export { SupplierFilters };