import { jsx, jsxs } from "react/jsx-runtime";
import { Search } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Select } from "../../../../shared/components/ui/Select";
import { ItemsPerPageSelect } from "../../../../shared/components/ui/ItemsPerPageSelect";
import { SortSelect } from "../../../../shared/components/ui/SortSelect";
function PurchasesFiltersBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  supplierFilter,
  onSupplierFilterChange,
  suppliers,
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
  return /* @__PURE__ */jsx(Card, {
    className: "p-4 sm:p-5",
    children: /* @__PURE__ */jsxs("div", {
      className: "grid grid-cols-1 gap-3 2xl:grid-cols-[minmax(160px,1fr)_185px_220px_125px_125px_200px_132px] 2xl:items-center",
      children: [/* @__PURE__ */jsxs("div", {
        className: "relative min-w-0",
        children: [/* @__PURE__ */jsx(Search, {
          className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        }), /* @__PURE__ */jsx("input", {
          value: searchQuery,
          onChange: e => onSearchChange(e.target.value),
          placeholder: "Buscar compra o proveedor",
          className: "h-10 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        })]
      }), /* @__PURE__ */jsx(Select, {
        wrapperClassName: "w-full",
        value: statusFilter,
        onChange: e => onStatusFilterChange(e.target.value),
        options: [{
          value: "all",
          label: "Todos los estados"
        }, {
          value: "pending",
          label: "Pendientes"
        }, {
          value: "partial",
          label: "Pago parcial"
        }, {
          value: "paid",
          label: "Pagados"
        }]
      }), /* @__PURE__ */jsx(Select, {
        wrapperClassName: "w-full",
        value: supplierFilter,
        onChange: e => onSupplierFilterChange(e.target.value),
        options: [{
          value: "all",
          label: "Todos los proveedores"
        }, ...suppliers.map(s => ({
          value: s.name,
          label: s.name
        }))]
      }), /* @__PURE__ */jsx("input", {
        type: "date",
        value: dateFrom,
        onChange: e => onDateFromChange(e.target.value),
        className: "h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      }), /* @__PURE__ */jsx("input", {
        type: "date",
        value: dateTo,
        onChange: e => onDateToChange(e.target.value),
        className: "h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
export { PurchasesFiltersBar };