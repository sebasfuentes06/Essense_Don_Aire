import { AlertCircle, Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { Card } from "../../../../shared/components/ui/Card";
import { ExportButton, PrintButton } from "../../../../shared/components/ui/ExportButton";
import { MotivoDialog } from "../../../../shared/negocio";
import { cn } from "../../../../shared/utils/cn";
import { useUsers } from "../../hooks/users";
import { UserStats, UserFilters, UserTable, UserFormModal, UserDetailModal, UserRequests, ApproveUserModal } from "../../components/users";

const userColumns = [
  { key: "name", header: "Usuario" },
  { key: "email", header: "Correo" },
  { key: "phone", header: "Teléfono" },
  { key: "role", header: "Rol" },
  { key: "customerName", header: "Ficha de cliente" },
  { header: "Estado", value: (row) => (row.status === "active" ? "Activo" : "Inactivo") },
  { key: "lastLogin", header: "Último acceso", format: "date" },
  { key: "joinDate", header: "Registro", format: "date" }
];

/** Usuarios: cuentas (3 roles fijos) y solicitudes de registro por aprobar. */
function Users() {
  const u = useUsers();
  const tabs = [
    { id: "cuentas", label: "Cuentas", count: 0 },
    { id: "solicitudes", label: "Solicitudes", count: u.requests.length }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">Usuarios</h1>
          <p className="text-muted-foreground">Cuentas de acceso, roles y solicitudes de registro</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ExportButton name="usuarios" rows={u.users} columns={userColumns} />
          <PrintButton />
          <Button onClick={u.handleNewUser}>
            <Plus className="h-5 w-5" />
            Nuevo usuario
          </Button>
        </div>
      </div>

      {u.loadError && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{u.loadError}</span>
        </div>
      )}

      <UserStats totalUsers={u.stats.total} activeUsers={u.activeUsers} adminCount={u.adminCount} inactiveUsers={u.inactiveUsers} />

      <div className="flex gap-2 border-b border-border" data-no-print>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => u.setTab(t.id)}
            aria-pressed={u.tab === t.id}
            className={cn(
              "-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              u.tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
            {t.count > 0 && <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">{t.count}</span>}
          </button>
        ))}
      </div>

      {u.tab === "solicitudes" ? (
        <UserRequests requests={u.requests} onApprove={u.setApprovingUser} onReject={u.setRejectingUser} />
      ) : (
        <>
          <UserFilters
            searchQuery={u.searchQuery}
            onSearchChange={u.handleSearchChange}
            statusFilter={u.statusFilter}
            onStatusFilterChange={u.handleStatusFilterChange}
            roleFilter={u.roleFilter}
            onRoleFilterChange={u.handleRoleFilterChange}
            roleOptions={u.roles}
            sortBy={u.sortBy}
            onSortByChange={u.setSortBy}
            sortDirection={u.sortDirection}
            onSortDirectionChange={u.setSortDirection}
            sortOptions={u.sortOptions}
            itemsPerPage={u.itemsPerPage}
            onItemsPerPageChange={u.setItemsPerPage}
          />
          {u.isLoading && u.users.length === 0 ? (
            <Card className="py-12 text-center text-muted-foreground">Cargando usuarios…</Card>
          ) : u.paginatedUsers.length === 0 && !u.loadError ? (
            <Card className="py-12 text-center text-muted-foreground">No hay usuarios que coincidan con la búsqueda.</Card>
          ) : (
            <UserTable
              users={u.paginatedUsers}
              totalPages={u.totalPages}
              currentPage={u.currentPage}
              totalItems={u.totalItems}
              itemsPerPage={u.itemsPerPage}
              currentUserId={u.currentUserId}
              onPageChange={u.setCurrentPage}
              onShowDetail={u.handleShowUserDetail}
              onEdit={u.handleEdit}
              onToggleStatus={u.handleToggleStatus}
            />
          )}
        </>
      )}

      <UserFormModal
        isOpen={u.isModalOpen}
        onClose={u.handleCloseModal}
        isEditing={Boolean(u.selectedUser)}
        isSelf={Boolean(u.selectedUser) && Number(u.selectedUser.id) === Number(u.currentUserId)}
        userForm={u.userForm}
        onUserFormChange={u.setUserForm}
        roles={u.roleChoices}
        customers={u.customerOptions}
        serverError={u.actionError}
        serverFieldErrors={u.formErrors}
        onSave={u.handleSaveUser}
      />

      <UserDetailModal isOpen={u.detailModalOpen} onClose={u.handleCloseDetailModal} user={u.selectedUserForDetail} />

      <ApproveUserModal user={u.approvingUser} roles={u.roleChoices} onConfirm={u.confirmApprove} onClose={() => u.setApprovingUser(null)} />

      <MotivoDialog
        isOpen={Boolean(u.rejectingUser)}
        title={`Rechazar a ${u.rejectingUser?.name ?? ""}`}
        description="La persona recibe el motivo por correo y no podrá entrar."
        label="Motivo del rechazo"
        confirmText="Rechazar"
        danger
        onConfirm={u.confirmReject}
        onClose={() => u.setRejectingUser(null)}
      />
    </div>
  );
}

export { Users };
