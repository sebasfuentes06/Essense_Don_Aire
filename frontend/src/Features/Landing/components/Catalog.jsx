import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { SectionHeader } from "./SectionHeader";
import { ProductCard } from "./ProductCard";
import { LandingCart } from "./LandingCart";
import { cargarProductos, ProductoDetalle } from "../../../shared/negocio";
import { useAuth, ROLES } from "../../../shared/auth";
import { useCart } from "../../../shared/cart";

const POR_TANDA = 6;

/**
 * Catálogo público con los productos reales de la API. El visitante ve el
 * detalle de cada fragancia y arma su carrito; para finalizar la compra
 * inicia sesión o se registra (ver LandingCart).
 */
function Catalog() {
  const [products, setProducts] = useState(null);
  const [categoria, setCategoria] = useState("Todas");
  const [visibles, setVisibles] = useState(POR_TANDA);
  const [detalle, setDetalle] = useState(null);
  const cart = useCart();
  const { user, role } = useAuth();
  // El equipo (admin/vendedor) puede mirar la vitrina, pero no comprar.
  const puedeComprar = !user || role === ROLES.CLIENT;

  useEffect(() => {
    let vivo = true;
    cargarProductos()
      .then((lista) => {
        if (!vivo) return;
        setProducts(
          lista
            .filter((p) => p.active && p.inStock)
            .sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)) || a.name.localeCompare(b.name, "es"))
        );
      })
      .catch(() => vivo && setProducts([]));
    return () => {
      vivo = false;
    };
  }, []);

  const categorias = useMemo(() => ["Todas", ...new Set((products ?? []).map((p) => p.category).filter(Boolean))], [products]);
  const filtrados = (products ?? []).filter((p) => categoria === "Todas" || p.category === categoria);
  const enCarrito = (id) => cart.items.find((i) => i.id === id)?.quantity ?? 0;

  const agregar = (product, cantidad = 1) => {
    if (cart.add(product, cantidad)) {
      toast.success(`${product.name} agregado al carrito`, { action: { label: "Ver carrito", onClick: cart.open } });
      return true;
    }
    toast.error(`Solo hay ${product.stock} unidad(es) de ${product.name}.`);
    return false;
  };

  return (
    <section id="catalogo" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 md:px-8">
      <SectionHeader eyebrow="Nuestra colección" subtitle="Cada fragancia es una obra de arte creada para despertar emociones únicas." />

      {products && products.length > 0 && categorias.length > 2 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {categorias.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCategoria(c);
                setVisibles(POR_TANDA);
              }}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                categoria === c ? "border-[#C9A227] bg-[#C9A227] text-[#0b0d10]" : "border-white/15 text-[#d9d2c8] hover:border-[#C9A227]/60"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {products === null ? (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[30rem] animate-pulse rounded-[28px] border border-white/10 bg-[#121417]" />
          ))}
        </div>
      ) : filtrados.length === 0 ? (
        <p className="text-center text-[#d9d2c8]/75">Muy pronto verás aquí nuestras fragancias.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filtrados.slice(0, visibles).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={setDetalle}
              onAdd={puedeComprar ? (p) => agregar(p) : undefined}
              inCart={puedeComprar ? enCarrito(product.id) : 0}
            />
          ))}
        </div>
      )}

      {filtrados.length > visibles && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibles((v) => v + POR_TANDA)}
            className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/60 bg-[#C9A227]/10 px-6 py-3 text-sm font-medium text-[#f5f1ea] transition hover:bg-[#C9A227] hover:text-[#0b0d10]"
          >
            Ver más fragancias ({filtrados.length - visibles})
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}

      <ProductoDetalle
        product={detalle}
        onClose={() => setDetalle(null)}
        onAgregar={puedeComprar ? agregar : undefined}
        enCarrito={detalle && puedeComprar ? enCarrito(detalle.id) : 0}
        nota={puedeComprar ? undefined : "Estás con una cuenta del equipo: las compras se hacen con una cuenta de cliente."}
      />
      {puedeComprar && <LandingCart />}
    </section>
  );
}

export { Catalog };
