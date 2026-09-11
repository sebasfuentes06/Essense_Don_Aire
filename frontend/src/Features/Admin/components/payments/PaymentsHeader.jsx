import { Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { ExportButton, PrintButton } from "../../../../shared/components/ui/ExportButton";
import { useAuth } from "../../../../shared/auth";
import { METHOD_LABELS } from "../../../../shared/payments";

const columns = [
  { key: "folio", header: "Abono" },
  { key: "date", header: "Fecha", format: "date" },
  { key: "saleFolio", header: "Venta" },
  { key: "customer", header: "Cliente" },
  { key: "seller", header: "Vendedor" },
  { key: "amount", header: "Monto", format: "money" },
  { header: "Método", value: (row) => METHOD_LABELS[row.method] ?? row.method },
  { key: "reference", header: "Referencia" }
];

function PaymentsHeader({ onNewPayment, rows = [], onlyOwn, isClient }) {
  const { can } = useAuth();

  const title = isClient ? "Mi estado de cuenta" : onlyOwn ? "Pagos de mis ventas" : "Pagos y abonos";
  const subtitle = isClient
    ? "Consulta tus abonos y el saldo que tienes pendiente"
    : onlyOwn
      ? "Registra abonos y revisa el saldo de tus clientes"
      : "Control de cobros, abonos y saldos por cliente";

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <ExportButton name={isClient ? "mis_abonos" : "pagos"} rows={rows} columns={columns} />
        <PrintButton />
        {/* El boton nunca se deshabilita: si no hay ventas con saldo, el modal
            lo explica. Un boton gris sin motivo se lee como un boton roto. */}
        {can("payments.create") && (
          <Button onClick={() => onNewPayment()}>
            <Plus className="h-5 w-5" />
            Registrar abono
          </Button>
        )}
      </div>
    </div>
  );
}

export { PaymentsHeader };
