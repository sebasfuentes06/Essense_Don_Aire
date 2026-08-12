import { Award } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/components/figma/ImageWithFallback';

const ABOUT_STATS = [
  { value: '15+', label: 'Años de experiencia' },
  { value: '500+', label: 'Fragancias únicas' },
  { value: '50K+', label: 'Clientes satisfechos' },
];

export function About() {
  return (
    <section id="nosotros" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px w-12 bg-[#C9A227]" />
              <span className="text-[#C9A227] text-sm tracking-widest uppercase">Nuestra Historia</span>
            </div>
            <h2 className="text-4xl font-serif text-white mb-6">Pasión por las fragancias desde 2009</h2>
            <p className="text-white/60 mb-6 leading-relaxed">
              Essence Don Aire nació de la pasión por crear experiencias olfativas que trasciendan el tiempo. Durante más de 15 años, hemos combinado técnicas artesanales con los mejores ingredientes naturales del mundo.
            </p>
            <p className="text-white/60 mb-8 leading-relaxed">
              Cada fragancia en nuestra colección es el resultado de meses de investigación y desarrollo, garantizando que cada gota evoque emociones únicas y perdurables.
            </p>
            <div className="flex gap-8">
              {ABOUT_STATS.map(s => (
                <div key={s.label}>
                  <p className="text-3xl font-bold text-[#C9A227]">{s.value}</p>
                  <p className="text-white/50 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1718466044521-d38654f3ba0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
                alt="Perfume collection"
                className="w-full h-80 object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 p-5 bg-[#C9A227] rounded-2xl">
              <Award className="h-8 w-8 text-black mb-2" />
              <p className="text-black font-bold">Premio</p>
              <p className="text-black/70 text-sm">Mejor Marca 2023</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
