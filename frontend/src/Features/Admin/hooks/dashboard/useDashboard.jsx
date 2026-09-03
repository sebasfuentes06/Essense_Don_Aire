import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp
} from "lucide-react";
const salesData = [
  { month: "Ene", ventas: 45e3, pedidos: 120 },
  { month: "Feb", ventas: 52e3, pedidos: 145 },
  { month: "Mar", ventas: 48e3, pedidos: 130 },
  { month: "Abr", ventas: 61e3, pedidos: 168 },
  { month: "May", ventas: 55e3, pedidos: 152 },
  { month: "Jun", ventas: 67e3, pedidos: 180 }
];
const topProducts = [
  { name: "Essence Royale", sales: 245, revenue: "$12,250" },
  { name: "Noir Elegance", sales: 198, revenue: "$9,900" },
  { name: "Golden Mist", sales: 176, revenue: "$8,800" },
  { name: "Velvet Rose", sales: 154, revenue: "$7,700" },
  { name: "Ocean Breeze", sales: 132, revenue: "$6,600" }
];
const lowStockProducts = [
  { name: "Essence Royale", stock: 5, min: 20 },
  { name: "Midnight Dream", stock: 3, min: 15 },
  { name: "Summer Bloom", stock: 8, min: 25 }
];
const stats = [
  { title: "Ventas Totales", value: "$67,000", change: "+12% vs mes anterior", changeType: "positive", icon: DollarSign,
    iconColor: "text-primary"
  },
  { title: "Pedidos", value: "180", change: "+8% vs mes anterior", changeType: "positive", icon: ShoppingCart,
    iconColor: "text-primary"
  },
  { title: "Clientes Nuevos", value: "42", change: "+23% vs mes anterior", changeType: "positive", icon: Users,
    iconColor: "text-primary"
  },
  { title: "Tasa de Conversi\xF3n", value: "3.2%", change: "-0.5% vs mes anterior", changeType: "negative", icon: TrendingUp,
    iconColor: "text-muted-foreground"
  }
];
function useDashboard() {
  return {
    stats,
    salesData,
    topProducts,
    lowStockProducts
  };
}
export {
  useDashboard
};
