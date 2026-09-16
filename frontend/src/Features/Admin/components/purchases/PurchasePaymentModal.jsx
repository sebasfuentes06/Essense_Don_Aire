import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/input";
import { Select } from "../../../../shared/components/ui/Select";
import { Button } from "../../../../shared/components/ui/button";
import { plata } from "./formato";

/**
 * Registrar un abono al proveedor.
 *
 * Este modal es la única forma de que una compra cambie de estado. No hay
 * ningún desplegable que diga "Pagada": eso lo decide la suma de los abonos,
 * así que para que una compra figure pagada alguien tuvo que registrar el
 * dinero que la cubre.
 *
 * El monto viene propuesto con el saldo completo porque es lo que se paga la
 * mayoría de las veces; si es un abono parcial, se corrige el número.
 */
function PurchasePaymentModal({
  isOpen,
  onClose,
  purchase,
  paymentForm,
  onFormChange,
  paymentMethods = [],
  serverError = "",
  serverFieldErrors = {},
  onSave
}) {
  const [guardando, setGuardando] = useState(false);

  if (!purchase) return null;

  const saldo = Number(purchase.balance ?? 0);
  const monto = Number(paymentForm.monto);
  const quedaria = Number.isFinite(monto) ? Math.max(0, saldo - monto) : saldo;

  const cambiar = (cambios) => onFormChange({ ...paymentForm, ...cambios });

  // Se avisa antes de ir al servidor, pero el servidor lo valida igual: este
  // aviso es comodidad, no una defensa.
  const excede = Number.isFinite(monto) && monto > saldo;

  const guardar = async () => {
    setGuardando(true);
    try {
      await onSave();
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title={`Registrar abono · ${purchase.folio}`}>
      <div className="space-y-5">
        {serverError && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border bg-muted/20 p-4 text-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Total</p>
            <p className="mt-1 font-semibold text-foreground">{plata(purchase.total)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Pagado</p>
            <p className="mt-1 font-semibold text-foreground">{plata(purchase.paid)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Saldo</p>
            <p className="mt-1 font-semibold text-destructive">{plata(saldo)}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Proveedor: <span className="font-medium text-foreground">{purchase.supplierName}</span>
        </p>

        <Select
          label="Método de pago"
          value={String(paymentForm.id_metodo_pago ?? "")}
          required
          error={serverFieldErrors.id_metodo_pago}
          onChange={(e) => cambiar({ id_metodo_pago: e.target.value })}
          options={[
            { value: "", label: "Seleccionar método" },
            ...paymentMethods.map((m) => ({ value: String(m.id), label: m.nombre }))
          ]}
        />

        <Input
          label="Monto"
          type="number"
          min="0"
          step="0.01"
          value={paymentForm.monto ?? ""}
          required
          error={serverFieldErrors.monto || (excede ? `El saldo es ${plata(saldo)}.` : "")}
          onChange={(e) => cambiar({ monto: e.target.value })}
          placeholder="0"
        />

        <Input
          label="Referencia"
          value={paymentForm.referencia ?? ""}
          error={serverFieldErrors.referencia}
          onChange={(e) => cambiar({ referencia: e.target.value })}
          placeholder="N° de transferencia, recibo, consignación…"
        />

        {!excede && Number.isFinite(monto) && monto > 0 && (
          <p className="rounded-xl border border-border bg-muted/20 p-3 text-sm text-muted-foreground">
            Después de este abono la compra queda con un saldo de{" "}
            <strong className="text-foreground">{plata(quedaria)}</strong>
            {quedaria === 0 ? " y pasa a Pagada." : " y queda Parcial."}
          </p>
        )}

        <div className="flex justify-end gap-3 border-t border-border pt-5">
          <Button type="button" variant="outline" onClick={onClose} disabled={guardando}>
            Cancelar
          </Button>
          <Button type="button" onClick={guardar} disabled={guardando || excede}>
            {guardando ? "Registrando…" : "Registrar abono"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export { PurchasePaymentModal };
