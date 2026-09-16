import { Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { ExportButton, PrintButton } from "../../../../shared/components/ui/ExportButton";
import { useAuth } from "../../../../shared/auth";

/**
 * Encabezado de Compras.
 *
 * Las columnas del CSV aplanan lo que en la API viene anidado: `items` y
 * `payments` son arreglos, y una celda de hoja de cálculo no puede llevar un
 * arreglo. Se resumen en un conteo, que es lo que sirve para revisar el
 * archivo en Excel; el detalle completo está en la ficha de cada compra.
 */
const purchaseColumns = [
  { key: "folio", header: "Folio" },
  { key: "date", header: "Fecha", format: "date" },
  { key: "supplierName", header: "Proveedor" },
  { header: "Líneas", value: (row) => (row.items ?? []).length, format: "number" },
  {
    header: "Unidades",
    value: (row) => (row.items ?? []).reduce((s, i) => s + Number(i.quantity ?? 0), 0),
    format: "number"
  },
  { key: "subtotal", header: "Subtotal", format: "money" },
  { key: "tax", header: "Impuesto", format: "money" },
  { key: "total", header: "Total", format: "money" },
  { key: "paid", header: "Pagado", format: "money" },
  { key: "balance", header: "Saldo", format: "money" },
  { header: "Abonos", value: (row) => (row.payments ?? []).length, format: "number" },
  {
    header: "Estado",
    value: (row) =>
      ({ pending: "Pendiente", partial: "Parcial", paid: "Pagada", cancelled: "Cancelada" })[row.status] ??
      row.status
  }
];

function PurchasesHeader({ onNewPurchase, rows = [] }) {
  const { can } = useAuth();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="mb-2 text-4xl font-bold text-foreground">Compras</h1>
        <p className="text-muted-foreground">
          Órdenes de compra a proveedores, entrada de mercancía y abonos
        </p>
      </div>

      <div className="flex gap-3">
        <ExportButton name="compras" rows={rows} columns={purchaseColumns} />
        <PrintButton />
        {can("purchases.create") && (
          <Button onClick={onNewPurchase}>
            <Plus className="h-5 w-5" />
            Nueva Compra
          </Button>
        )}
      </div>
    </div>
  );
}

export { PurchasesHeader, purchaseColumns };
