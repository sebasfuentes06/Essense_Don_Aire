import { NOMBRES_METODO, METODOS_VENTA, METODOS_ABONO, dinero } from "./formato";
import { CampoComprobante } from "./CampoComprobante";

/** Botones para escoger el método de pago (obligatorio en ventas). */
function SelectorMetodo({ valor, onCambio, opciones = METODOS_VENTA, error }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {opciones.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onCambio(m)}
            aria-pressed={valor === m}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              valor === m ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/60"
            }`}
          >
            {NOMBRES_METODO[m] ?? m}
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}

export const PAGO_VACIO = { monto: "", metodo: "efectivo", referencia: "", comprobante: null };

/** Monto (con botón "Todo"), método, referencia y comprobante de un pago. */
function CamposPago({ valor, onCambio, maximo, metodos = METODOS_ABONO, pedirComprobante = true, comprobanteObligatorio = false, errores = {} }) {
  const set = (campo, v) => onCambio({ ...valor, [campo]: v });
  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-foreground">Monto</label>
        <div className="mt-1 flex gap-2">
          <input
            inputMode="numeric"
            value={valor.monto}
            onChange={(e) => set("monto", e.target.value.replace(/\D/g, ""))}
            placeholder="0"
            className="h-10 flex-1 rounded-xl border border-input bg-input-background px-3 text-sm"
          />
          {maximo > 0 && (
            <button type="button" className="rounded-xl border border-border px-3 text-sm hover:bg-muted" onClick={() => set("monto", String(Math.round(maximo)))}>
              Todo ({dinero(maximo)})
            </button>
          )}
        </div>
        {errores.monto && <p className="mt-1 text-sm text-destructive">{errores.monto}</p>}
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Método</label>
        <div className="mt-1">
          <SelectorMetodo valor={valor.metodo} onCambio={(m) => set("metodo", m)} opciones={metodos} />
        </div>
      </div>
      {valor.metodo !== "efectivo" && (
        <>
          <input
            value={valor.referencia}
            onChange={(e) => set("referencia", e.target.value)}
            placeholder="Referencia / número de la transacción (opcional)"
            className="h-10 w-full rounded-xl border border-input bg-input-background px-3 text-sm"
          />
          {pedirComprobante && (
            <CampoComprobante valor={valor.comprobante} onCambio={(c) => set("comprobante", c)} obligatorio={comprobanteObligatorio} />
          )}
        </>
      )}
    </div>
  );
}

/** Pago del formulario -> cuerpo de la API. */
export function pagoAApi(p) {
  return {
    monto: Number(p.monto),
    metodo: p.metodo,
    ...(p.referencia?.trim() && { referencia: p.referencia.trim() }),
    ...(p.comprobante && { comprobante: { base64: p.comprobante.base64, tipo_mime: p.comprobante.tipo_mime } })
  };
}

export { SelectorMetodo, CamposPago };
