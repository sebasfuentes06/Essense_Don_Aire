import { useEffect, useState } from "react";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Button } from "../../../../shared/components/ui/button";
import { CamposPago, PAGO_VACIO, pagoAApi, pagos, dinero, METODOS_ABONO, METODOS_REPORTE } from "../../../../shared/negocio";

/**
 * Registrar un abono (equipo) o reportar un pago (cliente) sobre una venta.
 * El pago del cliente queda "Por aprobar" y exige comprobante, igual que en
 * la app móvil.
 */
function PaymentFormModal({ sale, isClient, onClose, onSave }) {
  const [pago, setPago] = useState(PAGO_VACIO);
  const [nota, setNota] = useState("");
  const [errores, setErrores] = useState({});
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [datosPago, setDatosPago] = useState({});

  useEffect(() => {
    if (!sale) return;
    setPago({ ...PAGO_VACIO, monto: String(Math.round(sale.balance)), metodo: isClient ? "transferencia" : "efectivo" });
    setNota("");
    setErrores({});
    setError("");
    if (isClient) pagos.datosPago().then(setDatosPago);
  }, [sale, isClient]);

  if (!sale) return null;

  const enviar = async () => {
    const e = {};
    const monto = Number(pago.monto);
    if (!(monto > 0)) e.monto = "Escribe el monto.";
    else if (monto > sale.balance) e.monto = `No puede superar el saldo (${dinero(sale.balance)}).`;
    setErrores(e);
    if (isClient && !pago.comprobante) return setError("Adjunta la foto del comprobante de la transferencia.");
    if (Object.keys(e).length) return;
    setError("");
    setEnviando(true);
    try {
      await onSave({ id_venta: sale.id, ...pagoAApi(pago), ...(nota.trim() && { nota: nota.trim() }) });
    } catch (err) {
      setError(err.message);
      if (err.details?.monto) setErrores({ monto: err.details.monto });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="lg" title={isClient ? `Reportar pago · ${sale.invoice}` : `Registrar abono · ${sale.invoice}`}>
      <div className="space-y-5">
        <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3 text-sm">
          <span>
            {sale.customer && !isClient ? `${sale.customer} · ` : ""}Saldo pendiente
          </span>
          <b className="text-lg text-destructive">{dinero(sale.balance)}</b>
        </div>
        {isClient && (
          <div className="rounded-xl bg-primary/10 p-3 text-sm">
            {datosPago.transferencia ? (
              <>
                Transfiere a: <b>{datosPago.transferencia}</b>. Luego sube la foto del comprobante; tu pago queda en revisión hasta que lo aprobemos.
              </>
            ) : (
              "Sube la foto del comprobante de tu transferencia; tu pago queda en revisión hasta que lo aprobemos."
            )}
          </div>
        )}
        <CamposPago
          valor={pago}
          onCambio={setPago}
          maximo={sale.balance}
          metodos={isClient ? METODOS_REPORTE : METODOS_ABONO}
          comprobanteObligatorio={isClient}
          errores={errores}
        />
        <label className="block text-sm font-medium text-foreground">
          Nota (opcional)
          <input
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            maxLength={300}
            className="mt-1 h-10 w-full rounded-xl border border-input bg-input-background px-3 text-sm"
          />
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={enviar} disabled={enviando}>
            {enviando ? "Enviando..." : isClient ? "Enviar pago" : "Registrar abono"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export { PaymentFormModal };
