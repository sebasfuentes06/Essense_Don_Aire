import { jsx, jsxs } from "react/jsx-runtime";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../../../../shared/components/ui/Button";
import { Modal } from "../../../../shared/components/ui/Modal";

function CartModal({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return /* @__PURE__ */jsx(Modal, {
    isOpen,
    onClose,
    size: "lg",
    title: "Carrito de compras",
    children: items.length === 0 ? /* @__PURE__ */jsx("div", {
      className: "py-10 text-center text-muted-foreground",
      children: "Aún no has agregado fragancias al carrito."
    }) : /* @__PURE__ */jsxs("div", {
      className: "space-y-4",
      children: [/* @__PURE__ */jsx("div", {
        className: "space-y-3",
        children: items.map(item => /* @__PURE__ */jsxs("div", {
          className: "flex items-center gap-3 rounded-xl border border-border p-3",
          children: [/* @__PURE__ */jsx("img", {
            src: item.image,
            alt: item.name,
            className: "h-16 w-14 rounded-lg object-cover"
          }), /* @__PURE__ */jsxs("div", {
            className: "min-w-0 flex-1",
            children: [/* @__PURE__ */jsx("p", {
              className: "truncate font-medium text-foreground",
              children: item.name
            }), /* @__PURE__ */jsxs("p", {
              className: "text-sm text-primary",
              children: ["$", item.price.toFixed(2)]
            })]
          }), /* @__PURE__ */jsxs("div", {
            className: "flex items-center gap-2",
            children: [/* @__PURE__ */jsx("button", {
              type: "button",
              className: "flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-muted",
              onClick: () => onUpdateQuantity(item.id, item.quantity - 1),
              "aria-label": `Restar una unidad de ${item.name}`,
              children: /* @__PURE__ */jsx(Minus, { className: "h-4 w-4" })
            }), /* @__PURE__ */jsx("span", {
              className: "w-5 text-center text-sm font-medium",
              children: item.quantity
            }), /* @__PURE__ */jsx("button", {
              type: "button",
              className: "flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-muted",
              onClick: () => onUpdateQuantity(item.id, item.quantity + 1),
              "aria-label": `Sumar una unidad de ${item.name}`,
              children: /* @__PURE__ */jsx(Plus, { className: "h-4 w-4" })
            })]
          }), /* @__PURE__ */jsx("button", {
            type: "button",
            className: "flex h-8 w-8 items-center justify-center rounded-md text-destructive hover:bg-destructive/10",
            onClick: () => onRemoveItem(item.id),
            "aria-label": `Quitar ${item.name} del carrito`,
            children: /* @__PURE__ */jsx(Trash2, { className: "h-4 w-4" })
          })]
        }, item.id))
      }), /* @__PURE__ */jsxs("div", {
        className: "flex items-center justify-between border-t border-border pt-4",
        children: [/* @__PURE__ */jsx("span", {
          className: "text-lg font-semibold text-foreground",
          children: "Total"
        }), /* @__PURE__ */jsxs("span", {
          className: "text-xl font-bold text-primary",
          children: ["$", total.toFixed(2)]
        })]
      }), /* @__PURE__ */jsx("div", {
        className: "flex justify-end border-t border-border pt-4",
        children: /* @__PURE__ */jsx(Button, {
          type: "button",
          onClick: onClose,
          children: "Continuar comprando"
        })
      })]
    })
  });
}

export { CartModal };
