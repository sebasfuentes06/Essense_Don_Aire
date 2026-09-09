import { jsx, jsxs } from "react/jsx-runtime";
import { usePurchases } from "../../hooks/purchases";
import { PurchasesHeader, PurchasesStats, PurchasesFiltersBar, PurchasesTable, PurchaseDeleteDialog, PurchaseDetailModal, PurchaseFormModal } from "../../components/purchases";
function Purchases() {
  const {
    purchases,
    suppliers,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    supplierFilter,
    setSupplierFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    sortOptions,
    detailPurchase,
    availableProducts,
    isPurchaseFormOpen,
    selectedPurchase,
    purchaseForm,
    setPurchaseForm,
    deleteDialogOpen,
    purchaseToDelete,
    filtered,
    totalPages,
    paginated,
    totalPurchased,
    totalBalance,
    pendingCount,
    handleViewDetail,
    handleCloseDetail,
    handleNewPurchase,
    handleClosePurchaseForm,
    handleSavePurchase,
    handleCancelPurchase,
    handleDeleteRequest,
    closeDeleteDialog,
    confirmDelete
  } = usePurchases();
  return /* @__PURE__ */jsxs("div", {
    className: "space-y-6",
    children: [/* @__PURE__ */jsx(PurchasesHeader, {
      onNewPurchase: handleNewPurchase
    }), /* @__PURE__ */jsx(PurchasesStats, {
      totalOrders: purchases.length,
      totalPurchased,
      totalBalance,
      pendingCount
    }), /* @__PURE__ */jsx(PurchasesFiltersBar, {
      searchQuery,
      onSearchChange: setSearchQuery,
      statusFilter,
      onStatusFilterChange: setStatusFilter,
      supplierFilter,
      onSupplierFilterChange: setSupplierFilter,
      suppliers,
      dateFrom,
      onDateFromChange: setDateFrom,
      dateTo,
      onDateToChange: setDateTo,
      sortBy,
      onSortByChange: setSortBy,
      sortDirection,
      onSortDirectionChange: setSortDirection,
      sortOptions,
      itemsPerPage,
      onItemsPerPageChange: setItemsPerPage
    }), /* @__PURE__ */jsx(PurchasesTable, {
      purchases: paginated,
      currentPage,
      totalPages,
      totalItems: filtered.length,
      itemsPerPage,
      onPageChange: setCurrentPage,
      onViewDetail: handleViewDetail,
      onDeleteRequest: handleDeleteRequest
    }), /* @__PURE__ */jsx(PurchaseDetailModal, {
      isOpen: !!detailPurchase,
      onClose: handleCloseDetail,
      purchase: detailPurchase,
      onCancel: handleCancelPurchase
    }), /* @__PURE__ */jsx(PurchaseFormModal, {
      isOpen: isPurchaseFormOpen,
      onClose: handleClosePurchaseForm,
      isEditing: !!selectedPurchase,
      purchaseForm,
      onFormChange: setPurchaseForm,
      suppliers,
      products: availableProducts,
      onSave: handleSavePurchase
    }), /* @__PURE__ */jsx(PurchaseDeleteDialog, {
      isOpen: deleteDialogOpen,
      onClose: closeDeleteDialog,
      onConfirm: confirmDelete,
      purchaseToDelete
    })]
  });
}
export { Purchases };