import { ProductCard } from "./ProductCard";

function ProductGrid({ products, onAddToCart, onView, cantidadEnCarrito = () => 0 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onView={onView} inCart={cantidadEnCarrito(product.id)} />
      ))}
    </div>
  );
}

export { ProductGrid };
