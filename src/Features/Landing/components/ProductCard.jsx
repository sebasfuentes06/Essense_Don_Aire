import { Star } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/components/figma/ImageWithFallback';

export function ProductCard({ product }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#C9A227]/40 transition-all group">
      <div className="relative h-64 overflow-hidden">
        <ImageWithFallback
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute top-4 left-4 px-3 py-1 bg-[#C9A227] text-black text-xs font-bold rounded-full">
          {product.category}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-white text-xl font-semibold mb-2">{product.name}</h3>
        <p className="text-white/50 text-sm mb-4 leading-relaxed">{product.description}</p>
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-[#C9A227] fill-[#C9A227]' : 'text-white/20'}`} />
          ))}
          <span className="text-white/40 text-xs ml-1">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-[#C9A227]">${product.price}</span>
          <button className="px-4 py-2 bg-[#C9A227] text-black rounded-lg text-sm font-semibold hover:bg-[#b8911f] transition-all">
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
}
