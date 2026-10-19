import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { MotivoDialog } from "../../../../shared/negocio";
import { useOrders } from "../../hooks/orders";
import {
  OrdersHeader,
  OrdersStats,
  OrdersFiltersBar,
  OrdersTable,
  OrderDetailModal,
  OrderFormModal,
  ConvertOrderModal
} from "../../components/orders";

/**
 * Módulo Pedidos, conectado a la API de la app móvil. La misma pantalla sirve
 * a los tres perfiles: el Cliente ve solo los suyos (la API filtra) y el
 * equipo puede editar, cancelar y convertir en venta.
 */
function Orders() {
  const o = useOrders();

  return (
    <div className="space-y-6">
      <OrdersHeader onNewOrder={o.handleNewOrder} isClient={o.isClient} rows={o.filtered} />

      <OrdersStats stats={o.stats} />

      <OrdersFiltersBar
        searchQuery={o.searchQuery}
        onSearchChange={o.handleSearchChange}
        statusFilter={o.statusFilter}
        onStatusFilterChange={o.handleStatusFilterChange}
        channelFilter={o.channelFilter}
        onChannelFilterChange={o.handleChannelFilterChange}
        sortBy={o.sortBy}
        onSortByChange={o.setSortBy}
        sortDirection={o.sortDirection}
        onSortDirectionChange={o.setSortDirection}
        sortOptions={o.sortOptions}
        itemsPerPage={o.itemsPerPage}
        onItemsPerPageChange={o.setItemsPerPage}
      />

      {o.error ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-destructive">{o.error}</p>
          <Button variant="outline" onClick={o.reload}>
            <RefreshCw /> Reintentar
          </Button>
        </div>
      ) : o.isLoading && o.orders.length === 0 ? (
        <div className="flex items-center justify-center gap-2 p-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Cargando pedidos…
        </div>
      ) : (
        <OrdersTable
          orders={o.paginated}
          currentPage={o.currentPage}
          totalPages={o.totalPages}
          totalItems={o.filtered.length}
          itemsPerPage={o.itemsPerPage}
          onPageChange={o.setCurrentPage}
          isClient={o.isClient}
          onViewDetail={o.openDetail}
          onEdit={o.handleEditOrder}
          onCancel={o.setCancellingOrder}
          onConvert={o.setConvertingOrder}
          canEditOrder={o.canEditOrder}
          canCancelOrder={o.canCancelOrder}
          canConvertOrder={o.canConvertOrder}
        />
      )}

      <OrderDetailModal
        order={o.detailOrder}
        onClose={() => o.setDetailOrder(null)}
        isClient={o.isClient}
        onUploadProof={o.uploadProof}
        onConvert={(order) => {
          o.setDetailOrder(null);
          o.setConvertingOrder(order);
        }}
        canConvert={o.detailOrder ? o.canConvertOrder(o.detailOrder) : false}
      />

      <OrderFormModal
        isOpen={o.isFormOpen}
        editingOrder={o.editingOrder}
        onSave={o.handleSaveOrder}
        onClose={o.handleCloseForm}
      />

      <ConvertOrderModal
        order={o.convertingOrder}
        onClose={() => o.setConvertingOrder(null)}
        onConfirm={o.confirmConvert}
      />

      <MotivoDialog
        isOpen={Boolean(o.cancellingOrder)}
        title={`Anular pedido ${o.cancellingOrder?.folio ?? ""}`}
        description="El pedido no se borra: queda anulado (con el motivo) y ya no se puede convertir en venta."
        label="Motivo de la anulación"
        confirmText="Anular pedido"
        danger
        onConfirm={o.confirmCancel}
        onClose={() => o.setCancellingOrder(null)}
      />
    </div>
  );
}

export { Orders };
