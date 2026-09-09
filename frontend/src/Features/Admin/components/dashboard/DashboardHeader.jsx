import { PrintButton } from "../../../../shared/components/ui/ExportButton";

function DashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido a Essence Don Aire - Vista general de tu negocio
        </p>
      </div>
      <PrintButton label="Exportar a PDF" />
    </div>
  );
}

export { DashboardHeader };
