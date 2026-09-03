import { Star } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const TESTIMONIALS = [
  { name: 'María López', city: 'Ciudad de México', text: 'La atención fue excelente y el acabado de cada pieza se siente premium.', rating: 5 },
  { name: 'Carlos Ruiz', city: 'Guadalajara', text: 'Muy recomendable. Entregaron todo a tiempo y con una presentación impecable.', rating: 5 },
  { name: 'Ana García', city: 'Monterrey', text: 'El proceso fue sencillo, elegante y la calidad superó nuestras expectativas.', rating: 5 },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader eyebrow="Testimonios" title="Lo que dicen nuestros clientes" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C9A227]/30 transition-all">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-[#C9A227] fill-[#C9A227]" />
                ))}
              </div>
              <p className="text-white/70 italic mb-6 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C9A227]/20 flex items-center justify-center">
                  <span className="text-[#C9A227] font-bold">{t.name[0]}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
