import { Wallet, ArrowRight } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { DeleteDialog } from "../../../../shared/components/ui/DeleteDialog";
import { cn } from "../../../../shared/utils/cn";
import { usePayments } from "../../hooks/payments";
import {
  PaymentsHeader,
  PaymentsStats,
  PaymentsFiltersBar,
  PaymentsTable,
  AccountStatementTable,
  AccountStatementModal,
  PaymentFormModal
} from "../../components/payments";

const TABS = [
  { id: "abonos", label: "Abonos registrados" },
  { id: "cuenta", label: "Estado de cuenta" }
];

/**
 * Módulo Pagos y Abonos.
 * Administrador y Vendedor alternan entre el listado de abonos y el estado
 * de cuenta por cliente. El Cliente ve una versión de solo lectura con su
 * propio saldo y sus abonos.
 */
function Payments() {
  const {
    tab, setTab,
    onlyOwn, isClient,
    payments, allFilteredPayments, statements, payableSales, stats, sortOptions,
    searchQuery, handleSearchChange,
    methodFilter, handleMethodFilterChange,
    statusFilter, handleStatusFilterChange,
    sortBy, setSortBy,
    sortDirection, setSortDirection,
    currentPage, setCurrentPage,
    itemsPerPage, setItemsPerPage,
    totalPages,
    isFormOpen, form, setForm, formError,
    handleNewPayment, handleCloseForm, handleSavePayment,
    statementCustomer, setStatementCustomer, getStatement,
    deleteDialogOpen, paymentToDelete, closeDeleteDialog,
    handleDeleteRequest, confirmDelete
  } = usePayments();

  const activeTab = isClient ? "abonos" : tab;
  const myStatement = isClient ? statements[0] ?? null : null;

  return (
    <div className="space-y-6">
      <PaymentsHeader
        onNewPayment={handleNewPayment}
        rows={allFilteredPayments}
        onlyOwn={onlyOwn}
        isClient={isClient}
      />

      <PaymentsStats stats={stats} isClient={isClient} />

      {/* Resumen de saldo para el Cliente, con acceso al detalle */}
      {isClient && myStatement && (
        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {myStatement.balance > 0
                    ? `Tienes un saldo pendiente de $${myStatement.balance.toFixed(2)}`
                    : "Estás al día, no tienes saldo pendiente"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {myStatement.salesCount} {myStatement.salesCount === 1 ? "compra" : "compras"} ·{" "}
                  {myStatement.openSales} con saldo
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStatementCustomer(myStatement.customer)}
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg border border-primary text-primary font-semibold transition-all hover:bg-primary/10"
            >
              Ver detalle
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Card>
      )}

      {/* Pestañas: solo para quien gestiona cobros */}
      {!isClient && (
        <div className="flex gap-2 border-b border-border" data-no-print>
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              aria-pressed={activeTab === item.id}
              className={cn(
                "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeTab === item.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <div data-no-print={activeTab === "cuenta" ? "true" : undefined}>
        <PaymentsFiltersBar
          tab={activeTab}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          methodFilter={methodFilter}
          onMethodFilterChange={handleMethodFilterChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortDirection={sortDirection}
          onSortDirectionChange={setSortDirection}
          sortOptions={sortOptions}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      {activeTab === "abonos" ? (
        <PaymentsTable
          payments={payments}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={allFilteredPayments.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          isClient={isClient}
          onDelete={handleDeleteRequest}
        />
      ) : (
        <AccountStatementTable
          statements={statements}
          onViewDetail={setStatementCustomer}
          onNewPayment={(statement) => {
            const withBalance = statement.sales.find((sale) => sale.balance > 0);
            handleNewPayment(withBalance);
          }}
        />
      )}

      <AccountStatementModal
        statement={statementCustomer ? getStatement(statementCustomer) : null}
        onClose={() => setStatementCustomer(null)}
      />

      <PaymentFormModal
        isOpen={isFormOpen}
        form={form}
        onFormChange={setForm}
        onSave={handleSavePayment}
        onClose={handleCloseForm}
        payableSales={payableSales}
        error={formError}
      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="¿Eliminar este abono?"
        description="El monto volverá a quedar como saldo pendiente de la venta."
        itemName={paymentToDelete?.folio}
      />
    </div>
  );
}

export { Payments };
