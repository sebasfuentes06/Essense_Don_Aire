import { useState } from "react";
import { Flower2 } from "lucide-react";
import { dinero } from "../../../shared/negocio";

/** Tarjeta de la vitrina: foto real (o un ícono si aún no tiene), precio y stock. */
function ProductCard({ product, onLogin }) {
  const [sinFoto, setSinFoto] = useState(!product.image);
  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/10 bg-[#121417] shadow-[0_25px_70px_rgba(0,0,0,0.15)]">
      <div className="relative h-72 overflow-hidden bg-[#0b0d10]">
        {sinFoto ? (
          <div className="flex h-full w-full items-center justify-center">
            <Flower2 className="h-16 w-16 text-[#C9A227]/50" />
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setSinFoto(true)}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-[#0b0d10]/10 to-transparent" />
        {product.category && (
          <span className="absolute left-4 top-4 rounded-full border border-[#C9A227]/60 bg-[#0b0d10]/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#f5f1ea]">
            {product.category}
          </span>
        )}
        {product.stock <= product.minStock && (
          <span className="absolute right-4 top-4 rounded-full bg-[#C9A227] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#0b0d10]">
            Últimas {product.stock} und.
          </span>
        )}
      </div>
      <div className="space-y-4 p-5">
        <h3 className="text-2xl font-medium text-[#f5f1ea]">{product.name}</h3>
        <p className="line-clamp-3 min-h-[5.25rem] text-sm leading-7 text-[#d9d2c8]/75">
          {product.description || "Fragancia de nuestra colección Essence Don Aire."}
        </p>
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-2xl font-semibold text-[#f5f1ea]">{dinero(product.price)}</span>
          <button
            onClick={onLogin}
            className="rounded-full border border-[#C9A227]/60 bg-[#C9A227]/10 px-4 py-2 text-sm font-medium text-[#f5f1ea] transition hover:bg-[#C9A227] hover:text-[#0b0d10]"
          >
            Comprar
          </button>
        </div>
      </div>
    </article>
  );
}

export { ProductCard };
