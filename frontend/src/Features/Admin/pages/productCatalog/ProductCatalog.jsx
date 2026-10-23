import { useState } from "react";
import { toast } from "sonner";
import { ProductoDetalle } from "../../../../shared/negocio";
import { Pagination } from "../../../../shared/components/ui/Pagination";
import { useAuth, ROLES } from "../../../../shared/auth";
import { useCart } from "../../../../shared/cart";
import { useProductCatalog } from "../../hooks/productCatalog";
import {
  ProductCatalogHeader,
  ProductCatalogFilters,
  ProductCategoryTabs,
  ProductGrid
} from "../../components/productCatalog";

/**
 * Catálogo con los productos reales. El Cliente agrega al carrito (que se
 * queda guardado aunque cambie de pantalla) y desde ahí hace el pedido.
 * El equipo lo usa para consultar precios, fotos y disponibilidad.
 */
function ProductCatalog() {
  const { role, can } = useAuth();
  const cart = useCart();
  const c = useProductCatalog();
  const isClient = role === ROLES.CLIENT && can("orders.create");

  const [detalle, setDetalle] = useState(null);

  const agregar = (product, cantidad = 1) => {
    if (cart.add(product, cantidad)) {
      toast.success(`${product.name} agregado al carrito`, { action: { label: "Ver carrito", onClick: cart.open } });
    } else {
      toast.error(`Solo hay ${product.stock} unidad(es) de ${product.name}.`);
      return false;
    }
    return true;
  };

  const cantidadEnCarrito = (id) => cart.items.find((i) => i.id === id)?.quantity ?? 0;

  return (
    <div className="space-y-6">
      <ProductCatalogHeader cartItemCount={cart.count} onViewCart={cart.open} showCart={isClient} />

      <ProductCatalogFilters
        searchQuery={c.searchQuery}
        onSearchChange={c.setSearchQuery}
        availabilityFilter={c.availabilityFilter}
        onAvailabilityChange={c.setAvailabilityFilter}
        sortBy={c.sortBy}
        onSortByChange={c.setSortBy}
        sortDirection={c.sortDirection}
        onSortDirectionChange={c.setSortDirection}
        sortOptions={c.sortOptions}
        itemsPerPage={c.itemsPerPage}
        onItemsPerPageChange={c.setItemsPerPage}
      />

      <ProductCategoryTabs categories={c.categories} selectedCategory={c.selectedCategory} onSelectCategory={c.setSelectedCategory} />

      {c.error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center">
          <p className="text-destructive">{c.error}</p>
          <button type="button" className="mt-2 text-sm text-primary underline" onClick={c.reload}>
            Reintentar
          </button>
        </div>
      ) : c.isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((k) => (
            <div key={k} className="h-96 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : c.filteredProducts.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">No hay productos con estos filtros.</p>
      ) : (
        <ProductGrid products={c.paginatedProducts} onAddToCart={isClient ? (p) => agregar(p) : undefined} onView={setDetalle} cantidadEnCarrito={cantidadEnCarrito} />
      )}

      <ProductoDetalle
        product={detalle}
        onClose={() => setDetalle(null)}
        onAgregar={isClient ? agregar : undefined}
        enCarrito={detalle ? cantidadEnCarrito(detalle.id) : 0}
      />

      {c.totalPages > 1 && (
        <Pagination
          currentPage={c.currentPage}
          totalPages={c.totalPages}
          totalItems={c.filteredProducts.length}
          itemsPerPage={c.itemsPerPage}
          onPageChange={c.setCurrentPage}
        />
      )}
    </div>
  );
}

export { ProductCatalog };
