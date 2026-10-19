import { useEffect, useState } from "react";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/input";
import { Select } from "../../../../shared/components/ui/Select";
import { Button } from "../../../../shared/components/ui/button";
import { cargarProductos, clientes, dinero, SelectorMetodo, CamposPago, PAGO_VACIO, pagoAApi } from "../../../../shared/negocio";

const VACIO = { customerId: "", channel: "punto_fisico", method: "", discount: "", notes: "", items: [], payNow: true };

/**
 * Venta directa (sin pedido): descuenta stock y genera la factura al guardar.
 * El método de pago es obligatorio, como en la app.
 */
function SaleFormModal({ isOpen, onSave, onClose }) {
  const [productos, setProductos] = useState([]);
  const [listaClientes, setListaClientes] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [pago, setPago] = useState(PAGO_VACIO);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setForm(VACIO);
    setPago(PAGO_VACIO);
    setError("");
    Promise.all([cargarProductos({ status: "active" }), clientes.listar({ status: "active" })])
      .then(([p, c]) => {
        setProductos(p.filter((x) => x.inStock));
        setListaClientes(c);
        setProductId(String(p.find((x) => x.inStock)?.id ?? ""));
      })
      .catch((e) => setError(e.message));
  }, [isOpen]);

  if (!isOpen) return null;
  const set = (campo, v) => setForm((f) => ({ ...f, [campo]: v }));
  const subtotal = form.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const total = Math.max(0, subtotal - Number(form.discount || 0));

  const agregar = () => {
    const p = productos.find((x) => String(x.id) === String(productId));
    const qty = Number(quantity);
    if (!p || !(qty > 0)) return setError("Elige un producto y una cantidad mayor a cero.");
    const actual = form.items.find((i) => i.productId === p.id);
    if ((actual?.quantity ?? 0) + qty > p.stock) return setError(`${p.name}: solo hay ${p.stock} en stock.`);
    setError("");
    set(
      "items",
      actual
        ? form.items.map((i) => (i.productId === p.id ? { ...i, quantity: i.quantity + qty } : i))
        : [...form.items, { productId: p.id, productName: p.name, quantity: qty, unitPrice: p.price }]
    );
    setQuantity("1");
  };

  const elegirMetodo = (m) => {
    set("method", m);
    if (m !== "wompi") setPago((p) => ({ ...p, metodo: m }));
  };

  const guardar = async (e) => {
    e.preventDefault();
    if (!form.customerId) return setError("Elige el cliente.");
    if (form.items.length === 0) return setError("Agrega al menos un producto.");
    if (!form.method) return setError("Elige la forma de pago.");
    if (Number(form.discount || 0) > subtotal) return setError("El descuento no puede superar el subtotal.");
    const conPago = form.method !== "wompi" && form.payNow && Number(pago.monto) > 0;
    if (conPago && Number(pago.monto) > total) return setError(`El pago no puede superar ${dinero(total)}.`);
    setGuardando(true);
    try {
      await onSave({
        id_cliente: Number(form.customerId),
        canal: form.channel,
        metodo_pago: form.method,
        descuento: Number(form.discount || 0),
        notas: form.notes.trim(),
        items: form.items.map((i) => ({ id_producto: i.productId, cantidad: i.quantity })),
        ...(conPago && { pago_inicial: pagoAApi(pago) })
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="lg" title="Registrar venta">
      <form className="space-y-5" onSubmit={guardar}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Cliente"
            required
            value={form.customerId}
            onChange={(e) => set("customerId", e.target.value)}
            options={[
              { value: "", label: listaClientes.length ? "Selecciona el cliente..." : "Cargando clientes..." },
              ...listaClientes.map((c) => ({ value: String(c.id), label: `${c.name}${c.document ? ` · ${c.document}` : ""}` }))
            ]}
          />
          <Select
            label="Canal"
            value={form.channel}
            onChange={(e) => set("channel", e.target.value)}
            options={[
              { value: "punto_fisico", label: "Punto físico" },
              { value: "whatsapp", label: "WhatsApp" }
            ]}
          />
        </div>

        <div className="border-t border-border pt-5">
          <p className="mb-3 text-sm font-semibold text-foreground">Productos</p>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_110px_auto] sm:items-end">
            <Select
              label="Producto"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              options={productos.map((p) => ({ value: String(p.id), label: `${p.name} — ${dinero(p.price)} (${p.stock} disp.)` }))}
            />
            <Input label="Cantidad" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <Button type="button" variant="outline" onClick={agregar}>
              <Plus className="h-4 w-4" /> Agregar
            </Button>
          </div>
          {form.items.length > 0 && (
            <div className="mt-4 space-y-2">
              {form.items.map((i) => (
                <div key={i.productId} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{i.productName}</p>
                    <p className="text-sm text-muted-foreground">{i.quantity} × {dinero(i.unitPrice)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="whitespace-nowrap font-medium">{dinero(i.quantity * i.unitPrice)}</span>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-md text-destructive hover:bg-destructive/10"
                      onClick={() => set("items", form.items.filter((x) => x.productId !== i.productId))}
                      aria-label={`Quitar ${i.productName}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Descuento (opcional)" inputMode="numeric" value={form.discount} onChange={(e) => set("discount", e.target.value.replace(/\D/g, ""))} />
          <Input label="Notas" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Opcional" />
        </div>
        <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
          <span>Total</span>
          <b className="text-xl text-primary">{dinero(total)}</b>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Forma de pago *</p>
          <SelectorMetodo valor={form.method} onCambio={elegirMetodo} />
        </div>
        {form.method && form.method !== "wompi" && (
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.payNow} onChange={(e) => set("payNow", e.target.checked)} className="h-4 w-4 accent-primary" />
              El cliente paga ahora (todo o un abono)
            </label>
            {form.payNow && <CamposPago valor={pago} onCambio={setPago} maximo={total} />}
          </div>
        )}
        {form.method === "wompi" && <p className="text-sm text-muted-foreground">Después de guardar, crea el link de Wompi desde el detalle de la venta.</p>}

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={guardando}>
            {guardando ? "Registrando..." : "Registrar venta"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export { SaleFormModal };
