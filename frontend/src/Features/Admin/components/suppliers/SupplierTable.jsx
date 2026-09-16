import { Edit, Trash2, Star, MapPin, Eye } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "../../../../shared/components/ui/Table";
import { Badge } from "../../../../shared/components/ui/Badge";
import { Switch } from "../../../../shared/components/ui/switch";
import { Pagination } from "../../../../shared/components/ui/Pagination";
import { useAuth } from "../../../../shared/auth";

/**
 * Tabla de proveedores.
 *
 * Dos cosas que cambiaron al conectar con la API:
 *
 * - La columna "Productos" leía `supplier.products.length`, un arreglo que
 *   solo existía en los datos de ejemplo. La base no guarda esa lista: manda
 *   `totalProducts`, ya contado. Tal como estaba, la primera fila real
 *   reventaba la pantalla entera con "cannot read properties of undefined".
 *
 * - "Gastado" mostraba $45.0k dividiendo entre mil. Con pesos colombianos eso
 *   se lee mal; ahora va con el formato de moneda de es-CO.
 */

const moneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});

function SupplierTable({
  suppliers = [],
  totalPages,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onToggleStatus
}) {
  const { can } = useAuth();

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Productos</TableHead>
            <TableHead>Órdenes</TableHead>
            <TableHead>Comprado</TableHead>
            <TableHead>Calificación</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-[1%] text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {suppliers.map((supplier) => {
            const activo = supplier.status === "active";
            const productos = supplier.totalProducts ?? 0;
            const ordenes = supplier.totalOrders ?? 0;
            const comprado = Number(supplier.totalSpent ?? 0);
            const calificacion = Number(supplier.rating ?? 0);

            return (
              <TableRow key={supplier.id}>
                <TableCell>
                  <div>
                    <p className="font-semibold text-foreground">{supplier.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {supplier.city || "Sin ciudad"}
                    </p>
                  </div>
                </TableCell>

                <TableCell>{supplier.contact || "—"}</TableCell>
                <TableCell>{supplier.email || "—"}</TableCell>
                <TableCell>{supplier.phone || "—"}</TableCell>

                <TableCell>
                  <Badge variant={productos > 0 ? "info" : "default"}>
                    {productos} {productos === 1 ? "producto" : "productos"}
                  </Badge>
                </TableCell>

                <TableCell>{ordenes}</TableCell>

                <TableCell className="whitespace-nowrap">{moneda.format(comprado)}</TableCell>

                <TableCell className="w-[1%] whitespace-nowrap">
                  {supplier.reviews > 0 ? (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-semibold text-foreground">
                        {calificacion.toFixed(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">({supplier.reviews})</span>
                    </div>
                  ) : (
                    // Sin reseñas, un "0.0 ⭐" se lee como un proveedor pésimo
                    // cuando en realidad es uno que nadie ha calificado todavía.
                    <span className="text-xs text-muted-foreground">Sin calificar</span>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    {can("suppliers.toggle") && (
                      <Switch
                        checked={activo}
                        itemName={supplier.name}
                        onCheckedChange={() => onToggleStatus(supplier)}
                        aria-label={`${activo ? "Desactivar" : "Activar"} ${supplier.name}`}
                      />
                    )}
                    <span
                      className={
                        activo
                          ? "text-sm font-medium text-success"
                          : "text-sm font-medium text-muted-foreground"
                      }
                    >
                      {activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="w-[1%] whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                      onClick={() => onView(supplier)}
                      title={`Ver ${supplier.name}`}
                      aria-label={`Ver ${supplier.name}`}
                    >
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </button>

                    {can("suppliers.edit") && (
                      <button
                        className="h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                        onClick={() => onEdit(supplier)}
                        title={`Editar ${supplier.name}`}
                        aria-label={`Editar ${supplier.name}`}
                      >
                        <Edit className="h-4 w-4 text-primary" />
                      </button>
                    )}

                    {can("suppliers.delete") && (
                      <button
                        className="h-8 w-8 rounded-lg hover:bg-destructive/10 transition-colors flex items-center justify-center"
                        onClick={() => onDelete(supplier)}
                        title={`Eliminar ${supplier.name}`}
                        aria-label={`Eliminar ${supplier.name}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
    </Card>
  );
}

export { SupplierTable };
