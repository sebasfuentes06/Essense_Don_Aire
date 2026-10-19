import { Link2, Loader2, Phone, Plus } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Button } from "../../../../shared/components/ui/button";
import { dinero, fecha } from "../../../../shared/negocio";

/** Cartera: ventas con saldo agrupadas por cliente (la más vieja primero). */
function CarteraTable({ cartera, onPay, onWompi, wompiBusy }) {
  const clientes = cartera?.clientes ?? [];
  if (clientes.length === 0) {
    return (
      <Card>
        <div className="py-14 text-center">
          <p className="font-medium text-foreground">No hay cartera pendiente</p>
          <p className="mt-1 text-sm text-muted-foreground">Todas las ventas confirmadas están pagadas.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {clientes.map((c) => (
        <Card key={c.id_cliente} className="p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-foreground">{c.cliente}</p>
              {c.telefono && (
                <a href={`https://wa.me/57${c.telefono}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                  <Phone className="h-3.5 w-3.5" /> {c.telefono}
                </a>
              )}
            </div>
            <p className="text-lg font-bold text-destructive">{dinero(c.saldo)}</p>
          </div>
          <div className="divide-y divide-border rounded-xl border border-border">
            {c.ventas.map((v) => {
              const venta = { id: v.id_venta, invoice: v.numero_factura, customer: c.cliente, balance: Number(v.saldo), total: Number(v.total) };
              return (
                <div key={v.id_venta} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm">
                    <p className="font-medium text-foreground">
                      {v.numero_factura} <span className="font-normal text-muted-foreground">· {fecha(v.fecha)} · hace {v.dias} día(s)</span>
                    </p>
                    <p className="text-muted-foreground">
                      Total {dinero(v.total)} · pagado {dinero(v.pagado)} · <b className="text-destructive">saldo {dinero(v.saldo)}</b>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onWompi(venta)} disabled={wompiBusy === venta.id}>
                      {wompiBusy === venta.id ? <Loader2 className="animate-spin" /> : <Link2 />} Link Wompi
                    </Button>
                    <Button size="sm" onClick={() => onPay(venta)}>
                      <Plus /> Abonar
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}

export { CarteraTable };
