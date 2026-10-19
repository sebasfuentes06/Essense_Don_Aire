import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Minus, Plus, Trash2, ClipboardCheck, ArrowLeft, Flower2, Upload, Landmark, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Modal } from "../components/ui/Modal";
import { useAuth } from "../auth";
import { useOrdersStore } from "../orders";
import { useCart } from "./CartContext";
import { dinero, METODOS_PEDIDO_CLIENTE, clientes, pagos, leerImagen } from "../negocio";

/**
 * Carrito y "Hacer pedido" del Cliente (mismo flujo que la app móvil):
 *  1. Revisar productos y cantidades.
 *  2. Escoger cómo pagar: Wompi, transferencia (foto del comprobante
 *     OBLIGATORIA) o efectivo en el punto físico; dirección y notas.
 */
function CartModal() {
  const cart = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrdersStore();
  const navigate = useNavigate();

  const [paso, setPaso] = useState("carrito");
  const [metodo, setMetodo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");
  const [referencia, setReferencia] = useState("");
  const [comprobante, setComprobante] = useState(null);
  const [datosPago, setDatosPago] = useState({});
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Al abrir el paso de pago: datos de la cuenta y la dirección de su ficha.
  useEffect(() => {
    if (!cart.isOpen || paso !== "pago") return;
    pagos.datosPago().then(setDatosPago);
    if (!direccion && user?.idCliente) {
      clientes
        .obtener(user.idCliente)
        .then((c) => setDireccion([c.address, c.city].filter(Boolean).join(", ")))
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.isOpen, paso]);

  const cerrar = () => {
    cart.close();
    setPaso("carrito");
    setError("");
  };

  const elegirComprobante = async (e) => {
    setError("");
    try {
      setComprobante(await leerImagen(e.target.files?.[0]));
    } catch (err) {
      setError(err.message);
    }
    e.target.value = "";
  };

  const enviar = async () => {
    setError("");
    if (!metodo) return setError("Elige cómo vas a pagar tu pedido.");
    if (metodo === "transferencia" && !comprobante) return setError("Adjunta la foto del comprobante de la transferencia.");
    setEnviando(true);
    try {
      const { order, message } = await createOrder({
        metodo_pago: metodo,
        items: cart.items.map((i) => ({ id_producto: i.id, cantidad: i.quantity })),
        direccion_entrega: direccion.trim(),
        notas: notas.trim(),
        ...(metodo === "transferencia" && {
          comprobante: { base64: comprobante.base64, tipo_mime: comprobante.tipo_mime },
          referencia_pago: referencia.trim() || undefined
        })
      });
      cart.clear();
      setMetodo("");
      setNotas("");
      setReferencia("");
      setComprobante(null);
      cerrar();
      toast.success(message ?? `Pedido ${order.folio} registrado.`);
      navigate("/panel/pedidos");
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const titulo = paso === "carrito" ? "Mi carrito" : "¿Cómo vas a pagar?";

  return (
    <Modal isOpen={cart.isOpen} onClose={cerrar} size="lg" title={titulo}>
      {cart.items.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground">Aún no has agregado fragancias al carrito.</div>
      ) : paso === "carrito" ? (
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
                  {item.quantity >= item.stock && <p className="text-xs text-destructive">Máximo {item.stock} disponibles</p>}
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
                  aria-label={`Quitar ${item.name} del carrito`}
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

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={cerrar}>
              Seguir comprando
            </Button>
            <Button type="button" onClick={() => setPaso("pago")}>
              <ClipboardCheck className="h-5 w-5" />
              Hacer pedido
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="space-y-2">
            {METODOS_PEDIDO_CLIENTE.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMetodo(m.value)}
                aria-pressed={metodo === m.value}
                className={`w-full rounded-xl border p-4 text-left transition-all ${
                  metodo === m.value ? "border-primary bg-primary/10 ring-2 ring-primary" : "border-border hover:border-primary/50"
                }`}
              >
                <p className="font-semibold text-foreground">{m.label}</p>
                <p className="text-sm text-muted-foreground">{m.ayuda}</p>
              </button>
            ))}
          </div>

          {metodo === "transferencia" && (
            <div className="space-y-3 rounded-xl border border-border p-4">
              <div className="flex items-start gap-3">
                <Landmark className="mt-0.5 h-5 w-5 text-primary" />
                <p className="text-sm text-foreground">
                  {datosPago.transferencia ? (
                    <>
                      Transfiere <b>{dinero(cart.total)}</b> a: <b>{datosPago.transferencia}</b>. Luego sube la foto del comprobante.
                    </>
                  ) : (
                    <>Transfiere <b>{dinero(cart.total)}</b> a la cuenta que te indicamos por WhatsApp y sube la foto del comprobante.</>
                  )}
                </p>
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-primary/50 p-3 hover:bg-primary/5">
                {comprobante ? (
                  <img src={comprobante.vista} alt="Comprobante" className="h-16 w-16 rounded-lg object-cover" />
                ) : (
                  <Upload className="h-6 w-6 text-primary" />
                )}
                <span className="text-sm">
                  {comprobante ? "Comprobante adjunto · clic para cambiarlo" : "Adjuntar comprobante (obligatorio)"}
                  <span className="block text-xs text-muted-foreground">Foto o captura de la transferencia (JPG, PNG o WEBP)</span>
                </span>
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={elegirComprobante} />
              </label>
              <input
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                placeholder="Número de la transacción (opcional)"
                className="h-10 w-full rounded-xl border border-input bg-input-background px-3 text-sm"
              />
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Dirección de entrega
              <input
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-input bg-input-background px-3 text-sm"
              />
            </label>
            <label className="block text-sm font-medium text-foreground">
              Notas (hora, empaque, regalo...)
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                maxLength={250}
                rows={2}
                className="mt-1 w-full rounded-xl border border-input bg-input-background p-3 text-sm"
              />
            </label>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-lg font-semibold text-foreground">Total</span>
            <span className="text-xl font-bold text-primary">{dinero(cart.total)}</span>
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setPaso("carrito")}>
              <ArrowLeft className="h-4 w-4" />
              Volver al carrito
            </Button>
            <Button type="button" onClick={enviar} disabled={enviando}>
              {enviando ? "Enviando..." : "Confirmar pedido"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

/** Barra fija del carrito: se ve en cualquier pantalla mientras tenga algo. */
function CartBar() {
  const cart = useCart();
  if (cart.count === 0 || cart.isOpen) return null;
  return (
    <button
      type="button"
      onClick={cart.open}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-primary px-5 py-3 text-primary-foreground shadow-xl transition hover:bg-primary/90"
    >
      <span className="relative">
        <ShoppingCartIcon />
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-background px-1 text-xs font-bold text-primary">
          {cart.count}
        </span>
      </span>
      <span className="font-semibold">{dinero(cart.total)}</span>
      <span className="text-sm opacity-90">Ver carrito</span>
    </button>
  );
}

function ShoppingCartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

export { CartModal, CartBar };
