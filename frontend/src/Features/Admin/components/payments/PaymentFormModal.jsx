import { AlertCircle } from "lucide-react";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/input";
import { Select } from "../../../../shared/components/ui/Select";
import { Button } from "../../../../shared/components/ui/button";
import { METHOD_OPTIONS } from "../../../../shared/payments";

const money = (value) => `$${value.toFixed(2)}`;

/**
 * Registro de un abono. Solo ofrece ventas con saldo, y avisa cuál es el
 * máximo que se puede abonar: el store rechaza cualquier monto por encima.
 */
function PaymentFormModal({ isOpen, form, onFormChange, onSave, onClose, payableSales, error }) {
  if (!isOpen) return null;

  const selected = payableSales.find((sale) => String(sale.id) === String(form.saleId)) ?? null;

  const setField = (field, value) => onFormChange({ ...form, [field]: value });

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="Registrar abono">
      {payableSales.length === 0 ? (
        <div className="py-8 text-center">
          <p className="font-medium text-foreground">No hay ventas con saldo pendiente</p>
          <p className="text-sm text-muted-foreground mt-1">
            Todas las ventas a tu alcance están pagadas al día.
          </p>
          <div className="mt-6 flex justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cerrar</Button>
          </div>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Select
            label="Venta"
            value={form.saleId}
            onChange={(event) => setField("saleId", event.target.value)}
            options={payableSales.map((sale) => ({
              value: String(sale.id),
              label: `${sale.folio} · ${sale.customer} · saldo ${money(sale.balance)}`
            }))}
            required
          />

          {selected && (
            <div className="rounded-xl bg-muted/50 p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total de la venta</span>
                <span className="font-medium text-foreground">{money(selected.total)}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-muted-foreground">Ya abonado</span>
                <span className="font-medium text-success">{money(selected.paid)}</span>
              </div>
              <div className="flex items-center justify-between mt-1 border-t border-border pt-1">
                <span className="text-muted-foreground">Máximo a abonar</span>
                <span className="font-semibold text-destructive">{money(selected.balance)}</span>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Monto"
              type="number"
              min="0.01"
              step="0.01"
              max={selected ? String(selected.balance) : undefined}
              value={form.amount}
              onChange={(event) => setField("amount", event.target.value)}
              placeholder="0.00"
              required
            />
            <Input
              label="Fecha"
              type="date"
              value={form.date}
              onChange={(event) => setField("date", event.target.value)}
              required
            />
          </div>

          <Select
            label="Método de pago"
            value={form.method}
            onChange={(event) => setField("method", event.target.value)}
            options={METHOD_OPTIONS}
          />

          <Input
            label="Referencia"
            value={form.reference}
            onChange={(event) => setField("reference", event.target.value)}
            placeholder="Nº de transacción, observación... (opcional)"
          />

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2.5">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Registrar abono</Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export { PaymentFormModal };
