import { ShoppingCart } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { ExportButton, PrintButton } from "../../../../shared/components/ui/ExportButton";
import { useAuth } from "../../../../shared/auth";

const ESTADOS = { completed: "Completada", pending: "Pendiente", cancelled: "Anulada" };
const PAGOS = { cash: "Efectivo", card: "Tarjeta", transfer: "Transferencia", mixed: "Mixto" };

const columns = [
  { key: "folio", header: "Folio" },
  { key: "date", header: "Fecha", format: "date" },
  { key: "customer", header: "Cliente" },
  { key: "seller", header: "Vendedor" },
  { header: "Productos", value: (row) => row.items.reduce((sum, item) => sum + item.quantity, 0), format: "number" },
  { key: "subtotal", header: "Subtotal", format: "money" },
  { key: "discount", header: "Descuento", format: "money" },
  { key: "total", header: "Total", format: "money" },
  { header: "Método de pago", value: (row) => PAGOS[row.paymentMethod] ?? row.paymentMethod },
  { header: "Estado", value: (row) => ESTADOS[row.status] ?? row.status }
];

function SalesHeader({ onNewSale, rows = [] }) {
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
      <div className="flex flex-wrap gap-3">
        <ExportButton name={onlyOwn ? "mis_ventas" : "ventas"} rows={rows} columns={columns} />
        <PrintButton />
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
