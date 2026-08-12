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
  ShoppingBag,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

/**
 * Menú del panel administrativo como DATO, no incrustado en el Sidebar.
 * Cuando implementen roles y privilegios, aquí se filtra:
 * ej. MENU_ITEMS.filter(item => usuarioTienePrivilegio(item.path))
 */
export const MENU_ITEMS: MenuItem[] = [
  { icon: TrendingUp, label: 'Dashboard', path: '/' },
  { icon: Sparkles, label: 'Catálogo', path: '/catalogo' },
  { icon: Package, label: 'Productos', path: '/productos' },
  { icon: Tag, label: 'Categorías', path: '/categorias' },
  { icon: ShoppingCart, label: 'Ventas', path: '/ventas' },
  { icon: Users, label: 'Clientes', path: '/clientes' },
  { icon: Truck, label: 'Proveedores', path: '/proveedores' },
  { icon: ShoppingBag, label: 'Compras', path: '/compras' },
  { icon: UserCircle, label: 'Usuarios', path: '/usuarios' },
  { icon: Shield, label: 'Roles', path: '/roles' },
];
