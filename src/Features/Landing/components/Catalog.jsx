import { ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { ProductCard } from './ProductCard';

const PRODUCTS = [
  {
    id: 1,
    name: 'Essence Royale',
    description: 'Floral, amaderado y oriental. Una experiencia sensorial única.',
    price: 89.99,
    category: 'Exclusivos',
    img: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    rating: 4.9,
    reviews: 128
  },
  {
    id: 2,
    name: 'Noir Elegance',
    description: 'Intenso, misterioso y seductor. Para el hombre de poder.',
    price: 74.99,
    category: 'Hombre',
    img: 'https://images.unsplash.com/photo-1718466044521-d38654f3ba0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    rating: 4.7,
    reviews: 94
  },
  {
    id: 3,
    name: 'Golden Mist',
    description: 'Luminoso, fresco y primaveral. La elegancia hecha fragancia.',
    price: 79.99,
    category: 'Mujer',
    img: 'https://images.unsplash.com/photo-1737920459846-2d0318700658?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    rating: 4.8,
    reviews: 76
  },
];

export function Catalog({ onLogin }) {
  return (
    <section id="catalogo" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow="Colección Premium"
          title="Nuestras Fragancias"
          subtitle="Cada fragancia es una obra de arte creada para despertar emociones únicas."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button onClick={onLogin}
            className="inline-flex items-center gap-2 px-8 py-4 border border-[#C9A227] text-[#C9A227] rounded-lg hover:bg-[#C9A227] hover:text-black transition-all font-semibold">
            Ver catálogo completo <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
