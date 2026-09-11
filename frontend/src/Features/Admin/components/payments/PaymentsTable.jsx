import { Trash2 } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Badge } from "../../../../shared/components/ui/Badge";
import { Pagination } from "../../../../shared/components/ui/Pagination";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "../../../../shared/components/ui/Table";
import { useAuth } from "../../../../shared/auth";
import { METHOD_LABELS } from "../../../../shared/payments";

function PaymentsTable({
  payments, currentPage, totalPages, totalItems, itemsPerPage, onPageChange, isClient, onDelete
}) {
  const { can } = useAuth();

  if (payments.length === 0) {
    return (
      <Card>
        <div className="py-14 text-center">
          <p className="text-foreground font-medium">Aún no hay abonos registrados</p>
          <p className="text-sm text-muted-foreground mt-1">
            {isClient
              ? "Cuando hagas un pago, quedará registrado aquí."
              : "Registra el primer abono o ajusta los filtros."}
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
            <TableHead>Abono</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Venta</TableHead>
            {!isClient && <TableHead>Cliente</TableHead>}
            {!isClient && <TableHead>Vendedor</TableHead>}
            <TableHead>Método</TableHead>
            <TableHead>Referencia</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            {can("payments.delete") && <TableHead className="text-right">Acciones</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.folio}</TableCell>
              <TableCell className="whitespace-nowrap">{payment.date}</TableCell>
              <TableCell>{payment.saleFolio}</TableCell>
              {!isClient && <TableCell>{payment.customer}</TableCell>}
              {!isClient && <TableCell>{payment.seller}</TableCell>}
              <TableCell>
                <Badge variant="info">{METHOD_LABELS[payment.method] ?? payment.method}</Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {payment.reference || "—"}
              </TableCell>
              <TableCell className="text-right font-semibold whitespace-nowrap">
                ${payment.amount.toFixed(2)}
              </TableCell>
              {can("payments.delete") && (
                <TableCell className="w-[1%] whitespace-nowrap text-right">
                  <button
                    type="button"
                    className="h-8 w-8 rounded-lg hover:bg-destructive/10 transition-colors flex items-center justify-center"
                    onClick={() => onDelete(payment)}
                    title="Eliminar abono"
                    aria-label={`Eliminar el abono ${payment.folio}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </TableCell>
              )}
            </TableRow>
          ))}
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

export { PaymentsTable };
