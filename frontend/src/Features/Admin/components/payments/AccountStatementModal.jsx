import { Modal } from "../../../../shared/components/ui/Modal";
import { Badge } from "../../../../shared/components/ui/Badge";
import { PAYMENT_STATUS_LABELS, PAYMENT_STATUS_VARIANTS, METHOD_LABELS } from "../../../../shared/payments";

const money = (value) => `$${value.toFixed(2)}`;

/** Detalle del estado de cuenta de un cliente: venta por venta, con sus abonos. */
function AccountStatementModal({ statement, onClose }) {
  if (!statement) return null;

  return (
    <Modal
      isOpen={Boolean(statement)}
      onClose={onClose}
      size="lg"
      title={`Estado de cuenta · ${statement.customer}`}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Facturado</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{money(statement.invoiced)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Pagado</p>
            <p className="text-xl font-bold text-success mt-0.5">{money(statement.paid)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Saldo</p>
            <p
              className={`text-xl font-bold mt-0.5 ${statement.balance > 0 ? "text-destructive" : "text-success"}`}
            >
              {money(statement.balance)}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground mb-3">Ventas</p>
          <div className="space-y-3">
            {statement.sales.map((sale) => (
              <div key={sale.id} className="rounded-xl border border-border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">
                      {sale.folio} <span className="text-sm text-muted-foreground">· {sale.date}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total {money(sale.total)} · Pagado {money(sale.paid)} · Saldo {money(sale.balance)}
                    </p>
                  </div>
                  <Badge variant={PAYMENT_STATUS_VARIANTS[sale.paymentStatus]}>
                    {PAYMENT_STATUS_LABELS[sale.paymentStatus]}
                  </Badge>
                </div>

                {sale.payments.length > 0 && (
                  <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                    {sale.payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {payment.folio} · {payment.date} · {METHOD_LABELS[payment.method] ?? payment.method}
                          {payment.reference && ` · ${payment.reference}`}
                        </span>
                        <span className="font-medium text-foreground whitespace-nowrap">
                          {money(payment.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export { AccountStatementModal };
