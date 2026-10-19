import { Eye, Edit, Ban, ReceiptText, Paperclip } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Badge } from "../../../../shared/components/ui/Badge";
import { Pagination } from "../../../../shared/components/ui/Pagination";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../shared/components/ui/Table";
import { STATUS_LABELS, STATUS_VARIANTS, CHANNEL_LABELS } from "../../../../shared/orders";
import { dinero, fecha, hora, NOMBRES_METODO } from "../../../../shared/negocio";

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
  onCancel,
  onConvert,
  canEditOrder,
  canCancelOrder,
  canConvertOrder
}) {
  if (orders.length === 0) {
    return (
      <Card>
        <div className="py-14 text-center">
          <p className="text-foreground font-medium">Todavía no hay pedidos aquí</p>
          <p className="text-sm text-muted-foreground mt-1">
            {isClient ? "Agrega productos al carrito desde el catálogo y haz tu pedido." : "Ajusta los filtros o registra un pedido nuevo."}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Table className="[&_td]:px-3 [&_th]:px-3">
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Fecha</TableHead>
            {!isClient && <TableHead>Cliente</TableHead>}
            <TableHead>Canal</TableHead>
            <TableHead>Pago</TableHead>
            <TableHead>Und.</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="whitespace-nowrap font-medium">{order.folio}</TableCell>
              <TableCell className="whitespace-nowrap">
                <div>{fecha(order.date)}</div>
                <div className="text-xs text-muted-foreground">{hora(order.date)}</div>
              </TableCell>
              {!isClient && <TableCell>{order.customer}</TableCell>}
              <TableCell>
                <Badge variant="info" className="whitespace-nowrap">{CHANNEL_LABELS[order.channel] ?? order.channel}</Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {order.paymentMethod ? NOMBRES_METODO[order.paymentMethod] : <span className="text-muted-foreground">—</span>}
                {order.hasProof && <Paperclip className="ml-1 inline h-3.5 w-3.5 text-primary" aria-label="Con comprobante" />}
              </TableCell>
              <TableCell>{order.units}</TableCell>
              <TableCell className="whitespace-nowrap font-medium">{dinero(order.total)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant={STATUS_VARIANTS[order.status]}>{STATUS_LABELS[order.status]}</Badge>
                  {order.invoice && <span className="text-xs text-muted-foreground whitespace-nowrap">→ {order.invoice}</span>}
                </div>
              </TableCell>
              <TableCell className="w-[1%] whitespace-nowrap">
                <div className="flex items-center justify-end gap-2">
                  <button type="button" className={actionClass} onClick={() => onViewDetail(order)} title="Ver detalle">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {canConvertOrder(order) && (
                    <button type="button" className={actionClass} onClick={() => onConvert(order)} title="Convertir en venta">
                      <ReceiptText className="h-4 w-4 text-primary" />
                    </button>
                  )}
                  {canEditOrder(order) && (
                    <button type="button" className={actionClass} onClick={() => onEdit(order)} title="Editar pedido">
                      <Edit className="h-4 w-4 text-primary" />
                    </button>
                  )}
                  {canCancelOrder(order) && (
                    <button type="button" className={actionClass} onClick={() => onCancel(order)} title="Cancelar pedido">
                      <Ban className="h-4 w-4 text-destructive" />
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={onPageChange} />
      )}
    </Card>
  );
}

export { OrdersTable };
