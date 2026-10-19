import { PrintButton } from "../../../../shared/components/ui/ExportButton";
import { useSellerDashboard } from "../../hooks/dashboard";
import { DashboardBody } from "./Dashboard";

/** Dashboard del Vendedor: el mismo resumen, recortado a sus ventas por la API. */
function SellerDashboard() {
  const d = useSellerDashboard();
  const firstName = d.userName.split(" ")[0] || "vendedor";
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">Hola, {firstName}</h1>
          <p className="text-muted-foreground">Este es el resumen de tus ventas</p>
        </div>
        <PrintButton label="Exportar a PDF" />
      </div>
      <DashboardBody d={d} />
    </div>
  );
}

export { SellerDashboard };
