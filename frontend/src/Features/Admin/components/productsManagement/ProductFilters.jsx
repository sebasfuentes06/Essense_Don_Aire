import { jsx, jsxs } from "react/jsx-runtime";
import { Search, Filter } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Button } from "../../../../shared/components/ui/button";
import { Input } from "../../../../shared/components/ui/input";
import { Select } from "../../../../shared/components/ui/Select";
import { FilterPanel } from "../../../../shared/components/ui/FilterPanel";
import { SortSelect } from "../../../../shared/components/ui/SortSelect";
import { ItemsPerPageSelect } from "../../../../shared/components/ui/ItemsPerPageSelect";
import { cn } from "../../../../shared/utils/cn";
function ProductFilters({
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters,
  onCloseFilters,
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortByChange,
  sortOptions,
  sortDirection,
  onSortDirectionChange,
  itemsPerPage,
  onItemsPerPageChange,
  onResetFilters,
  statusFilter,
  onStatusFilterChange,
  stockFilter,
  onStockFilterChange,
  supplierFilter,
  onSupplierFilterChange,
  suppliers,
  priceRange,
  onPriceMinChange,
  onPriceMaxChange
}) {
  return /* @__PURE__ */jsxs("div", {
    className: "space-y-4",
    children: [/* @__PURE__ */jsx(Card, {
      children: /* @__PURE__ */jsxs("div", {
        className: "relative flex flex-nowrap items-center gap-3 p-4 sm:p-5",
        children: [/* @__PURE__ */jsxs("div", {
            className: "relative min-w-[160px] flex-[1_1_auto]",
            children: [/* @__PURE__ */jsx(Search, {
              className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
            }), /* @__PURE__ */jsx("input", {
              value: searchQuery,
              onChange: e => onSearchChange(e.target.value),
              placeholder: "Buscar producto",
              className: cn("h-11 w-full min-w-0 rounded-xl border border-input bg-background pl-11 pr-4", "text-foreground placeholder:text-muted-foreground", "focus:outline-none focus:ring-2 focus:ring-primary")
            })]
          }), /* @__PURE__ */jsxs(Button, {
            size: "lg",
            className: "h-11 shrink-0 2xl:hidden",
            onClick: onToggleFilters,
            children: [/* @__PURE__ */jsx(Filter, {
              className: "h-5 w-5"
            }), /* @__PURE__ */jsx("span", {
              className: "hidden sm:inline",
              children: "Filtros"
            })]
          }), /* @__PURE__ */jsxs("div", {
          className: "hidden min-w-0 flex-[1_1_auto] items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden 2xl:flex",
          children: [/* @__PURE__ */jsxs(Button, {
            size: "lg",
            className: "h-11 shrink-0",
            onClick: onToggleFilters,
            children: [/* @__PURE__ */jsx(Filter, {
              className: "h-5 w-5"
            }), "Filtros"]
          }), categories.map(category => /* @__PURE__ */jsx("button", {
            onClick: () => onCategoryChange(category),
            className: cn("h-11 shrink-0 rounded-xl px-4 text-sm font-medium transition-all", selectedCategory === category ? "bg-primary text-primary-foreground" : "border border-border bg-background hover:bg-muted"),
            children: category
          }, category))]
        }), /* @__PURE__ */jsxs("div", {
          className: "hidden w-[220px] shrink-0 2xl:block",
          children: /* @__PURE__ */jsx(SortSelect, {
            value: sortBy,
            onChange: onSortByChange,
            options: sortOptions,
            direction: sortDirection,
            onDirectionChange: onSortDirectionChange
          })
        }), /* @__PURE__ */jsx(ItemsPerPageSelect, {
          className: "hidden shrink-0 2xl:flex",
          value: itemsPerPage,
          onChange: onItemsPerPageChange
        }), /* @__PURE__ */jsxs("details", {
          className: "relative shrink-0 2xl:hidden",
          children: [/* @__PURE__ */jsx("summary", {
            className: "flex h-11 cursor-pointer list-none items-center rounded-xl border border-input bg-background px-3 text-sm font-medium text-foreground hover:bg-muted [&::-webkit-details-marker]:hidden",
            children: "Más filtros"
          }), /* @__PURE__ */jsxs("div", {
            className: "absolute right-0 top-[calc(100%+0.5rem)] z-20 w-72 space-y-3 rounded-xl border border-border bg-card p-3 shadow-xl",
            children: [/* @__PURE__ */jsx(Select, {
              label: "Categoría",
              value: selectedCategory,
              onChange: e => onCategoryChange(e.target.value),
              options: categories.map(category => ({ value: category, label: category }))
            }), /* @__PURE__ */jsx(SortSelect, {
              value: sortBy,
              onChange: onSortByChange,
              options: sortOptions,
              direction: sortDirection,
              onDirectionChange: onSortDirectionChange
            }), /* @__PURE__ */jsx(ItemsPerPageSelect, {
              value: itemsPerPage,
              onChange: onItemsPerPageChange
            })]
          })]
        })]
      })
    }), showFilters && /* @__PURE__ */jsx(FilterPanel, {
        isOpen: showFilters,
        onClose: onCloseFilters,
        onReset: onResetFilters,
        children: /* @__PURE__ */jsxs("div", {
          className: "space-y-4",
          children: [/* @__PURE__ */jsx(Select, {
            value: statusFilter,
            onChange: onStatusFilterChange,
            options: [{
              label: "Todos"
            }, {
              label: "Activo"
            }, {
              label: "Inactivo"
            }]
          }), /* @__PURE__ */jsx(Select, {
            value: stockFilter,
            onChange: onStockFilterChange,
            options: [{
              label: "Todos"
            }, {
              label: "Stock Bajo"
            }, {
              label: "Stock Normal"
            }]
          }), /* @__PURE__ */jsx(Select, {
            value: supplierFilter,
            onChange: onSupplierFilterChange,
            options: [{
              label: "Todos"
            }, ...suppliers.map(s => ({
              value: s,
              label: s
            }))]
          }), /* @__PURE__ */jsxs("div", {
            children: [/* @__PURE__ */jsx("label", {
              className: "block mb-2 text-sm font-medium text-foreground",
              children: "Rango de Precio"
            }), /* @__PURE__ */jsxs("div", {
              className: "grid grid-cols-2 gap-2",
              children: [/* @__PURE__ */jsx(Input, {
                value: priceRange.min,
                onChange: onPriceMinChange
              }), /* @__PURE__ */jsx(Input, {
                value: priceRange.max,
                onChange: onPriceMaxChange
              })]
            })]
          })]
        })
      })]
  });
}
export { ProductFilters };