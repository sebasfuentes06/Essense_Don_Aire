import { jsx, jsxs } from "react/jsx-runtime";
import { Edit, Trash2, Star, MapPin, Eye } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../shared/components/ui/Table";
import { Badge } from "../../../../shared/components/ui/Badge";
import { Switch } from "../../../../shared/components/ui/switch";
import { Pagination } from "../../../../shared/components/ui/Pagination";
function SupplierTable({
  suppliers,
  totalPages,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onToggleStatus
}) {
  return /* @__PURE__ */jsxs(Card, {
    children: [/* @__PURE__ */jsxs(Table, {
      children: [/* @__PURE__ */jsx(TableHeader, {
        children: /* @__PURE__ */jsxs(TableRow, {
          children: [/* @__PURE__ */jsx(TableHead, {
            children: "Nombre"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Contacto"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Email"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Tel\xE9fono"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Productos"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "\xD3rdenes"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Gastado"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Calificaci\xF3n"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Estado"
          }), /* @__PURE__ */jsx(TableHead, {
            className: "w-[1%] text-right",
            children: "Acciones"
          })]
        })
      }), /* @__PURE__ */jsx(TableBody, {
        children: suppliers.map(supplier => /* @__PURE__ */jsxs(TableRow, {
          children: [/* @__PURE__ */jsx(TableCell, {
            children: /* @__PURE__ */jsxs("div", {
              children: [/* @__PURE__ */jsx("p", {
                className: "font-semibold text-foreground",
                children: supplier.name
              }), /* @__PURE__ */jsxs("p", {
                className: "text-xs text-muted-foreground flex items-center gap-1",
                children: [/* @__PURE__ */jsx(MapPin, {
                  className: "h-3 w-3"
                }), " ", supplier.city]
              })]
            })
          }), /* @__PURE__ */jsx(TableCell, {
            children: supplier.contact
          }), /* @__PURE__ */jsx(TableCell, {
            children: supplier.email
          }), /* @__PURE__ */jsx(TableCell, {
            children: supplier.phone
          }), /* @__PURE__ */jsx(TableCell, {
            children: /* @__PURE__ */jsxs(Badge, {
              children: [supplier.products.length, " productos"]
            })
          }), /* @__PURE__ */jsx(TableCell, {
            children: supplier.totalOrders
          }), /* @__PURE__ */jsxs(TableCell, {
            children: ["$", (supplier.totalSpent / 1e3).toFixed(1), "k"]
          }), /* @__PURE__ */jsx(TableCell, {
            className: "w-[1%] whitespace-nowrap",
            children: /* @__PURE__ */jsxs("div", {
              className: "flex items-center gap-1",
              children: [/* @__PURE__ */jsx(Star, {
                className: "h-4 w-4 fill-primary text-primary"
              }), /* @__PURE__ */jsx("span", {
                className: "font-semibold text-foreground",
                children: supplier.rating
              }), /* @__PURE__ */jsxs("span", {
                className: "text-xs text-muted-foreground",
                children: ["(", supplier.reviews, ")"]
              })]
            })
          }), /* @__PURE__ */jsx(TableCell, {
            children: /* @__PURE__ */jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */jsx(Switch, {
                checked: supplier.status === "active",
                itemName: supplier.name,
                onCheckedChange: () => onToggleStatus(supplier),
                "aria-label": `${supplier.status === "active" ? "Desactivar" : "Activar"} ${supplier.name}`
              }), /* @__PURE__ */jsx("span", {
                className: supplier.status === "active" ? "text-sm font-medium text-success" : "text-sm font-medium text-muted-foreground",
                children: supplier.status === "active" ? "Activo" : "Inactivo"
              })]
            })
          }), /* @__PURE__ */jsx(TableCell, {
            className: "w-[1%] whitespace-nowrap",
            children: /* @__PURE__ */jsxs("div", {
              className: "flex items-center justify-end gap-2",
              children: [/* @__PURE__ */jsx("button", {
                className: "h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center",
                onClick: () => onView(supplier),
                children: /* @__PURE__ */jsx(Eye, {
                  className: "h-4 w-4 text-muted-foreground"
                })
              }), /* @__PURE__ */jsx("button", {
                className: "h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center",
                onClick: () => onEdit(supplier),
                children: /* @__PURE__ */jsx(Edit, {
                  className: "h-4 w-4 text-primary"
                })
              }), /* @__PURE__ */jsx("button", {
                className: "h-8 w-8 rounded-lg hover:bg-destructive/10 transition-colors flex items-center justify-center",
                onClick: () => onDelete(supplier),
                children: /* @__PURE__ */jsx(Trash2, {
                  className: "h-4 w-4 text-destructive"
                })
              })]
            })
          })]
        }, supplier.id))
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
export { SupplierTable };