import { jsx, jsxs } from "react/jsx-runtime";
import { DeleteDialog } from "../../../../shared/components/ui/DeleteDialog";
import { useProductsManagement } from "../../hooks/productsManagement";
import { ProductsHeader, ProductStats, ProductFilters, ProductTable, ProductFormModal } from "../../components/productsManagement";
function ProductsManagement() {
  const {
    products,
    stats,
    loadError,
    actionError,
    totalItems,
    categoryOptions,
    supplierOptions,
    searchQuery,
    selectedCategory,
    showFilters,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    sortBy,
    sortDirection,
    isModalOpen,
    selectedProduct,
    productForm,
    setProductForm,
    deleteDialogOpen,
    productToDelete,
    statusFilter,
    priceRange,
    stockFilter,
    supplierFilter,
    categories,
    sortOptions,
    suppliers,
    sortedProducts,
    totalPages,
    paginatedProducts,
    lowStockCount,
    handleSearchChange,
    handleToggleFilters,
    handleCloseFilters,
    handleCategoryChange,
    handleSortByChange,
    handleSortDirectionChange,
    handleItemsPerPageChange,
    handleStatusFilterChange,
    handleToggleStatus,
    handleStockFilterChange,
    handleSupplierFilterChange,
    handlePriceMinChange,
    handlePriceMaxChange,
    resetFilters,
    handleDelete,
    confirmDelete,
    closeDeleteDialog,
    handleEdit,
    handleView,
    handleNewProduct,
    closeModal,
    handleSaveProduct
  } = useProductsManagement();
  const aviso = (loadError || actionError)
    ? /* @__PURE__ */jsx("div", {
        className: "rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive",
        children: loadError || actionError
      })
    : null;

  return /* @__PURE__ */jsxs("div", {
    className: "space-y-6",
    children: [aviso, /* @__PURE__ */jsx(ProductsHeader, {
      onNewProduct: handleNewProduct,
      rows: sortedProducts
    }), /* @__PURE__ */jsx(ProductStats, {
      products,
      lowStockCount,
      stats
    }), /* @__PURE__ */jsx(ProductFilters, {
      searchQuery,
      onSearchChange: handleSearchChange,
      showFilters,
      onToggleFilters: handleToggleFilters,
      onCloseFilters: handleCloseFilters,
      categories,
      selectedCategory,
      onCategoryChange: handleCategoryChange,
      sortBy,
      onSortByChange: handleSortByChange,
      sortOptions,
      sortDirection,
      onSortDirectionChange: handleSortDirectionChange,
      itemsPerPage,
      onItemsPerPageChange: handleItemsPerPageChange,
      onResetFilters: resetFilters,
      statusFilter,
      onStatusFilterChange: handleStatusFilterChange,
      stockFilter,
      onStockFilterChange: handleStockFilterChange,
      supplierFilter,
      onSupplierFilterChange: handleSupplierFilterChange,
      suppliers,
      priceRange,
      onPriceMinChange: handlePriceMinChange,
      onPriceMaxChange: handlePriceMaxChange
    }), /* @__PURE__ */jsx(ProductTable, {
      products: paginatedProducts,
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      onPageChange: setCurrentPage,
      onView: handleView,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onToggleStatus: handleToggleStatus
    }), /* @__PURE__ */jsx(ProductFormModal, {
      isOpen: isModalOpen,
      onClose: closeModal,
      isEditing: !!selectedProduct,
      productForm,
      onProductFormChange: setProductForm,
      categories: categoryOptions,
      suppliers: supplierOptions,
      onSave: handleSaveProduct,
      error: actionError
    }), /* @__PURE__ */jsx(DeleteDialog, {
      isOpen: deleteDialogOpen,
      onClose: closeDeleteDialog,
      onConfirm: confirmDelete,
      itemName: productToDelete?.name
    })]
  });
}
export { ProductsManagement };