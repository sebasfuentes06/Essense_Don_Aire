import { jsx, jsxs } from "react/jsx-runtime";
import { Eye, Trash2, CheckCircle, Clock, XCircle, CreditCard } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../shared/components/ui/Table";
import { Badge } from "../../../../shared/components/ui/Badge";
import { Pagination } from "../../../../shared/components/ui/Pagination";
const statusConfig = {
  pending: {
    label: "Pendiente",
    variant: "warning",
    icon: Clock
  },
  partial: {
    label: "Parcial",
    variant: "info",
    icon: CreditCard
  },
  paid: {
    label: "Pagado",
    variant: "success",
    icon: CheckCircle
  },
  cancelled: {
    label: "Cancelado",
    variant: "danger",
    icon: XCircle
  }
};
function PurchasesTable({
  purchases,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onViewDetail,
  onDeleteRequest
}) {
  return /* @__PURE__ */jsxs(Card, {
    children: [/* @__PURE__ */jsxs(Table, {
      children: [/* @__PURE__ */jsx(TableHeader, {
        children: /* @__PURE__ */jsxs(TableRow, {
          children: [/* @__PURE__ */jsx(TableHead, {
            children: "Folio"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Fecha"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Proveedor"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Productos"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Total"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Pagado"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Saldo"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Estado"
          }), /* @__PURE__ */jsx(TableHead, {
            className: "w-[1%] text-right",
            children: "Acciones"
          })]
        })
      }), /* @__PURE__ */jsx(TableBody, {
        children: purchases.map(purchase => {
          const sc = statusConfig[purchase.status];
          return /* @__PURE__ */jsxs(TableRow, {
            children: [/* @__PURE__ */jsx(TableCell, {
              children: purchase.folio
            }), /* @__PURE__ */jsx(TableCell, {
              children: new Date(purchase.date).toLocaleDateString()
            }), /* @__PURE__ */jsx(TableCell, {
              children: purchase.supplierName
            }), /* @__PURE__ */jsx(TableCell, {
              children: /* @__PURE__ */jsxs(Badge, {
                children: [purchase.items.length, " productos"]
              })
            }), /* @__PURE__ */jsxs(TableCell, {
              children: ["$", purchase.total.toFixed(2)]
            }), /* @__PURE__ */jsxs(TableCell, {
              children: ["$", purchase.paid.toFixed(2)]
            }), /* @__PURE__ */jsx(TableCell, {
              children: /* @__PURE__ */jsxs("span", {
                className: purchase.balance > 0 ? "text-destructive font-semibold" : "text-muted-foreground",
                children: ["$", purchase.balance.toFixed(2)]
              })
            }), /* @__PURE__ */jsx(TableCell, {
              children: /* @__PURE__ */jsx(Badge, {
                variant: sc.variant,
                children: sc.label
              })
            }), /* @__PURE__ */jsx(TableCell, {
              className: "w-[1%] whitespace-nowrap",
              children: /* @__PURE__ */jsxs("div", {
                className: "flex items-center justify-end gap-2",
                children: [/* @__PURE__ */jsx("button", {
                  className: "h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center",
                  onClick: () => onViewDetail(purchase),
                  title: "Ver detalles",
                  "aria-label": `Ver detalles de ${purchase.folio}`,
                  children: /* @__PURE__ */jsx(Eye, {
                    className: "h-4 w-4 text-muted-foreground"
                  })
                }), /* @__PURE__ */jsx("button", {
                  className: "h-8 w-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center",
                  onClick: () => onDeleteRequest(purchase),
                  title: "Eliminar compra",
                  "aria-label": `Eliminar compra ${purchase.folio}`,
                  children: /* @__PURE__ */jsx(Trash2, {
                    className: "h-4 w-4 text-destructive"
                  })
                })]
              })
            })]
          }, purchase.id);
        })
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
export { PurchasesTable };