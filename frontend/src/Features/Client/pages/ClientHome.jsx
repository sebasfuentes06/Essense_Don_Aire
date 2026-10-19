import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Sparkles, Package, ClipboardList, Wallet, ArrowRight } from "lucide-react";
import { Card, CardContent } from "../../../shared/components/ui/Card";
import { useAuth } from "../../../shared/auth";
import { useCart } from "../../../shared/cart";
import { useOrdersStore, ORDER_STATUS } from "../../../shared/orders";
import { ventas, dinero } from "../../../shared/negocio";
import { useProductCatalog } from "../../Admin/hooks/productCatalog";
import { ProductCard } from "../../Admin/components/productCatalog/ProductCard";

/**
 * Inicio del Cliente con datos reales: su saldo, sus pedidos pendientes y
 * las novedades del catálogo (con botón para agregar al carrito).
 */
function ClientHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const cart = useCart();
  const { products, isLoading } = useProductCatalog();
  const { orders } = useOrdersStore();
  const [saldo, setSaldo] = useState(null);

  useEffect(() => {
    ventas
      .listar({ estado_pago: "con_saldo" })
      .then((lista) => setSaldo({ total: lista.reduce((s, v) => s + v.balance, 0), ventas: lista.length }))
      .catch(() => setSaldo(null));
  }, []);

  const disponibles = useMemo(() => products.filter((p) => p.inStock), [products]);
  // Novedades: los productos más recientes que tienen stock (la API no marca "destacados").
  const novedades = useMemo(() => [...disponibles].sort((a, b) => b.id - a.id).slice(0, 6), [disponibles]);
  const pendientes = orders.filter((o) => o.status === ORDER_STATUS.PENDING).length;
  const enCarrito = (id) => cart.items.find((i) => i.id === id)?.quantity ?? 0;

  const agregar = (product) => {
    if (cart.add(product)) toast.success(`${product.name} agregado al carrito`, { action: { label: "Ver carrito", onClick: cart.open } });
    else toast.error(`Solo hay ${product.stock} unidad(es) de ${product.name}.`);
  };

  const stats = [
    { icon: Package, label: "Productos disponibles", value: isLoading ? "…" : disponibles.length, to: "/panel/catalogo" },
    { icon: ClipboardList, label: "Pedidos pendientes", value: pendientes, to: "/panel/pedidos" },
    {
      icon: Wallet,
      label: saldo?.ventas ? `Saldo pendiente (${saldo.ventas} compra/s)` : "Saldo pendiente",
      value: saldo ? dinero(saldo.total) : "…",
      to: "/panel/pagos",
      alerta: saldo?.total > 0
    }
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-6 sm:p-8">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Essence Don Aire</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Hola, {user?.name?.split(" ")[0] ?? "bienvenido"}</h1>
        <p className="mt-1 text-muted-foreground">Explora nuestras fragancias, arma tu carrito y haz tu pedido.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate("/panel/catalogo")}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-md transition-all hover:opacity-90"
          >
            Ver catálogo
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate("/panel/pedidos")}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-primary px-5 font-semibold text-primary transition-all hover:bg-primary/10"
          >
            Mis pedidos
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ icon: Icon, label, value, to, alerta }) => (
          <Card key={label} hover className="cursor-pointer" onClick={() => navigate(to)}>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${alerta ? "text-destructive" : "text-foreground"}`}>{value}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Novedades</h2>
          <button type="button" onClick={() => navigate("/panel/catalogo")} className="text-sm font-medium text-primary hover:underline">
            Ver todo
          </button>
        </div>
        {isLoading && novedades.length === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {novedades.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={agregar} inCart={enCarrito(product.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export { ClientHome };
