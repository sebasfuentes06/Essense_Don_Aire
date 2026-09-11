import { Package, AlertCircle } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";

/**
 * Tarjetas de resumen.
 *
 * `stats` viene del servidor y cubre TODO el inventario filtrado, no solo la
 * página visible. Si no llega (por ejemplo si la API falla), se calcula sobre
 * los productos que haya en pantalla para no dejar las tarjetas vacías.
 */
function ProductStats({ products = [], lowStockCount = 0, stats }) {
  const total = stats?.total ?? products.length;
  const activos = stats?.activos ?? products.filter((p) => p.status === "active").length;
  const bajos = stats?.lowStockCount ?? lowStockCount;
  const valor = stats?.inventoryValue ?? products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const cards = [
    { label: "Total Productos", value: total, tone: "text-foreground",
      icon: <Package className="h-8 w-8 text-primary" /> },
    { label: "Activos", value: activos, tone: "text-success",
      icon: <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center"><span className="text-success">✓</span></div> },
    { label: "Stock Bajo", value: bajos, tone: "text-destructive",
      icon: <AlertCircle className="h-8 w-8 text-destructive" /> },
    { label: "Valor Total", value: `$${Number(valor).toFixed(2)}`, tone: "text-primary",
      icon: <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-primary">$</span></div> }
  ];

  return (
    <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className={`text-2xl font-bold ${card.tone}`}>{card.value}</p>
            </div>
            {card.icon}
          </div>
        </Card>
      ))}
    </div>
  );
}

export { ProductStats };
