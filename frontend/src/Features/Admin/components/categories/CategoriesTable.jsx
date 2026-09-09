import { jsx, jsxs } from "react/jsx-runtime";
import { Edit, Eye, Trash2, Tag } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../shared/components/ui/Table";
import { Badge } from "../../../../shared/components/ui/Badge";
import { Switch } from "../../../../shared/components/ui/switch";
import { Pagination } from "../../../../shared/components/ui/Pagination";
function CategoriesTable({
  categories,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onShowDetail,
  onEdit,
  onDelete,
  onToggleStatus
}) {
  return /* @__PURE__ */jsxs(Card, {
    children: [/* @__PURE__ */jsxs(Table, {
      children: [/* @__PURE__ */jsx(TableHeader, {
        children: /* @__PURE__ */jsxs(TableRow, {
          children: [/* @__PURE__ */jsx(TableHead, {
            children: "Categor\xEDa"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Descripci\xF3n"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Productos"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Estado"
          }), /* @__PURE__ */jsx(TableHead, {
            className: "w-[1%] text-right",
            children: "Acciones"
          })]
        })
      }), /* @__PURE__ */jsx(TableBody, {
        children: categories.map(category => /* @__PURE__ */jsxs(TableRow, {
          children: [/* @__PURE__ */jsx(TableCell, {
            children: /* @__PURE__ */jsxs("div", {
              className: "flex items-center gap-3",
              children: [/* @__PURE__ */jsx("div", {
                className: "h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center",
                children: /* @__PURE__ */jsx(Tag, {
                  className: "h-5 w-5 text-primary"
                })
              }), /* @__PURE__ */jsxs("div", {
                children: [/* @__PURE__ */jsx("p", {
                  className: "font-semibold text-foreground",
                  children: category.name
                }), /* @__PURE__ */jsxs("p", {
                  className: "text-xs text-muted-foreground",
                  children: ["ID: ", category.id]
                })]
              })]
            })
          }), /* @__PURE__ */jsx(TableCell, {
            children: category.description
          }), /* @__PURE__ */jsx(TableCell, {
            children: /* @__PURE__ */jsxs(Badge, {
              children: [category.productCount, " productos"]
            })
          }), /* @__PURE__ */jsx(TableCell, {
            children: /* @__PURE__ */jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */jsx(Switch, {
                checked: category.status === "active",
                itemName: category.name,
                onCheckedChange: () => onToggleStatus(category),
                "aria-label": `${category.status === "active" ? "Desactivar" : "Activar"} ${category.name}`
              }), /* @__PURE__ */jsx("span", {
                className: category.status === "active" ? "text-sm font-medium text-success" : "text-sm font-medium text-muted-foreground",
                children: category.status === "active" ? "Activo" : "Inactivo"
              })]
            })
          }), /* @__PURE__ */jsx(TableCell, {
            className: "w-[1%] whitespace-nowrap",
            children: /* @__PURE__ */jsxs("div", {
              className: "flex items-center justify-end gap-2",
              children: [/* @__PURE__ */jsx("button", {
                className: "h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center",
                onClick: () => onShowDetail(category),
                title: "Ver detalles",
                "aria-label": `Ver detalles de ${category.name}`,
                children: /* @__PURE__ */jsx(Eye, {
                  className: "h-4 w-4 text-muted-foreground"
                })
              }), /* @__PURE__ */jsx("button", {
                className: "h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center",
                onClick: () => onEdit(category),
                children: /* @__PURE__ */jsx(Edit, {
                  className: "h-4 w-4 text-primary"
                })
              }), /* @__PURE__ */jsx("button", {
                className: "h-8 w-8 rounded-lg hover:bg-destructive/10 transition-colors flex items-center justify-center",
                onClick: () => onDelete(category),
                children: /* @__PURE__ */jsx(Trash2, {
                  className: "h-4 w-4 text-destructive"
                })
              })]
            })
          })]
        }, category.id))
      })]
    }), totalPages > 1 && /* @__PURE__ */jsx(Pagination, {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      onPageChange
    })]
  });
}
export { CategoriesTable };