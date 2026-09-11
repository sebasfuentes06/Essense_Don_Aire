import { FileText, Wallet, AlertCircle, Receipt } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";

const money = (value) => `$${value.toFixed(2)}`;

function PaymentsStats({ stats, isClient }) {
  const cards = isClient
    ? [
        { label: "Total facturado", value: money(stats.invoiced), icon: FileText, tone: "text-primary" },
        { label: "Ya abonado", value: money(stats.collected), icon: Wallet, tone: "text-success" },
        { label: "Saldo pendiente", value: money(stats.balance), icon: AlertCircle, tone: stats.balance > 0 ? "text-destructive" : "text-success" },
        { label: "Abonos realizados", value: String(stats.paymentsCount), icon: Receipt, tone: "text-primary" }
      ]
    : [
        { label: "Facturado", value: money(stats.invoiced), icon: FileText, tone: "text-primary" },
        { label: "Cobrado", value: money(stats.collected), icon: Wallet, tone: "text-success" },
        { label: "Saldo pendiente", value: money(stats.balance), icon: AlertCircle, tone: stats.balance > 0 ? "text-destructive" : "text-success" },
        { label: "Ventas con saldo", value: String(stats.openSales), icon: Receipt, tone: "text-primary" }
      ];

  return (
    <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, tone }) => (
        <Card key={label}>
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

export { PaymentsStats };
