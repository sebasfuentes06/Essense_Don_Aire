import { ShoppingCart } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";

function ProductCatalogHeader({ cartItemCount, onViewCart, showCart = true }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Catálogo de Fragancias</h1>
        <p className="text-muted-foreground">Descubre nuestra colección de perfumes</p>
      </div>
      {showCart && (
        <Button onClick={onViewCart}>
          <ShoppingCart className="h-5 w-5" />
          {`Ver carrito (${cartItemCount})`}
        </Button>
      )}
    </div>
  );
}

export { ProductCatalogHeader };
