import { Eye, Plus } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Badge } from "../../../../shared/components/ui/Badge";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "../../../../shared/components/ui/Table";
import { useAuth } from "../../../../shared/auth";

const money = (value) => `$${value.toFixed(2)}`;

/** Estado de cuenta agregado por cliente: cuánto se le facturó, cuánto pagó y cuánto debe. */
function AccountStatementTable({ statements, onViewDetail, onNewPayment }) {
  const { can } = useAuth();

  if (statements.length === 0) {
    return (
      <Card>
        <div className="py-14 text-center">
          <p className="text-foreground font-medium">No hay estados de cuenta que mostrar</p>
          <p className="text-sm text-muted-foreground mt-1">Ajusta el filtro o la búsqueda.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead className="text-right">Ventas</TableHead>
            <TableHead className="text-right">Con saldo</TableHead>
            <TableHead className="text-right">Facturado</TableHead>
            <TableHead className="text-right">Pagado</TableHead>
            <TableHead className="text-right">Saldo</TableHead>
            <TableHead>Situación</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {statements.map((statement) => {
            const debt = statement.balance > 0;

            return (
              <TableRow key={statement.customer}>
                <TableCell className="font-medium">{statement.customer}</TableCell>
                <TableCell className="text-right">{statement.salesCount}</TableCell>
                <TableCell className="text-right">{statement.openSales}</TableCell>
                <TableCell className="text-right whitespace-nowrap">{money(statement.invoiced)}</TableCell>
                <TableCell className="text-right whitespace-nowrap text-success">{money(statement.paid)}</TableCell>
                <TableCell
                  className={`text-right whitespace-nowrap font-semibold ${debt ? "text-destructive" : "text-success"}`}
                >
                  {money(statement.balance)}
                </TableCell>
                <TableCell>
                  <Badge variant={debt ? "danger" : "success"}>{debt ? "Con saldo" : "Al día"}</Badge>
                </TableCell>
                <TableCell className="w-[1%] whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      className="h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                      onClick={() => onViewDetail(statement.customer)}
                      title="Ver detalle"
                      aria-label={`Ver el estado de cuenta de ${statement.customer}`}
                    >
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </button>

                    {debt && can("payments.create") && (
                      <button
                        type="button"
                        className="h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                        onClick={() => onNewPayment(statement)}
                        title="Registrar abono"
                        aria-label={`Registrar un abono de ${statement.customer}`}
                      >
                        <Plus className="h-4 w-4 text-primary" />
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}

export { AccountStatementTable };
