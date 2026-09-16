import { Package, TrendingUp, Boxes, Star } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";

/**
 * Indicadores de la pantalla de Proveedores.
 *
 * Las cuatro cifras vienen del servidor y cuentan TODOS los proveedores, no
 * los de la página que se está viendo. Calcularlas sumando las filas visibles
 * daría "Total Proveedores: 10" habiendo treinta, y el número cambiaría al
 * pasar de página.
 *
 * La calificación promedio solo considera proveedores con al menos una
 * reseña: los recién creados entran con 0 y, si se promediaran, arrastrarían
 * el indicador hacia abajo por no haber sido calificados todavía.
 */
function SupplierStats({ totalSuppliers = 0, activeSuppliers = 0, totalProducts = 0, avgRating = "0.0" }) {
  const tarjetas = [
    {
      etiqueta: "Total Proveedores",
      valor: totalSuppliers,
      color: "text-foreground",
      Icono: Package,
      tono: "text-primary"
    },
    {
      etiqueta: "Proveedores Activos",
      valor: activeSuppliers,
      color: "text-success",
      Icono: TrendingUp,
      tono: "text-success"
    },
    {
      etiqueta: "Productos en Catálogo",
      valor: totalProducts,
      color: "text-primary",
      Icono: Boxes,
      tono: "text-primary"
    },
    {
      etiqueta: "Calificación Promedio",
      valor: Number(avgRating) > 0 ? `${avgRating} ⭐` : "Sin calificar",
      color: "text-foreground",
      Icono: Star,
      tono: "text-primary"
    }
  ];

  return (
    <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {tarjetas.map(({ etiqueta, valor, color, Icono, tono }) => (
        <Card key={etiqueta}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{etiqueta}</p>
              <p className={`text-2xl font-bold ${color}`}>{valor}</p>
            </div>
            <Icono className={`h-8 w-8 ${tono}`} />
          </div>
        </Card>
      ))}
    </div>
  );
}

export { SupplierStats };
