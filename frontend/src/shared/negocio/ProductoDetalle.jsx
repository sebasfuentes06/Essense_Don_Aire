import { useEffect, useState } from "react";
import { Flower2, Minus, Plus, ShoppingCart } from "lucide-react";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/Badge";
import { dinero } from "./formato";

/**
 * Detalle de un producto: foto grande, descripción completa, precio y
 * disponibilidad. Si se pasa `onAgregar`, deja escoger la cantidad y
 * agregarla al carrito. Lo usan el catálogo del panel y la vitrina pública.
 */
function ProductoDetalle({ product, onClose, onAgregar, enCarrito = 0, nota }) {
  const [cantidad, setCantidad] = useState(1);
  useEffect(() => setCantidad(1), [product?.id]);
  if (!product) return null;
  const p = product;
  const maximo = Math.max(0, p.stock - enCarrito);

  return (
    <Modal isOpen onClose={onClose} size="lg" title={p.name}>
      {/* text-foreground: en la vitrina el modal hereda el texto claro del fondo oscuro. */}
      <div className="grid gap-6 text-foreground sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
          {p.image ? (
            <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10">
              <Flower2 className="h-20 w-20 text-primary/50" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {p.category && <Badge variant="info">{p.category}</Badge>}
            {p.sku && <span className="text-xs text-muted-foreground">Ref. {p.sku}</span>}
          </div>
          <p className="text-3xl font-bold text-primary">{dinero(p.price)}</p>
          <div>
            <p className="mb-1 text-sm font-semibold text-foreground">Descripción</p>
            <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
              {p.description || "Fragancia de nuestra colección Essence Don Aire."}
            </p>
          </div>
          <p className={`text-sm font-medium ${p.inStock ? "text-emerald-600" : "text-destructive"}`}>
            {p.inStock ? `${p.stock} unidad(es) disponibles` : "Agotado por ahora"}
            {enCarrito > 0 && <span className="text-muted-foreground"> · {enCarrito} en tu carrito</span>}
          </p>

          {onAgregar && p.inStock && (
            <div className="mt-auto space-y-3 border-t border-border pt-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Cantidad</span>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-input hover:bg-muted disabled:opacity-40"
                  disabled={cantidad <= 1}
                  onClick={() => setCantidad((c) => c - 1)}
                  aria-label="Restar"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-semibold">{cantidad}</span>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-input hover:bg-muted disabled:opacity-40"
                  disabled={cantidad >= maximo}
                  onClick={() => setCantidad((c) => c + 1)}
                  aria-label="Sumar"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button className="w-full" disabled={maximo < 1} onClick={() => onAgregar(p, cantidad) && onClose()}>
                <ShoppingCart className="h-4 w-4" />
                {maximo < 1 ? "Ya tienes todo el stock en el carrito" : `Agregar al carrito · ${dinero(p.price * cantidad)}`}
              </Button>
            </div>
          )}
          {nota && <p className="text-sm text-muted-foreground">{nota}</p>}
        </div>
      </div>
    </Modal>
  );
}

export { ProductoDetalle };
