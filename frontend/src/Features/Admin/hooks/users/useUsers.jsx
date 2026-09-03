import { useState } from "react";
const mockUsers = [
  {
    id: 1, name: "Admin Principal", email: "admin@fragshop.com", phone: "+34 91 234 5678", role: "Administrador", status: "active", lastLogin: "2024-06-01", joinDate: "2022-01-01"
  },
  {
    id: 2, name: "Carlos Vendedor", email: "carlos@fragshop.com", phone: "+34 93 456 7890", role: "Vendedor", status: "active", lastLogin: "2024-05-31", joinDate: "2022-03-15"
  },
  {
    id: 3, name: "Mar\xEDa Vendedora", email: "maria@fragshop.com", phone: "+34 95 678 9012", role: "Vendedor", status: "active", lastLogin: "2024-06-01", joinDate: "2022-06-10"
  },
  {
    id: 4, name: "Juan Supervisor", email: "juan@fragshop.com", phone: "+34 94 123 4567", role: "Supervisor", status: "active", lastLogin: "2024-05-28", joinDate: "2023-01-20"
  },
  {
    id: 5, name: "Ana Inventario", email: "ana@fragshop.com", phone: "+34 96 789 0123", role: "Vendedor", status: "inactive", lastLogin: "2024-03-15", joinDate: "2023-06-01"
  }
];
const roles = ["Todos", "Administrador", "Supervisor", "Vendedor"];
const sortOptions = [
  { value: "name", label: "Nombre" },
  { value: "role", label: "Rol" },
  { value: "lastLogin", label: "\xDAltimo acceso" },
  { value: "joinDate", label: "Fecha ingreso" }
];
function useUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState(null);
  const [userForm, setUserForm] = useState({ nombre: "", correo: "", contrasena: "", telefono: "", id_rol: 0, estado: true, name: "", email: "", password: "", phone: "", role: "Vendedor", status: "active" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const sortedUsers = [...filteredUsers].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage);
  const handleDelete = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };
  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };
  const handleEdit = (user) => {
    setSelectedUser(user);
    setUserForm({
      nombre: user.nombre ?? user.name ?? "",
      correo: user.correo ?? user.email ?? "",
      contrasena: "",
      telefono: user.telefono ?? user.phone ?? "",
      id_rol: user.id_rol ?? 0,
      estado: user.estado ?? user.status ?? true,
      name: user.name ?? user.nombre ?? "",
      email: user.email ?? user.correo ?? "",
      password: "",
      phone: user.phone ?? user.telefono ?? "",
      role: user.role ?? user.id_rol ?? "Vendedor",
      status: user.status ?? user.estado ?? "active"
    });
    setIsModalOpen(true);
  };
  const handleNewUser = () => {
    setSelectedUser(null);
    setUserForm({ nombre: "", correo: "", contrasena: "", telefono: "", id_rol: 0, estado: true, name: "", email: "", password: "", phone: "", role: "Vendedor", status: "active" });
    setIsModalOpen(true);
  };
  const handleShowUserDetail = (user) => {
    setSelectedUserForDetail(user);
    setDetailModalOpen(true);
  };
  const handleSaveUser = () => {
    const nombre = userForm.nombre ?? userForm.name ?? "";
    const correo = userForm.correo ?? userForm.email ?? "";
    const passwordValue = userForm.contrasena ?? userForm.password ?? "";
    const telefono = userForm.telefono ?? userForm.phone ?? "";
    const idRol = Number(userForm.id_rol ?? (userForm.role || 0));

    if (!String(nombre).trim()) {
      alert("Debe indicar el nombre completo.");
      return;
    }
    if (!String(correo).trim()) {
      alert("Debe indicar un correo electrónico.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(correo).trim())) {
      alert("El correo electrónico no es válido.");
      return;
    }
    if (!selectedUser && !String(passwordValue).trim()) {
      alert("La contraseña es obligatoria.");
      return;
    }
    if (!idRol || idRol <= 0) {
      alert("Debe seleccionar un rol.");
      return;
    }
    if (String(telefono).trim() && !/^[+()\d\s-]{7,}$/.test(String(telefono).trim())) {
      alert("El teléfono no es válido.");
      return;
    }

    const payload = {
      nombre,
      correo,
      contrasena: passwordValue,
      telefono,
      id_rol: idRol,
      estado: userForm.estado ?? userForm.status ?? true,
      name: userForm.name ?? userForm.nombre ?? "",
      email: userForm.email ?? userForm.correo ?? "",
      password: passwordValue,
      phone: userForm.phone ?? userForm.telefono ?? "",
      role: userForm.role ?? userForm.id_rol ?? "Vendedor",
      status: userForm.status ?? userForm.estado ?? "active"
    };

    if (selectedUser) {
      setUsers(users.map(
        (user) => user.id === selectedUser.id
          ? { ...user, ...payload, password: passwordValue || user.password }
          : user
      ));
    } else {
      const nextId = Math.max(0, ...users.map((user) => user.id)) + 1;
      setUsers([...users, {
        id: nextId,
        lastLogin: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        joinDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        ...payload
      }]);
    }
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  const handleToggleStatus = (user) => {
    setUsers(users.map(
      (u) => u.id === user.id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u
    ));
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedUserForDetail(null);
  };
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };
  const activeUsers = users.filter((u) => u.status === "active").length;
  const adminCount = users.filter((u) => u.role === "Administrador").length;
  const inactiveUsers = users.filter((u) => u.status === "inactive").length;
  return {
    // raw state
    users,
    setUsers,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    statusFilter,
    setStatusFilter,
    isModalOpen,
    setIsModalOpen,
    selectedUser,
    setSelectedUser,
    detailModalOpen,
    selectedUserForDetail,
    userForm,
    setUserForm,
    deleteDialogOpen,
    setDeleteDialogOpen,
    userToDelete,
    setUserToDelete,
    // derived data
    filteredUsers,
    sortedUsers,
    totalPages,
    startIndex,
    paginatedUsers,
    activeUsers,
    adminCount,
    inactiveUsers,
    // constants
    roles,
    sortOptions,
    // handlers
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
    handleStatusFilterChange
  };
}
export {
  roles,
  sortOptions,
  useUsers
};
