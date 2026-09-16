import { AlertCircle, Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { Card } from "../../../../shared/components/ui/Card";
import { DeleteDialog } from "../../../../shared/components/ui/DeleteDialog";
import { ExportButton, PrintButton } from "../../../../shared/components/ui/ExportButton";
import { useSuppliers } from "../../hooks/suppliers";
import {
  SupplierStats,
  SupplierFilters,
  SupplierTable,
  SupplierFormModal,
  SupplierDetailModal
} from "../../components/suppliers";
import { useAuth } from "../../../../shared/auth";

const supplierColumns = [
  { key: "name", header: "Proveedor" },
  { key: "contact", header: "Contacto" },
  { key: "email", header: "Correo" },
  { key: "phone", header: "Teléfono" },
  { key: "city", header: "Ciudad" },
  { key: "rating", header: "Calificación", format: "number" },
  { key: "reviews", header: "Reseñas", format: "number" },
  { key: "totalProducts", header: "Productos", format: "number" },
  { key: "totalOrders", header: "Órdenes", format: "number" },
  { key: "totalSpent", header: "Total comprado", format: "money" },
  { header: "Estado", value: (row) => (row.status === "active" ? "Activo" : "Inactivo") },
  { key: "since", header: "Desde", format: "date" }
];

function Suppliers() {
  const { can } = useAuth();

  const {
    exportRows,
    cities,
    isLoading,
    loadError,
    actionError,
    formErrors,
    totalItems,
    searchQuery,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    statusFilter,
    cityFilter,
    isModalOpen,
    selectedSupplier,
    supplierForm,
    setSupplierForm,
    deleteDialogOpen,
    supplierToDelete,
    detailModalOpen,
    supplierToView,
    sortOptions,
    totalPages,
    paginatedSuppliers,
    totalSuppliers,
    activeSuppliers,
    totalProducts,
    avgRating,
    handleDelete,
    confirmDelete,
    handleEdit,
    handleView,
    closeDetailModal,
    handleNewSupplier,
    handleSaveSupplier,
    handleCloseModal,
    handleCloseDeleteDialog,
    handleSearchChange,
    handleStatusFilterChange,
    handleCityFilterChange,
    handleToggleStatus
  } = useSuppliers();

  const hayFiltros = Boolean(searchQuery) || statusFilter !== "all" || cityFilter !== "all";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Proveedores</h1>
          <p className="text-muted-foreground">
            Directorio de proveedores y gestión de relaciones
          </p>
        </div>

        <div className="flex gap-3">
          {/*
            Se exporta `exportRows`, no la página que se está viendo. La tabla
            solo tiene diez filas en memoria; si el CSV saliera de ahí, quien
            exportara un listado de cincuenta se llevaría diez sin enterarse.
          */}
          <ExportButton name="proveedores" rows={exportRows} columns={supplierColumns} />
          <PrintButton />
          {can("suppliers.create") && (
            <Button onClick={handleNewSupplier}>
              <Plus className="h-5 w-5" />
              Nuevo Proveedor
            </Button>
          )}
        </div>
      </div>

      {loadError && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      {/*
        El error de una acción se muestra aquí solo si no hay un modal abierto.
        Si lo hay, se pinta dentro del modal —que es donde está mirando la
        persona— y repetirlo debajo sería ruido.
      */}
      {actionError && !deleteDialogOpen && !isModalOpen && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      <SupplierStats
        totalSuppliers={totalSuppliers}
        activeSuppliers={activeSuppliers}
        totalProducts={totalProducts}
        avgRating={avgRating}
      />

      <SupplierFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        cityFilter={cityFilter}
        onCityFilterChange={handleCityFilterChange}
        cities={cities}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOptions={sortOptions}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {isLoading ? (
        <Card className="py-12 text-center text-muted-foreground">Cargando proveedores…</Card>
      ) : paginatedSuppliers.length === 0 && !loadError ? (
        <Card className="py-12 text-center text-muted-foreground">
          {hayFiltros
            ? "No hay proveedores que coincidan con la búsqueda."
            : "Todavía no hay proveedores registrados."}
        </Card>
      ) : (
        <SupplierTable
          suppliers={paginatedSuppliers}
          totalPages={totalPages}
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}

      <SupplierFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isEditing={!!selectedSupplier}
        supplierForm={supplierForm}
        onFormChange={setSupplierForm}
        serverError={actionError}
        serverFieldErrors={formErrors}
        onSave={handleSaveSupplier}
      />

      <SupplierDetailModal
        isOpen={detailModalOpen}
        onClose={closeDetailModal}
        supplier={supplierToView}
      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={confirmDelete}
        itemName={supplierToDelete?.name}
        description={
          actionError ||
          "Esta acción no se puede deshacer. Un proveedor con productos o compras no se puede eliminar: desactívalo en su lugar."
        }
      />
    </div>
  );
}

export { Suppliers };
