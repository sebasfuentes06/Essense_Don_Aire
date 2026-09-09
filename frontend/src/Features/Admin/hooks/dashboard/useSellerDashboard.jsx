import { useMemo } from "react";
import { DollarSign, ShoppingCart, Receipt, ClipboardList } from "lucide-react";
import { useAuth } from "../../../../shared/auth";
import { useOrdersStore, ORDER_STATUS } from "../../../../shared/orders";
import { mockSales } from "../sales/useSales";
import { useDashboard } from "./useDashboard";

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

/** Meta mensual de venta por vendedor. En producción vendría de la BD. */
const MONTHLY_GOAL = 400;

const currency = (value) => `$${value.toFixed(2)}`;

/**
 * Dashboard personal del Vendedor (story mapping, fila Vendedor > Dashboard):
 * KPIs propios, sus productos más vendidos, su meta y su posición en el
 * ranking. Todo se calcula sobre SUS ventas, nunca sobre las del negocio.
 */
function useSellerDashboard() {
  const { user } = useAuth();
  const { orders } = useOrdersStore();
  const { lowStockProducts } = useDashboard();

  const sellerName = user?.name ?? "";

  return useMemo(() => {
    const mySales = mockSales.filter((sale) => sale.seller === sellerName);
    const completed = mySales.filter((sale) => sale.status === "completed");

    const revenue = completed.reduce((sum, sale) => sum + sale.total, 0);
    const avgTicket = completed.length ? revenue / completed.length : 0;

    // pedidos que este vendedor debe atender (suyos o sin asignar, pendientes)
    const myPendingOrders = orders.filter(
      (order) =>
        order.status === ORDER_STATUS.PENDING &&
        (order.seller === sellerName || order.seller === null)
    );

    const stats = [
      {
        title: "Mis ventas", value: String(completed.length),
        change: `${mySales.length} registradas en total`, changeType: "positive",
        icon: ShoppingCart, iconColor: "text-primary"
      },
      {
        title: "Ingresos generados", value: currency(revenue),
        change: "Solo tus ventas completadas", changeType: "positive",
        icon: DollarSign, iconColor: "text-primary"
      },
      {
        title: "Ticket promedio", value: currency(avgTicket),
        change: "Promedio por venta tuya", changeType: "positive",
        icon: Receipt, iconColor: "text-primary"
      },
      {
        title: "Pedidos por atender", value: String(myPendingOrders.length),
        change: "Tuyos y sin asignar", changeType: myPendingOrders.length > 0 ? "negative" : "positive",
        icon: ClipboardList, iconColor: "text-muted-foreground"
      }
    ];

    // tendencia mensual de SUS ventas
    const byMonth = new Map();
    for (const sale of completed) {
      const monthIndex = Number(String(sale.date).slice(5, 7)) - 1;
      const key = MONTHS[monthIndex] ?? String(sale.date).slice(0, 7);
      const current = byMonth.get(key) ?? { month: key, ventas: 0, pedidos: 0 };
      current.ventas += sale.total;
      current.pedidos += 1;
      byMonth.set(key, current);
    }
    const salesData = [...byMonth.values()].map((row) => ({
      ...row,
      ventas: Number(row.ventas.toFixed(2))
    }));

    // sus productos más vendidos
    const byProduct = new Map();
    for (const sale of completed) {
      for (const item of sale.items) {
        const current = byProduct.get(item.productName) ?? { name: item.productName, sales: 0, amount: 0 };
        current.sales += item.quantity;
        current.amount += item.quantity * item.unitPrice;
        byProduct.set(item.productName, current);
      }
    }
    const topProducts = [...byProduct.values()]
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
      .map((product) => ({ name: product.name, sales: product.sales, revenue: currency(product.amount) }));

    /**
     * Ranking: se calcula aquí (donde sí está la lista completa) y hacia
     * afuera solo salen la posición y el total de vendedores. El Vendedor
     * ve dónde está parado, no las cifras de sus compañeros.
     */
    const revenueBySeller = new Map();
    for (const sale of mockSales) {
      if (sale.status !== "completed") continue;
      revenueBySeller.set(sale.seller, (revenueBySeller.get(sale.seller) ?? 0) + sale.total);
    }
    const ranking = [...revenueBySeller.entries()].sort((a, b) => b[1] - a[1]);
    const position = ranking.findIndex(([name]) => name === sellerName);

    return {
      sellerName,
      stats,
      salesData,
      topProducts,
      lowStockProducts,
      pendingOrdersCount: myPendingOrders.length,
      goal: {
        target: MONTHLY_GOAL,
        achieved: revenue,
        percent: Math.min(100, Math.round((revenue / MONTHLY_GOAL) * 100))
      },
      rank: position >= 0 ? position + 1 : null,
      sellersCount: ranking.length
    };
  }, [sellerName, orders, lowStockProducts]);
}

export { useSellerDashboard };
