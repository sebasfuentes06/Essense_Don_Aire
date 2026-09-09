import { useState } from "react";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/input";
import { Select } from "../../../../shared/components/ui/Select";
import { Button } from "../../../../shared/components/ui/button";
import { useProductCatalog } from "../../hooks/productCatalog";

const channelOptions = [
  { value: "web", label: "Web" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "fisico", label: "Punto físico" }
];

function OrderFormModal({ isOpen, isEditing, form, onFormChange, onSave, onClose, isClient }) {
  const { products } = useProductCatalog();
  const [productId, setProductId] = useState(String(products[0]?.id ?? ""));
  const [quantity, setQuantity] = useState("1");
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const subtotal = form.items.reduce((sum, item) => sum + item.subtotal, 0);

  const setField = (field, value) => {
    onFormChange({ ...form, [field]: value });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleAddItem = () => {
    const product = products.find((candidate) => String(candidate.id) === String(productId));
    const qty = Number(quantity);

    if (!product || !Number.isFinite(qty) || qty <= 0) {
      setErrors((prev) => ({ ...prev, items: "Elige un producto y una cantidad mayor a cero." }));
      return;
    }

    const existing = form.items.find((item) => item.productId === product.id);
    const items = existing
      ? form.items.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + qty,
                subtotal: Number(((item.quantity + qty) * item.unitPrice).toFixed(2))
              }
            : item
        )
      : [
          ...form.items,
          {
            productId: product.id,
            productName: product.name,
            quantity: qty,
            unitPrice: product.price,
            discount: 0,
            subtotal: Number((product.price * qty).toFixed(2))
          }
        ];

    onFormChange({ ...form, items });
    setQuantity("1");
    setErrors((prev) => ({ ...prev, items: "" }));
  };

  const handleRemoveItem = (id) => {
    onFormChange({ ...form, items: form.items.filter((item) => item.productId !== id) });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!String(form.customer ?? "").trim()) nextErrors.customer = "Indica el cliente del pedido.";
    if (form.items.length === 0) nextErrors.items = "Agrega al menos un producto.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={isEditing ? "Editar pedido" : "Registrar pedido"}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Input
              label="Cliente"
              name="customer"
              value={form.customer}
              onChange={(event) => setField("customer", event.target.value)}
              disabled={isClient}
              placeholder="Nombre del cliente"
              required
            />
            {errors.customer && <p className="mt-1.5 text-sm text-destructive">{errors.customer}</p>}
          </div>

          <Select
            label="Canal"
            value={form.channel}
            onChange={(event) => setField("channel", event.target.value)}
            options={channelOptions}
          />

          <Input
            label="Fecha estimada de entrega"
            name="deliveryDate"
            type="date"
            value={form.deliveryDate}
            onChange={(event) => setField("deliveryDate", event.target.value)}
          />

          <Input
            label="Observaciones"
            name="notes"
            value={form.notes}
            onChange={(event) => setField("notes", event.target.value)}
            placeholder="Opcional"
          />
        </div>

        <div className="border-t border-border pt-5">
          <p className="text-sm font-semibold text-foreground mb-3">Productos del pedido</p>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px_auto] sm:items-end">
            <Select
              label="Producto"
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
              options={products.map((product) => ({
                value: String(product.id),
                label: `${product.name} — $${product.price.toFixed(2)}`
              }))}
            />
            <Input
              label="Cantidad"
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
            <Button type="button" variant="outline" onClick={handleAddItem}>
              <Plus className="h-4 w-4" />
              Agregar
            </Button>
          </div>

          {errors.items && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive">{errors.items}</p>
            </div>
          )}

          {form.items.length > 0 && (
            <div className="mt-4 space-y-2">
              {form.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground whitespace-nowrap">
                      ${item.subtotal.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-md text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveItem(item.productId)}
                      aria-label={`Quitar ${item.productName} del pedido`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-lg font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">${subtotal.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">{isEditing ? "Guardar cambios" : "Crear pedido"}</Button>
        </div>
      </form>
    </Modal>
  );
}

export { OrderFormModal };
