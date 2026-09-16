import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../../../../shared/api";

/**
 * Proveedores, ya contra la API.
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

  const filtros = {
    search: searchTerm,
    status: statusFilter,
    city: cityFilter === "all" ? "" : cityFilter,
    sortBy,
    sortDir: sortDirection
  };

  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const { data, stats: resumen, meta } = await api.get("/proveedores", {
        search: searchTerm,
        status: statusFilter,
        city: cityFilter === "all" ? "" : cityFilter,
        sortBy,
        sortDir: sortDirection,
        page: currentPage,
        limit: itemsPerPage
      });
      setSuppliers(data ?? []);
      setStats(resumen ?? emptyStats);
      setTotalItems(meta?.total ?? 0);
      setTotalPages(meta?.totalPages ?? 1);
    } catch (error) {
      setSuppliers([]);
      setTotalItems(0);
      setLoadError(
        error instanceof ApiError ? error.message : "No se pudieron cargar los proveedores."
      );
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, cityFilter, sortBy, sortDirection, currentPage, itemsPerPage]);

  /**
   * Las filas para el CSV.
   *
   * El botón exporta lo que se está viendo filtrado, pero ahora la tabla solo
   * tiene en memoria la página actual: si se le pasara eso, "Exportar" se
   * llevaría diez filas de cincuenta sin avisar. Por eso se piden aparte, sin
   * paginar. El tope de la API son 100 por petición; si algún día hay más
   * proveedores que eso habrá que exportar desde el servidor.
   */
  const fetchExportRows = useCallback(async () => {
    try {
      const { data } = await api.get("/proveedores", { ...filtros, page: 1, limit: 100 });
      setExportRows(data ?? []);
    } catch {
      // Que falle la exportación no debe romper la pantalla: el botón
      // simplemente queda deshabilitado por no tener filas.
      setExportRows([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, cityFilter, sortBy, sortDirection]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  useEffect(() => {
    fetchExportRows();
  }, [fetchExportRows]);

  /** Las ciudades que hay en uso, para el desplegable del filtro. */
  const fetchCities = useCallback(async () => {
    try {
      const { ciudades } = await api.get("/proveedores/ciudades");
      setCities(ciudades ?? []);
    } catch {
      setCities([]);
    }
  }, []);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

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
      await fetchExportRows();
      await fetchCities();
      return true;
    } catch (error) {
      setActionError(
        error instanceof ApiError ? error.message : "No se pudo completar la operación."
      );
      if (error?.details) setFormErrors(error.details);
      return false;
    }
  };

  const handleToggleStatus = (supplier) =>
    run(() =>
      api.patch(`/proveedores/${supplier.id}/estado`, { estado: supplier.status !== "active" })
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
      nombre: supplierForm.nombre ?? supplierForm.name ?? "",
      contacto: supplierForm.contacto ?? supplierForm.contact ?? "",
      email: supplierForm.email ?? "",
      telefono: supplierForm.telefono ?? supplierForm.phone ?? "",
      ciudad: supplierForm.ciudad ?? supplierForm.city ?? "",
      calificacion: supplierForm.calificacion,
      resenas: supplierForm.resenas,
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
