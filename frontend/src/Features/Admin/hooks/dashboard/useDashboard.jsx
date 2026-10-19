import { useCallback, useEffect, useState } from "react";
import { DollarSign, ShoppingCart, Wallet, ClipboardList } from "lucide-react";
import { useAuth } from "../../../../shared/auth";
import { api } from "../../../../shared/api";
import { ventas, cargarProductos, dinero, num, fechaApi } from "../../../../shared/negocio";

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

/**
 * Dashboard con los números reales de la API (/dashboard/resumen), los mismos
 * de la pantalla de inicio de la app móvil. El Administrador ve el negocio;
 * el Vendedor, solo sus ventas (la API ya recorta el alcance).
 */
function useDashboard() {
  const { user } = useAuth();
  const isSeller = user?.role === "Vendedor";
  const [data, setData] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [lowStockProducts, setLowStock] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const inicio = new Date();
      inicio.setDate(1);
      inicio.setMonth(inicio.getMonth() - 5);
      const [resumen, lista, productos] = await Promise.all([
        api.datos("/dashboard/resumen"),
        ventas.listar({ estado: "confirmada", desde: fechaApi(inicio) }).catch(() => []),
        cargarProductos().catch(() => [])
      ]);
      setData(resumen);

      // Tendencia de los últimos 6 meses (el Vendedor, solo las suyas).
      const meses = [];
      for (let i = 0; i < 6; i++) {
        const d = new Date(inicio.getFullYear(), inicio.getMonth() + i, 1);
        meses.push({ key: `${d.getFullYear()}-${d.getMonth()}`, month: MONTHS[d.getMonth()], ventas: 0, pedidos: 0 });
      }
      const propias = isSeller ? lista.filter((v) => v.seller === user?.name) : lista;
      for (const v of propias) {
        const d = new Date(v.date);
        const m = meses.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
        if (m) {
          m.ventas += v.total;
          m.pedidos += 1;
        }
      }
      setSalesData(meses.map(({ key, ...r }) => r));

      setLowStock(
        productos
          .filter((p) => p.active && p.stock <= p.minStock)
          .sort((a, b) => a.stock - b.stock)
          .slice(0, 6)
          .map((p) => ({ name: p.name, stock: p.stock, min: p.minStock }))
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [isSeller, user?.name]);

  useEffect(() => {
    reload();
  }, [reload]);

  const d = data ?? {};
  const stats = [
    {
      title: isSeller ? "Mis ventas de hoy" : "Ventas de hoy",
      value: dinero(d.ventas_hoy),
      change: `${d.cantidad_hoy ?? 0} venta(s)`,
      changeType: "neutral",
      icon: DollarSign,
      iconColor: "text-primary"
    },
    {
      title: isSeller ? "Mis ventas del mes" : "Ventas del mes",
      value: dinero(d.ventas_mes),
      change: `${d.cantidad_mes ?? 0} venta(s)`,
      changeType: "neutral",
      icon: ShoppingCart,
      iconColor: "text-primary"
    },
    {
      title: isSeller ? "Mi cartera" : "Por cobrar",
      value: dinero(d.cartera),
      change: `${d.ventas_con_saldo ?? 0} venta(s) con saldo`,
      changeType: num(d.cartera) > 0 ? "negative" : "positive",
      icon: Wallet,
      iconColor: "text-primary"
    },
    {
      title: "Pedidos pendientes",
      value: String(d.pedidos_pendientes ?? 0),
      change: d.pedidos_pendientes ? "Por atender" : "Al día",
      changeType: d.pedidos_pendientes ? "negative" : "positive",
      icon: ClipboardList,
      iconColor: "text-muted-foreground"
    }
  ];

  const topProducts = (d.mas_vendidos ?? []).map((p) => ({ name: p.nombre, sales: p.unidades, revenue: "este mes" }));

  return {
    isLoading,
    error,
    reload,
    isSeller,
    userName: user?.name ?? "",
    stats,
    salesData,
    topProducts,
    lowStockProducts,
    pendingOrders: Number(d.pedidos_pendientes ?? 0),
    pendingPayments: Number(d.pagos_por_aprobar ?? 0),
    pendingPaymentsValue: num(d.monto_por_aprobar),
    pendingSignups: Number(d.solicitudes_pendientes ?? 0),
    lowStockCount: Number(d.stock_bajo ?? 0)
  };
}

export { useDashboard };
