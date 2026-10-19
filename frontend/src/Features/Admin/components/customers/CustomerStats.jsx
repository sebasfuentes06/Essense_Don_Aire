import { Users, UserCheck, AlertCircle, Wallet } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { dinero } from "../../../../shared/negocio";

function CustomerStats({ stats }) {
  const cards = [
    { label: "Total clientes", value: stats.total, icon: Users, tone: "text-primary" },
    { label: "Activos", value: stats.active, icon: UserCheck, tone: "text-success" },
    { label: "Con saldo pendiente", value: stats.withDebt, icon: AlertCircle, tone: stats.withDebt ? "text-destructive" : "text-success" },
    { label: "Cartera total", value: dinero(stats.debt), icon: Wallet, tone: stats.debt > 0 ? "text-destructive" : "text-success" }
  ];
  return (
    <div className="stats-grid grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, tone }) => (
        <Card key={label} className="p-5">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className={`text-2xl font-bold ${tone}`}>{value}</p>
            </div>
            <Icon className={`h-8 w-8 shrink-0 ${tone}`} />
          </div>
        </Card>
      ))}
    </div>
  );
}

export { CustomerStats };
