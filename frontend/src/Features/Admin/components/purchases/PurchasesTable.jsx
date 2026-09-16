import { Eye, CreditCard, Ban, Trash2 } from "lucide-react";
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
import { Pagination } from "../../../../shared/components/ui/Pagination";
import { useAuth } from "../../../../shared/auth";
import { plata, fecha, estadoDe } from "./formato";

/**
 * Tabla de compras.
 *
 * No hay botón de editar: una compra registrada ya movió stock y es el
 * soporte de lo que se le debe al proveedor. Lo que sí hay son las tres
 * acciones que tienen sentido sobre ella — ver, abonar y cancelar — y cada
 * una aparece solo cuando se puede hacer de verdad:
 *
 *   Abonar   solo si queda saldo y la compra no está cancelada
 *   Cancelar solo si no está cancelada
 *   Eliminar solo si YA está cancelada (así el stock ya se devolvió)
 *
 * Esconder el botón cuando la acción va a fallar ahorra el viaje al servidor
 * y el mensaje de error; el servidor igual lo valida, porque esconder un
 * botón no es una defensa.
 */
function PurchasesTable({
  purchases = [],
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onViewDetail,
  onRegisterPayment,
  onCancelRequest,
  onDeleteRequest
}) {
  const { can } = useAuth();

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Folio</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead>Ítems</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Pagado</TableHead>
            <TableHead>Saldo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-[1%] text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {purchases.map((compra) => {
            const estado = estadoDe(compra.status);
            const cancelada = compra.status === "cancelled";
            const saldo = Number(compra.balance ?? 0);
            const items = Array.isArray(compra.items) ? compra.items : [];
            const unidades = items.reduce((suma, i) => suma + Number(i.quantity ?? 0), 0);

            return (
              <TableRow key={compra.id} className={cancelada ? "opacity-60" : undefined}>
                <TableCell className="font-semibold text-foreground">{compra.folio}</TableCell>
                <TableCell className="whitespace-nowrap">{fecha(compra.date)}</TableCell>
                <TableCell>{compra.supplierName}</TableCell>

                <TableCell className="whitespace-nowrap">
                  <Badge>{items.length} × {unidades} und</Badge>
                </TableCell>

                <TableCell className="whitespace-nowrap font-medium text-foreground">
                  {plata(compra.total)}
                </TableCell>
                <TableCell className="whitespace-nowrap">{plata(compra.paid)}</TableCell>
                <TableCell
                  className={`whitespace-nowrap font-medium ${
                    !cancelada && saldo > 0 ? "text-destructive" : "text-muted-foreground"
                  }`}
                >
                  {plata(saldo)}
                </TableCell>

                <TableCell>
                  <Badge variant={estado.variant}>{estado.label}</Badge>
                </TableCell>

                <TableCell className="w-[1%] whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                      onClick={() => onViewDetail(compra)}
                      title={`Ver ${compra.folio}`}
                      aria-label={`Ver ${compra.folio}`}
                    >
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </button>

                    {can("purchases.create") && !cancelada && saldo > 0 && (
                      <button
                        className="h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                        onClick={() => onRegisterPayment(compra)}
                        title={`Registrar abono a ${compra.folio}`}
                        aria-label={`Registrar abono a ${compra.folio}`}
                      >
                        <CreditCard className="h-4 w-4 text-primary" />
                      </button>
                    )}

                    {can("purchases.edit") && !cancelada && (
                      <button
                        className="h-8 w-8 rounded-lg hover:bg-destructive/10 transition-colors flex items-center justify-center"
                        onClick={() => onCancelRequest(compra)}
                        title={`Cancelar ${compra.folio}`}
                        aria-label={`Cancelar ${compra.folio}`}
                      >
                        <Ban className="h-4 w-4 text-destructive" />
                      </button>
                    )}

                    {can("purchases.delete") && cancelada && (
                      <button
                        className="h-8 w-8 rounded-lg hover:bg-destructive/10 transition-colors flex items-center justify-center"
                        onClick={() => onDeleteRequest(compra)}
                        title={`Eliminar ${compra.folio}`}
                        aria-label={`Eliminar ${compra.folio}`}
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

export { PurchasesTable };
