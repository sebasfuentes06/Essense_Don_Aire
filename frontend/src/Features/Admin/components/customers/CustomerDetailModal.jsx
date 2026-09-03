import { jsx, jsxs } from "react/jsx-runtime";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Button } from "../../../../shared/components/ui/Button";
function CustomerDetailModal({
  isOpen,
  onClose,
  customerForm
}) {
  return /* @__PURE__ */jsx(Modal, {
    isOpen,
    onClose,
    children: /* @__PURE__ */jsxs("div", {
      className: "space-y-4",
      children: [/* @__PURE__ */jsxs("div", {
        children: [/* @__PURE__ */jsx("h2", {
          className: "text-lg font-semibold",
          children: customerForm.name
        }), /* @__PURE__ */jsx("p", {
          className: "text-sm text-muted-foreground",
          children: customerForm.email
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
        children: [/* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("span", {
            className: "block text-sm text-muted-foreground",
            children: "Tel\xE9fono"
          }), /* @__PURE__ */jsx("p", {
            className: "mt-1 text-foreground",
            children: customerForm.phone
          })]
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("span", {
            className: "block text-sm text-muted-foreground",
            children: "Ciudad"
          }), /* @__PURE__ */jsx("p", {
            className: "mt-1 text-foreground",
            children: customerForm.city
          })]
        }), /* @__PURE__ */jsxs("div", {
          children: [/* @__PURE__ */jsx("span", {
            className: "block text-sm text-muted-foreground",
            children: "Estado"
          }), /* @__PURE__ */jsx("p", {
            className: "mt-1 text-foreground",
            children: customerForm.status === "active" ? "Activo" : "Inactivo"
          })]
        })]
      }), /* @__PURE__ */jsx("div", {
        className: "flex justify-end gap-3 pt-2",
        children: /* @__PURE__ */jsx(Button, {
          onClick: onClose,
          children: "Cerrar"
        })
      })]
    })
  });
}
export { CustomerDetailModal };