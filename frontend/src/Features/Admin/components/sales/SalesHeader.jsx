import { Download, ShoppingCart } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { useAuth } from "../../../../shared/auth";

function SalesHeader({ onNewSale }) {
  const { can } = useAuth();
  const onlyOwn = can("sales.own");

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {onlyOwn ? "Mis ventas" : "Ventas"}
        </h1>
        <p className="text-muted-foreground">
          {onlyOwn
            ? "Historial de las ventas que has registrado"
            : "Historial completo de ventas y gestión"}
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline">
          <Download className="h-5 w-5" />
          Exportar Excel
        </Button>
        {can("sales.create") && (
          <Button onClick={onNewSale}>
            <ShoppingCart className="h-5 w-5" />
            Nueva Venta (POS)
          </Button>
        )}
      </div>
    </div>
  );
}

export { SalesHeader };
