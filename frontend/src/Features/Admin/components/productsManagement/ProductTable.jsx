import { jsx, jsxs } from "react/jsx-runtime";
import { Edit, Trash2, Eye, AlertCircle } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../shared/components/ui/Table";
import { Badge } from "../../../../shared/components/ui/Badge";
import { Switch } from "../../../../shared/components/ui/switch";
import { Pagination } from "../../../../shared/components/ui/Pagination";
import { cn } from "../../../../shared/utils/cn";
import { useAuth } from "../../../../shared/auth";
function ProductTable({
  products,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onToggleStatus
}) {
  const { can } = useAuth();

  return /* @__PURE__ */jsxs(Card, {
    children: [/* @__PURE__ */jsxs(Table, {
      children: [/* @__PURE__ */jsx(TableHeader, {
        children: /* @__PURE__ */jsxs(TableRow, {
          children: [/* @__PURE__ */jsx(TableHead, {
            children: "Producto"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "SKU"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Categor\xEDa"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Precio"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Stock"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Proveedor"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Estado"
          }), /* @__PURE__ */jsx(TableHead, {
            className: "w-[1%] text-right",
            children: "Acciones"
          })]
        })
      }), /* @__PURE__ */jsx(TableBody, {
        children: products.map(product => /* @__PURE__ */jsxs(TableRow, {
          children: [/* @__PURE__ */jsx(TableCell, {
            children: /* @__PURE__ */jsxs("div", {
              className: "flex items-center gap-3",
              children: [/* @__PURE__ */jsx("img", {
                src: product.images[0],
                alt: product.name,
                className: "h-10 w-10 rounded-lg object-cover"
              }), /* @__PURE__ */jsxs("div", {
                children: [/* @__PURE__ */jsx("p", {
                  className: "font-semibold text-foreground",
                  children: product.name
                }), /* @__PURE__ */jsx("p", {
                  className: "text-xs text-muted-foreground truncate max-w-[200px]",
                  children: product.description
                })]
              })]
            })
          }), /* @__PURE__ */jsx(TableCell, {
            children: /* @__PURE__ */jsx("code", {
              className: "text-xs bg-muted px-2 py-1 rounded",
              children: product.sku
            })
          }), /* @__PURE__ */jsx(TableCell, {
            children: product.category
          }), /* @__PURE__ */jsxs(TableCell, {
            children: ["$", product.price]
          }), /* @__PURE__ */jsx(TableCell, {
            className: "w-[1%] whitespace-nowrap",
            children: /* @__PURE__ */jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */jsx("span", {
                className: cn("font-semibold", product.stock < product.minStock ? "text-destructive" : "text-foreground"),
                children: product.stock
              }), product.stock < product.minStock && /* @__PURE__ */jsx(AlertCircle, {
                className: "h-4 w-4 text-destructive"
              })]
            })
          }), /* @__PURE__ */jsx(TableCell, {
            children: product.supplier
          }), /* @__PURE__ */jsx(TableCell, {
            children: /* @__PURE__ */jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */jsx(Switch, {
                checked: product.status === "active",
                itemName: product.name,
                onCheckedChange: () => onToggleStatus(product),
                "aria-label": `${product.status === "active" ? "Desactivar" : "Activar"} ${product.name}`
              }), /* @__PURE__ */jsx("span", {
                className: product.status === "active" ? "text-sm font-medium text-success" : "text-sm font-medium text-muted-foreground",
                children: product.status === "active" ? "Activo" : "Inactivo"
              })]
            })
          }), /* @__PURE__ */jsx(TableCell, {
            className: "w-[1%] whitespace-nowrap",
            children: /* @__PURE__ */jsxs("div", {
              className: "flex items-center justify-end gap-2",
              children: [/* @__PURE__ */jsx("button", {
                className: "h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center",
                onClick: () => onView(product),
                children: /* @__PURE__ */jsx(Eye, {
                  className: "h-4 w-4 text-muted-foreground"
                })
              }), can("products.edit") && /* @__PURE__ */jsx("button", {
                className: "h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center",
                onClick: () => onEdit(product),
                children: /* @__PURE__ */jsx(Edit, {
                  className: "h-4 w-4 text-primary"
                })
              }), can("products.delete") && /* @__PURE__ */jsx("button", {
                className: "h-8 w-8 rounded-lg hover:bg-destructive/10 transition-colors flex items-center justify-center",
                onClick: () => onDelete(product),
                children: /* @__PURE__ */jsx(Trash2, {
                  className: "h-4 w-4 text-destructive"
                })
              })]
            })
          })]
        }, product.id))
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
export { ProductTable };