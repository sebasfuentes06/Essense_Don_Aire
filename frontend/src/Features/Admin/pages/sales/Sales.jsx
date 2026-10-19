import { AlertCircle, Plus, RefreshCw } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { ExportButton, PrintButton } from "../../../../shared/components/ui/ExportButton";
import { MotivoDialog, NOMBRES_METODO, NOMBRES_CANAL } from "../../../../shared/negocio";
import { useSales } from "../../hooks/sales";
import { SalesStats, SalesFiltersBar, SalesTable, SaleDetailModal, SaleFormModal, ESTADO_VENTA } from "../../components/sales";
import { PaymentFormModal } from "../../components/payments";

const columns = [
  { key: "invoice", header: "Factura" },
  { key: "date", header: "Fecha", format: "date" },
  { key: "customer", header: "Cliente" },
  { header: "Canal", value: (r) => NOMBRES_CANAL[r.channel] ?? r.channel },
  { header: "Forma de pago", value: (r) => NOMBRES_METODO[r.paymentMethod] ?? r.paymentMethod ?? "" },
  { key: "total", header: "Total", format: "money" },
  { key: "paid", header: "Pagado", format: "money" },
  { key: "balance", header: "Saldo", format: "money" },
  { header: "Estado", value: (r) => ESTADO_VENTA[r.paymentStatus]?.[0] ?? r.paymentStatus },
  { key: "orderCode", header: "Pedido" },
  { key: "seller", header: "Atendió" }
];

/** Ventas conectadas a la API de la app: factura, abonos, Wompi y anulación. */
function Sales() {
  const s = useSales();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">Ventas</h1>
          <p className="text-muted-foreground">Facturas, abonos y saldo de cada venta</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ExportButton name="ventas" rows={s.filtered} columns={columns} />
          <PrintButton />
          {s.canCreate && (
            <Button onClick={() => s.setIsFormOpen(true)}>
              <Plus className="h-5 w-5" /> Registrar venta
            </Button>
          )}
        </div>
      </div>

      <SalesStats stats={s.stats} />

      <SalesFiltersBar
        searchQuery={s.searchQuery}
        onSearchChange={s.handleSearchChange}
        statusFilter={s.statusFilter}
        onStatusFilterChange={s.handleStatusFilterChange}
        channelFilter={s.channelFilter}
        onChannelFilterChange={s.handleChannelFilterChange}
        sortBy={s.sortBy}
        onSortByChange={s.setSortBy}
        sortDirection={s.sortDirection}
        onSortDirectionChange={s.setSortDirection}
        sortOptions={s.sortOptions}
        itemsPerPage={s.itemsPerPage}
        onItemsPerPageChange={s.setItemsPerPage}
      />

      {s.error ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-destructive">{s.error}</p>
          <Button variant="outline" onClick={s.reload}>
            <RefreshCw /> Reintentar
          </Button>
        </div>
      ) : s.isLoading && s.all.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground">Cargando ventas…</div>
      ) : (
        <SalesTable
          sales={s.paginated}
          currentPage={s.currentPage}
          totalPages={s.totalPages}
          totalItems={s.filtered.length}
          itemsPerPage={s.itemsPerPage}
          onPageChange={s.setCurrentPage}
          onView={s.openDetail}
          onPay={s.setPayingSale}
          onCancel={s.setCancellingSale}
          isAdmin={s.isAdmin}
        />
      )}

      <SaleDetailModal
        sale={s.detailSale}
        onClose={() => s.setDetailSale(null)}
        onPay={s.setPayingSale}
        onCancel={s.setCancellingSale}
        onWompi={s.createWompiLink}
        isAdmin={s.isAdmin}
      />

      <SaleFormModal isOpen={s.isFormOpen} onSave={s.createSale} onClose={() => s.setIsFormOpen(false)} />

      <PaymentFormModal sale={s.payingSale} isClient={false} onClose={() => s.setPayingSale(null)} onSave={s.savePayment} />

      <MotivoDialog
        isOpen={Boolean(s.cancellingSale)}
        title={`Anular ${s.cancellingSale?.invoice ?? ""}`}
        description="El stock vuelve al inventario y los pagos aplicados quedan anulados."
        label="Motivo de la anulación"
        confirmText="Anular venta"
        danger
        onConfirm={s.confirmCancel}
        onClose={() => s.setCancellingSale(null)}
      />
    </div>
  );
}

export { Sales };
