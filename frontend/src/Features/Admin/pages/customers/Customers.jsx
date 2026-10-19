import { AlertCircle, Plus, RefreshCw } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { DeleteDialog } from "../../../../shared/components/ui/DeleteDialog";
import { ExportButton, PrintButton } from "../../../../shared/components/ui/ExportButton";
import { useAuth } from "../../../../shared/auth";
import { useCustomers } from "../../hooks/customers";
import { CustomerStats, CustomerFilters, CustomerTable, CustomerFormModal, CustomerDetailModal } from "../../components/customers";

const customerColumns = [
  { key: "name", header: "Cliente" },
  { key: "documentType", header: "Tipo doc." },
  { key: "document", header: "Documento" },
  { key: "phone", header: "Celular" },
  { key: "email", header: "Correo" },
  { key: "city", header: "Municipio" },
  { key: "address", header: "Dirección" },
  { key: "purchases", header: "Compras", format: "number" },
  { key: "balance", header: "Saldo", format: "money" },
  { header: "Estado", value: (row) => (row.active ? "Activo" : "Inactivo") },
  { key: "lastPurchase", header: "Última compra", format: "date" }
];

/** Clientes: misma ficha y estado de cuenta que en la app móvil. */
function Customers() {
  const { can } = useAuth();
  const c = useCustomers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Fichas de clientes, su historial de compras y lo que deben</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ExportButton name="clientes" rows={c.filtered} columns={customerColumns} />
          <PrintButton />
          {can("customers.create") && (
            <Button onClick={c.openNew}>
              <Plus className="h-5 w-5" /> Nuevo cliente
            </Button>
          )}
        </div>
      </div>

      <CustomerStats stats={c.stats} />

      <CustomerFilters
        searchQuery={c.searchQuery}
        onSearchChange={c.handleSearchChange}
        statusFilter={c.statusFilter}
        onStatusFilterChange={c.handleStatusFilterChange}
        balanceFilter={c.balanceFilter}
        onBalanceFilterChange={c.handleBalanceFilterChange}
        sortBy={c.sortBy}
        onSortByChange={c.setSortBy}
        sortOptions={c.sortOptions}
        sortDirection={c.sortDirection}
        onSortDirectionChange={c.setSortDirection}
        itemsPerPage={c.itemsPerPage}
        onItemsPerPageChange={c.setItemsPerPage}
      />

      {c.loadError ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-destructive">{c.loadError}</p>
          <Button variant="outline" onClick={c.reload}>
            <RefreshCw /> Reintentar
          </Button>
        </div>
      ) : c.isLoading && c.all.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground">Cargando clientes…</div>
      ) : (
        <CustomerTable
          customers={c.paginated}
          currentPage={c.currentPage}
          totalPages={c.totalPages}
          totalItems={c.filtered.length}
          itemsPerPage={c.itemsPerPage}
          onPageChange={c.setCurrentPage}
          onView={c.setViewingCustomer}
          onToggleStatus={c.toggleStatus}
          onEdit={c.openEdit}
          onDelete={c.setDeletingCustomer}
        />
      )}

      <CustomerFormModal
        key={c.editingCustomer?.id ?? "nuevo"}
        isOpen={c.isFormOpen}
        onClose={c.closeForm}
        isEditing={Boolean(c.editingCustomer)}
        form={c.form}
        onFormChange={c.setForm}
        serverErrors={c.formErrors}
        serverError={c.formError}
        onSave={c.save}
      />

      <CustomerDetailModal customer={c.viewingCustomer} onClose={() => c.setViewingCustomer(null)} />

      <DeleteDialog
        isOpen={Boolean(c.deletingCustomer)}
        onClose={() => c.setDeletingCustomer(null)}
        onConfirm={c.confirmDelete}
        itemName={c.deletingCustomer?.name}
        description="Si el cliente tiene ventas o pedidos no se puede eliminar; en ese caso desactívalo."
      />
    </div>
  );
}

export { Customers };
