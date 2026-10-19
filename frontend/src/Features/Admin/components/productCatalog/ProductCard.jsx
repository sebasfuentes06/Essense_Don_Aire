import { Flower2, ShoppingCart } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { Button } from "../../../../shared/components/ui/button";
import { dinero } from "../../../../shared/negocio";

/** Tarjeta de un producto real de la API, con su foto. */
function ProductCard({ product, onAddToCart, inCart = 0 }) {
  return (
    <Card hover className="overflow-hidden group">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10">
            <Flower2 className="h-16 w-16 text-primary/60" />
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-4 py-2 rounded-full bg-destructive text-destructive-foreground font-semibold">Agotado</span>
          </div>
        )}
        {product.inStock && product.stock <= product.minStock && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
            Últimas {product.stock} und.
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="mb-3">
          <span className="text-xs font-medium text-primary uppercase tracking-wide">{product.category}</span>
          <h3 className="text-xl font-semibold text-foreground mt-1 mb-1">{product.name}</h3>
          {product.description && <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-2xl font-bold text-primary">{dinero(product.price)}</p>
            <p className="text-xs text-muted-foreground">
              {product.inStock ? `${product.stock} disponibles` : "Sin stock"}
              {inCart > 0 && ` · ${inCart} en tu carrito`}
            </p>
          </div>
          {onAddToCart && (
            <Button disabled={!product.inStock} onClick={() => onAddToCart(product)}>
              <ShoppingCart className="h-4 w-4" />
              {product.inStock ? "Agregar" : "Agotado"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export { ProductCard };
