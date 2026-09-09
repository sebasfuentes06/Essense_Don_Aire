import { jsx, jsxs } from "react/jsx-runtime";
import { Edit, Trash2, Mail, Phone, Eye } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../shared/components/ui/Table";
import { Switch } from "../../../../shared/components/ui/switch";
import { Pagination } from "../../../../shared/components/ui/Pagination";
import { useAuth } from "../../../../shared/auth";
function CustomerTable({
  customers,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onView,
  onToggleStatus,
  onEdit,
  onDelete
}) {
  const { can } = useAuth();

  return /* @__PURE__ */jsxs(Card, {
    children: [/* @__PURE__ */jsxs(Table, {
      children: [/* @__PURE__ */jsx(TableHeader, {
        children: /* @__PURE__ */jsxs(TableRow, {
          children: [/* @__PURE__ */jsx(TableHead, {
            children: "Cliente"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Contacto"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Ubicaci\xF3n"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Compras"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Total Gastado"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Estado"
          }), /* @__PURE__ */jsx(TableHead, {
            className: "w-[1%] text-right",
            children: "Acciones"
          })]
        })
      }), /* @__PURE__ */jsx(TableBody, {
        children: customers.map(customer => /* @__PURE__ */jsxs(TableRow, {
          children: [/* @__PURE__ */jsx(TableCell, {
            children: /* @__PURE__ */jsxs("div", {
              className: "flex items-center gap-3",
              children: [/* @__PURE__ */jsx("div", {
                className: "h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center",
                children: /* @__PURE__ */jsx("span", {
                  className: "font-semibold text-primary",
                  children: customer.name[0]
                })
              }), /* @__PURE__ */jsxs("div", {
                children: [/* @__PURE__ */jsx("p", {
                  className: "font-semibold text-foreground",
                  children: customer.name
                }), /* @__PURE__ */jsxs("p", {
                  className: "text-xs text-muted-foreground",
                  children: ["ID: ", customer.id]
                })]
              })]
            })
          }), /* @__PURE__ */jsx(TableCell, {
            className: "w-[1%] whitespace-nowrap",
            children: /* @__PURE__ */jsxs("div", {
              className: "space-y-1",
              children: [/* @__PURE__ */jsxs("div", {
                className: "flex items-center gap-2 text-sm",
                children: [/* @__PURE__ */jsx(Mail, {
                  className: "h-3 w-3 text-muted-foreground"
                }), /* @__PURE__ */jsx("span", {
                  className: "text-foreground",
                  children: customer.email
                })]
              }), /* @__PURE__ */jsxs("div", {
                className: "flex items-center gap-2 text-sm",
                children: [/* @__PURE__ */jsx(Phone, {
                  className: "h-3 w-3 text-muted-foreground"
                }), /* @__PURE__ */jsx("span", {
                  className: "text-foreground",
                  children: customer.phone
                })]
              })]
            })
          }), /* @__PURE__ */jsx(TableCell, {
            children: /* @__PURE__ */jsx("div", {
              children: /* @__PURE__ */jsx("p", {
                className: "text-sm text-foreground",
                children: customer.city
              })
            })
          }), /* @__PURE__ */jsx(TableCell, {
            children: customer.totalPurchases
          }), /* @__PURE__ */jsxs(TableCell, {
            children: ["$", customer.totalSpent.toFixed(2)]
          }), /* @__PURE__ */jsx(TableCell, {
            children: /* @__PURE__ */jsxs("div", {
              className: "flex items-center gap-2",
              children: [can("customers.toggle") && /* @__PURE__ */jsx(Switch, {
                checked: customer.status === "active",
                itemName: customer.name,
                onCheckedChange: () => onToggleStatus(customer),
                "aria-label": `${customer.status === "active" ? "Desactivar" : "Activar"} ${customer.name}`
              }), /* @__PURE__ */jsx("span", {
                className: customer.status === "active" ? "text-sm font-medium text-success" : "text-sm font-medium text-muted-foreground",
                children: customer.status === "active" ? "Activo" : "Inactivo"
              })]
            })
          }), /* @__PURE__ */jsx(TableCell, {
            className: "w-[1%] whitespace-nowrap",
            children: /* @__PURE__ */jsxs("div", {
              className: "flex items-center justify-end gap-2",
              children: [/* @__PURE__ */jsx("button", {
                className: "h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center",
                onClick: () => onView(customer),
                children: /* @__PURE__ */jsx(Eye, {
                  className: "h-4 w-4 text-muted-foreground"
                })
              }), can("customers.edit") && /* @__PURE__ */jsx("button", {
                className: "h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center",
                onClick: () => onEdit(customer),
                children: /* @__PURE__ */jsx(Edit, {
                  className: "h-4 w-4 text-primary"
                })
              }), can("customers.delete") && /* @__PURE__ */jsx("button", {
                className: "h-8 w-8 rounded-lg hover:bg-destructive/10 transition-colors flex items-center justify-center",
                onClick: () => onDelete(customer),
                children: /* @__PURE__ */jsx(Trash2, {
                  className: "h-4 w-4 text-destructive"
                })
              })]
            })
          })]
        }, customer.id))
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
export { CustomerTable };