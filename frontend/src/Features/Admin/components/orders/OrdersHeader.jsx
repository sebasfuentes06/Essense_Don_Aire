import { Download, Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { useAuth } from "../../../../shared/auth";

function OrdersHeader({ onNewOrder, onlyOwn, isClient }) {
  const { can } = useAuth();

  const title = isClient ? "Mis pedidos" : onlyOwn ? "Pedidos asignados" : "Pedidos";
  const subtitle = isClient
    ? "Consulta el estado de los pedidos que has realizado"
    : onlyOwn
      ? "Tus pedidos y los que aún no tienen vendedor asignado"
      : "Gestiona los pedidos antes de convertirlos en venta";

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex gap-3">
        {!isClient && (
          <Button variant="outline">
            <Download className="h-5 w-5" />
            Exportar
          </Button>
        )}
        {can("orders.create") && (
          <Button onClick={onNewOrder}>
            <Plus className="h-5 w-5" />
            {isClient ? "Nuevo pedido" : "Registrar pedido"}
          </Button>
        )}
      </div>
    </div>
  );
}

export { OrdersHeader };
