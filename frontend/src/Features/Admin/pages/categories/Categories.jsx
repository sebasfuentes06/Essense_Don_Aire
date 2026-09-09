import { jsx, jsxs } from "react/jsx-runtime";
import { DeleteDialog } from "../../../../shared/components/ui/DeleteDialog";
import { useCategories } from "../../hooks/categories";
import { CategoriesHeader, CategoriesStats, CategoriesFilters, CategoriesTable, CategoryFormModal, CategoryDetailModal } from "../../components/categories";
function Categories() {
  const {
    categories,
    searchQuery,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    statusFilter,
    isModalOpen,
    selectedCategory,
    detailModalOpen,
    selectedCategoryForDetail,
    categoryForm,
    setCategoryForm,
    deleteDialogOpen,
    categoryToDelete,
    sortOptions,
    sortedCategories,
    totalPages,
    paginatedCategories,
    handleSearchChange,
    handleStatusFilterChange,
    handleToggleStatus,
    handleDelete,
    confirmDelete,
    closeDeleteDialog,
    handleEdit,
    openNewCategoryModal,
    handleShowCategoryDetail,
    closeModal,
    handleCloseDetailModal,
    handleSaveCategory
  } = useCategories();
  return /* @__PURE__ */jsxs("div", {
    className: "space-y-6",
    children: [/* @__PURE__ */jsx(CategoriesHeader, {
      onNewCategory: openNewCategoryModal,
      rows: sortedCategories
    }), /* @__PURE__ */jsx(CategoriesStats, {
      categories
    }), /* @__PURE__ */jsx(CategoriesFilters, {
      searchQuery,
      onSearchChange: handleSearchChange,
      statusFilter,
      onStatusFilterChange: handleStatusFilterChange,
      sortBy,
      onSortByChange: setSortBy,
      sortOptions,
      sortDirection,
      onSortDirectionChange: setSortDirection,
      itemsPerPage,
      onItemsPerPageChange: setItemsPerPage
    }), /* @__PURE__ */jsx(CategoriesTable, {
      categories: paginatedCategories,
      currentPage,
      totalPages,
      totalItems: sortedCategories.length,
      itemsPerPage,
      onPageChange: setCurrentPage,
      onShowDetail: handleShowCategoryDetail,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onToggleStatus: handleToggleStatus
    }), /* @__PURE__ */jsx(CategoryFormModal, {
      isOpen: isModalOpen,
      onClose: closeModal,
      isEditing: !!selectedCategory,
      categoryForm,
      onCategoryFormChange: setCategoryForm,
      onSave: handleSaveCategory
    }), /* @__PURE__ */jsx(CategoryDetailModal, {
      isOpen: detailModalOpen,
      onClose: handleCloseDetailModal,
      category: selectedCategoryForDetail
    }), /* @__PURE__ */jsx(DeleteDialog, {
      isOpen: deleteDialogOpen,
      onClose: closeDeleteDialog,
      onConfirm: confirmDelete,
      itemName: categoryToDelete?.name
    })]
  });
}
export { Categories };