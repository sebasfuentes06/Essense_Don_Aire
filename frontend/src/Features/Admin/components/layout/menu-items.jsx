import {
  Users,
  Package,
  ShoppingCart,
  UserCircle,
  TrendingUp,
  Tag,
  Truck,
  Shield,
  ShoppingBag,
  LayoutGrid,
  FileBarChart,
  Home
} from "lucide-react";
import { ROLES, roleCan } from "../../../../shared/auth/roles";

/**
 * Menu completo del panel.
 *
 * Cada item declara el permiso que lo habilita. `getMenuGroups(role)` filtra
 * el menu segun los permisos del rol, asi que el Sidebar no sabe nada de roles:
 * solo pinta lo que le llega. Agregar un modulo nuevo = agregar un item aqui.
 */
const MENU_GROUPS_DEF = [
  {
    id: "principal",
    label: "PRINCIPAL",
    items: [
      {
        icon: TrendingUp,
        label: "Dashboard",
        path: "/panel",
        permission: "dashboard.view",
        labelByRole: { [ROLES.CLIENT]: "Inicio", [ROLES.SELLER]: "Mi dashboard" },
        iconByRole: { [ROLES.CLIENT]: Home }
      }
    ]
  },
  {
    id: "catalogo",
    label: "CATÁLOGO",
    items: [
      { icon: LayoutGrid, label: "Catálogo", path: "/panel/catalogo", permission: "catalog.view" },
      { icon: Package, label: "Productos", path: "/panel/productos", permission: "products.view" },
      { icon: Tag, label: "Categorías", path: "/panel/categorias", permission: "categories.view" }
    ]
  },
  {
    id: "operaciones",
    label: "OPERACIONES",
    items: [
      {
        icon: ShoppingCart,
        label: "Ventas",
        path: "/panel/ventas",
        permission: "sales.view",
        labelByRole: { [ROLES.SELLER]: "Mis ventas" }
      },
      { icon: ShoppingBag, label: "Compras", path: "/panel/compras", permission: "purchases.view" }
    ]
  },
  {
    id: "gestion",
    label: "GESTIÓN",
    items: [
      { icon: Users, label: "Clientes", path: "/panel/clientes", permission: "customers.view" },
      { icon: Truck, label: "Proveedores", path: "/panel/proveedores", permission: "suppliers.view" }
    ]
  },
  {
    id: "administracion",
    label: "ADMINISTRACIÓN",
    items: [
      { icon: UserCircle, label: "Usuarios", path: "/panel/usuarios", permission: "users.view" },
      { icon: Shield, label: "Roles", path: "/panel/roles", permission: "roles.view" },
      { icon: FileBarChart, label: "Reportes", path: "/panel/reportes", permission: "reports.view" }
    ]
  },
  {
    id: "cuenta",
    label: "MI CUENTA",
    items: [
      { icon: UserCircle, label: "Mi perfil", path: "/panel/mi-perfil", permission: "profile.view" }
    ]
  }
];

/** Aplica las variantes de label/icono que dependen del rol. */
function resolveItem(item, role) {
  return {
    ...item,
    label: item.labelByRole?.[role] ?? item.label,
    icon: item.iconByRole?.[role] ?? item.icon
  };
}

/** Grupos del menu visibles para un rol (los grupos vacios se descartan). */
function getMenuGroups(role) {
  if (!role) return [];
  return MENU_GROUPS_DEF
    .map((group) => ({
      ...group,
      items: group.items
        .filter((item) => !item.permission || roleCan(role, item.permission))
        .map((item) => resolveItem(item, role))
    }))
    .filter((group) => group.items.length > 0);
}

/** Lista plana de items visibles (la usa el Breadcrumb). */
function getMenuItems(role) {
  return getMenuGroups(role).flatMap((group) => group.items);
}

export { MENU_GROUPS_DEF, getMenuGroups, getMenuItems };
