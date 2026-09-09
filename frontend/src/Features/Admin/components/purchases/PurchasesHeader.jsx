import { Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { ExportButton, PrintButton } from "../../../../shared/components/ui/ExportButton";
import { useAuth } from "../../../../shared/auth";

const ESTADOS = { pending: "Pendiente", partial: "Parcial", paid: "Pagada", cancelled: "Cancelada" };

const columns = [
  { key: "folio", header: "Folio" },
  { key: "date", header: "Fecha", format: "date" },
  { key: "supplierName", header: "Proveedor" },
  { key: "subtotal", header: "Subtotal", format: "money" },
  { key: "tax", header: "Impuesto", format: "money" },
  { key: "total", header: "Total", format: "money" },
  { key: "paid", header: "Pagado", format: "money" },
  { key: "balance", header: "Saldo", format: "money" },
  { header: "Estado", value: (row) => ESTADOS[row.status] ?? row.status }
];

function PurchasesHeader({ onNewPurchase, rows = [] }) {
  const { can } = useAuth();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Compras</h1>
        <p className="text-muted-foreground">Gestión de pedidos y abonos a proveedores</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <ExportButton name="compras" rows={rows} columns={columns} />
        <PrintButton />
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
