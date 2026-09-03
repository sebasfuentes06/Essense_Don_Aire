import { useState } from "react";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";

const salesByMonth = [
  { month: "Ene", ventas: 45000, productos: 120, clientes: 35 },
  { month: "Feb", ventas: 52000, productos: 145, clientes: 42 },
  { month: "Mar", ventas: 48000, productos: 130, clientes: 38 },
  { month: "Abr", ventas: 61000, productos: 168, clientes: 48 },
  { month: "May", ventas: 55000, productos: 152, clientes: 45 },
  { month: "Jun", ventas: 67000, productos: 180, clientes: 52 },
];

const salesByCategory = [
  { name: "Exclusivos", value: 35, amount: 23450 },
  { name: "Hombre", value: 28, amount: 18760 },
  { name: "Mujer", value: 32, amount: 21440 },
  { name: "Unisex", value: 15, amount: 10050 },
];

const topSellers = [
  { name: "Carlos Vendedor", sales: 45, total: 33750 },
  { name: "María Vendedora", sales: 38, total: 28500 },
  { name: "Juan Pérez", sales: 32, total: 24000 },
  { name: "Ana García", sales: 28, total: 21000 },
];

const COLORS = ["#C9A227", "#8B7355", "#D4AF37", "#A88620"];

const periodOptions = [
  { value: "week", label: "Última Semana" },
  { value: "month", label: "Último Mes" },
  { value: "quarter", label: "Último Trimestre" },
  { value: "year", label: "Último Año" },
];

const summaryCards = [
  { icon: DollarSign, title: "Ventas Totales", value: "$328,000", change: "+12%" },
  { icon: ShoppingCart, title: "Pedidos", value: "895", change: "+8%" },
  { icon: Users, title: "Clientes Nuevos", value: "260", change: "+23%" },
  { icon: TrendingUp, title: "Ticket Promedio", value: "$366", change: "+15%" },
];

function useReports() {
  const [period, setPeriod] = useState("month");

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  return {
    period,
    handlePeriodChange,
    periodOptions,
    summaryCards,
    salesByMonth,
    salesByCategory,
    topSellers,
    COLORS,
  };
}

export { useReports };
