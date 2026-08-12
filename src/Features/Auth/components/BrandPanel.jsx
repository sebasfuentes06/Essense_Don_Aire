import { Sparkles, Leaf, Star, Award } from 'lucide-react';

import { ImageWithFallback } from '../../../shared/components/figma/ImageWithFallback';

const FEATURE_PILLS = [
  { icon: Leaf, label: <>Ingredientes<br />de alta calidad</> },
  { icon: Star, label: <>Fragancias<br />exclusivas</> },
  { icon: Award, label: <>Experiencias<br />inolvidables</> },
];

/**
 * Panel izquierdo del Login (solo visible en desktop):
 * imagen de fondo, logo, titular y pills de características.
 */
export function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
      {/* Imagen de fondo */}
      <ImageWithFallback
        src="https://images.unsplash.com/photo-1737920459846-2d0318700658?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZXJmdW1lJTIwZnJhZ3JhbmNlJTIwZGFyayUyMGdvbGR8ZW58MXx8fHwxNzgwNjA2NzY4fDA&ixlib=rb-4.1.0&q=80&w=1080"
        alt="Luxury perfume"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay oscuro con degradado dorado */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-[#C9A227]/30" />

      {/* Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C9A227] flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-black" />
          </div>
          <span className="text-white font-bold tracking-widest uppercase text-sm">Essence Don Aire</span>
        </div>
      </div>

      {/* Titular */}
      <div className="relative z-10">
        <h2 className="text-5xl font-serif text-white leading-tight mb-4">
          Fragancias que<br />
          dejan <span className="text-[#C9A227]">huella</span>
        </h2>
        <p className="text-white/60 mb-10">
          Fragancias premium para momentos inolvidables.
        </p>

        {/* Pills de características */}
        <div className="flex gap-6">
          {FEATURE_PILLS.map(({ icon: Icon, label }, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Icon className="h-4 w-4 text-[#C9A227]" />
              </div>
              <span className="text-white/70 text-xs text-center">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
