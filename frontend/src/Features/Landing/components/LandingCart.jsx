import { Flower2, LogIn, Minus, Plus, ShoppingBag, Trash2, UserPlus } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Modal } from "../../../shared/components/ui/Modal";
import { Button } from "../../../shared/components/ui/button";
import { useAuth, ROLES } from "../../../shared/auth";
import { useCart, MARCA_FINALIZAR } from "../../../shared/cart";
import { dinero } from "../../../shared/negocio";

/**
 * Carrito de la vitrina. Cualquiera puede ir armándolo; para finalizar la
 * compra hay que entrar con una cuenta de cliente (o crearla). El carrito se
 * guarda y, al iniciar sesión, pasa a la cuenta para hacer el pedido.
 */
function LandingCart() {
  const cart = useCart();
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const finalizar = () => {
    if (user && role !== ROLES.CLIENT) {
      toast.error("Las compras se hacen con una cuenta de cliente.");
      return;
    }
    try {
      window.sessionStorage.setItem(MARCA_FINALIZAR, "1");
    } catch {
      /* sin almacenamiento */
    }
    cart.close();
    navigate(user ? "/panel" : "/login");
  };

  return (
    <>
      {cart.count > 0 && !cart.isOpen && (
        <button
          type="button"
          onClick={cart.open}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-[#C9A227] px-5 py-3 font-semibold text-[#0b0d10] shadow-2xl transition hover:bg-[#b8911f]"
        >
          <span className="relative">
            <ShoppingBag className="h-6 w-6" />
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0b0d10] px-1 text-xs text-[#C9A227]">
              {cart.count}
            </span>
          </span>
          {dinero(cart.total)}
          <span className="text-sm font-normal">Ver carrito</span>
        </button>
      )}

      <Modal isOpen={cart.isOpen} onClose={cart.close} size="lg" title="Tu carrito">
        <div className="text-foreground">
        {cart.items.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">Aún no has agregado fragancias.</p>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-16 w-14 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-16 w-14 items-center justify-center rounded-lg bg-primary/10">
                      <Flower2 className="h-6 w-6 text-primary/60" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-primary">{dinero(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-muted"
                      onClick={() => cart.setQuantity(item.id, item.quantity - 1)}
                      aria-label={`Restar una unidad de ${item.name}`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      disabled={item.quantity >= item.stock}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-muted disabled:opacity-40"
                      onClick={() => cart.setQuantity(item.id, item.quantity + 1)}
                      aria-label={`Sumar una unidad de ${item.name}`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-destructive hover:bg-destructive/10"
                    onClick={() => cart.remove(item.id)}
                    aria-label={`Quitar ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-lg font-semibold text-foreground">Total</span>
              <span className="text-xl font-bold text-primary">{dinero(cart.total)}</span>
            </div>

            {user ? (
              <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={cart.close}>
                  Seguir comprando
                </Button>
                <Button onClick={finalizar}>
                  <ShoppingBag className="h-4 w-4" /> Finalizar compra
                </Button>
              </div>
            ) : (
              <div className="space-y-3 border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">
                  Para continuar con tu compra, regístrate como cliente. Tu carrito queda guardado y lo encuentras al entrar con tu cuenta.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button variant="outline" onClick={cart.close}>
                    Seguir comprando
                  </Button>
                  <Button
                    onClick={() => {
                      try {
                        window.sessionStorage.setItem(MARCA_FINALIZAR, "1");
                      } catch {
                        /* sin almacenamiento */
                      }
                      cart.close();
                      navigate("/registro");
                    }}
                  >
                    <UserPlus className="h-4 w-4" /> Registrarme para continuar
                  </Button>
                </div>
                <p className="text-center text-sm text-muted-foreground sm:text-right">
                  ¿Ya tienes cuenta?{" "}
                  <button type="button" onClick={finalizar} className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                    <LogIn className="h-3.5 w-3.5" /> Inicia sesión
                  </button>
                </p>
              </div>
            )}
          </div>
        )}
        </div>
      </Modal>
    </>
  );
}

export { LandingCart };
