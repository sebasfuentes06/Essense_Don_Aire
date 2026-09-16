import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../../../../shared/api";
import { useAuth } from "../../../../shared/auth";

/**
 * Usuarios (personal del sistema), ya contra la API.
 *
 * Dos cosas que conviene tener claras al leer esto:
 *
 * 1. Búsqueda, filtro, orden y paginación los resuelve PostgreSQL. Al hook
 *    solo le llegan las filas de la página actual, así que `paginatedUsers`,
 *    `sortedUsers` y `filteredUsers` apuntan todos a lo mismo: se conservan
 *    los tres nombres porque la página y los componentes ya los usan.
 *
 * 2. Los clientes viven en la misma tabla `usuarios`, pero esta pantalla
 *    lista solo al personal. Los clientes tienen su propio módulo.
 */

const roles = ["Todos", "Administrador", "Supervisor", "Vendedor"];

const sortOptions = [
  { value: "name", label: "Nombre" },
  { value: "role", label: "Rol" },
  { value: "lastLogin", label: "Último acceso" },
  { value: "joinDate", label: "Fecha ingreso" }
];

const emptyForm = {
  nombre: "",
  correo: "",
  contrasena: "",
  telefono: "",
  id_rol: 0,
  estado: true,
  // Alias en inglés: los componentes heredados leen estos nombres.
  name: "",
  email: "",
  password: "",
  phone: "",
  role: "",
  status: "active"
};

/** Convierte una fila de la API al formato que espera el formulario. */
function formDesdeUsuario(user, rolesDisponibles) {
  const rol = rolesDisponibles.find((r) => r.name === user.role);
  return {
    nombre: user.name ?? "",
    correo: user.email ?? "",
    contrasena: "",
    telefono: user.phone ?? "",
    id_rol: rol?.id ?? 0,
    estado: user.status === "active",
    name: user.name ?? "",
    email: user.email ?? "",
    password: "",
    phone: user.phone ?? "",
    role: String(rol?.id ?? ""),
    status: user.status ?? "active"
  };
}

function useUsers() {
  const { user: sesion } = useAuth();

  const [users, setUsers] = useState([]);
  const [rolesDisponibles, setRolesDisponibles] = useState([]);
  const [stats, setStats] = useState({ total: 0, activos: 0, inactivos: 0, administradores: 0 });
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState(null);
  const [userForm, setUserForm] = useState(emptyForm);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  /** Los roles se cargan una sola vez: casi nunca cambian durante la sesión. */
  useEffect(() => {
    let cancelado = false;
    api
      .get("/usuarios/roles")
      .then((lista) => {
        if (!cancelado) setRolesDisponibles(lista ?? []);
      })
      .catch(() => {
        if (!cancelado) setRolesDisponibles([]);
      });
    return () => {
      cancelado = true;
    };
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const { data, stats: resumen, meta } = await api.get("/usuarios", {
        search: searchQuery,
        status: statusFilter,
        role: roleFilter,
        sortBy,
        sortDir: sortDirection,
        page: currentPage,
        limit: itemsPerPage
      });
      setUsers(data ?? []);
      setStats(resumen ?? { total: 0, activos: 0, inactivos: 0, administradores: 0 });
      setTotalItems(meta?.total ?? 0);
      setTotalPages(meta?.totalPages ?? 1);
    } catch (error) {
      setUsers([]);
      setTotalItems(0);
      setLoadError(error instanceof ApiError ? error.message : "No se pudieron cargar los usuarios.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, roleFilter, sortBy, sortDirection, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const resetPage = () => setCurrentPage(1);
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    resetPage();
  };
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    resetPage();
  };
  const handleRoleFilterChange = (value) => {
    setRoleFilter(value);
    resetPage();
  };

  /**
   * Envuelve una acción de escritura: refresca la lista si salió bien y, si no,
   * deja el mensaje del servidor a la vista. Sin esto los fallos eran mudos.
   */
  const run = async (accion) => {
    setActionError("");
    try {
      await accion();
      await fetchUsers();
      return true;
    } catch (error) {
      setActionError(error instanceof ApiError ? error.message : "No se pudo completar la operación.");
      if (error?.details) setFormErrors(error.details);
      return false;
    }
  };

  const handleToggleStatus = (user) =>
    run(() => api.patch(`/usuarios/${user.id}/estado`, { estado: user.status !== "active" }));

  const handleDelete = (user) => {
    setActionError("");
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    const ok = await run(() => api.delete(`/usuarios/${userToDelete.id}`));
    if (ok) {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
    // Si falló (por ejemplo, tiene ventas asociadas) el diálogo se queda
    // abierto a propósito, con el motivo visible.
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
    setActionError("");
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setUserForm(formDesdeUsuario(user, rolesDisponibles));
    setFormErrors({});
    setActionError("");
    setIsModalOpen(true);
  };

  const handleNewUser = () => {
    setSelectedUser(null);
    setUserForm(emptyForm);
    setFormErrors({});
    setActionError("");
    setIsModalOpen(true);
  };

  const handleShowUserDetail = (user) => {
    setSelectedUserForDetail(user);
    setDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setUserForm(emptyForm);
    setFormErrors({});
    setActionError("");
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedUserForDetail(null);
  };

  const handleSaveUser = async () => {
    setFormErrors({});
    const contrasena = userForm.contrasena ?? userForm.password ?? "";
    const payload = {
      nombre: userForm.nombre ?? userForm.name ?? "",
      correo: userForm.correo ?? userForm.email ?? "",
      telefono: userForm.telefono ?? userForm.phone ?? "",
      id_rol: Number(userForm.id_rol ?? userForm.role ?? 0),
      estado: userForm.estado ?? userForm.status === "active"
    };

    const ok = await run(async () => {
      if (selectedUser) {
        await api.put(`/usuarios/${selectedUser.id}`, payload);
        // Al editar, la contraseña es opcional: solo se manda si la escribieron.
        if (contrasena) {
          await api.patch(`/usuarios/${selectedUser.id}/password`, { contrasena });
        }
      } else {
        await api.post("/usuarios", { ...payload, contrasena });
      }
    });

    if (ok) handleCloseModal();
  };

  // Mismos nombres de siempre: la página y la tabla ya trabajan con ellos.
  const paginatedUsers = users;
  const sortedUsers = users;
  const filteredUsers = users;

  return {
    users,
    setUsers,
    isLoading,
    loadError,
    actionError,
    formErrors,
    stats,
    totalItems,
    currentUserId: sesion?.id ?? null,
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
    roleFilter,
    setRoleFilter,
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
    // derivados
    filteredUsers,
    sortedUsers,
    paginatedUsers,
    totalPages,
    startIndex: (currentPage - 1) * itemsPerPage,
    activeUsers: stats.activos,
    adminCount: stats.administradores,
    inactiveUsers: stats.inactivos,
    // constantes
    roles: rolesDisponibles,
    sortOptions,
    // acciones
    refresh: fetchUsers,
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
  };
}

export { roles, sortOptions, useUsers };
