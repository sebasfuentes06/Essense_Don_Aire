import { ClipboardList, Clock, CheckCircle2, DollarSign } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";

function OrdersStats({ stats }) {
  const cards = [
    { label: "Pedidos", value: stats.totalOrders, icon: ClipboardList },
    { label: "Pendientes", value: stats.pendingCount, icon: Clock },
    { label: "Confirmados", value: stats.confirmedCount, icon: CheckCircle2 },
    { label: "Valor pendiente", value: `$${stats.pendingValue.toFixed(2)}`, icon: DollarSign }
  ];

  return (
    <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon }) => (
        <Card key={label}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold text-foreground">{value}</p>
            </div>
            <Icon className="h-8 w-8 text-primary" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export { OrdersStats };
