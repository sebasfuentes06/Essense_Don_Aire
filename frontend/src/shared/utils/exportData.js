/**
 * Exportación de listados a CSV.
 *
 * Decisiones pensadas para Excel en español (es-CO):
 *  - separador de columnas ";"  (Excel en español no parte por comas)
 *  - separador decimal ","      (coherente con lo anterior)
 *  - BOM UTF-8 al inicio        (si no, Excel muestra "Categorías" como "CategorÃ­as")
 *
 * Cada columna se declara como { key, header, format }, donde format es
 * "text" (por defecto), "number", "money" o "date".
 */

const SEPARATOR = ";";
const BOM = "﻿";

/** Convierte un valor al texto que va dentro de la celda. */
function formatValue(value, format) {
  if (value === null || value === undefined) return "";

  switch (format) {
    case "money":
      return Number(value).toFixed(2).replace(".", ",");
    case "number":
      return String(value).replace(".", ",");
    case "date":
      return String(value);
    default:
      return String(value);
  }
}

/** Escapa una celda según el estándar CSV (comillas dobles duplicadas). */
function escapeCell(text) {
  const needsQuotes = /["\n\r;]/.test(text);
  const escaped = text.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

function toCsv(rows, columns) {
  const head = columns.map((column) => escapeCell(column.header)).join(SEPARATOR);

  const body = rows.map((row) =>
    columns
      .map((column) => {
        const raw = typeof column.value === "function" ? column.value(row) : row[column.key];
        return escapeCell(formatValue(raw, column.format));
      })
      .join(SEPARATOR)
  );

  return [head, ...body].join("\r\n");
}

/** Agrega la fecha al nombre para que no se pisen las descargas. */
function stampedFilename(name) {
  const today = new Date().toISOString().slice(0, 10);
  return `${name}_${today}.csv`;
}

/**
 * Genera el archivo y dispara la descarga.
 * Devuelve la cantidad de filas exportadas.
 */
function downloadCsv(name, rows, columns) {
  const csv = BOM + toCsv(rows, columns);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = stampedFilename(name);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // liberar la memoria del blob una vez el navegador tomó el archivo
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  return rows.length;
}

export { toCsv, downloadCsv, stampedFilename, SEPARATOR };
