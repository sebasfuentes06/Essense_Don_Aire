import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../../../../shared/api";

/**
 * Roles y permisos, ya contra la API.
 *
 * El cambio de fondo respecto a la versión anterior: el catálogo de permisos
 * ya no está escrito en este archivo, viene de la base de datos. Antes había
 * 40 permisos inventados con el patrón ver/crear/editar/eliminar por módulo,
 * y la base tiene 56 distintos: se podían asignar permisos que no existían y
 * había módulos enteros —Pedidos, Pagos y Abonos, Mi cuenta, Sistema— cuyos
 * permisos no aparecían en ninguna parte.
 *
 * Ahora hay una sola fuente de verdad, y es la misma que consulta el backend
 * para decidir si deja pasar una petición.
 */

const sortOptions = [
  { value: "name", label: "Nombre" },
  { value: "usersCount", label: "Usuarios" },
  { value: "createdAt", label: "Fecha de creación" }
];

const emptyForm = {
  nombre: "",
  descripcion: "",
  permisos: [],
  estado: true,
  // Alias en inglés: los componentes heredados leen estos nombres.
  name: "",
  description: "",
  permissions: [],
  status: "active"
};

function useRoles() {
  const [roles, setRoles] = useState([]);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [permissionModules, setPermissionModules] = useState([]);
  const [stats, setStats] = useState({ total: 0, activos: 0, inactivos: 0 });
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleForm, setRoleForm] = useState(emptyForm);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [roleToView, setRoleToView] = useState(null);

  /** El catálogo de permisos se carga una sola vez: no cambia en la sesión. */
  useEffect(() => {
    let cancelado = false;
    api
      .get("/roles/permisos")
      .then(({ permisos, modulos }) => {
        if (cancelado) return;
        setAvailablePermissions(permisos ?? []);
        setPermissionModules(modulos ?? []);
      })
      .catch((error) => {
        if (cancelado) return;
        setLoadError(
          error instanceof ApiError
            ? `No se pudo cargar el catálogo de permisos: ${error.message}`
            : "No se pudo cargar el catálogo de permisos."
        );
      });
    return () => {
      cancelado = true;
    };
  }, []);

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const { data, stats: resumen, meta } = await api.get("/roles", {
        search: searchQuery,
        status: statusFilter,
        sortBy,
        sortDir: sortDirection,
        page: currentPage,
        limit: itemsPerPage
      });
      setRoles(data ?? []);
      setStats(resumen ?? { total: 0, activos: 0, inactivos: 0 });
      setTotalItems(meta?.total ?? 0);
      setTotalPages(meta?.totalPages ?? 1);
    } catch (error) {
      setRoles([]);
      setTotalItems(0);
      setLoadError(error instanceof ApiError ? error.message : "No se pudieron cargar los roles.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, sortBy, sortDirection, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const resetPage = () => setCurrentPage(1);
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    resetPage();
  };
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    resetPage();
  };

  /**
   * Envuelve una escritura: refresca la lista si salió bien y, si no, deja a
   * la vista el motivo que dio el servidor. Los resguardos de este módulo
   * responden con explicaciones largas y concretas —"el rol Administrador no
   * puede quedarse sin roles.view"— y esa explicación es justo lo que hay que
   * mostrar, no un "error al guardar" genérico.
   */
  const run = async (accion) => {
    setActionError("");
    try {
      await accion();
      await fetchRoles();
      return true;
    } catch (error) {
      setActionError(error instanceof ApiError ? error.message : "No se pudo completar la operación.");
      if (error?.details) setFormErrors(error.details);
      return false;
    }
  };

  const handleToggleStatus = (role) =>
    run(() => api.patch(`/roles/${role.id}/estado`, { estado: role.status !== "active" }));

  const handleDelete = (role) => {
    setActionError("");
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!roleToDelete) return;
    const ok = await run(() => api.delete(`/roles/${roleToDelete.id}`));
    if (ok) {
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
    // Si falló, el diálogo se queda abierto con el motivo: casi siempre es
    // que el rol tiene usuarios asignados, y conviene leerlo.
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
    setActionError("");
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setRoleForm({
      nombre: role.name ?? "",
      descripcion: role.description ?? "",
      permisos: role.permissions ?? [],
      estado: role.status === "active",
      name: role.name ?? "",
      description: role.description ?? "",
      permissions: role.permissions ?? [],
      status: role.status ?? "active"
    });
    setFormErrors({});
    setActionError("");
    setIsModalOpen(true);
  };

  const handleNewRole = () => {
    setSelectedRole(null);
    setRoleForm(emptyForm);
    setFormErrors({});
    setActionError("");
    setIsModalOpen(true);
  };

  const handleView = (role) => {
    setRoleToView(role);
    setDetailModalOpen(true);
  };

  const closeFormModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
    setRoleForm(emptyForm);
    setFormErrors({});
    setActionError("");
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setRoleToView(null);
  };

  const handleSaveRole = async () => {
    setFormErrors({});
    const payload = {
      nombre: roleForm.nombre ?? roleForm.name ?? "",
      descripcion: roleForm.descripcion ?? roleForm.description ?? "",
      permisos: roleForm.permisos ?? roleForm.permissions ?? [],
      estado: roleForm.estado ?? roleForm.status === "active"
    };

    const ok = await run(() =>
      selectedRole ? api.put(`/roles/${selectedRole.id}`, payload) : api.post("/roles", payload)
    );

    if (ok) closeFormModal();
  };

  // Mismos nombres de siempre: la página y la tabla ya trabajan con ellos.
  const paginatedRoles = roles;
  const sortedRoles = roles;
  const filteredRoles = roles;

  return {
    roles,
    availablePermissions,
    permissionModules,
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
    filteredRoles,
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
    setSearchQuery,
    setCurrentPage,
    setItemsPerPage,
    setSortBy,
    setSortDirection,
    setStatusFilter,
    setRoleForm,
    refresh: fetchRoles,
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

export { useRoles, sortOptions };
