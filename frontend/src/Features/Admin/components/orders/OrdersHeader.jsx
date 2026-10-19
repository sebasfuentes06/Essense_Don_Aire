import { useNavigate } from "react-router";
import { Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { ExportButton, PrintButton } from "../../../../shared/components/ui/ExportButton";
import { useAuth } from "../../../../shared/auth";
import { STATUS_LABELS, CHANNEL_LABELS } from "../../../../shared/orders";

const columns = [
  { key: "folio", header: "Código" },
  { key: "date", header: "Fecha", format: "date" },
  { key: "customer", header: "Cliente" },
  { header: "Canal", value: (row) => CHANNEL_LABELS[row.channel] ?? row.channel },
  { header: "Unidades", value: (row) => row.units, format: "number" },
  { header: "Forma de pago", value: (row) => row.paymentMethod ?? "" },
  { key: "total", header: "Total", format: "money" },
  { header: "Estado", value: (row) => STATUS_LABELS[row.status] ?? row.status },
  { header: "Factura", value: (row) => row.invoice ?? "" }
];

function OrdersHeader({ onNewOrder, isClient, rows = [] }) {
  const navigate = useNavigate();
  const { can } = useAuth();

  const title = isClient ? "Mis pedidos" : "Pedidos";
  const subtitle = isClient
    ? "Consulta el estado de tus pedidos y adjunta tus comprobantes"
    : "Pedidos de WhatsApp, del local y de la app: revísalos y conviértelos en venta";

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
          <Button onClick={isClient ? () => navigate("/panel/catalogo") : onNewOrder}>
            <Plus className="h-5 w-5" />
            {isClient ? "Nuevo pedido (ir al catálogo)" : "Registrar pedido"}
          </Button>
        )}
      </div>
    </div>
  );
}

export { OrdersHeader };
