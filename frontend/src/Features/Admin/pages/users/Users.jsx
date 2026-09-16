import { AlertCircle, Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { Card } from "../../../../shared/components/ui/Card";
import { DeleteDialog } from "../../../../shared/components/ui/DeleteDialog";
import { ExportButton, PrintButton } from "../../../../shared/components/ui/ExportButton";
import { useUsers } from "../../hooks/users";
import { UserStats, UserFilters, UserTable, UserFormModal, UserDetailModal } from "../../components/users";

const userColumns = [
  { key: "name", header: "Usuario" },
  { key: "email", header: "Correo" },
  { key: "phone", header: "Teléfono" },
  { key: "role", header: "Rol" },
  { header: "Estado", value: (row) => (row.status === "active" ? "Activo" : "Inactivo") },
  { key: "lastLogin", header: "Último acceso", format: "date" },
  { key: "joinDate", header: "Fecha de ingreso", format: "date" }
];

function Users() {
  const {
    users,
    isLoading,
    loadError,
    actionError,
    formErrors,
    stats,
    totalItems,
    currentUserId,
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
    roleFilter,
    isModalOpen,
    selectedUser,
    detailModalOpen,
    selectedUserForDetail,
    userForm,
    setUserForm,
    deleteDialogOpen,
    userToDelete,
    totalPages,
    paginatedUsers,
    activeUsers,
    adminCount,
    inactiveUsers,
    roles,
    sortOptions,
    handleDelete,
    confirmDelete,
    handleEdit,
    handleNewUser,
    handleShowUserDetail,
    handleSaveUser,
    handleToggleStatus,
    handleCloseModal,
    handleCloseDetailModal,
    handleCloseDeleteDialog,
    handleSearchChange,
    handleStatusFilterChange,
    handleRoleFilterChange
  } = useUsers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Usuarios</h1>
          <p className="text-muted-foreground">
            Gestión de cuentas de usuario y acceso al sistema
          </p>
        </div>
        <div className="flex gap-3">
          <ExportButton name="usuarios" rows={users} columns={userColumns} />
          <PrintButton />
          <Button onClick={handleNewUser}>
            <Plus className="h-5 w-5" />
            Nuevo Usuario
          </Button>
        </div>
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

      <UserStats
        totalUsers={stats.total}
        activeUsers={activeUsers}
        adminCount={adminCount}
        inactiveUsers={inactiveUsers}
      />

      <UserFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        roleFilter={roleFilter}
        onRoleFilterChange={handleRoleFilterChange}
        roleOptions={roles}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
        sortOptions={sortOptions}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {isLoading ? (
        <Card className="py-12 text-center text-muted-foreground">Cargando usuarios…</Card>
      ) : paginatedUsers.length === 0 && !loadError ? (
        <Card className="py-12 text-center text-muted-foreground">
          No hay usuarios que coincidan con la búsqueda.
        </Card>
      ) : (
        <UserTable
          users={paginatedUsers}
          totalPages={totalPages}
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentUserId={currentUserId}
          onPageChange={setCurrentPage}
          onShowDetail={handleShowUserDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}

      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isEditing={!!selectedUser}
        userForm={userForm}
        onUserFormChange={setUserForm}
        roles={roles}
        serverError={actionError}
        serverFieldErrors={formErrors}
        onSave={handleSaveUser}
      />

      <UserDetailModal
        isOpen={detailModalOpen}
        onClose={handleCloseDetailModal}
        user={selectedUserForDetail}
      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={confirmDelete}
        itemName={userToDelete?.name}
        description={
          actionError ||
          "Esta acción no se puede deshacer. Si el usuario tiene ventas o pedidos asociados, desactívalo en lugar de eliminarlo."
        }
      />
    </div>
  );
}

export { Users };
