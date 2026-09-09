import { jsx, jsxs } from "react/jsx-runtime";
import { Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { DeleteDialog } from "../../../../shared/components/ui/DeleteDialog";
import { ExportButton, PrintButton } from "../../../../shared/components/ui/ExportButton";
import { useCustomers } from "../../hooks/customers";
import { CustomerStats, CustomerFilters, CustomerTable, CustomerFormModal, CustomerDetailModal } from "../../components/customers";
import { useAuth } from "../../../../shared/auth";

const customerColumns = [
  { key: "name", header: "Cliente" },
  { key: "email", header: "Correo" },
  { key: "phone", header: "Teléfono" },
  { key: "city", header: "Ciudad" },
  { key: "address", header: "Dirección" },
  { key: "totalPurchases", header: "Compras", format: "number" },
  { key: "totalSpent", header: "Total gastado", format: "money" },
  { header: "Estado", value: (row) => (row.status === "active" ? "Activo" : "Inactivo") },
  { key: "joinDate", header: "Registro", format: "date" },
  { key: "lastPurchase", header: "Última compra", format: "date" }
];

function Customers() {
  const { can } = useAuth();

  const {
    customers,
    sortOptions,
    paginatedCustomers,
    totalPages,
    sortedCustomers,
    searchQuery,
    currentPage,
    itemsPerPage,
    sortBy,
    sortDirection,
    statusFilter,
    isModalOpen,
    selectedCustomer,
    viewMode,
    customerForm,
    deleteDialogOpen,
    customerToDelete,
    setCurrentPage,
    setItemsPerPage,
    setSortBy,
    setSortDirection,
    handleDelete,
    confirmDelete,
    handleEdit,
    handleView,
    handleNewCustomer,
    handleSaveCustomer,
    handleToggleStatus,
    closeModal,
    closeDeleteDialog,
    handleSearchChange,
    handleStatusFilterChange,
    updateCustomerFormField
  } = useCustomers();
  return /* @__PURE__ */jsxs("div", {
    className: "space-y-6",
    children: [/* @__PURE__ */jsxs("div", {
      className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4",
      children: [/* @__PURE__ */jsxs("div", {
        children: [/* @__PURE__ */jsx("h1", {
          className: "text-4xl font-bold text-foreground mb-2",
          children: "Clientes"
        }), /* @__PURE__ */jsx("p", {
          className: "text-muted-foreground",
          children: "Gestiona tu base de clientes"
        })]
      }), /* @__PURE__ */jsxs("div", {
        className: "flex gap-3",
        children: [/* @__PURE__ */jsx(ExportButton, {
          name: "clientes",
          rows: sortedCustomers,
          columns: customerColumns
        }), /* @__PURE__ */jsx(PrintButton, {}), can("customers.create") && /* @__PURE__ */jsxs(Button, {
          onClick: handleNewCustomer,
          children: [/* @__PURE__ */jsx(Plus, {
            className: "h-5 w-5"
          }), "Nuevo Cliente"]
        })]
      })]
    }), /* @__PURE__ */jsx(CustomerStats, {
      customers
    }), /* @__PURE__ */jsx(CustomerFilters, {
      searchQuery,
      onSearchChange: handleSearchChange,
      statusFilter,
      onStatusFilterChange: handleStatusFilterChange,
      sortBy,
      onSortByChange: setSortBy,
      sortOptions,
      sortDirection,
      onSortDirectionChange: setSortDirection,
      itemsPerPage,
      onItemsPerPageChange: setItemsPerPage
    }), /* @__PURE__ */jsx(CustomerTable, {
      customers: paginatedCustomers,
      currentPage,
      totalPages,
      totalItems: sortedCustomers.length,
      itemsPerPage,
      onPageChange: setCurrentPage,
      onView: handleView,
      onToggleStatus: handleToggleStatus,
      onEdit: handleEdit,
      onDelete: handleDelete
    }), viewMode === "details" ? /* @__PURE__ */jsx(CustomerDetailModal, {
      isOpen: isModalOpen,
      onClose: closeModal,
      customerForm
    }) : /* @__PURE__ */jsx(CustomerFormModal, {
      isOpen: isModalOpen,
      onClose: closeModal,
      isEditing: Boolean(selectedCustomer),
      customerForm,
      onFieldChange: updateCustomerFormField,
      onSave: handleSaveCustomer
    }), /* @__PURE__ */jsx(DeleteDialog, {
      isOpen: deleteDialogOpen,
      onClose: closeDeleteDialog,
      onConfirm: confirmDelete,
      itemName: customerToDelete?.name
    })]
  });
}
export { Customers };