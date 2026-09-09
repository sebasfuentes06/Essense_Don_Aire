import { Minus, Plus, Trash2, ClipboardCheck } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { Modal } from "../../../../shared/components/ui/Modal";

function CartModal({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onConfirmOrder, canOrder }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Carrito de compras">
      {items.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground">
          Aún no has agregado fragancias al carrito.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <img src={item.image} alt={item.name} className="h-16 w-14 rounded-lg object-cover" />

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-primary">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-muted"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    aria-label={`Restar una unidad de ${item.name}`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-muted"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    aria-label={`Sumar una unidad de ${item.name}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-destructive hover:bg-destructive/10"
                  onClick={() => onRemoveItem(item.id)}
                  aria-label={`Quitar ${item.name} del carrito`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-lg font-semibold text-foreground">Total</span>
            <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Continuar comprando
            </Button>
            {canOrder && (
              <Button type="button" onClick={onConfirmOrder}>
                <ClipboardCheck className="h-5 w-5" />
                Confirmar pedido
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

export { CartModal };
