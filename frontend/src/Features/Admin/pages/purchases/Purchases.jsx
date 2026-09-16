import { AlertCircle } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { DeleteDialog } from "../../../../shared/components/ui/DeleteDialog";
import { usePurchases } from "../../hooks/purchases";
import {
  PurchasesHeader,
  PurchasesStats,
  PurchasesFiltersBar,
  PurchasesTable,
  PurchaseDetailModal,
  PurchaseFormModal,
  PurchasePaymentModal
} from "../../components/purchases";

function Purchases() {
  const {
    exportRows,
    suppliers,
    paymentMethods,
    supplierProducts,
    loadingProducts,
    isLoading,
    loadError,
    actionError,
    formErrors,
    stats,
    totalItems,
    searchQuery,
    handleSearchChange,
    statusFilter,
    setStatusFilter,
    supplierFilter,
    setSupplierFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    sortOptions,
    paginated,
    totalPages,
    isPurchaseFormOpen,
    purchaseForm,
    setPurchaseForm,
    detailPurchase,
    paymentModalOpen,
    purchaseToPay,
    paymentForm,
    setPaymentForm,
    cancelDialogOpen,
    purchaseToCancel,
    deleteDialogOpen,
    purchaseToDelete,
    handleNewPurchase,
    handleClosePurchaseForm,
    handleSavePurchase,
    handleViewDetail,
    handleCloseDetail,
    handleOpenPayment,
    handleClosePayment,
    handleSavePayment,
    handleAnularPago,
    handleCancelRequest,
    closeCancelDialog,
    confirmCancel,
    handleDeleteRequest,
    closeDeleteDialog,
    confirmDelete
  } = usePurchases();

  const hayFiltros =
    Boolean(searchQuery) ||
    statusFilter !== "all" ||
    supplierFilter !== "all" ||
    Boolean(dateFrom) ||
    Boolean(dateTo);

  // El error de una acción se muestra en el sitio donde está mirando la
  // persona: dentro del modal si hay uno abierto, y solo si no, aquí arriba.
  const hayModalAbierto =
    isPurchaseFormOpen || paymentModalOpen || cancelDialogOpen || deleteDialogOpen || Boolean(detailPurchase);

  return (
    <div className="space-y-6">
      <PurchasesHeader onNewPurchase={handleNewPurchase} rows={exportRows} />

      {loadError && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      {actionError && !hayModalAbierto && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      <PurchasesStats stats={stats} />

      <PurchasesFiltersBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        supplierFilter={supplierFilter}
        onSupplierFilterChange={setSupplierFilter}
        suppliers={suppliers}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
        sortOptions={sortOptions}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {isLoading ? (
        <Card className="py-12 text-center text-muted-foreground">Cargando compras…</Card>
      ) : paginated.length === 0 && !loadError ? (
        <Card className="py-12 text-center text-muted-foreground">
          {hayFiltros
            ? "No hay compras que coincidan con los filtros."
            : "Todavía no hay compras registradas."}
        </Card>
      ) : (
        <PurchasesTable
          purchases={paginated}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onViewDetail={handleViewDetail}
          onRegisterPayment={handleOpenPayment}
          onCancelRequest={handleCancelRequest}
          onDeleteRequest={handleDeleteRequest}
        />
      )}

      <PurchaseFormModal
        isOpen={isPurchaseFormOpen}
        onClose={handleClosePurchaseForm}
        purchaseForm={purchaseForm}
        onFormChange={setPurchaseForm}
        suppliers={suppliers}
        supplierProducts={supplierProducts}
        loadingProducts={loadingProducts}
        serverError={actionError}
        serverFieldErrors={formErrors}
        onSave={handleSavePurchase}
      />

      <PurchaseDetailModal
        isOpen={Boolean(detailPurchase) && !paymentModalOpen}
        onClose={handleCloseDetail}
        purchase={detailPurchase}
        actionError={cancelDialogOpen || deleteDialogOpen ? "" : actionError}
        onRegisterPayment={handleOpenPayment}
        onAnularPago={handleAnularPago}
        onCancelRequest={handleCancelRequest}
        onDeleteRequest={handleDeleteRequest}
      />

      <PurchasePaymentModal
        isOpen={paymentModalOpen}
        onClose={handleClosePayment}
        purchase={purchaseToPay}
        paymentForm={paymentForm}
        onFormChange={setPaymentForm}
        paymentMethods={paymentMethods}
        serverError={actionError}
        serverFieldErrors={formErrors}
        onSave={handleSavePayment}
      />

      <DeleteDialog
        isOpen={cancelDialogOpen}
        onClose={closeCancelDialog}
        onConfirm={confirmCancel}
        title="¿Cancelar esta compra?"
        itemName={purchaseToCancel?.folio}
        confirmLabel="Sí, cancelar"
        confirmingLabel="Cancelando…"
        warningText="⚠️ El stock que entró con esta compra se va a devolver"
        description={
          actionError ||
          "La compra queda anulada y el stock de sus productos baja por las mismas cantidades que había subido. Si esa mercancía ya se vendió, la operación se bloquea."
        }
      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        itemName={purchaseToDelete?.folio}
        description={
          actionError ||
          "Esta acción no se puede deshacer. Solo se pueden eliminar compras ya canceladas, para que el stock se haya devuelto antes de borrar el registro."
        }
      />
    </div>
  );
}

export { Purchases };
