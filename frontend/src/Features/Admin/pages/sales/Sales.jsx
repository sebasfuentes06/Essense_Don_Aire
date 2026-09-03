import { jsx, jsxs } from "react/jsx-runtime";
import { DeleteDialog } from "../../../../shared/components/ui/DeleteDialog";
import { useSales } from "../../hooks/sales";
import { SalesHeader, SalesStats, SalesFiltersBar, SalesTable, SaleCancelDialog, SaleDetailModal, SaleFormModal } from "../../components/sales";
function Sales() {
  const {
    sellers,
    searchQuery,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    sortOptions,
    statusFilter,
    sellerFilter,
    detailSale,
    cancelDialogOpen,
    saleToCancel,
    deleteDialogOpen,
    saleToDelete,
    isSaleFormOpen,
    saleForm,
    setSaleForm,
    filtered,
    totalPages,
    paginated,
    totalRevenue,
    avgTicket,
    completedCount,
    todayCount,
    handleSearchChange,
    handleStatusFilterChange,
    handleSellerFilterChange,
    handleViewDetail,
    handleNewSale,
    handleCloseSaleForm,
    handleSaveSale,
    handleCloseDetail,
    handleCancel,
    closeCancelDialog,
    confirmCancel,
    handleDelete,
    closeDeleteDialog,
    confirmDelete
  } = useSales();
  return /* @__PURE__ */jsxs("div", {
    className: "space-y-6",
    children: [/* @__PURE__ */jsx(SalesHeader, {
      onNewSale: handleNewSale
    }), /* @__PURE__ */jsx(SalesStats, {
      completedCount,
      totalRevenue,
      todayCount,
      avgTicket
    }), /* @__PURE__ */jsx(SalesFiltersBar, {
      searchQuery,
      onSearchChange: handleSearchChange,
      statusFilter,
      onStatusFilterChange: handleStatusFilterChange,
      sellerFilter,
      onSellerFilterChange: handleSellerFilterChange,
      sellers,
      sortBy,
      onSortByChange: setSortBy,
      sortDirection,
      onSortDirectionChange: setSortDirection,
      sortOptions,
      itemsPerPage,
      onItemsPerPageChange: setItemsPerPage
    }), /* @__PURE__ */jsx(SalesTable, {
      sales: paginated,
      currentPage,
      totalPages,
      totalItems: filtered.length,
      itemsPerPage,
      onPageChange: setCurrentPage,
      onViewDetail: handleViewDetail,
      onDelete: handleDelete
    }), /* @__PURE__ */jsx(SaleDetailModal, {
      isOpen: !!detailSale,
      onClose: handleCloseDetail,
      sale: detailSale,
      onCancel: handleCancel
    }), /* @__PURE__ */jsx(SaleFormModal, {
      isOpen: isSaleFormOpen,
      onClose: handleCloseSaleForm,
      saleForm,
      onFormChange: setSaleForm,
      sellers,
      onSave: handleSaveSale
    }), /* @__PURE__ */jsx(SaleCancelDialog, {
      isOpen: cancelDialogOpen,
      onClose: closeCancelDialog,
      onConfirm: confirmCancel,
      saleToCancel
    }), /* @__PURE__ */jsx(DeleteDialog, {
      isOpen: deleteDialogOpen,
      onClose: closeDeleteDialog,
      onConfirm: confirmDelete,
      itemName: saleToDelete?.folio
    })]
  });
}
export { Sales };