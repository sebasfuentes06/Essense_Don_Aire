import { useEffect, useState } from "react";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Button } from "../../../../shared/components/ui/button";
import { dinero, SelectorMetodo, CamposPago, PAGO_VACIO, pagoAApi } from "../../../../shared/negocio";

/**
 * Convertir el pedido en venta: método de pago (por defecto el que escogió
 * el cliente), descuento y, si paga en ese momento, el pago inicial. Si el
 * cliente mandó comprobante, la API lo deja en Pagos ▸ Por aprobar.
 */
function ConvertOrderModal({ order, onClose, onConfirm }) {
  const [metodo, setMetodo] = useState("");
  const [descuento, setDescuento] = useState("");
  const [pagaAhora, setPagaAhora] = useState(false);
  const [pago, setPago] = useState(PAGO_VACIO);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!order) return;
    const m = order.paymentMethod ?? "";
    setMetodo(m);
    setDescuento("");
    setPagaAhora(!m || m === "efectivo");
    setPago({ ...PAGO_VACIO, metodo: m && m !== "wompi" ? m : "efectivo" });
    setError("");
  }, [order]);

  if (!order) return null;
  const total = Math.max(0, order.total - Number(descuento || 0));

  const enviar = async () => {
    setError("");
    if (!metodo) return setError("Elige el método de pago.");
    if (Number(descuento || 0) > order.total) return setError("El descuento no puede superar el total.");
    const conPago = metodo !== "wompi" && pagaAhora && Number(pago.monto) > 0;
    if (conPago && Number(pago.monto) > total) return setError(`El pago no puede superar ${dinero(total)}.`);
    setEnviando(true);
    try {
      await onConfirm({
        metodo_pago: metodo,
        descuento: Number(descuento || 0),
        ...(conPago && { pago_inicial: pagoAApi(pago) })
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="lg" title={`Convertir ${order.folio} en venta`}>
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">
          Se genera la factura y se descuenta el stock en este momento. Cliente: <b className="text-foreground">{order.customer}</b>.
        </p>
        {order.hasProof && (
          <div className="rounded-xl bg-primary/10 p-3 text-sm">
            El cliente adjuntó el comprobante de su transferencia: quedará en <b>Pagos ▸ Por aprobar</b> para que lo revises.
          </div>
        )}
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Método de pago *</p>
          <SelectorMetodo valor={metodo} onCambio={(m) => { setMetodo(m); if (m !== "wompi") setPago((p) => ({ ...p, metodo: m })); }} />
        </div>
        <label className="block text-sm font-medium text-foreground">
          Descuento (opcional)
          <input
            inputMode="numeric"
            value={descuento}
            onChange={(e) => setDescuento(e.target.value.replace(/\D/g, ""))}
            className="mt-1 h-10 w-full rounded-xl border border-input bg-input-background px-3 text-sm"
          />
        </label>
        <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
          <span>Total a pagar</span>
          <b className="text-lg text-primary">{dinero(total)}</b>
        </div>
        {metodo && metodo !== "wompi" && (
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={pagaAhora} onChange={(e) => setPagaAhora(e.target.checked)} className="h-4 w-4 accent-primary" />
              El cliente paga ahora (pago total o abono inicial)
            </label>
            {pagaAhora && <CamposPago valor={pago} onCambio={setPago} maximo={total} />}
          </div>
        )}
        {metodo === "wompi" && <p className="text-sm text-muted-foreground">El cliente paga con Wompi desde su cuenta (o le envías el link desde la venta).</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={enviar} disabled={enviando}>
            {enviando ? "Registrando..." : "Confirmar venta"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export { ConvertOrderModal };
