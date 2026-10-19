import { RefreshCw } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { ExportButton, PrintButton } from "../../../../shared/components/ui/ExportButton";
import { NOMBRES_METODO, NOMBRES_ESTADO_PAGO } from "../../../../shared/negocio";

const columns = [
  { key: "date", header: "Fecha", format: "date" },
  { key: "invoice", header: "Factura" },
  { key: "customer", header: "Cliente" },
  { key: "amount", header: "Monto", format: "money" },
  { header: "Método", value: (row) => NOMBRES_METODO[row.method] ?? row.method },
  { header: "Estado", value: (row) => NOMBRES_ESTADO_PAGO[row.status] ?? row.status },
  { key: "reference", header: "Referencia" }
];

function PaymentsHeader({ isClient, rows = [], onRefresh, isLoading }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="mb-2 text-4xl font-bold text-foreground">{isClient ? "Mis pagos" : "Pagos y cartera"}</h1>
        <p className="text-muted-foreground">
          {isClient
            ? "Paga el saldo de tus compras con Wompi o reporta tu transferencia"
            : "Aprueba los pagos que reportan los clientes, registra abonos y revisa la cartera"}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={isLoading ? "animate-spin" : ""} /> Actualizar
        </Button>
        <ExportButton name={isClient ? "mis_pagos" : "pagos"} rows={rows} columns={columns} />
        <PrintButton />
      </div>
    </div>
  );
}

export { PaymentsHeader };
