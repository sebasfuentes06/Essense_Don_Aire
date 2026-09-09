import { useNavigate } from "react-router";
import { ArrowRight, ClipboardList } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { useSellerDashboard } from "../../hooks/dashboard";
import {
  DashboardStats,
  SalesTrendChart,
  TopProductsList,
  LowStockAlert,
  SellerGoalCard
} from "../../components/dashboard";

/**
 * Dashboard del Vendedor. Todo lo que se muestra sale de SUS ventas y de los
 * pedidos que le corresponden: nunca de la facturación global del negocio.
 */
function SellerDashboard() {
  const {
    sellerName,
    stats,
    salesData,
    topProducts,
    lowStockProducts,
    pendingOrdersCount,
    goal,
    rank,
    sellersCount
  } = useSellerDashboard();

  const navigate = useNavigate();
  const firstName = sellerName.split(" ")[0] || "vendedor";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Hola, {firstName}</h1>
        <p className="text-muted-foreground">Este es el resumen de tu propia gestión</p>
      </div>

      <DashboardStats stats={stats} />

      {pendingOrdersCount > 0 && (
        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Tienes {pendingOrdersCount} {pendingOrdersCount === 1 ? "pedido pendiente" : "pedidos pendientes"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Confírmalos o conviértelos en venta desde el módulo Pedidos
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/panel/pedidos")}
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-primary text-primary-foreground font-semibold transition-all hover:opacity-90"
            >
              Ver pedidos
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SalesTrendChart data={salesData} />
        <SellerGoalCard goal={goal} rank={rank} sellersCount={sellersCount} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopProductsList products={topProducts} />
        <LowStockAlert products={lowStockProducts} />
      </div>
    </div>
  );
}

export { SellerDashboard };
