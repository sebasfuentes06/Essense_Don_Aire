import { useState } from "react";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/input";
import { Select } from "../../../../shared/components/ui/Select";
import { Button } from "../../../../shared/components/ui/button";
import { plata } from "./formato";

/**
 * Formulario para registrar una compra.
 *
 * Tres cambios de fondo respecto a la versión anterior:
 *
 * 1. El COSTO se escribe a mano. Antes se tomaba de `product.price`, que es
 *    el precio al que se le VENDE al cliente. Con eso toda compra quedaba
 *    registrada por encima de lo que realmente se le pagó al proveedor, y el
 *    margen del negocio desaparecía de los números.
 *
 * 2. Ya no hay desplegable de estado. El estado sale de los abonos: una
 *    compra nace Pendiente y pasa a Parcial o Pagada cuando se le registran
 *    pagos. Poder marcar "Pagada" a mano era poder mentir.
 *
 * 3. Los productos se limitan a los del proveedor elegido. La API rechaza lo
 *    contrario, así que ofrecer todos era dejar armar una compra entera para
 *    que fallara al guardar.
 *
 * El total que se muestra abajo es un anticipo para que la persona vea lo que
 * va a quedar; el que se guarda lo recalcula el servidor a partir de cantidad
 * × costo, porque cualquiera puede mandar otro con un fetch.
 */
function PurchaseFormModal({
  isOpen,
  onClose,
  purchaseForm,
  onFormChange,
  suppliers = [],
  supplierProducts = [],
  loadingProducts = false,
  serverError = "",
  serverFieldErrors = {},
  onSave
}) {
  const [guardando, setGuardando] = useState(false);
  const [nuevoItem, setNuevoItem] = useState({ id_producto: "", cantidad: 1, precio_costo: "" });
  const [errorItem, setErrorItem] = useState("");

  const items = Array.isArray(purchaseForm.items) ? purchaseForm.items : [];
  const impuesto = purchaseForm.impuesto === "" ? 0 : Number(purchaseForm.impuesto) || 0;
  const subtotal = items.reduce((suma, i) => suma + Number(i.cantidad) * Number(i.precio_costo), 0);
  const total = subtotal + impuesto;

  const cambiar = (cambios) => onFormChange({ ...purchaseForm, ...cambios });

  const cambiarProveedor = (valor) => {
    // Al cambiar de proveedor se vacían los ítems: los que había eran del
    // proveedor anterior y la API los rechazaría uno por uno.
    cambiar({ id_proveedor: valor ? Number(valor) : "", items: [] });
    setNuevoItem({ id_producto: "", cantidad: 1, precio_costo: "" });
    setErrorItem("");
  };

  const agregarItem = () => {
    const idProducto = Number(nuevoItem.id_producto);
    const cantidad = Number(nuevoItem.cantidad);
    const costo = Number(nuevoItem.precio_costo);

    if (!idProducto) return setErrorItem("Elige un producto.");
    if (!Number.isInteger(cantidad) || cantidad < 1) return setErrorItem("La cantidad debe ser un entero mayor que cero.");
    if (nuevoItem.precio_costo === "" || !Number.isFinite(costo) || costo < 0) {
      return setErrorItem("Escribe el costo unitario que te cobra el proveedor.");
    }
    if (items.some((i) => Number(i.id_producto) === idProducto)) {
      return setErrorItem("Ese producto ya está en la lista. Cámbiale la cantidad allá abajo.");
    }

    const producto = supplierProducts.find((p) => Number(p.id) === idProducto);
    cambiar({
      items: [...items, { id_producto: idProducto, nombre: producto?.nombre ?? "", sku: producto?.sku ?? "", cantidad, precio_costo: costo }]
    });
    setNuevoItem({ id_producto: "", cantidad: 1, precio_costo: "" });
    setErrorItem("");
  };

  const quitarItem = (idProducto) =>
    cambiar({ items: items.filter((i) => Number(i.id_producto) !== Number(idProducto)) });

  const guardar = async () => {
    setGuardando(true);
    try {
      await onSave();
    } finally {
      setGuardando(false);
    }
  };

  const productoElegido = supplierProducts.find((p) => Number(p.id) === Number(nuevoItem.id_producto));

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="Registrar compra">
      <div className="space-y-5">
        {serverError && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            label="Folio"
            value={purchaseForm.folio ?? ""}
            required
            error={serverFieldErrors.folio}
            onChange={(e) => cambiar({ folio: e.target.value })}
            placeholder="OC-001"
          />
          <Select
            label="Proveedor"
            value={String(purchaseForm.id_proveedor ?? "")}
            required
            error={serverFieldErrors.id_proveedor}
            onChange={(e) => cambiarProveedor(e.target.value)}
            options={[
              { value: "", label: "Seleccionar proveedor" },
              ...suppliers.map((s) => ({ value: String(s.id), label: s.nombre }))
            ]}
          />
          <Input
            label="Fecha"
            type="date"
            value={purchaseForm.fecha_compra ?? ""}
            max={new Date().toISOString().slice(0, 10)}
            error={serverFieldErrors.fecha_compra}
            onChange={(e) => cambiar({ fecha_compra: e.target.value })}
          />
        </div>

        {/* ----------------------------------------------------------- */}
        <div className="space-y-3 rounded-2xl border border-border bg-muted/20 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold text-foreground">Productos de la compra</h4>
            {!purchaseForm.id_proveedor && (
              <span className="text-xs text-muted-foreground">Elige primero un proveedor</span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_110px_150px_auto]">
            <Select
              label="Producto"
              value={String(nuevoItem.id_producto)}
              disabled={!purchaseForm.id_proveedor || loadingProducts}
              onChange={(e) => {
                const id = e.target.value;
                setNuevoItem((prev) => ({ ...prev, id_producto: id }));
                setErrorItem("");
              }}
              options={[
                {
                  value: "",
                  label: !purchaseForm.id_proveedor
                    ? "Elige un proveedor"
                    : loadingProducts
                      ? "Cargando…"
                      : supplierProducts.length === 0
                        ? "Este proveedor no tiene productos activos"
                        : "Seleccionar producto"
                },
                ...supplierProducts.map((p) => ({
                  value: String(p.id),
                  label: `${p.sku} — ${p.nombre} (stock ${p.stock})`
                }))
              ]}
            />

            <Input
              label="Cantidad"
              type="number"
              min="1"
              step="1"
              value={nuevoItem.cantidad}
              disabled={!purchaseForm.id_proveedor}
              onChange={(e) => setNuevoItem((prev) => ({ ...prev, cantidad: e.target.value }))}
            />

            {/*
              El costo es lo que TE cobra el proveedor, no lo que tú cobras.
              Se deja vacío a propósito en vez de proponer el precio de venta:
              un número ya escrito invita a aceptarlo sin mirarlo, y ese fue
              justamente el error de la versión anterior.
            */}
            <Input
              label="Costo unitario"
              type="number"
              min="0"
              step="0.01"
              value={nuevoItem.precio_costo}
              disabled={!purchaseForm.id_proveedor}
              onChange={(e) => setNuevoItem((prev) => ({ ...prev, precio_costo: e.target.value }))}
              placeholder="0"
            />

            <div className="flex items-end">
              <Button type="button" onClick={agregarItem} disabled={!purchaseForm.id_proveedor}>
                <Plus className="h-4 w-4" />
                Agregar
              </Button>
            </div>
          </div>

          {productoElegido && (
            <p className="text-xs text-muted-foreground">
              Se vende a {plata(productoElegido.precio)} · stock actual {productoElegido.stock}
            </p>
          )}

          {(errorItem || serverFieldErrors.items) && (
            <p className="text-xs font-medium text-destructive">{errorItem || serverFieldErrors.items}</p>
          )}

          <div className="overflow-hidden rounded-xl border border-border bg-background/40">
            {items.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                Todavía no has agregado productos.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Producto</th>
                    <th className="px-3 py-2">Cantidad</th>
                    <th className="px-3 py-2">Costo</th>
                    <th className="px-3 py-2">Subtotal</th>
                    <th className="w-[1%] px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id_producto} className="border-t border-border/70">
                      <td className="px-3 py-2.5">
                        <span className="font-medium text-foreground">{item.nombre}</span>
                        <span className="ml-2 font-mono text-xs text-muted-foreground">{item.sku}</span>
                      </td>
                      <td className="px-3 py-2.5">{item.cantidad}</td>
                      <td className="px-3 py-2.5">{plata(item.precio_costo)}</td>
                      <td className="px-3 py-2.5 font-medium text-foreground">
                        {plata(Number(item.cantidad) * Number(item.precio_costo))}
                      </td>
                      <td className="px-3 py-2.5">
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-destructive/10"
                          onClick={() => quitarItem(item.id_producto)}
                          title={`Quitar ${item.nombre}`}
                          aria-label={`Quitar ${item.nombre}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ----------------------------------------------------------- */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Impuesto"
            type="number"
            min="0"
            step="0.01"
            value={purchaseForm.impuesto ?? ""}
            error={serverFieldErrors.impuesto}
            onChange={(e) => cambiar({ impuesto: e.target.value })}
            placeholder="0"
          />

          <div className="space-y-1 rounded-xl border border-border bg-muted/20 p-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{plata(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Impuesto</span>
              <span>{plata(impuesto)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-1 text-base font-semibold text-foreground">
              <span>Total</span>
              <span>{plata(total)}</span>
            </div>
          </div>
        </div>

        <p className="rounded-xl border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
          Al registrar la compra, el stock de cada producto sube por la cantidad indicada.
          La compra nace <strong className="text-foreground">Pendiente</strong>: el estado cambia
          solo cuando le registres abonos.
        </p>

        <div className="flex justify-end gap-3 border-t border-border pt-5">
          <Button type="button" variant="outline" onClick={onClose} disabled={guardando}>
            Cancelar
          </Button>
          <Button type="button" onClick={guardar} disabled={guardando || items.length === 0}>
            {guardando ? "Registrando…" : "Registrar compra"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export { PurchaseFormModal };
