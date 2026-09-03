import { jsx, jsxs } from "react/jsx-runtime";
import { Pagination } from "../../../../shared/components/ui/Pagination";
import { useProductCatalog } from "../../hooks/productCatalog";
import { CartModal, ProductCatalogHeader, ProductCatalogFilters, ProductCategoryTabs, ProductGrid } from "../../components/productCatalog";
function ProductCatalog() {
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
    handleRemoveFromCart
  } = useProductCatalog();
  return /* @__PURE__ */jsxs("div", {
    className: "space-y-6",
    children: [/* @__PURE__ */jsx(ProductCatalogHeader, {
      cartItemCount,
      onViewCart: () => setIsCartOpen(true)
    }), /* @__PURE__ */jsx(ProductCatalogFilters, {
      searchQuery,
      onSearchChange: setSearchQuery,
      availabilityFilter,
      onAvailabilityChange: setAvailabilityFilter,
      sortBy,
      onSortByChange: setSortBy,
      sortDirection,
      onSortDirectionChange: setSortDirection,
      sortOptions,
      itemsPerPage,
      onItemsPerPageChange: setItemsPerPage
    }), /* @__PURE__ */jsx(ProductCategoryTabs, {
      categories,
      selectedCategory,
      onSelectCategory: setSelectedCategory
    }), /* @__PURE__ */jsx(ProductGrid, {
      products: paginatedProducts,
      onAddToCart: handleAddToCart
    }), totalPages > 1 && /* @__PURE__ */jsx(Pagination, {
      currentPage,
      totalPages,
      totalItems: filteredProducts.length,
      itemsPerPage,
      onPageChange: setCurrentPage
    }), /* @__PURE__ */jsx(CartModal, {
      isOpen: isCartOpen,
      onClose: () => setIsCartOpen(false),
      items: cartItems,
      onUpdateQuantity: handleUpdateCartQuantity,
      onRemoveItem: handleRemoveFromCart
    })]
  });
}
export { ProductCatalog };