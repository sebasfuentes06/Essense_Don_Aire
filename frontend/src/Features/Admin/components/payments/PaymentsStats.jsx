import { Clock, Wallet, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { dinero } from "../../../../shared/negocio";

function PaymentsStats({ stats, isClient }) {
  const cards = isClient
    ? [
        { label: "Saldo pendiente", value: dinero(stats.cartera), hint: `${stats.carteraVentas} compra(s) con saldo`, icon: AlertCircle, tone: stats.cartera > 0 ? "text-destructive" : "text-success" },
        { label: "Por aprobar", value: dinero(stats.porAprobarValue), hint: `${stats.porAprobarCount} pago(s) en revisión`, icon: Clock, tone: "text-primary" },
        { label: "Pagado", value: dinero(stats.pagadoTotal), hint: "Pagos aplicados", icon: CheckCircle2, tone: "text-success" }
      ]
    : [
        { label: "Por aprobar", value: String(stats.porAprobarCount), hint: dinero(stats.porAprobarValue), icon: Clock, tone: "text-primary" },
        { label: "Cartera", value: dinero(stats.cartera), hint: `${stats.carteraVentas} venta(s) · ${stats.carteraClientes} cliente(s)`, icon: AlertCircle, tone: stats.cartera > 0 ? "text-destructive" : "text-success" },
        { label: "Cobrado este mes", value: dinero(stats.cobradoMes), hint: "Pagos aplicados", icon: Wallet, tone: "text-success" },
        { label: "Rechazados", value: String(stats.rechazados), hint: "Pagos que no se aprobaron", icon: XCircle, tone: "text-muted-foreground" }
      ];

  return (
    <div className={`stats-grid grid grid-cols-1 gap-4 sm:grid-cols-2 ${isClient ? "xl:grid-cols-3" : "xl:grid-cols-4"}`}>
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

export { PaymentsStats };
