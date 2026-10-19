import { Check, Eye, Paperclip, X } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Badge } from "../../../../shared/components/ui/Badge";
import { Pagination } from "../../../../shared/components/ui/Pagination";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../shared/components/ui/Table";
import { dinero, fecha, hora, NOMBRES_METODO, NOMBRES_ESTADO_PAGO } from "../../../../shared/negocio";

export const VARIANTE_ESTADO_PAGO = { aplicado: "success", pendiente: "warning", rechazado: "danger", anulado: "default" };

const iconBtn = "flex h-8 w-8 items-center justify-center rounded-lg transition-colors";

/**
 * Lista de pagos. En "Por aprobar" el Administrador aprueba o rechaza desde
 * la fila; el detalle muestra el comprobante.
 */
function PaymentsTable({
  payments,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isClient,
  isAdmin,
  emptyTitle = "No hay pagos",
  emptyText = "Ajusta los filtros o vuelve más tarde.",
  onView,
  onApprove,
  onReject
}) {
  if (payments.length === 0) {
    return (
      <Card>
        <div className="py-14 text-center">
          <p className="font-medium text-foreground">{emptyTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">{emptyText}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Table className="[&_td]:px-3 [&_th]:px-3">
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Factura</TableHead>
            {!isClient && <TableHead>Cliente</TableHead>}
            <TableHead>Método</TableHead>
            <TableHead>Referencia</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="whitespace-nowrap text-sm">
                <div>{fecha(p.date)}</div>
                <div className="text-xs text-muted-foreground">{hora(p.date)}</div>
              </TableCell>
              <TableCell className="font-medium">{p.invoice ?? "—"}</TableCell>
              {!isClient && <TableCell>{p.customer}</TableCell>}
              <TableCell>
                <span className="inline-flex items-center gap-1">
                  {NOMBRES_METODO[p.method] ?? p.method}
                  {p.hasProof && <Paperclip className="h-3.5 w-3.5 text-muted-foreground" aria-label="Con comprobante" />}
                </span>
              </TableCell>
              <TableCell className="max-w-[180px] truncate text-sm text-muted-foreground">{p.reference || "—"}</TableCell>
              <TableCell className="whitespace-nowrap text-right font-semibold">{dinero(p.amount)}</TableCell>
              <TableCell>
                <Badge variant={VARIANTE_ESTADO_PAGO[p.status] ?? "default"}>{NOMBRES_ESTADO_PAGO[p.status] ?? p.status}</Badge>
                {p.status === "rechazado" && p.rejectReason && (
                  <p className="mt-1 max-w-[200px] text-xs text-destructive">{p.rejectReason}</p>
                )}
              </TableCell>
              <TableCell className="w-[1%] whitespace-nowrap">
                <div className="flex justify-end gap-1">
                  <button type="button" className={`${iconBtn} hover:bg-muted`} onClick={() => onView(p)} title="Ver detalle" aria-label="Ver detalle">
                    <Eye className="h-4 w-4" />
                  </button>
                  {isAdmin && p.status === "pendiente" && (
                    <>
                      <button type="button" className={`${iconBtn} hover:bg-success/10`} onClick={() => onApprove(p)} title="Aprobar" aria-label="Aprobar">
                        <Check className="h-4 w-4 text-success" />
                      </button>
                      <button type="button" className={`${iconBtn} hover:bg-destructive/10`} onClick={() => onReject(p)} title="Rechazar" aria-label="Rechazar">
                        <X className="h-4 w-4 text-destructive" />
                      </button>
                    </>
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

export { PaymentsTable };
