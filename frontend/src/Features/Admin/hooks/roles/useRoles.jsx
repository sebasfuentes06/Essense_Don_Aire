import { useState } from "react";
const availablePermissions = [
  { id: "dashboard.view", name: "Ver Dashboard", description: "Acceso al panel principal", module: "Dashboard" },
  { id: "products.view", name: "Ver Productos", description: "Ver listado de productos", module: "Productos" },
  { id: "products.create", name: "Crear Productos", description: "Crear nuevos productos", module: "Productos" },
  { id: "products.edit", name: "Editar Productos", description: "Modificar productos existentes", module: "Productos" },
  { id: "sales.view", name: "Ver Ventas", description: "Ver historial de ventas", module: "Ventas" },
  { id: "customers.view", name: "Ver Clientes", description: "Ver listado de clientes", module: "Clientes" },
  { id: "users.view", name: "Ver Usuarios", description: "Ver listado de usuarios", module: "Usuarios" }
];
const mockRoles = [
  {
    id: 1, name: "Administrador", description: "Acceso completo a todas las funcionalidades del sistema", permissions: availablePermissions.map((p) => p.id),
    usersCount: 2, status: "active", createdAt: "2024-01-01"
  },
  {
    id: 2, name: "Vendedor", description: "Acceso a ventas, productos y clientes", permissions: ["dashboard.view", "products.view", "sales.view", "customers.view"],
    usersCount: 5, status: "active", createdAt: "2024-01-15"
  },
  {
    id: 3, name: "Supervisor", description: "Acceso a reportes y supervisi\xF3n", permissions: ["dashboard.view", "products.view", "sales.view", "customers.view"],
    usersCount: 3, status: "active", createdAt: "2024-02-01"
  }
];
const sortOptions = [
  { value: "name", label: "Nombre" },
  { value: "usersCount", label: "Usuarios" },
  { value: "createdAt", label: "Fecha Creaci\xF3n" }
];
function useRoles() {
  const [roles, setRoles] = useState(mockRoles);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleForm, setRoleForm] = useState({ nombre: "", descripcion: "", permisos: [], estado: true, name: "", description: "", permissions: [], status: "active" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [roleToView, setRoleToView] = useState(null);
  const filteredRoles = roles.filter((role) => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase()) || role.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || role.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const sortedRoles = [...filteredRoles].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  const totalPages = Math.ceil(sortedRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoles = sortedRoles.slice(startIndex, startIndex + itemsPerPage);
  const handleDelete = (role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };
  const confirmDelete = () => {
    if (roleToDelete) {
      setRoles(roles.filter((r) => r.id !== roleToDelete.id));
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };
  const handleEdit = (role) => {
    setSelectedRole(role);
    setRoleForm({
      nombre: role.nombre ?? role.name ?? "",
      descripcion: role.descripcion ?? role.description ?? "",
      permisos: role.permisos ?? role.permissions ?? [],
      estado: role.estado ?? role.status ?? true,
      name: role.name ?? role.nombre ?? "",
      description: role.description ?? role.descripcion ?? "",
      permissions: role.permissions ?? role.permisos ?? [],
      status: role.status ?? role.estado ?? "active"
    });
    setIsModalOpen(true);
  };
  const handleView = (role) => {
    setRoleToView(role);
    setDetailModalOpen(true);
  };
  const handleNewRole = () => {
    setSelectedRole(null);
    setRoleForm({ nombre: "", descripcion: "", permisos: [], estado: true, name: "", description: "", permissions: [], status: "active" });
    setIsModalOpen(true);
  };
  const handleSaveRole = () => {
    const nombre = roleForm.nombre ?? roleForm.name ?? "";
    const permisos = roleForm.permisos ?? roleForm.permissions ?? [];

    if (!String(nombre).trim()) {
      alert("Debe indicar el nombre del rol.");
      return;
    }
    if (!Array.isArray(permisos) || permisos.length === 0) {
      alert("Debe seleccionar al menos un permiso.");
      return;
    }

    const payload = {
      nombre,
      descripcion: roleForm.descripcion ?? roleForm.description ?? "",
      permisos,
      estado: roleForm.estado ?? roleForm.status ?? true,
      name: roleForm.name ?? roleForm.nombre ?? "",
      description: roleForm.description ?? roleForm.descripcion ?? "",
      permissions: roleForm.permissions ?? roleForm.permisos ?? [],
      status: roleForm.status ?? roleForm.estado ?? "active"
    };

    if (selectedRole) {
      setRoles(roles.map(
        (role) => role.id === selectedRole.id ? { ...role, ...payload } : role
      ));
    } else {
      const nextId = Math.max(0, ...roles.map((role) => role.id)) + 1;
      setRoles([...roles, {
        id: nextId,
        usersCount: 0, createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        ...payload
      }]);
    }
    setIsModalOpen(false);
    setSelectedRole(null);
  };
  const handleToggleStatus = (role) => {
    setRoles(roles.map(
      (r) => r.id === role.id ? { ...r, status: r.status === "active" ? "inactive" : "active" } : r
    ));
  };
  const closeFormModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };
  const closeDetailModal = () => {
    setDetailModalOpen(false);
  };
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
  };
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };
  return {
    // data
    roles,
    availablePermissions,
    sortOptions,
    // list state
    searchQuery,
    currentPage,
    itemsPerPage,
    sortBy,
    sortDirection,
    statusFilter,
    // derived
    filteredRoles,
    sortedRoles,
    totalPages,
    paginatedRoles,
    // modal / dialog state
    isModalOpen,
    selectedRole,
    roleForm,
    deleteDialogOpen,
    roleToDelete,
    detailModalOpen,
    roleToView,
    // setters
    setSearchQuery,
    setCurrentPage,
    setItemsPerPage,
    setSortBy,
    setSortDirection,
    setStatusFilter,
    setRoleForm,
    // handlers
    handleDelete,
    confirmDelete,
    handleEdit,
    handleView,
    handleNewRole,
    handleSaveRole,
    handleToggleStatus,
    closeFormModal,
    closeDetailModal,
    closeDeleteDialog,
    handleSearchChange,
    handleStatusFilterChange
  };
}
export {
  useRoles
};
