import { Ban, Eye, Plus } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Badge } from "../../../../shared/components/ui/Badge";
import { Pagination } from "../../../../shared/components/ui/Pagination";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../shared/components/ui/Table";
import { dinero, fecha, hora, NOMBRES_METODO, NOMBRES_CANAL } from "../../../../shared/negocio";

export const ESTADO_VENTA = {
  pendiente: ["Pendiente", "danger"],
  parcial: ["Abonada", "warning"],
  pagada: ["Pagada", "success"],
  anulada: ["Anulada", "default"]
};

const iconBtn = "flex h-8 w-8 items-center justify-center rounded-lg transition-colors";

function SalesTable({ sales, currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onView, onPay, onCancel, isAdmin }) {
  if (sales.length === 0) {
    return (
      <Card>
        <div className="py-14 text-center">
          <p className="font-medium text-foreground">No hay ventas</p>
          <p className="mt-1 text-sm text-muted-foreground">Registra una venta o convierte un pedido.</p>
        </div>
      </Card>
    );
  }
  return (
    <Card>
      <Table className="[&_td]:px-3 [&_th]:px-3">
        <TableHeader>
          <TableRow>
            <TableHead>Factura</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Canal</TableHead>
            <TableHead>Pago</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Saldo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((v) => {
            const [label, variant] = ESTADO_VENTA[v.paymentStatus] ?? [v.paymentStatus, "default"];
            const vigente = v.status !== "anulada";
            return (
              <TableRow key={v.id}>
                <TableCell className="whitespace-nowrap font-medium">
                  {v.invoice}
                  {v.orderCode && <p className="text-xs font-normal text-muted-foreground">{v.orderCode}</p>}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div>{fecha(v.date)}</div>
                  <div className="text-xs text-muted-foreground">{hora(v.date)}</div>
                </TableCell>
                <TableCell>
                  {v.customer}
                  {v.seller && <p className="text-xs text-muted-foreground">Atendió: {v.seller}</p>}
                </TableCell>
                <TableCell>
                  <Badge variant="info" className="whitespace-nowrap">{NOMBRES_CANAL[v.channel] ?? v.channel}</Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">{NOMBRES_METODO[v.paymentMethod] ?? v.paymentMethod ?? "—"}</TableCell>
                <TableCell className="whitespace-nowrap text-right font-semibold">{dinero(v.total)}</TableCell>
                <TableCell className={`whitespace-nowrap text-right ${vigente && v.balance > 0 ? "font-semibold text-destructive" : "text-muted-foreground"}`}>
                  {vigente ? dinero(v.balance) : "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={variant}>{label}</Badge>
                </TableCell>
                <TableCell className="w-[1%] whitespace-nowrap">
                  <div className="flex justify-end gap-1">
                    <button type="button" className={`${iconBtn} hover:bg-muted`} onClick={() => onView(v)} title="Ver detalle" aria-label={`Ver ${v.invoice}`}>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </button>
                    {vigente && v.balance > 0 && (
                      <button type="button" className={`${iconBtn} hover:bg-primary/10`} onClick={() => onPay(v)} title="Registrar abono" aria-label={`Abonar a ${v.invoice}`}>
                        <Plus className="h-4 w-4 text-primary" />
                      </button>
                    )}
                    {isAdmin && vigente && (
                      <button type="button" className={`${iconBtn} hover:bg-destructive/10`} onClick={() => onCancel(v)} title="Anular venta" aria-label={`Anular ${v.invoice}`}>
                        <Ban className="h-4 w-4 text-destructive" />
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
        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={onPageChange} />
      )}
    </Card>
  );
}

export { SalesTable };
