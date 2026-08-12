import { Leaf, Shield, Truck, Heart } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const FEATURES = [
  { icon: Leaf, title: 'Ingredientes Naturales', desc: 'Seleccionamos los mejores ingredientes del mundo para cada fragancia.' },
  { icon: Shield, title: 'Calidad Certificada', desc: 'Todos nuestros productos pasan rigurosos controles de calidad.' },
  { icon: Truck, title: 'Envío Premium', desc: 'Entrega rápida y segura con empaque de lujo a tu puerta.' },
  { icon: Heart, title: 'Hecho con Amor', desc: 'Cada fragancia es creada con pasión y dedicación artesanal.' },
];

export function Features() {
  return (
    <section className="py-24 bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow="Por qué elegirnos"
          title="La excelencia en cada gota"
          subtitle="Nos dedicamos a crear experiencias olfativas únicas que perduran en la memoria y el corazón."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C9A227]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#C9A227]/10 flex items-center justify-center mb-5 group-hover:bg-[#C9A227]/20 transition-all">
                <Icon className="h-6 w-6 text-[#C9A227]" />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
