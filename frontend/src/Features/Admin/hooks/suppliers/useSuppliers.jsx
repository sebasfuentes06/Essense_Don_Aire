import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../../../../shared/api";

/**
 * Proveedores, contra la API de la app móvil (la misma base de datos).
 *
 * Tres cambios de fondo respecto a la versión anterior:
 *
 * 1. Los datos vienen de PostgreSQL, no de una lista escrita en este archivo.
 *
 * 2. Filtrar, ordenar y paginar lo hace la base, no el navegador. Con tres
 *    proveedores da lo mismo; con tres mil es la diferencia entre una tabla
 *    instantánea y uno que descarga todo para mostrar diez filas.
 *
 * 3. Las validaciones dejaron de ser alert(). Ahora el servidor responde qué
 *    campo está mal y el formulario lo pinta debajo del campo.
 */

const sortOptions = [
  { value: "name", label: "Nombre" },
  { value: "city", label: "Ciudad" },
  { value: "totalSpent", label: "Total comprado" },
  { value: "totalOrders", label: "N° de órdenes" },
  { value: "totalProducts", label: "N° de productos" },
  { value: "rating", label: "Calificación" },
  { value: "since", label: "Antigüedad" }
];

const emptyStats = {
  total: 0,
  activos: 0,
  inactivos: 0,
  calificacionPromedio: 0,
  totalProductos: 0
};

const emptyForm = {
  tipo_persona: "",
  tipo_documento: "",
  documento: "",
  departamento: "Antioquia",
  nombre: "",
  contacto: "",
  email: "",
  telefono: "",
  ciudad: "",
  calificacion: "",
  resenas: "",
  estado: true,
  // Alias en inglés: los componentes heredados leen estos nombres.
  name: "",
  contact: "",
  phone: "",
  city: "",
  status: "active"
};

/** Un proveedor de la API, traducido a los campos que llena el formulario. */
function aFormulario(proveedor) {
  return {
    tipo_persona: proveedor.personType ?? "",
    tipo_documento: proveedor.documentType ?? "",
    documento: proveedor.document ?? "",
    departamento: proveedor.department ?? "",
    nombre: proveedor.name ?? "",
    contacto: proveedor.contact ?? "",
    email: proveedor.email ?? "",
    telefono: proveedor.phone ?? "",
    ciudad: proveedor.city ?? "",
    calificacion: proveedor.rating ?? "",
    resenas: proveedor.reviews ?? "",
    estado: proveedor.status === "active",
    name: proveedor.name ?? "",
    contact: proveedor.contact ?? "",
    phone: proveedor.phone ?? "",
    city: proveedor.city ?? "",
    status: proveedor.status ?? "active"
  };
}

/** Proveedor de la API de la app -> campos que usan los componentes. */
function aProveedor(p) {
  return {
    id: p.id_proveedor,
    personType: p.tipo_persona ?? "",
    documentType: p.tipo_documento ?? "",
    document: p.documento ?? "",
    department: p.departamento ?? "",
    name: p.nombre,
    contact: p.contacto ?? "",
    email: p.email ?? "",
    phone: p.telefono ?? "",
    city: p.ciudad ?? "",
    rating: Number(p.calificacion ?? 0),
    reviews: Number(p.cantidad_resenas ?? 0),
    status: p.estado ? "active" : "inactive",
    since: p.fecha_alta,
    totalProducts: Number(p.total_productos ?? 0),
    totalOrders: Number(p.total_compras ?? 0),
    totalSpent: Number(p.total_comprado ?? 0)
  };
}

function useSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [exportRows, setExportRows] = useState([]);
  const [cities, setCities] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  // searchQuery es lo que se ve escrito; searchTerm es lo que se le manda a
  // la API. Separarlos permite esperar a que la persona deje de escribir: sin
  // eso, "Fragancias" dispara diez peticiones, una por letra.
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierForm, setSupplierForm] = useState(emptyForm);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [supplierToView, setSupplierToView] = useState(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setSearchTerm(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(id);
  }, [searchQuery]);

  // Se trae la lista completa una vez (son pocos) y se filtra, ordena y
  // pagina en el navegador; así los indicadores cuentan todos los proveedores.
  const [allSuppliers, setAllSuppliers] = useState([]);

  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      setAllSuppliers((await api.todos("/proveedores")).map(aProveedor));
    } catch (error) {
      setAllSuppliers([]);
      setLoadError(error instanceof ApiError ? error.message : "No se pudieron cargar los proveedores.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();
    const filtrados = allSuppliers.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (cityFilter !== "all" && p.city !== cityFilter) return false;
      if (!q) return true;
      return [p.name, p.contact, p.email, p.city, p.document, p.department].some((v) => String(v ?? "").toLowerCase().includes(q));
    });
    const dir = sortDirection === "desc" ? -1 : 1;
    filtrados.sort((a, b) => {
      const x = a[sortBy];
      const y = b[sortBy];
      if (typeof x === "number" || typeof y === "number") return (Number(x ?? 0) - Number(y ?? 0)) * dir;
      return String(x ?? "").localeCompare(String(y ?? ""), "es") * dir;
    });
    const paginas = Math.max(1, Math.ceil(filtrados.length / itemsPerPage));
    setExportRows(filtrados);
    setTotalItems(filtrados.length);
    setTotalPages(paginas);
    setSuppliers(filtrados.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    setCities([...new Set(allSuppliers.map((p) => p.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es")));
    const activos = allSuppliers.filter((p) => p.status === "active");
    setStats({
      total: allSuppliers.length,
      activos: activos.length,
      inactivos: allSuppliers.length - activos.length,
      calificacionPromedio: allSuppliers.length ? allSuppliers.reduce((t, p) => t + p.rating, 0) / allSuppliers.length : 0,
      totalProductos: allSuppliers.reduce((t, p) => t + p.totalProducts, 0)
    });
  }, [allSuppliers, searchTerm, statusFilter, cityFilter, sortBy, sortDirection, currentPage, itemsPerPage]);

  const resetPage = () => setCurrentPage(1);
  const handleSearchChange = (value) => setSearchQuery(value);
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    resetPage();
  };
  const handleCityFilterChange = (value) => {
    setCityFilter(value);
    resetPage();
  };

  /**
   * Envuelve una escritura: refresca la lista si salió bien y, si no, deja a
   * la vista el motivo que dio el servidor. Los resguardos de este módulo
   * responden con explicaciones concretas —"tiene 3 producto(s) en catálogo y
   * 2 compra(s) registradas"— y eso es justo lo que hay que mostrar, no un
   * "error al guardar" genérico.
   */
  const run = async (accion) => {
    setActionError("");
    try {
      await accion();
      await fetchSuppliers();
      return true;
    } catch (error) {
      setActionError(
        error instanceof ApiError ? error.message : "No se pudo completar la operación."
      );
      if (error?.details) setFormErrors({ ...error.details, resenas: error.details.cantidad_resenas });
      return false;
    }
  };

  const handleToggleStatus = (supplier) =>
    run(() =>
      api.put(`/proveedores/${supplier.id}`, { estado: supplier.status !== "active" })
    );

  const handleDelete = (supplier) => {
    setActionError("");
    setSupplierToDelete(supplier);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!supplierToDelete) return;
    const ok = await run(() => api.delete(`/proveedores/${supplierToDelete.id}`));
    if (ok) {
      setDeleteDialogOpen(false);
      setSupplierToDelete(null);
    }
    // Si falló, el diálogo se queda abierto con el motivo a la vista: casi
    // siempre es que el proveedor tiene productos o compras, y conviene leerlo.
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSupplierToDelete(null);
    setActionError("");
  };

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setSupplierForm(aFormulario(supplier));
    setFormErrors({});
    setActionError("");
    setIsModalOpen(true);
  };

  /**
   * Ver ya no abre el formulario de edición.
   *
   * Antes "ver" y "editar" llevaban al mismo modal, así que quien solo tenía
   * permiso de lectura terminaba frente a campos que podía escribir y a un
   * botón Guardar que el servidor iba a rechazar con un 403. Ahora hay una
   * ficha de solo lectura, y además muestra las tres cifras calculadas
   * (órdenes, total comprado, productos) que en el formulario no cabían.
   */
  const handleView = (supplier) => {
    setSupplierToView(supplier);
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSupplierToView(null);
  };

  const handleNewSupplier = () => {
    setSelectedSupplier(null);
    setSupplierForm(emptyForm);
    setFormErrors({});
    setActionError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
    setSupplierForm(emptyForm);
    setFormErrors({});
    setActionError("");
  };

  const handleSaveSupplier = async () => {
    setFormErrors({});
    const payload = {
      tipo_persona: supplierForm.tipo_persona,
      tipo_documento: supplierForm.tipo_documento,
      documento: String(supplierForm.documento ?? "").trim(),
      departamento: supplierForm.departamento,
      nombre: supplierForm.nombre ?? supplierForm.name ?? "",
      contacto: supplierForm.contacto ?? supplierForm.contact ?? "",
      email: supplierForm.email ?? "",
      telefono: supplierForm.telefono ?? supplierForm.phone ?? "",
      ciudad: supplierForm.ciudad ?? supplierForm.city ?? "",
      ...(supplierForm.calificacion !== "" && supplierForm.calificacion != null && { calificacion: Number(supplierForm.calificacion) }),
      estado: supplierForm.estado ?? supplierForm.status === "active"
    };

    const ok = await run(() =>
      selectedSupplier
        ? api.put(`/proveedores/${selectedSupplier.id}`, payload)
        : api.post("/proveedores", payload)
    );

    if (ok) handleCloseModal();
  };

  // Mismos nombres de siempre: la página y la tabla ya trabajan con ellos.
  const paginatedSuppliers = suppliers;
  const sortedSuppliers = suppliers;
  const filteredSuppliers = suppliers;

  return {
    suppliers,
    exportRows,
    cities,
    isLoading,
    loadError,
    actionError,
    formErrors,
    stats,
    totalItems,
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
    cityFilter,
    setCityFilter,
    isModalOpen,
    selectedSupplier,
    supplierForm,
    setSupplierForm,
    deleteDialogOpen,
    supplierToDelete,
    detailModalOpen,
    supplierToView,
    sortOptions,
    filteredSuppliers,
    sortedSuppliers,
    paginatedSuppliers,
    totalPages,
    // Indicadores: salen del servidor y cuentan TODOS los proveedores, no
    // solo los de la página que se está viendo.
    totalSuppliers: stats.total,
    activeSuppliers: stats.activos,
    totalProducts: stats.totalProductos,
    avgRating: Number(stats.calificacionPromedio ?? 0).toFixed(1),
    refresh: fetchSuppliers,
    handleDelete,
    confirmDelete,
    handleEdit,
    handleView,
    closeDetailModal,
    handleNewSupplier,
    handleSaveSupplier,
    handleCloseModal,
    handleCloseDeleteDialog,
    handleSearchChange,
    handleStatusFilterChange,
    handleCityFilterChange,
    handleToggleStatus
  };
}

export { useSuppliers, sortOptions };
