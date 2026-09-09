import { jsx, jsxs } from "react/jsx-runtime";
import { Plus, Package } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { DeleteDialog } from "../../../../shared/components/ui/DeleteDialog";
import { useSuppliers } from "../../hooks/suppliers";
import { SupplierStats, SupplierFilters, SupplierTable, SupplierFormModal } from "../../components/suppliers";
function Suppliers() {
  const {
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
    selectedSupplier,
    supplierForm,
    setSupplierForm,
    deleteDialogOpen,
    supplierToDelete,
    sortOptions,
    sortedSuppliers,
    totalPages,
    paginatedSuppliers,
    totalSuppliers,
    activeSuppliers,
    totalProducts,
    avgRating,
    searchQuery,
    handleDelete,
    confirmDelete,
    handleEdit,
    handleView,
    handleNewSupplier,
    handleSaveSupplier,
    handleCloseModal,
    handleCloseDeleteDialog,
    handleSearchChange,
    handleStatusFilterChange,
    handleToggleStatus
  } = useSuppliers();
  return /* @__PURE__ */jsxs("div", {
    className: "space-y-6",
    children: [/* @__PURE__ */jsxs("div", {
      className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4",
      children: [/* @__PURE__ */jsxs("div", {
        children: [/* @__PURE__ */jsx("h1", {
          className: "text-4xl font-bold text-foreground mb-2",
          children: "Proveedores"
        }), /* @__PURE__ */jsx("p", {
          className: "text-muted-foreground",
          children: "Directorio de proveedores y gesti\xF3n de relaciones"
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "flex gap-3",
        children: [/* @__PURE__ */jsxs(Button, {
          children: [/* @__PURE__ */jsx(Package, {
            className: "h-5 w-5"
          }), "Importar"]
        }), /* @__PURE__ */jsxs(Button, {
          onClick: handleNewSupplier,
          children: [/* @__PURE__ */jsx(Plus, {
            className: "h-5 w-5"
          }), "Nuevo Proveedor"]
        })]
      })]
    }), /* @__PURE__ */jsx(SupplierStats, {
      totalSuppliers,
      activeSuppliers,
      totalProducts,
      avgRating
    }), /* @__PURE__ */jsx(SupplierFilters, {
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
    }), /* @__PURE__ */jsx(SupplierTable, {
      suppliers: paginatedSuppliers,
      totalPages,
      currentPage,
      totalItems: sortedSuppliers.length,
      itemsPerPage,
      onPageChange: setCurrentPage,
      onView: handleView,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onToggleStatus: handleToggleStatus
    }), /* @__PURE__ */jsx(SupplierFormModal, {
      isOpen: isModalOpen,
      onClose: handleCloseModal,
      isEditing: !!selectedSupplier,
      supplierForm,
      onFormChange: setSupplierForm,
      onSave: handleSaveSupplier
    }), /* @__PURE__ */jsx(DeleteDialog, {
      isOpen: deleteDialogOpen,
      onClose: handleCloseDeleteDialog,
      onConfirm: confirmDelete,
      itemName: supplierToDelete?.name
    })]
  });
}
export { Suppliers };