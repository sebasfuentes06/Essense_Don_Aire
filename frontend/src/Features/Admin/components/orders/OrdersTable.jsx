import { Eye, Edit, Trash2, Ban, CheckCircle2, ReceiptText } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Badge } from "../../../../shared/components/ui/Badge";
import { Pagination } from "../../../../shared/components/ui/Pagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "../../../../shared/components/ui/Table";
import { STATUS_LABELS, STATUS_VARIANTS, CHANNEL_LABELS } from "../../../../shared/orders";

const actionClass = "h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center";

function OrdersTable({
  orders,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isClient,
  onViewDetail,
  onEdit,
  onDelete,
  onConfirm,
  onCancel,
  onConvert,
  canEditOrder,
  canDeleteOrder,
  canCancelOrder,
  canConfirmOrder,
  canConvertOrder
}) {
  if (orders.length === 0) {
    return (
      <Card>
        <div className="py-14 text-center">
          <p className="text-foreground font-medium">Todavía no hay pedidos aquí</p>
          <p className="text-sm text-muted-foreground mt-1">
            {isClient
              ? "Cuando hagas un pedido desde el catálogo, aparecerá en esta lista."
              : "Ajusta los filtros o registra un pedido nuevo."}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Folio</TableHead>
            <TableHead>Fecha</TableHead>
            {!isClient && <TableHead>Cliente</TableHead>}
            {!isClient && <TableHead>Vendedor</TableHead>}
            <TableHead>Canal</TableHead>
            <TableHead>Productos</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => {
            const units = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.folio}</TableCell>
                <TableCell className="whitespace-nowrap">{order.date}</TableCell>

                {!isClient && <TableCell>{order.customer}</TableCell>}
                {!isClient && (
                  <TableCell>
                    {order.seller ?? (
                      <span className="text-sm text-muted-foreground italic">Sin asignar</span>
                    )}
                  </TableCell>
                )}

                <TableCell>
                  <Badge variant="info">{CHANNEL_LABELS[order.channel] ?? order.channel}</Badge>
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  {order.items.length} · {units} und.
                </TableCell>

                <TableCell className="whitespace-nowrap font-medium">
                  ${order.total.toFixed(2)}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={STATUS_VARIANTS[order.status]}>{STATUS_LABELS[order.status]}</Badge>
                    {order.saleId && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        → venta
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell className="w-[1%] whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      className={actionClass}
                      onClick={() => onViewDetail(order)}
                      title="Ver detalle"
                      aria-label={`Ver detalle del pedido ${order.folio}`}
                    >
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </button>

                    {canConfirmOrder(order) && (
                      <button
                        type="button"
                        className={actionClass}
                        onClick={() => onConfirm(order)}
                        title="Confirmar pedido"
                        aria-label={`Confirmar el pedido ${order.folio}`}
                      >
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      </button>
                    )}

                    {canConvertOrder(order) && (
                      <button
                        type="button"
                        className={actionClass}
                        onClick={() => onConvert(order)}
                        title="Convertir en venta"
                        aria-label={`Convertir el pedido ${order.folio} en venta`}
                      >
                        <ReceiptText className="h-4 w-4 text-primary" />
                      </button>
                    )}

                    {canEditOrder(order) && (
                      <button
                        type="button"
                        className={actionClass}
                        onClick={() => onEdit(order)}
                        title="Editar pedido"
                        aria-label={`Editar el pedido ${order.folio}`}
                      >
                        <Edit className="h-4 w-4 text-primary" />
                      </button>
                    )}

                    {canCancelOrder(order) && (
                      <button
                        type="button"
                        className={actionClass}
                        onClick={() => onCancel(order)}
                        title="Cancelar pedido"
                        aria-label={`Cancelar el pedido ${order.folio}`}
                      >
                        <Ban className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}

                    {canDeleteOrder(order) && (
                      <button
                        type="button"
                        className="h-8 w-8 rounded-lg hover:bg-destructive/10 transition-colors flex items-center justify-center"
                        onClick={() => onDelete(order)}
                        title="Eliminar pedido"
                        aria-label={`Eliminar el pedido ${order.folio}`}
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

export { OrdersTable };
