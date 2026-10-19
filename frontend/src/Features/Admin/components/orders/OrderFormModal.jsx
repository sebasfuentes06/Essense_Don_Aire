import { useEffect, useState } from "react";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/input";
import { Select } from "../../../../shared/components/ui/Select";
import { Button } from "../../../../shared/components/ui/button";
import { cargarProductos, clientes, dinero, SelectorMetodo } from "../../../../shared/negocio";

const channelOptions = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "punto_fisico", label: "Punto físico" }
];

/**
 * Registrar o editar un pedido (equipo). No descuenta stock: eso pasa al
 * convertirlo en venta. Clientes y productos salen de la API.
 */
function OrderFormModal({ isOpen, editingOrder, onSave, onClose }) {
  const [productos, setProductos] = useState([]);
  const [listaClientes, setListaClientes] = useState([]);
  const [form, setForm] = useState({ customerId: "", channel: "whatsapp", paymentMethod: "", address: "", notes: "", items: [] });
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    Promise.all([cargarProductos({ status: "active" }), clientes.listar({ status: "active" })])
      .then(([p, c]) => {
        setProductos(p);
        setListaClientes(c);
        setProductId(String(p.find((x) => x.inStock)?.id ?? ""));
      })
      .catch((e) => setError(e.message));
    const o = editingOrder;
    setForm(
      o
        ? {
            customerId: String(o.customerId),
            channel: o.channel === "app" ? "app" : o.channel,
            paymentMethod: o.paymentMethod ?? "",
            address: o.address ?? "",
            notes: o.notes ?? "",
            items: o.items.map((i) => ({ productId: i.productId, productName: i.productName, quantity: i.quantity, unitPrice: i.unitPrice }))
          }
        : { customerId: "", channel: "whatsapp", paymentMethod: "", address: "", notes: "", items: [] }
    );
  }, [isOpen, editingOrder]);

  if (!isOpen) return null;
  const total = form.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const set = (campo, v) => setForm((f) => ({ ...f, [campo]: v }));

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

  const elegirCliente = (id) => {
    const c = listaClientes.find((x) => String(x.id) === String(id));
    setForm((f) => ({ ...f, customerId: id, address: f.address || [c?.address, c?.city].filter(Boolean).join(", ") }));
  };

  const guardar = async (e) => {
    e.preventDefault();
    if (!form.customerId) return setError("Elige el cliente del pedido.");
    if (form.items.length === 0) return setError("Agrega al menos un producto.");
    setGuardando(true);
    try {
      await onSave({
        id_cliente: Number(form.customerId),
        ...(form.channel !== "app" && { canal: form.channel }),
        ...(form.paymentMethod && { metodo_pago: form.paymentMethod }),
        direccion_entrega: form.address.trim(),
        notas: form.notes.trim(),
        items: form.items.map((i) => ({ id_producto: i.productId, cantidad: i.quantity }))
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={editingOrder ? `Editar ${editingOrder.folio}` : "Registrar pedido"}>
      <form className="space-y-5" onSubmit={guardar}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Cliente"
            required
            value={form.customerId}
            onChange={(e) => elegirCliente(e.target.value)}
            options={[
              { value: "", label: listaClientes.length ? "Selecciona el cliente..." : "Cargando clientes..." },
              ...listaClientes.map((c) => ({ value: String(c.id), label: `${c.name}${c.phone ? ` · ${c.phone}` : ""}` }))
            ]}
          />
          {form.channel === "app" ? (
            <Input label="Canal" value="App / Web (lo hizo el cliente)" disabled />
          ) : (
            <Select label="Canal" value={form.channel} onChange={(e) => set("channel", e.target.value)} options={channelOptions} />
          )}
          <Input label="Dirección de entrega" value={form.address} onChange={(e) => set("address", e.target.value)} />
          <Input label="Notas" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Opcional" />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Forma de pago (opcional)</p>
          <SelectorMetodo valor={form.paymentMethod} onCambio={(m) => set("paymentMethod", form.paymentMethod === m ? "" : m)} />
        </div>

        <div className="border-t border-border pt-5">
          <p className="text-sm font-semibold text-foreground mb-3">Productos del pedido</p>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_110px_auto] sm:items-end">
            <Select
              label="Producto"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              options={productos.map((p) => ({
                value: String(p.id),
                label: `${p.name} — ${dinero(p.price)} (${p.stock} disp.)`
              }))}
            />
            <Input label="Cantidad" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <Button type="button" variant="outline" onClick={agregar}>
              <Plus className="h-4 w-4" />
              Agregar
            </Button>
          </div>
          {form.items.length > 0 && (
            <div className="mt-4 space-y-2">
              {form.items.map((i) => (
                <div key={i.productId} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{i.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {i.quantity} × {dinero(i.unitPrice)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground whitespace-nowrap">{dinero(i.quantity * i.unitPrice)}</span>
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
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-lg font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">{dinero(total)}</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : editingOrder ? "Guardar cambios" : "Crear pedido"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export { OrderFormModal };
