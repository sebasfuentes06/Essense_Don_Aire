import { ShoppingBag, DollarSign, CreditCard, Ban } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { plata } from "./formato";

/**
 * Indicadores de Compras.
 *
 * Los cuatro salen del servidor y cuentan sobre TODO lo filtrado, no sobre la
 * página que se ve. Las dos cifras de dinero excluyen las compras canceladas:
 * una orden anulada no es plata comprada ni plata debida, aunque siga
 * apareciendo en la tabla como parte del historial.
 *
 * Antes esto hacía `totalPurchased.toFixed(2)` sobre el valor crudo. Con datos
 * de la base eso revienta: PostgreSQL manda los NUMERIC como cadena, y
 * "99000.00" no tiene .toFixed().
 */
function PurchasesStats({ stats = {} }) {
  const tarjetas = [
    {
      etiqueta: "Total Órdenes",
      valor: stats.total ?? 0,
      color: "text-foreground",
      Icono: ShoppingBag,
      tono: "text-primary"
    },
    {
      etiqueta: "Total Comprado",
      valor: plata(stats.totalComprado),
      color: "text-primary",
      Icono: DollarSign,
      tono: "text-primary"
    },
    {
      etiqueta: "Saldo por Pagar",
      valor: plata(stats.saldoPendiente),
      color: Number(stats.saldoPendiente) > 0 ? "text-destructive" : "text-success",
      Icono: CreditCard,
      tono: "text-muted-foreground"
    },
    {
      etiqueta: "Órdenes por Pagar",
      valor: stats.porPagar ?? 0,
      color: "text-foreground",
      Icono: Ban,
      tono: "text-muted-foreground"
    }
  ];

  return (
    <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {tarjetas.map(({ etiqueta, valor, color, Icono, tono }) => (
        <Card key={etiqueta}>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{etiqueta}</p>
              <p className={`truncate text-2xl font-bold ${color}`}>{valor}</p>
            </div>
            <Icono className={`h-8 w-8 shrink-0 ${tono}`} />
          </div>
        </Card>
      ))}
    </div>
  );
}

export { PurchasesStats };
