import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { ProductCard } from "./ProductCard";
import { cargarProductos } from "../../../shared/negocio";

/**
 * Vitrina pública con los productos reales de la API (la lectura del catálogo
 * no pide sesión). Primero los que tienen foto y stock.
 */
function Catalog({ onLogin }) {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    let vivo = true;
    cargarProductos()
      .then((lista) => {
        if (!vivo) return;
        const visibles = lista
          .filter((p) => p.active && p.inStock)
          .sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)) || b.id - a.id)
          .slice(0, 6);
        setProducts(visibles);
      })
      .catch(() => vivo && setProducts([]));
    return () => {
      vivo = false;
    };
  }, []);

  return (
    <section id="catalogo" className="mx-auto max-w-7xl px-4 py-24 md:px-8">
      <SectionHeader eyebrow="Nuestra colección" subtitle="Cada fragancia es una obra de arte creada para despertar emociones únicas." />
      {products === null ? (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[30rem] animate-pulse rounded-[28px] border border-white/10 bg-[#121417]" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-[#d9d2c8]/75">Muy pronto verás aquí nuestras fragancias.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onLogin={onLogin} />
          ))}
        </div>
      )}
      <div className="mt-10 flex justify-center">
        <button
          onClick={onLogin}
          className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/60 bg-[#C9A227]/10 px-6 py-3 text-sm font-medium text-[#f5f1ea] transition hover:bg-[#C9A227] hover:text-[#0b0d10]"
        >
          Ver catálogo completo
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

export { Catalog };
