import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { useDashboard } from "../../hooks/dashboard";
import {
  DashboardHeader,
  DashboardStats,
  DashboardAlerts,
  SalesTrendChart,
  OrdersChart,
  TopProductsList,
  LowStockAlert
} from "../../components/dashboard";

function DashboardBody({ d }) {
  if (d.error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-destructive">{d.error}</p>
        <Button variant="outline" onClick={d.reload}>
          <RefreshCw /> Reintentar
        </Button>
      </div>
    );
  }
  return (
    <>
      {d.isLoading && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Actualizando…
        </p>
      )}
      <DashboardStats stats={d.stats} />
      <DashboardAlerts {...d} pendingSignups={d.isSeller ? 0 : d.pendingSignups} pendingPayments={d.isSeller ? 0 : d.pendingPayments} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SalesTrendChart data={d.salesData} />
        <OrdersChart data={d.salesData} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopProductsList products={d.topProducts} />
        <LowStockAlert products={d.lowStockProducts} />
      </div>
    </>
  );
}

function Dashboard() {
  const d = useDashboard();
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <DashboardBody d={d} />
    </div>
  );
}

export { Dashboard, DashboardBody };
