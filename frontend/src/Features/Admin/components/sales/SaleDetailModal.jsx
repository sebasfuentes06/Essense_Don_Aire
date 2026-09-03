import { jsx, jsxs } from "react/jsx-runtime";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Badge } from "../../../../shared/components/ui/Badge";
import { Button } from "../../../../shared/components/ui/Button";

const paymentMethodLabels = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
  mixed: "Mixto"
};

function SaleDetailModal({ isOpen, onClose, sale, onCancel }) {
  if (!sale) return null;

  return /* @__PURE__ */jsx(Modal, {
    isOpen,
    onClose,
    size: "lg",
    title: `Detalle de ${sale.folio}`,
    children: /* @__PURE__ */jsxs("div", {
      className: "space-y-5",
      children: [/* @__PURE__ */jsxs("div", {
        className: "grid grid-cols-1 gap-4 md:grid-cols-2",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "Cliente"
          }), /* @__PURE__ */jsx("p", {
            className: "font-medium text-foreground",
            children: sale.customer
          })]
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "Vendedor"
          }), /* @__PURE__ */jsx("p", {
            className: "font-medium text-foreground",
            children: sale.seller
          })]
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "Fecha"
          }), /* @__PURE__ */jsx("p", {
            className: "font-medium text-foreground",
            children: new Date(sale.date).toLocaleDateString()
          })]
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "Pago"
          }), /* @__PURE__ */jsx(Badge, {
            variant: sale.paymentMethod === "cash" ? "success" : sale.paymentMethod === "card" ? "info" : "default",
            children: paymentMethodLabels[sale.paymentMethod] || "Mixto"
          })]
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "Subtotal"
          }), /* @__PURE__ */jsx("p", {
            className: "font-medium text-foreground",
            children: ["$", sale.subtotal.toFixed(2)]
          })]
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "Total"
          }), /* @__PURE__ */jsx("p", {
            className: "font-semibold text-foreground",
            children: ["$", sale.total.toFixed(2)]
          })]
        })]
      }), /* @__PURE__ */jsxs("div", {
        children: [/* @__PURE__ */jsx("p", {
          className: "text-xs uppercase tracking-wide text-muted-foreground",
          children: "Productos"
        }), /* @__PURE__ */jsx("div", {
          className: "mt-3 space-y-2",
          children: sale.items.map((item, index) => /* @__PURE__ */jsxs("div", {
            className: "flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-2",
            children: [/* @__PURE__ */jsxs("div", {
              children: [/* @__PURE__ */jsx("p", {
                className: "font-medium text-foreground",
                children: item.productName
              }), /* @__PURE__ */jsx("p", {
                className: "text-xs text-muted-foreground",
                children: ["Cantidad: ", item.quantity]
              })]
            }), /* @__PURE__ */jsx("p", {
              className: "font-medium text-foreground",
              children: ["$", (item.unitPrice * item.quantity).toFixed(2)]
            })]
          }, index))
        })]
      }), sale.status === "completed" && /* @__PURE__ */jsx("div", {
        className: "flex justify-end border-t border-border pt-4",
        children: /* @__PURE__ */jsx(Button, {
          type: "button",
          variant: "destructive",
          onClick: () => onCancel(sale),
          children: "Cancelar venta"
        })
      })]
    })
  });
}

export { SaleDetailModal };
