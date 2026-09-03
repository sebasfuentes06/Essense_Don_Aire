import { jsx, jsxs } from "react/jsx-runtime";
import { Edit, Eye, Trash2, Mail, Phone, Calendar } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../shared/components/ui/Table";
import { Badge } from "../../../../shared/components/ui/Badge";
import { Switch } from "../../../../shared/components/ui/switch";
import { Pagination } from "../../../../shared/components/ui/Pagination";
function UserTable({
  users,
  totalPages,
  currentPage,
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
            children: "Nombre"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Email"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Tel\xE9fono"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Rol"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "\xDAltimo Acceso"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Ingreso"
          }), /* @__PURE__ */jsx(TableHead, {
            children: "Estado"
          }), /* @__PURE__ */jsx(TableHead, {
            className: "w-[1%] text-right",
            children: "Acciones"
          })]
        })
      }), /* @__PURE__ */jsx(TableBody, {
        children: users.map(user => /* @__PURE__ */jsxs(TableRow, {
          children: [/* @__PURE__ */jsx(TableCell, {
            children: /* @__PURE__ */jsxs("div", {
              className: "flex items-center gap-3",
              children: [/* @__PURE__ */jsx("div", {
                className: "h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center",
                children: /* @__PURE__ */jsx("span", {
                  className: "text-sm font-bold text-primary",
                  children: user.name[0]
                })
              }), /* @__PURE__ */jsxs("div", {
                children: [/* @__PURE__ */jsx("p", {
                  className: "font-semibold text-foreground",
                  children: user.name
                }), /* @__PURE__ */jsxs("p", {
                  className: "text-xs text-muted-foreground",
                  children: ["ID: ", user.id]
                })]
              })]
            })
          }), /* @__PURE__ */jsxs(TableCell, {
            className: "whitespace-nowrap",
            children: [/* @__PURE__ */jsx(Mail, {
              className: "mr-2 inline-block h-4 w-4 align-middle text-muted-foreground"
            }), user.email]
          }), /* @__PURE__ */jsxs(TableCell, {
            className: "whitespace-nowrap",
            children: [/* @__PURE__ */jsx(Phone, {
              className: "mr-2 inline-block h-4 w-4 align-middle text-muted-foreground"
            }), user.phone]
          }), /* @__PURE__ */jsx(TableCell, {
            children: /* @__PURE__ */jsx(Badge, {
              variant: user.role === "Administrador" ? "danger" : "default",
              children: user.role
            })
          }), /* @__PURE__ */jsx(TableCell, {
            children: new Date(user.lastLogin).toLocaleDateString()
          }), /* @__PURE__ */jsxs(TableCell, {
            className: "whitespace-nowrap",
            children: [/* @__PURE__ */jsx(Calendar, {
              className: "mr-2 inline-block h-4 w-4 align-middle text-muted-foreground"
            }), new Date(user.joinDate).toLocaleDateString()]
          }), /* @__PURE__ */jsx(TableCell, {
            children: /* @__PURE__ */jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */jsx(Switch, {
                checked: user.status === "active",
                onCheckedChange: () => onToggleStatus(user),
                "aria-label": `${user.status === "active" ? "Desactivar" : "Activar"} ${user.name}`
              }), /* @__PURE__ */jsx("span", {
                className: user.status === "active" ? "text-sm font-medium text-success" : "text-sm font-medium text-muted-foreground",
                children: user.status === "active" ? "Activo" : "Inactivo"
              })]
            })
          }), /* @__PURE__ */jsx(TableCell, {
            className: "w-[1%] whitespace-nowrap",
            children: /* @__PURE__ */jsxs("div", {
              className: "flex items-center justify-end gap-2",
              children: [/* @__PURE__ */jsx("button", {
                className: "h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center",
                onClick: () => onShowDetail(user),
                title: "Ver detalles",
                "aria-label": `Ver detalles de ${user.name}`,
                children: /* @__PURE__ */jsx(Eye, {
                  className: "h-4 w-4 text-muted-foreground"
                })
              }), /* @__PURE__ */jsx("button", {
                className: "h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center",
                onClick: () => onEdit(user),
                children: /* @__PURE__ */jsx(Edit, {
                  className: "h-4 w-4 text-primary"
                })
              }), /* @__PURE__ */jsx("button", {
                className: "h-8 w-8 rounded-lg hover:bg-destructive/10 transition-colors flex items-center justify-center",
                onClick: () => onDelete(user),
                children: /* @__PURE__ */jsx(Trash2, {
                  className: "h-4 w-4 text-destructive"
                })
              })]
            })
          })]
        }, user.id))
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
export { UserTable };