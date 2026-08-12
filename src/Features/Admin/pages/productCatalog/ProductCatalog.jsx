import { useState } from 'react';
import { Search, Filter, Heart, ShoppingCart, Star } from 'lucide-react';
import { Card } from '../../../../shared/components/ui/Card';
import { Button } from '../../../../shared/components/ui/Button';
import { cn } from '../../../../shared/utils/cn';

const categories = ['Todos', 'Hombre', 'Mujer', 'Unisex', 'Exclusivos'];

const products = [
  {
    id: 1,
    name: 'Essence Royale',
    category: 'Exclusivos',
    price: 89.99,
    rating: 4.9,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=500&fit=crop',
    inStock: true,
    featured: true
  },
  {
    id: 2,
    name: 'Noir Elegance',
    category: 'Hombre',
    price: 74.99,
    rating: 4.8,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=500&fit=crop',
    inStock: true,
    featured: true
  },
  {
    id: 3,
    name: 'Golden Mist',
    category: 'Mujer',
    price: 79.99,
    rating: 4.7,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&h=500&fit=crop',
    inStock: true,
    featured: false
  },
  {
    id: 4,
    name: 'Velvet Rose',
    category: 'Mujer',
    price: 69.99,
    rating: 4.9,
    reviews: 298,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=500&fit=crop',
    inStock: true,
    featured: false
  },
  {
    id: 5,
    name: 'Ocean Breeze',
    category: 'Unisex',
    price: 64.99,
    rating: 4.6,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=500&fit=crop',
    inStock: false,
    featured: false
  },
  {
    id: 6,
    name: 'Midnight Dream',
    category: 'Hombre',
    price: 84.99,
    rating: 4.8,
    reviews: 201,
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&h=500&fit=crop',
    inStock: true,
    featured: true
  }
];

export function ProductCatalog() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Catálogo de Fragancias</h1>
          <p className="text-muted-foreground">
            Descubre nuestra colección exclusiva de perfumes premium
          </p>
        </div>
        <Button variant="primary" size="lg">
          <ShoppingCart className="h-5 w-5" />
          Ver Carrito (0)
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar fragancias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full h-12 pl-11 pr-4 rounded-xl bg-card border border-border',
              'text-foreground placeholder:text-muted-foreground',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary'
            )}
          />
        </div>

        {/* Filter Button */}
        <Button variant="outline" size="lg">
          <Filter className="h-5 w-5" />
          Filtros
        </Button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              'px-6 py-2.5 rounded-xl font-medium transition-all duration-200 whitespace-nowrap',
              selectedCategory === category
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-foreground hover:bg-muted border border-border'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} hover className="overflow-hidden group">
            {/* Image */}
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.featured && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  Destacado
                </div>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="px-4 py-2 rounded-full bg-destructive text-destructive-foreground font-semibold">
                    Agotado
                  </span>
                </div>
              )}
              <button className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                <Heart className="h-5 w-5 text-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="mb-3">
                <span className="text-xs font-medium text-primary uppercase tracking-wide">
                  {product.category}
                </span>
                <h3 className="text-xl font-semibold text-foreground mt-1 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-semibold text-foreground">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews} reseñas)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    ${product.price}
                  </p>
                  <p className="text-xs text-muted-foreground">100ml</p>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  disabled={!product.inStock}
                  className="group-hover:shadow-lg"
                >
                  {product.inStock ? 'Agregar' : 'Agotado'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
