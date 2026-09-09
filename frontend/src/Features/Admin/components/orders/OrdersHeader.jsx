import { Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { ExportButton, PrintButton } from "../../../../shared/components/ui/ExportButton";
import { useAuth } from "../../../../shared/auth";
import { STATUS_LABELS, CHANNEL_LABELS } from "../../../../shared/orders";

const columns = [
  { key: "folio", header: "Folio" },
  { key: "date", header: "Fecha", format: "date" },
  { key: "customer", header: "Cliente" },
  { header: "Vendedor", value: (row) => row.seller ?? "Sin asignar" },
  { header: "Canal", value: (row) => CHANNEL_LABELS[row.channel] ?? row.channel },
  { header: "Productos", value: (row) => row.items.reduce((sum, item) => sum + item.quantity, 0), format: "number" },
  { key: "total", header: "Total", format: "money" },
  { header: "Estado", value: (row) => STATUS_LABELS[row.status] ?? row.status },
  { header: "Convertido en venta", value: (row) => (row.saleId ? "Sí" : "No") },
  { key: "deliveryDate", header: "Entrega estimada", format: "date" }
];

function OrdersHeader({ onNewOrder, onlyOwn, isClient, rows = [] }) {
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
      <div className="flex flex-wrap gap-3">
        <ExportButton name="pedidos" rows={rows} columns={columns} />
        <PrintButton />
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
