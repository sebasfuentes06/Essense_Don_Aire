import { useNavigate } from "react-router";
import { Pagination } from "../../../../shared/components/ui/Pagination";
import { useAuth, ROLES } from "../../../../shared/auth";
import { useOrdersStore } from "../../../../shared/orders";
import { useProductCatalog } from "../../hooks/productCatalog";
import {
  CartModal,
  ProductCatalogHeader,
  ProductCatalogFilters,
  ProductCategoryTabs,
  ProductGrid
} from "../../components/productCatalog";

function ProductCatalog() {
  const { user, role, can } = useAuth();
  const { createOrder } = useOrdersStore();
  const navigate = useNavigate();

  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    availabilityFilter,
    setAvailabilityFilter,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    sortOptions,
    itemsPerPage,
    setItemsPerPage,
    currentPage,
    setCurrentPage,
    filteredProducts,
    totalPages,
    paginatedProducts,
    cartItems,
    cartItemCount,
    isCartOpen,
    setIsCartOpen,
    handleAddToCart,
    handleUpdateCartQuantity,
    handleRemoveFromCart,
    clearCart
  } = useProductCatalog();

  const isClient = role === ROLES.CLIENT;

  /**
   * Cierra el ciclo del carrito: convierte lo que hay dentro en un pedido
   * real y lleva a la persona a la pantalla donde puede seguirlo.
   * Si lo hace el cliente, el pedido queda sin vendedor asignado.
   */
  const handleConfirmOrder = () => {
    if (cartItems.length === 0) return;

    createOrder({
      customer: user?.name ?? "",
      seller: null,
      items: cartItems.map((item) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        discount: 0
      })),
      channel: "web",
      notes: "Pedido generado desde el catálogo."
    });

    clearCart();
    setIsCartOpen(false);
    navigate("/panel/pedidos");
  };

  return (
    <div className="space-y-6">
      <ProductCatalogHeader cartItemCount={cartItemCount} onViewCart={() => setIsCartOpen(true)} />

      <ProductCatalogFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        availabilityFilter={availabilityFilter}
        onAvailabilityChange={setAvailabilityFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
        sortOptions={sortOptions}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      <ProductCategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <ProductGrid products={paginatedProducts} onAddToCart={handleAddToCart} />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredProducts.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onConfirmOrder={handleConfirmOrder}
        canOrder={isClient && can("orders.create")}
      />
    </div>
  );
}

export { ProductCatalog };
