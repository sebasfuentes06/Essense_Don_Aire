import { CreditCard, Loader2, Upload } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Button } from "../../../../shared/components/ui/button";
import { dinero, fecha } from "../../../../shared/negocio";

/** Compras del cliente con saldo: pagar con Wompi o reportar una transferencia. */
function ClientOpenSales({ sales, pendingBySale = {}, onWompi, onReport, wompiBusy }) {
  if (sales.length === 0) {
    return (
      <Card>
        <div className="py-14 text-center">
          <p className="font-medium text-foreground">¡Estás al día!</p>
          <p className="mt-1 text-sm text-muted-foreground">No tienes compras con saldo pendiente.</p>
        </div>
      </Card>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sales.map((s) => {
        const enRevision = pendingBySale[s.id] ?? 0;
        return (
          <Card key={s.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">{s.invoice}</p>
                <p className="text-sm text-muted-foreground">{fecha(s.date)} · {s.units} und.</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Saldo</p>
                <p className="text-xl font-bold text-destructive">{dinero(s.balance)}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Total {dinero(s.total)} · pagado {dinero(s.paid)}
            </p>
            {enRevision > 0 && (
              <p className="mt-2 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
                Tienes {dinero(enRevision)} en revisión. Te avisamos cuando lo aprobemos.
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => onWompi(s)} disabled={wompiBusy === s.id}>
                {wompiBusy === s.id ? <Loader2 className="animate-spin" /> : <CreditCard />} Pagar con Wompi
              </Button>
              <Button variant="outline" onClick={() => onReport(s)}>
                <Upload /> Reportar transferencia
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export { ClientOpenSales };
