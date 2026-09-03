import { jsx, jsxs } from "react/jsx-runtime";
import { Plus, Mail } from "lucide-react";
import { Button } from "../../../../shared/components/ui/Button";
import { DeleteDialog } from "../../../../shared/components/ui/DeleteDialog";
import { useUsers } from "../../hooks/users";
import { UserStats, UserFilters, UserTable, UserFormModal, UserDetailModal } from "../../components/users";
function Users() {
  const {
    searchQuery,
    currentPage,
    itemsPerPage,
    setItemsPerPage,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    statusFilter,
    isModalOpen,
    selectedUser,
    detailModalOpen,
    selectedUserForDetail,
    userForm,
    setUserForm,
    deleteDialogOpen,
    userToDelete,
    sortedUsers,
    totalPages,
    paginatedUsers,
    activeUsers,
    adminCount,
    inactiveUsers,
    users,
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
    setCurrentPage
  } = useUsers();
  return /* @__PURE__ */jsxs("div", {
    className: "space-y-6",
    children: [/* @__PURE__ */jsxs("div", {
      className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4",
      children: [/* @__PURE__ */jsxs("div", {
        children: [/* @__PURE__ */jsx("h1", {
          className: "text-4xl font-bold text-foreground mb-2",
          children: "Usuarios"
        }), /* @__PURE__ */jsx("p", {
          className: "text-muted-foreground",
          children: "Gesti\xF3n de cuentas de usuario y acceso al sistema"
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "flex gap-3",
        children: [/* @__PURE__ */jsxs(Button, {
          children: [/* @__PURE__ */jsx(Mail, {
            className: "h-5 w-5"
          }), "Invitar"]
        }), /* @__PURE__ */jsxs(Button, {
          onClick: handleNewUser,
          children: [/* @__PURE__ */jsx(Plus, {
            className: "h-5 w-5"
          }), "Nuevo Usuario"]
        })]
      })]
    }), /* @__PURE__ */jsx(UserStats, {
      totalUsers: users.length,
      activeUsers,
      adminCount,
      inactiveUsers
    }), /* @__PURE__ */jsx(UserFilters, {
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
    }), /* @__PURE__ */jsx(UserTable, {
      users: paginatedUsers,
      totalPages,
      currentPage,
      totalItems: sortedUsers.length,
      itemsPerPage,
      onPageChange: setCurrentPage,
      onShowDetail: handleShowUserDetail,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onToggleStatus: handleToggleStatus
    }), /* @__PURE__ */jsx(UserFormModal, {
      isOpen: isModalOpen,
      onClose: handleCloseModal,
      isEditing: !!selectedUser,
      userForm,
      onUserFormChange: setUserForm,
      roles,
      onSave: handleSaveUser
    }), /* @__PURE__ */jsx(UserDetailModal, {
      isOpen: detailModalOpen,
      onClose: handleCloseDetailModal,
      user: selectedUserForDetail
    }), /* @__PURE__ */jsx(DeleteDialog, {
      isOpen: deleteDialogOpen,
      onClose: handleCloseDeleteDialog,
      onConfirm: confirmDelete,
      itemName: userToDelete?.name
    })]
  });
}
export { Users };