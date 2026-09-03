import {
  Users,
  Package,
  ShoppingCart,
  Sparkles,
  UserCircle,
  TrendingUp,
  Tag,
  Truck,
  Shield,
  ShoppingBag
} from "lucide-react";

const MENU_ITEMS = [
  { icon: TrendingUp, label: "Dashboard", path: "/" },
  { icon: Sparkles, label: "Cat\xE1logo", path: "/catalogo" },
  { icon: Package, label: "Productos", path: "/productos" },
  { icon: Tag, label: "Categor\xEDas", path: "/categorias" },
  { icon: ShoppingCart, label: "Ventas", path: "/ventas" },
  { icon: Users, label: "Clientes", path: "/clientes" },
  { icon: Truck, label: "Proveedores", path: "/proveedores" },
  { icon: ShoppingBag, label: "Compras", path: "/compras" },
  { icon: UserCircle, label: "Usuarios", path: "/usuarios" },
  { icon: Shield, label: "Roles", path: "/roles" }
];

export { MENU_ITEMS };
