import { jsx, jsxs } from "react/jsx-runtime";
import { Eye, Trash2, Ban } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../shared/components/ui/Table";
import { Badge } from "../../../../shared/components/ui/Badge";
import { Pagination } from "../../../../shared/components/ui/Pagination";
import { useAuth } from "../../../../shared/auth";
const paymentMethodLabels = {
  cash: {
    label: "Efectivo",
    variant: "success"
  },
  card: {
    label: "Tarjeta",
    variant: "info"
  },
  transfer: {
    label: "Transferencia",
    variant: "default"
  },
  mixed: {
    label: "Mixto",
    variant: "warning"
  }
};
const statusLabels = {
  completed: {
    label: "Completada",
    variant: "success"
  },
  cancelled: {
    label: "Cancelada",
    variant: "danger"
  },
  pending: {
    label: "Pendiente",
    variant: "warning"
  }
};
function SalesTable({
  sales,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onViewDetail,
  onCancel,
  onDelete
}) {
  const { can } = useAuth();

  return /* @__PURE__ */jsxs(Card, {
    children: [/* @__PURE__ */jsxs(Table, {
      children: [/* @__PURE__ */jsx(TableHeader, {
        children: /* @__PURE__ */jsxs(TableRow, {
          children: [/* @__PURE__ */jsx(TableHead, {
            children: "Folio"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Fecha"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Cliente"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Vendedor"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Productos"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Total"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Pago"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Estado"
          }), /* @__PURE__ */jsx(TableHead, {
            className: "w-[1%] text-right",
            children: "Acciones"
          })]
        })
      }), /* @__PURE__ */jsx(TableBody, {
        children: sales.map(sale => {
          const pm = paymentMethodLabels[sale.paymentMethod];
          const st = statusLabels[sale.status];
          return /* @__PURE__ */jsxs(TableRow, {
            children: [/* @__PURE__ */jsx(TableCell, {
              children: sale.folio
            }), /* @__PURE__ */jsx(TableCell, {
              children: new Date(sale.date).toLocaleDateString()
            }), /* @__PURE__ */jsx(TableCell, {
              className: "w-[1%] whitespace-nowrap",
              children: /* @__PURE__ */jsxs("div", {
                className: "flex items-center gap-2",
                children: [/* @__PURE__ */jsx("div", {
                  className: "h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center",
                  children: /* @__PURE__ */jsx("span", {
                    className: "text-xs font-bold text-primary",
                    children: sale.customer[0]
                  })
                }), /* @__PURE__ */jsx("span", {
                  className: "text-sm font-medium text-foreground",
                  children: sale.customer
                })]
              })
            }), /* @__PURE__ */jsx(TableCell, {
              children: sale.seller
            }), /* @__PURE__ */jsx(TableCell, {
              children: /* @__PURE__ */jsxs(Badge, {
                children: [sale.items.reduce((s, i) => s + i.quantity, 0), " items"]
              })
            }), /* @__PURE__ */jsxs(TableCell, {
              children: ["$", sale.total.toFixed(2)]
            }), /* @__PURE__ */jsx(TableCell, {
              children: /* @__PURE__ */jsx(Badge, {
                variant: pm.variant,
                children: pm.label
              })
            }), /* @__PURE__ */jsx(TableCell, {
              children: /* @__PURE__ */jsx(Badge, {
                variant: st.variant,
                children: st.label
              })
            }), /* @__PURE__ */jsx(TableCell, {
              className: "w-[1%] whitespace-nowrap",
              children: /* @__PURE__ */jsxs("div", {
                  className: "flex items-center justify-end gap-2",
                children: [/* @__PURE__ */jsx("button", {
                  className: "h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center",
                  onClick: () => onViewDetail(sale),
                  title: "Ver detalles",
                  "aria-label": `Ver detalles de ${sale.folio}`,
                  children: /* @__PURE__ */jsx(Eye, {
                    className: "h-4 w-4 text-muted-foreground"
                  })
                }), can("sales.cancel") && sale.status !== "cancelled" && /* @__PURE__ */jsx("button", {
                  className: "h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center",
                  onClick: () => onCancel(sale),
                  title: "Anular venta",
                  "aria-label": `Anular venta ${sale.folio}`,
                  children: /* @__PURE__ */jsx(Ban, {
                    className: "h-4 w-4 text-muted-foreground"
                  })
                }), can("sales.delete") && /* @__PURE__ */jsx("button", {
                  className: "h-8 w-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center",
                  onClick: () => onDelete(sale),
                  title: "Eliminar venta",
                  "aria-label": `Eliminar venta ${sale.folio}`,
                  children: /* @__PURE__ */jsx(Trash2, {
                    className: "h-4 w-4 text-destructive"
                  })
                })]
              })
            })]
          }, sale.id);
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
export { SalesTable };