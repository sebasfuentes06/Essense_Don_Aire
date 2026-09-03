import { jsx, jsxs } from "react/jsx-runtime";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Badge } from "../../../../shared/components/ui/Badge";
import { Button } from "../../../../shared/components/ui/Button";

const statusConfig = {
  pending: { label: "Pendiente", variant: "warning" },
  partial: { label: "Parcial", variant: "info" },
  paid: { label: "Pagado", variant: "success" },
  cancelled: { label: "Cancelado", variant: "danger" }
};

function PurchaseDetailModal({ isOpen, onClose, purchase, onCancel }) {
  if (!purchase) return null;

  return /* @__PURE__ */jsx(Modal, {
    isOpen,
    onClose,
    size: "lg",
    title: `Detalle de ${purchase.folio}`,
    children: /* @__PURE__ */jsxs("div", {
      className: "space-y-5",
      children: [/* @__PURE__ */jsxs("div", {
        className: "grid grid-cols-1 gap-4 md:grid-cols-2",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "Proveedor"
          }), /* @__PURE__ */jsx("p", {
            className: "font-medium text-foreground",
            children: purchase.supplierName
          })]
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "Estado"
          }), /* @__PURE__ */jsx(Badge, {
            variant: statusConfig[purchase.status]?.variant || "default",
            children: statusConfig[purchase.status]?.label || purchase.status
          })]
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "Fecha"
          }), /* @__PURE__ */jsx("p", {
            className: "font-medium text-foreground",
            children: new Date(purchase.date).toLocaleDateString()
          })]
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "Total"
          }), /* @__PURE__ */jsx("p", {
            className: "font-semibold text-foreground",
            children: ["$", purchase.total.toFixed(2)]
          })]
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "Pagado"
          }), /* @__PURE__ */jsx("p", {
            className: "font-medium text-foreground",
            children: ["$", purchase.paid.toFixed(2)]
          })]
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("p", {
            className: "text-xs uppercase tracking-wide text-muted-foreground",
            children: "Saldo"
          }), /* @__PURE__ */jsx("p", {
            className: "font-medium text-foreground",
            children: ["$", purchase.balance.toFixed(2)]
          })]
        })]
      }), /* @__PURE__ */jsxs("div", {
        children: [/* @__PURE__ */jsx("p", {
          className: "text-xs uppercase tracking-wide text-muted-foreground",
          children: "Productos"
        }), /* @__PURE__ */jsx("div", {
          className: "mt-3 space-y-2",
          children: purchase.items.map((item, index) => /* @__PURE__ */jsxs("div", {
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
              children: ["$", (item.unitCost * item.quantity).toFixed(2)]
            })]
          }, index))
        })]
      }), purchase.status !== "cancelled" && /* @__PURE__ */jsx("div", {
        className: "flex justify-end border-t border-border pt-4",
        children: /* @__PURE__ */jsx(Button, {
          type: "button",
          variant: "destructive",
          onClick: () => onCancel(purchase),
          children: "Cancelar compra"
        })
      })]
    })
  });
}

export { PurchaseDetailModal };
