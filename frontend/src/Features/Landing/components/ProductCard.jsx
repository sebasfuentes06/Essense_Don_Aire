import { useState } from "react";
import { Eye, Flower2, ShoppingCart } from "lucide-react";
import { dinero } from "../../../shared/negocio";

/** Tarjeta de la vitrina: foto, precio y stock, con detalle y "Agregar". */
function ProductCard({ product, onView, onAdd, inCart = 0 }) {
  const [sinFoto, setSinFoto] = useState(!product.image);
  return (
    <article className="group flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#121417] shadow-[0_25px_70px_rgba(0,0,0,0.15)]">
      <button type="button" onClick={() => onView(product)} className="relative h-72 overflow-hidden bg-[#0b0d10] text-left" title="Ver detalle">
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
        {inCart > 0 && (
          <span className="absolute bottom-4 right-4 rounded-full bg-[#f5f1ea] px-3 py-1 text-xs font-semibold text-[#0b0d10]">
            {inCart} en tu carrito
          </span>
        )}
      </button>
      <div className="flex flex-1 flex-col space-y-4 p-5">
        <h3 className="text-2xl font-medium text-[#f5f1ea]">{product.name}</h3>
        <p className="line-clamp-3 min-h-[5.25rem] text-sm leading-7 text-[#d9d2c8]/75">
          {product.description || "Fragancia de nuestra colección Essence Don Aire."}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/10 pt-4">
          <span className="text-2xl font-semibold text-[#f5f1ea]">{dinero(product.price)}</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onView(product)}
              title="Ver detalle"
              aria-label={`Ver detalle de ${product.name}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-[#f5f1ea] transition hover:border-[#C9A227] hover:text-[#C9A227]"
            >
              <Eye className="h-4 w-4" />
            </button>
            {onAdd && (
              <button
                type="button"
                onClick={() => onAdd(product)}
                className="flex items-center gap-2 rounded-full border border-[#C9A227]/60 bg-[#C9A227]/10 px-4 py-2 text-sm font-medium text-[#f5f1ea] transition hover:bg-[#C9A227] hover:text-[#0b0d10]"
              >
                <ShoppingCart className="h-4 w-4" /> Agregar
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export { ProductCard };
