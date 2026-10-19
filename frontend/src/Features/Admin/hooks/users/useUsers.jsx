import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api, ApiError } from "../../../../shared/api";
import { useAuth } from "../../../../shared/auth";
import { clientes as clientesApi } from "../../../../shared/negocio";

/**
 * Usuarios contra la API de la app móvil.
 *
 * - Tres roles fijos: Administrador, Vendedor y Cliente. Una cuenta Cliente
 *   va ligada a una ficha de cliente (id_cliente).
 * - Las personas que se registran solas quedan "pendientes": el
 *   Administrador las aprueba (y les da rol) o las rechaza con un motivo.
 * - No se borran cuentas: se desactivan (así no se pierde quién vendió qué).
 */

const ROLES = ["Administrador", "Vendedor", "Cliente"];
const roles = ["Todos", ...ROLES];

const sortOptions = [
  { value: "name", label: "Nombre" },
  { value: "role", label: "Rol" },
  { value: "lastLogin", label: "Último acceso" },
  { value: "joinDate", label: "Fecha de registro" }
];

const emptyForm = { nombre: "", correo: "", contrasena: "", rol: "Vendedor", id_cliente: "", estado: true };

/** Usuario de la API -> campos que usan las tablas. */
function aUsuario(u) {
  return {
    id: u.id_usuario,
    name: u.nombre,
    email: u.correo,
    phone: u.telefono ?? "",
    role: u.rol,
    status: u.estado ? "active" : "inactive",
    approval: u.aprobacion ?? "aprobado", // pendiente | aprobado | rechazado
    rejectReason: u.motivo_rechazo ?? "",
    customerId: u.id_cliente,
    customerName: u.cliente ?? "",
    lastLogin: u.ultimo_acceso,
    joinDate: u.created_at
  };
}

function useUsers() {
  const { user: sesion } = useAuth();

  const [allUsers, setAllUsers] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [tab, setTab] = useState("cuentas");
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
  const [approvingUser, setApprovingUser] = useState(null);
  const [rejectingUser, setRejectingUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      setAllUsers((await api.todos("/usuarios")).map(aUsuario));
    } catch (error) {
      setAllUsers([]);
      setLoadError(error instanceof ApiError ? error.message : "No se pudieron cargar los usuarios.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    clientesApi
      .listar()
      .then((lista) => setCustomerOptions(lista.map((c) => ({ id: c.id, name: c.name, document: c.document }))))
      .catch(() => setCustomerOptions([]));
  }, [fetchUsers]);

  const requests = useMemo(() => allUsers.filter((u) => u.approval === "pendiente"), [allUsers]);
  const cuentas = useMemo(() => allUsers.filter((u) => u.approval !== "pendiente"), [allUsers]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const lista = cuentas.filter((u) => {
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (roleFilter !== "Todos" && u.role !== roleFilter) return false;
      if (!q) return true;
      return [u.name, u.email, u.phone, u.customerName].some((v) => String(v ?? "").toLowerCase().includes(q));
    });
    const dir = sortDirection === "desc" ? -1 : 1;
    return lista.sort((a, b) => String(a[sortBy] ?? "").localeCompare(String(b[sortBy] ?? ""), "es") * dir);
  }, [cuentas, searchQuery, statusFilter, roleFilter, sortBy, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetPage = () => setCurrentPage(1);

  const run = async (accion, exito) => {
    setActionError("");
    setFormErrors({});
    try {
      const r = await accion();
      if (exito || r?.mensaje) toast.success(r?.mensaje || exito);
      await fetchUsers();
      return { ok: true };
    } catch (error) {
      const msg = error instanceof ApiError ? error.message : "No se pudo completar la operación.";
      setActionError(msg);
      if (error?.details) setFormErrors({ ...error.details, contrasena: error.details.password ?? error.details.nueva });
      return { ok: false, error: msg };
    }
  };

  const handleToggleStatus = async (user) => {
    const r = await run(() => api.put(`/usuarios/${user.id}`, { estado: user.status !== "active" }));
    if (!r.ok) toast.error(r.error);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setUserForm({
      nombre: user.name ?? "",
      correo: user.email ?? "",
      contrasena: "",
      rol: user.role,
      id_cliente: user.customerId ? String(user.customerId) : "",
      estado: user.status === "active"
    });
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
    const f = userForm;
    const base = {
      nombre: f.nombre.trim(),
      correo: f.correo.trim(),
      rol: f.rol,
      id_cliente: f.rol === "Cliente" && f.id_cliente ? Number(f.id_cliente) : null
    };
    const { ok } = await run(async () => {
      if (selectedUser) {
        const r = await api.put(`/usuarios/${selectedUser.id}`, { ...base, estado: f.estado });
        if (f.contrasena) await api.put(`/usuarios/${selectedUser.id}/password`, { nueva: f.contrasena });
        return r;
      }
      return api.post("/usuarios", { ...base, password: f.contrasena });
    }, selectedUser ? "Usuario actualizado." : "Usuario creado.");
    if (ok) handleCloseModal();
  };

  /** Aprobar una solicitud de registro (con el rol que se elija). */
  const confirmApprove = async (rol) => {
    const r = await run(() => api.post(`/usuarios/${approvingUser.id}/aprobar`, { rol }), "Cuenta aprobada.");
    if (!r.ok) throw new Error(r.error);
    setApprovingUser(null);
  };

  const confirmReject = async (motivo) => {
    const r = await run(() => api.post(`/usuarios/${rejectingUser.id}/rechazar`, { motivo }), "Solicitud rechazada.");
    if (!r.ok) throw new Error(r.error);
    setRejectingUser(null);
  };

  const stats = {
    total: cuentas.length,
    activos: cuentas.filter((u) => u.status === "active").length,
    inactivos: cuentas.filter((u) => u.status !== "active").length,
    administradores: cuentas.filter((u) => u.role === "Administrador").length
  };

  return {
    users: filteredUsers,
    requests,
    isLoading,
    loadError,
    actionError,
    formErrors,
    stats,
    totalItems: filteredUsers.length,
    currentUserId: sesion?.id ?? null,
    tab,
    setTab,
    searchQuery,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage: (v) => {
      setItemsPerPage(Number(v));
      resetPage();
    },
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
    approvingUser,
    setApprovingUser,
    rejectingUser,
    setRejectingUser,
    customerOptions,
    filteredUsers,
    paginatedUsers,
    totalPages,
    activeUsers: stats.activos,
    adminCount: stats.administradores,
    inactiveUsers: stats.inactivos,
    roles,
    roleChoices: ROLES,
    sortOptions,
    refresh: fetchUsers,
    handleEdit,
    handleNewUser,
    handleShowUserDetail,
    handleSaveUser,
    handleToggleStatus,
    handleCloseModal,
    handleCloseDetailModal,
    handleSearchChange: (v) => {
      setSearchQuery(v);
      resetPage();
    },
    handleStatusFilterChange: (v) => {
      setStatusFilter(v);
      resetPage();
    },
    handleRoleFilterChange: (v) => {
      setRoleFilter(v);
      resetPage();
    },
    confirmApprove,
    confirmReject
  };
}

export { useUsers, roles, sortOptions };
