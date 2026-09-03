import { jsx, jsxs } from "react/jsx-runtime";
import { Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/Button";
import { DeleteDialog } from "../../../../shared/components/ui/DeleteDialog";
import { useRoles } from "../../hooks/roles";
import { RoleStats, RoleFilters, RoleTable, RoleFormModal, RoleDetailModal } from "../../components/roles";
function Roles() {
  const {
    roles,
    availablePermissions,
    sortOptions,
    searchQuery,
    currentPage,
    itemsPerPage,
    sortBy,
    sortDirection,
    statusFilter,
    sortedRoles,
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
  return /* @__PURE__ */jsxs("div", {
    className: "space-y-6",
    children: [/* @__PURE__ */jsxs("div", {
      className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4",
      children: [/* @__PURE__ */jsxs("div", {
        children: [/* @__PURE__ */jsx("h1", {
          className: "text-4xl font-bold text-foreground mb-2",
          children: "Roles y Permisos"
        }), /* @__PURE__ */jsx("p", {
          className: "text-muted-foreground",
          children: "Gestiona los roles y permisos de acceso al sistema"
        })]
      }), /* @__PURE__ */jsxs(Button, {
        onClick: handleNewRole,
        children: [/* @__PURE__ */jsx(Plus, {
          className: "h-5 w-5"
        }), "Nuevo Rol"]
      })]
    }), /* @__PURE__ */jsx(RoleStats, {
      roles,
      availablePermissions
    }), /* @__PURE__ */jsx(RoleFilters, {
      searchQuery,
      onSearchChange: handleSearchChange,
      statusFilter,
      onStatusFilterChange: handleStatusFilterChange,
      sortBy,
      onSortByChange: setSortBy,
      sortDirection,
      onSortDirectionChange: setSortDirection,
      sortOptions,
      itemsPerPage,
      onItemsPerPageChange: setItemsPerPage
    }), /* @__PURE__ */jsx(RoleTable, {
      paginatedRoles,
      totalPages,
      currentPage,
      itemsPerPage,
      totalItems: sortedRoles.length,
      onPageChange: setCurrentPage,
      onView: handleView,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onToggleStatus: handleToggleStatus
    }), /* @__PURE__ */jsx(RoleFormModal, {
      isOpen: isModalOpen,
      onClose: closeFormModal,
      isEditing: !!selectedRole,
      roleForm,
      onRoleFormChange: setRoleForm,
      availablePermissions,
      onSave: handleSaveRole
    }), /* @__PURE__ */jsx(RoleDetailModal, {
      isOpen: detailModalOpen,
      onClose: closeDetailModal,
      roleToView
    }), /* @__PURE__ */jsx(DeleteDialog, {
      isOpen: deleteDialogOpen,
      onClose: closeDeleteDialog,
      onConfirm: confirmDelete,
      itemName: roleToDelete?.name
    })]
  });
}
export { Roles };