import { AlertCircle, Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { Card } from "../../../../shared/components/ui/Card";
import { DeleteDialog } from "../../../../shared/components/ui/DeleteDialog";
import { useRoles } from "../../hooks/roles";
import { RoleStats, RoleFilters, RoleTable, RoleFormModal, RoleDetailModal } from "../../components/roles";

function Roles() {
  const {
    roles,
    availablePermissions,
    sortOptions,
    isLoading,
    loadError,
    actionError,
    formErrors,
    stats,
    totalItems,
    searchQuery,
    currentPage,
    itemsPerPage,
    sortBy,
    sortDirection,
    statusFilter,
    totalPages,
    paginatedRoles,
    isModalOpen,
    selectedRole,
    roleForm,
    deleteDialogOpen,
    roleToDelete,
    detailModalOpen,
    roleToView,
    setCurrentPage,
    setItemsPerPage,
    setSortBy,
    setSortDirection,
    setRoleForm,
    handleDelete,
    confirmDelete,
    handleEdit,
    handleView,
    handleToggleStatus,
    handleNewRole,
    handleSaveRole,
    closeFormModal,
    closeDetailModal,
    closeDeleteDialog,
    handleSearchChange,
    handleStatusFilterChange
  } = useRoles();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Roles y Permisos</h1>
          <p className="text-muted-foreground">
            Gestiona los roles y permisos de acceso al sistema
          </p>
        </div>
        <Button onClick={handleNewRole}>
          <Plus className="h-5 w-5" />
          Nuevo Rol
        </Button>
      </div>

      {loadError && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      {actionError && !deleteDialogOpen && !isModalOpen && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      <RoleStats roles={roles} availablePermissions={availablePermissions} stats={stats} />

      <RoleFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
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

      {isLoading ? (
        <Card className="py-12 text-center text-muted-foreground">Cargando roles…</Card>
      ) : paginatedRoles.length === 0 && !loadError ? (
        <Card className="py-12 text-center text-muted-foreground">
          No hay roles que coincidan con la búsqueda.
        </Card>
      ) : (
        <RoleTable
          paginatedRoles={paginatedRoles}
          totalPages={totalPages}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}

      <RoleFormModal
        isOpen={isModalOpen}
        onClose={closeFormModal}
        isEditing={!!selectedRole}
        roleForm={roleForm}
        onRoleFormChange={setRoleForm}
        availablePermissions={availablePermissions}
        serverError={actionError}
        serverFieldErrors={formErrors}
        onSave={handleSaveRole}
      />

      <RoleDetailModal
        isOpen={detailModalOpen}
        onClose={closeDetailModal}
        roleToView={roleToView}
        availablePermissions={availablePermissions}
      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        itemName={roleToDelete?.name}
        description={
          actionError ||
          "Esta acción no se puede deshacer. Un rol con usuarios asignados no se puede eliminar: reasígnalos primero."
        }
      />
    </div>
  );
}

export { Roles };
