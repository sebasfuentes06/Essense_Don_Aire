import { Receipt, CalendarDays, AlertCircle, XCircle } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { dinero } from "../../../../shared/negocio";

function SalesStats({ stats }) {
  const cards = [
    { label: "Ventas del mes", value: dinero(stats.monthTotal), hint: `${stats.monthCount} venta(s)`, icon: CalendarDays, tone: "text-primary" },
    { label: "Ventas vigentes", value: String(stats.count), hint: "Sin contar anuladas", icon: Receipt, tone: "text-foreground" },
    { label: "Por cobrar", value: dinero(stats.balance), hint: `${stats.withBalance} con saldo`, icon: AlertCircle, tone: stats.balance > 0 ? "text-destructive" : "text-success" },
    { label: "Anuladas", value: String(stats.cancelled), hint: "Devolvieron el stock", icon: XCircle, tone: "text-muted-foreground" }
  ];
  return (
    <div className="stats-grid grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, hint, icon: Icon, tone }) => (
        <Card key={label} className="p-5">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className={`text-2xl font-bold ${tone}`}>{value}</p>
              <p className="text-xs text-muted-foreground">{hint}</p>
            </div>
            <Icon className={`h-8 w-8 shrink-0 ${tone}`} />
          </div>
        </Card>
      ))}
    </div>
  );
}

export { SalesStats };
