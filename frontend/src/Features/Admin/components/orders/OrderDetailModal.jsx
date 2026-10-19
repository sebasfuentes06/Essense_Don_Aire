import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Badge } from "../../../../shared/components/ui/Badge";
import { Button } from "../../../../shared/components/ui/button";
import { STATUS_LABELS, STATUS_VARIANTS, CHANNEL_LABELS, ORDER_STATUS } from "../../../../shared/orders";
import { dinero, fechaHora, NOMBRES_METODO, ImagenPrivada, CampoComprobante, METODOS_PEDIDO_CLIENTE } from "../../../../shared/negocio";

function Row({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground mt-0.5">{value || "—"}</p>
    </div>
  );
}

/** Qué sigue con el pago, según el método y el estado (igual que la app). */
function instruccion(order, isClient) {
  const m = order.paymentMethod;
  if (!m) return null;
  if (order.status === ORDER_STATUS.PENDING) {
    if (!isClient) {
      return order.hasProof
        ? "El cliente ya transfirió y adjuntó el comprobante. Al convertirlo en venta, el pago queda en Pagos ▸ Por aprobar."
        : "El cliente eligió esta forma de pago. Al convertirlo en venta queda registrada.";
    }
    if (m === "wompi") return "Cuando confirmemos tu pedido podrás pagarlo en línea desde Mis compras.";
    if (m === "efectivo") return "Pagas en efectivo en el punto físico al recoger o recibir tu pedido.";
    return order.hasProof ? "Ya enviaste el comprobante. Lo revisamos al confirmar tu pedido." : "Adjunta la foto del comprobante de tu transferencia.";
  }
  if (order.status === ORDER_STATUS.CONFIRMED) {
    if (m === "wompi") return "Pedido confirmado: entra a la compra y paga en línea.";
    if (m === "efectivo") return "Pedido confirmado: el pago se hace en efectivo en el punto físico.";
    return order.hasProof
      ? "Pedido confirmado: tu comprobante quedó en revisión; te avisamos por correo cuando se apruebe."
      : "Pedido confirmado: transfiere y reporta el pago desde Pagos con el comprobante.";
  }
  return null;
}

function OrderDetailModal({ order, onClose, isClient, onUploadProof, onConvert, canConvert }) {
  const navigate = useNavigate();
  const [nuevo, setNuevo] = useState(null);
  const [version, setVersion] = useState(0);
  const [subiendo, setSubiendo] = useState(false);
  if (!order) return null;

  const subir = async () => {
    setSubiendo(true);
    try {
      await onUploadProof(order.id, { base64: nuevo.base64, tipo_mime: nuevo.tipo_mime });
      setNuevo(null);
      setVersion((v) => v + 1);
      toast.success("Comprobante guardado.");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSubiendo(false);
    }
  };

  const texto = instruccion(order, isClient);
  const metodo = METODOS_PEDIDO_CLIENTE.find((m) => m.value === order.paymentMethod)?.label ?? NOMBRES_METODO[order.paymentMethod];

  return (
    <Modal isOpen={Boolean(order)} onClose={onClose} size="lg" title={`Pedido ${order.folio}`}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={STATUS_VARIANTS[order.status]}>{STATUS_LABELS[order.status]}</Badge>
          <Badge variant="info">{CHANNEL_LABELS[order.channel] ?? order.channel}</Badge>
          {order.invoice && <Badge variant="success">Venta {order.invoice}</Badge>}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {!isClient && <Row label="Cliente" value={order.customer} />}
          {!isClient && <Row label="Celular" value={order.customerPhone} />}
          <Row label="Fecha" value={fechaHora(order.date)} />
          <Row label="Forma de pago" value={metodo} />
          <Row label="Entrega" value={order.address || order.customerAddress} />
          {order.paymentReference && <Row label="Referencia" value={order.paymentReference} />}
        </div>

        {texto && <div className="rounded-xl bg-primary/10 p-3 text-sm text-foreground">{texto}</div>}

        <div>
          <p className="text-sm font-semibold text-foreground mb-3">Productos</p>
          {!order.hasDetail ? (
            <div className="h-16 animate-pulse rounded-xl bg-muted" />
          ) : (
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × {dinero(item.unitPrice)}
                      {order.status === ORDER_STATUS.PENDING && !isClient && ` · stock: ${item.stock}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground whitespace-nowrap">{dinero(item.subtotal)}</p>
                    {order.status === ORDER_STATUS.PENDING && !item.available && <Badge variant="danger">Sin stock</Badge>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {(order.hasProof || (order.status === ORDER_STATUS.PENDING && order.paymentMethod === "transferencia")) && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Comprobante de la transferencia</p>
            {order.hasProof ? (
              <ImagenPrivada ruta={`/pedidos/${order.id}/comprobante`} version={version} />
            ) : (
              <p className="text-sm text-destructive">Este pedido todavía no tiene comprobante.</p>
            )}
            {order.status === ORDER_STATUS.PENDING && onUploadProof && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <CampoComprobante valor={nuevo} onCambio={setNuevo} />
                </div>
                {nuevo && (
                  <Button type="button" onClick={subir} disabled={subiendo}>
                    {subiendo ? "Subiendo..." : order.hasProof ? "Cambiar comprobante" : "Guardar comprobante"}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {order.notes && (
          <div className="rounded-xl bg-muted/50 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Notas</p>
            <p className="text-sm text-foreground">{order.notes}</p>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-lg font-semibold text-foreground">Total</span>
          <span className="text-xl font-bold text-primary">{dinero(order.total)}</span>
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          {order.saleId && (
            <Button type="button" variant="outline" onClick={() => navigate(isClient ? "/panel/pagos" : "/panel/ventas")}>
              {isClient ? "Ver mis compras y pagos" : `Ver venta ${order.invoice ?? ""}`}
            </Button>
          )}
          {canConvert && order.status === ORDER_STATUS.PENDING && (
            <Button type="button" onClick={() => onConvert(order)}>
              Convertir en venta
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

export { OrderDetailModal };
