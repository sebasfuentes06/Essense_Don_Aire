import { useState } from "react";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Button } from "../../../../shared/components/ui/button";
import { Badge } from "../../../../shared/components/ui/Badge";
import { CampoComprobante, ImagenPrivada, dinero, fechaHora, NOMBRES_METODO, NOMBRES_ESTADO_PAGO } from "../../../../shared/negocio";
import { VARIANTE_ESTADO_PAGO } from "./PaymentsTable";

const Fila = ({ label, children }) => (
  <div className="flex justify-between gap-4 py-1.5 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right font-medium text-foreground">{children}</span>
  </div>
);

/** Detalle de un pago con su comprobante y las acciones que correspondan. */
function PaymentDetailModal({ payment, isClient, isAdmin, onClose, onApprove, onReject, onVoid, onUploadProof }) {
  const [nuevo, setNuevo] = useState(null);
  const [version, setVersion] = useState(0);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  if (!payment) return null;
  const p = payment;
  const puedeCambiarComprobante = p.status === "pendiente" && (isClient || isAdmin);

  const subir = async () => {
    setSubiendo(true);
    setError("");
    try {
      await onUploadProof(p, { base64: nuevo.base64, tipo_mime: nuevo.tipo_mime });
      setNuevo(null);
      setVersion((v) => v + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="lg" title={`Pago ${p.invoice ? `· ${p.invoice}` : ""}`}>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <Badge variant={VARIANTE_ESTADO_PAGO[p.status] ?? "default"}>{NOMBRES_ESTADO_PAGO[p.status] ?? p.status}</Badge>
          <span className="text-2xl font-bold text-primary">{dinero(p.amount)}</span>
        </div>
        <div className="divide-y divide-border rounded-xl border border-border px-4 py-2">
          <Fila label="Fecha">{fechaHora(p.date)}</Fila>
          {!isClient && <Fila label="Cliente">{p.customer}</Fila>}
          <Fila label="Método">{NOMBRES_METODO[p.method] ?? p.method}</Fila>
          {p.reference && <Fila label="Referencia">{p.reference}</Fila>}
          {p.note && <Fila label="Nota">{p.note}</Fila>}
          {p.rejectReason && <Fila label="Motivo">{p.rejectReason}</Fila>}
        </div>

        {p.hasProof ? (
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Comprobante</p>
            <ImagenPrivada ruta={`/pagos/${p.id}/comprobante`} version={version} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Este pago no tiene comprobante adjunto.</p>
        )}

        {puedeCambiarComprobante && (
          <div className="space-y-2">
            <CampoComprobante valor={nuevo} onCambio={setNuevo} />
            {nuevo && (
              <Button size="sm" onClick={subir} disabled={subiendo}>
                {subiendo ? "Subiendo..." : p.hasProof ? "Reemplazar comprobante" : "Subir comprobante"}
              </Button>
            )}
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-4">
          {isAdmin && p.status === "aplicado" && (
            <Button variant="outline" className="text-destructive" onClick={() => onVoid(p)}>
              Anular pago
            </Button>
          )}
          {isAdmin && p.status === "pendiente" && (
            <>
              <Button variant="outline" className="text-destructive" onClick={() => onReject(p)}>
                Rechazar
              </Button>
              <Button onClick={() => onApprove(p)}>Aprobar pago</Button>
            </>
          )}
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export { PaymentDetailModal };
