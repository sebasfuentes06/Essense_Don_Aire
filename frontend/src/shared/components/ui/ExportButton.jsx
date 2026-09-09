import { Download, Printer } from "lucide-react";
import { Button } from "./button";
import { useAuth } from "../../auth";
import { downloadCsv } from "../../utils/exportData";

/**
 * Botón de exportación a CSV.
 *
 * Exporta EXACTAMENTE las filas que recibe, así que si la pantalla está
 * filtrada se exporta lo filtrado ("Exportar clientes filtrados" del story
 * mapping). Se oculta solo para quien no tiene el permiso data.export.
 */
function ExportButton({ name, rows = [], columns, label = "Exportar" }) {
  const { can } = useAuth();

  if (!can("data.export")) return null;

  const isEmpty = rows.length === 0;

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isEmpty}
      onClick={() => downloadCsv(name, rows, columns)}
      title={isEmpty ? "No hay filas para exportar" : `Descargar ${rows.length} registros en CSV`}
    >
      <Download className="h-5 w-5" />
      {label}
      {!isEmpty && <span className="text-xs opacity-70">({rows.length})</span>}
    </Button>
  );
}

/**
 * Imprime la pantalla actual. El navegador ofrece "Guardar como PDF", que es
 * la vía sin dependencias para el "Exportar a PDF" del story mapping.
 * Las hojas de estilo de impresión (globals.css) esconden menú, cabecera,
 * filtros y botones para que salga solo el contenido.
 */
function PrintButton({ label = "PDF" }) {
  const { can } = useAuth();

  if (!can("data.export")) return null;

  return (
    <Button type="button" variant="outline" onClick={() => window.print()} title="Imprimir o guardar como PDF">
      <Printer className="h-5 w-5" />
      {label}
    </Button>
  );
}

export { ExportButton, PrintButton };
