import { Download, Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { useAuth } from "../../../../shared/auth";

function PurchasesHeader({ onNewPurchase }) {
  const { can } = useAuth();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Compras</h1>
        <p className="text-muted-foreground">Gestión de pedidos y abonos a proveedores</p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline">
          <Download className="h-5 w-5" />
          Exportar
        </Button>
        {can("purchases.create") && (
          <Button onClick={onNewPurchase}>
            <Plus className="h-5 w-5" />
            Nueva Orden de Compra
          </Button>
        )}
      </div>
    </div>
  );
}

export { PurchasesHeader };
