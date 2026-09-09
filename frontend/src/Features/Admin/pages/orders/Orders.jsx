import { DeleteDialog } from "../../../../shared/components/ui/DeleteDialog";
import { useOrders } from "../../hooks/orders";
import {
  OrdersHeader,
  OrdersStats,
  OrdersFiltersBar,
  OrdersTable,
  OrderDetailModal,
  OrderFormModal
} from "../../components/orders";

/**
 * Módulo Pedidos. La misma pantalla sirve a los tres perfiles; lo que cambia
 * es el alcance de los datos y qué acciones aparecen, y eso lo resuelve
 * useOrders a partir de los permisos del rol.
 */
function Orders() {
  const {
    paginated,
    filtered,
    stats,
    sortOptions,
    onlyOwn,
    isClient,
    searchQuery, handleSearchChange,
    statusFilter, handleStatusFilterChange,
    channelFilter, handleChannelFilterChange,
    sortBy, setSortBy,
    sortDirection, setSortDirection,
    currentPage, setCurrentPage,
    itemsPerPage, setItemsPerPage,
    totalPages,
    detailOrder, setDetailOrder,
    isFormOpen, editingOrder, orderForm, setOrderForm,
    deleteDialogOpen, orderToDelete, closeDeleteDialog,
    handleNewOrder,
    handleEditOrder,
    handleCloseForm,
    handleSaveOrder,
    handleDeleteRequest,
    confirmDelete,
    confirmOrder,
    cancelOrder,
    convertToSale,
    canEditOrder,
    canDeleteOrder,
    canCancelOrder,
    canConfirmOrder,
    canConvertOrder
  } = useOrders();

  return (
    <div className="space-y-6">
      <OrdersHeader onNewOrder={handleNewOrder} onlyOwn={onlyOwn} isClient={isClient} />

      <OrdersStats stats={stats} />

      <OrdersFiltersBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        channelFilter={channelFilter}
        onChannelFilterChange={handleChannelFilterChange}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
        sortOptions={sortOptions}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      <OrdersTable
        orders={paginated}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        isClient={isClient}
        onViewDetail={setDetailOrder}
        onEdit={handleEditOrder}
        onDelete={handleDeleteRequest}
        onConfirm={confirmOrder}
        onCancel={cancelOrder}
        onConvert={convertToSale}
        canEditOrder={canEditOrder}
        canDeleteOrder={canDeleteOrder}
        canCancelOrder={canCancelOrder}
        canConfirmOrder={canConfirmOrder}
        canConvertOrder={canConvertOrder}
      />

      <OrderDetailModal order={detailOrder} onClose={() => setDetailOrder(null)} />

      <OrderFormModal
        isOpen={isFormOpen}
        isEditing={Boolean(editingOrder)}
        form={orderForm}
        onFormChange={setOrderForm}
        onSave={handleSaveOrder}
        onClose={handleCloseForm}
        isClient={isClient}
      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="¿Eliminar este pedido?"
        itemName={orderToDelete?.folio}
      />
    </div>
  );
}

export { Orders };
