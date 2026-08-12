import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/components/figma/ImageWithFallback';

const HERO_STATS = [
  { value: '500+', label: 'Productos' },
  { value: '10K+', label: 'Clientes' },
  { value: '15+', label: 'Años' },
];

export function Hero({ onLogin }) {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center pt-16">
      <ImageWithFallback
        src="https://images.unsplash.com/photo-1737920459846-2d0318700658?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        alt="Luxury perfume hero"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px w-12 bg-[#C9A227]" />
            <span className="text-[#C9A227] text-sm tracking-widest uppercase font-semibold">Lujo & Exclusividad</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
            Fragancias que<br />
            <span className="text-[#C9A227]">dejan huella</span>
          </h1>
          <p className="text-white/70 mb-10 max-w-md leading-relaxed">
            Descubre nuestra colección exclusiva de perfumes y lociones premium, elaborados con los mejores ingredientes del mundo para momentos inolvidables.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#catalogo"
              className="flex items-center gap-2 px-8 py-4 bg-[#C9A227] text-black rounded-lg font-bold hover:bg-[#b8911f] transition-all shadow-lg">
              Ver Catálogo <ArrowRight className="h-5 w-5" />
            </a>
            <button onClick={onLogin}
              className="flex items-center gap-2 px-8 py-4 border border-white/30 text-white rounded-lg hover:border-[#C9A227] hover:text-[#C9A227] transition-all">
              Acceder al Sistema
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-12">
            {HERO_STATS.map(stat => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-[#C9A227]">{stat.value}</p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}
