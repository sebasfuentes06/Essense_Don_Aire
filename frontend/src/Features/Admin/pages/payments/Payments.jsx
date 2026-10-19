import { useMemo } from "react";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { MotivoDialog } from "../../../../shared/negocio";
import { cn } from "../../../../shared/utils/cn";
import { usePayments } from "../../hooks/payments";
import {
  PaymentsHeader,
  PaymentsStats,
  PaymentsFiltersBar,
  PaymentsTable,
  CarteraTable,
  ClientOpenSales,
  PaymentDetailModal,
  PaymentFormModal
} from "../../components/payments";

/**
 * Módulo Pagos, conectado a la API de la app móvil.
 * Equipo: Por aprobar · Cartera · Historial. Cliente: Por pagar · Mis pagos.
 */
function Payments() {
  const p = usePayments();

  const tabs = p.isClient
    ? [
        { id: "saldos", label: "Por pagar", count: p.openSales.length },
        { id: "historial", label: "Mis pagos" }
      ]
    : [
        { id: "por_aprobar", label: "Por aprobar", count: p.porAprobar.length },
        { id: "cartera", label: "Cartera", count: p.cartera?.cantidad_ventas },
        { id: "historial", label: "Historial" }
      ];

  // Lo que el cliente ya reportó y sigue en revisión, por venta.
  const pendingBySale = useMemo(() => {
    const m = {};
    for (const x of p.porAprobar) m[x.saleId] = (m[x.saleId] ?? 0) + x.amount;
    return m;
  }, [p.porAprobar]);

  const tablaComun = {
    isClient: p.isClient,
    isAdmin: p.isAdmin,
    onView: p.setViewingPayment,
    onApprove: p.approve,
    onReject: p.setRejectingPayment
  };

  let contenido;
  if (p.error) {
    contenido = (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-destructive">{p.error}</p>
        <Button variant="outline" onClick={p.reload}>
          <RefreshCw /> Reintentar
        </Button>
      </div>
    );
  } else if (p.isLoading && p.payments.length === 0 && !p.cartera && p.openSales.length === 0) {
    contenido = (
      <div className="flex items-center justify-center gap-2 p-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Cargando pagos…
      </div>
    );
  } else if (p.tab === "saldos") {
    contenido = (
      <ClientOpenSales
        sales={p.openSales}
        pendingBySale={pendingBySale}
        onWompi={p.payWithWompi}
        onReport={p.setPayingSale}
        wompiBusy={p.wompiBusy}
      />
    );
  } else if (p.tab === "por_aprobar") {
    contenido = (
      <PaymentsTable
        {...tablaComun}
        payments={p.porAprobar}
        currentPage={1}
        totalPages={1}
        totalItems={p.porAprobar.length}
        itemsPerPage={p.porAprobar.length || 1}
        onPageChange={() => {}}
        emptyTitle="No hay pagos por aprobar"
        emptyText="Aquí llegan las transferencias que reportan los clientes, con su comprobante."
      />
    );
  } else if (p.tab === "cartera") {
    contenido = <CarteraTable cartera={p.cartera} onPay={p.setPayingSale} onWompi={p.payWithWompi} wompiBusy={p.wompiBusy} />;
  } else {
    contenido = (
      <div className="space-y-4">
        <PaymentsFiltersBar
          searchQuery={p.searchQuery}
          onSearchChange={p.handleSearchChange}
          statusFilter={p.statusFilter}
          onStatusFilterChange={p.handleStatusFilterChange}
          methodFilter={p.methodFilter}
          onMethodFilterChange={p.handleMethodFilterChange}
          itemsPerPage={p.itemsPerPage}
          onItemsPerPageChange={p.setItemsPerPage}
        />
        <PaymentsTable
          {...tablaComun}
          payments={p.paginated}
          currentPage={p.currentPage}
          totalPages={p.totalPages}
          totalItems={p.filtered.length}
          itemsPerPage={p.itemsPerPage}
          onPageChange={p.setCurrentPage}
          emptyText={p.isClient ? "Cuando pagues o reportes un pago, aparecerá aquí." : "Ajusta los filtros."}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PaymentsHeader isClient={p.isClient} rows={p.filtered} onRefresh={p.reload} isLoading={p.isLoading} />

      <PaymentsStats stats={p.stats} isClient={p.isClient} />

      <div className="flex gap-2 overflow-x-auto border-b border-border" data-no-print>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => p.setTab(t.id)}
            aria-pressed={p.tab === t.id}
            className={cn(
              "-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              p.tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
            {t.count > 0 && <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">{t.count}</span>}
          </button>
        ))}
      </div>

      {contenido}

      <PaymentFormModal sale={p.payingSale} isClient={p.isClient} onClose={() => p.setPayingSale(null)} onSave={p.savePayment} />

      <PaymentDetailModal
        key={p.viewingPayment?.id ?? "none"}
        payment={p.viewingPayment}
        isClient={p.isClient}
        isAdmin={p.isAdmin}
        onClose={() => p.setViewingPayment(null)}
        onApprove={p.approve}
        onReject={p.setRejectingPayment}
        onVoid={p.setVoidingPayment}
        onUploadProof={p.uploadProof}
      />

      <MotivoDialog
        isOpen={Boolean(p.rejectingPayment)}
        title="Rechazar pago"
        description="El cliente verá el motivo y podrá reportar el pago de nuevo."
        label="Motivo del rechazo"
        confirmText="Rechazar"
        danger
        onConfirm={p.confirmReject}
        onClose={() => p.setRejectingPayment(null)}
      />

      <MotivoDialog
        isOpen={Boolean(p.voidingPayment)}
        title="Anular pago"
        description="El monto vuelve a quedar como saldo pendiente de la venta."
        label="Motivo de la anulación"
        confirmText="Anular"
        danger
        onConfirm={p.confirmVoid}
        onClose={() => p.setVoidingPayment(null)}
      />
    </div>
  );
}

export { Payments };
