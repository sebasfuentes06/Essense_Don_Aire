import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../../../../shared/api";

const sortOptions = [
  { value: "name", label: "Nombre" },
  { value: "price", label: "Precio" },
  { value: "stock", label: "Stock" },
  { value: "category", label: "Categoría" },
  { value: "sku", label: "SKU" }
];

const emptyForm = {
  nombre: "", sku: "", descripcion: "", precio: "", stock: "", stock_minimo: "",
  id_categoria: "", id_proveedor: "", imagen: "", estado: true
};

const emptyStats = { total: 0, activos: 0, lowStockCount: 0, inventoryValue: 0 };

/**
 * Productos, contra la API.
 *
 * Todo el trabajo pesado lo hace PostgreSQL: filtros, orden, paginación y las
 * estadísticas. Las tarjetas de arriba muestran el total del inventario
 * COMPLETO, no el de la página que estás viendo — por eso `stats` viene del
 * servidor y no se calcula sobre el arreglo local.
 */
function useProductsManagement() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");

  // catálogos para los selectores
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [supplierOptions, setSupplierOptions] = useState([]);

  // filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);

  // orden y paginación
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productForm, setProductForm] = useState(emptyForm);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const { data, stats: resumen, meta } = await api.get("/productos", {
        search: searchQuery,
        category: selectedCategory,
        status: statusFilter,
        stock: stockFilter,
        supplier: supplierFilter,
        priceMin: priceRange.min,
        priceMax: priceRange.max,
        sortBy,
        sortDir: sortDirection,
        page: currentPage,
        limit: itemsPerPage
      });
      setProducts(data);
      setStats(resumen);
      setTotalItems(meta.total);
      setTotalPages(meta.totalPages);
    } catch (error) {
      setProducts([]);
      setStats(emptyStats);
      setTotalItems(0);
      setLoadError(error instanceof ApiError ? error.message : "No se pudieron cargar los productos.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, statusFilter, stockFilter, supplierFilter,
      priceRange.min, priceRange.max, sortBy, sortDirection, currentPage, itemsPerPage]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  /** Los catálogos se piden una sola vez: cambian poco. */
  useEffect(() => {
    let cancelado = false;
    api.get("/productos/opciones")
      .then(({ categorias, proveedores }) => {
        if (cancelado) return;
        setCategoryOptions(categorias.map((c) => ({ id: c.id, name: c.nombre })));
        setSupplierOptions(proveedores.map((p) => ({ id: p.id, name: p.nombre })));
      })
      .catch(() => { /* si falla, los selectores quedan vacíos y el listado ya avisa del error */ });
    return () => { cancelado = true; };
  }, []);

  const resetPage = () => setCurrentPage(1);
  const run = async (accion) => {
    setActionError("");
    try {
      await accion();
      await fetchProducts();
      return true;
    } catch (error) {
      setActionError(error instanceof ApiError ? error.message : "No se pudo completar la operación.");
      return false;
    }
  };

  /* --------------------------------- filtros --------------------------- */
  const handleSearchChange = (value) => { setSearchQuery(value); resetPage(); };
  const handleCategoryChange = (value) => { setSelectedCategory(value); resetPage(); };
  const handleStatusFilterChange = (value) => { setStatusFilter(value); resetPage(); };
  const handleStockFilterChange = (value) => { setStockFilter(value); resetPage(); };
  const handleSupplierFilterChange = (value) => { setSupplierFilter(value); resetPage(); };
  const handlePriceMinChange = (value) => { setPriceRange((p) => ({ ...p, min: value })); resetPage(); };
  const handlePriceMaxChange = (value) => { setPriceRange((p) => ({ ...p, max: value })); resetPage(); };
  const handleSortByChange = (value) => setSortBy(value);
  const handleSortDirectionChange = (value) => setSortDirection(value);
  const handleItemsPerPageChange = (value) => { setItemsPerPage(Number(value)); resetPage(); };
  const handleToggleFilters = () => setShowFilters((v) => !v);
  const handleCloseFilters = () => setShowFilters(false);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Todos");
    setStatusFilter("all");
    setStockFilter("all");
    setSupplierFilter("all");
    setPriceRange({ min: "", max: "" });
    resetPage();
  };

  /* -------------------------------- acciones --------------------------- */
  const handleToggleStatus = (product) =>
    run(() => api.patch(`/productos/${product.id}/estado`, { estado: product.status !== "active" }));

  const handleDelete = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    const ok = await run(() => api.delete(`/productos/${productToDelete.id}`));
    if (ok) {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
    setActionError("");
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setProductForm({
      nombre: product.name ?? "",
      sku: product.sku ?? "",
      descripcion: product.description ?? "",
      precio: product.price ?? "",
      stock: product.stock ?? "",
      stock_minimo: product.minStock ?? "",
      id_categoria: product.categoryId ?? "",
      id_proveedor: product.supplierId ?? "",
      imagen: Array.isArray(product.images) ? (product.images[0] ?? "") : "",
      estado: product.status === "active"
    });
    setIsModalOpen(true);
  };

  const handleView = (product) => handleEdit(product);

  const handleNewProduct = () => {
    setSelectedProduct(null);
    setProductForm(emptyForm);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setProductForm(emptyForm);
    setActionError("");
  };

  const handleSaveProduct = async () => {
    const payload = {
      nombre: productForm.nombre,
      sku: productForm.sku,
      descripcion: productForm.descripcion,
      precio: productForm.precio,
      stock: Number(productForm.stock || 0),
      stock_minimo: Number(productForm.stock_minimo || 0),
      id_categoria: productForm.id_categoria,
      id_proveedor: productForm.id_proveedor,
      estado: productForm.estado,
      imagen: productForm.imagen
    };

    const ok = await run(() =>
      selectedProduct
        ? api.put(`/productos/${selectedProduct.id}`, payload)
        : api.post("/productos", payload)
    );

    if (ok) closeModal();
  };

  /** Suma o resta unidades sin abrir el formulario completo. */
  const handleAdjustStock = (product, cantidad) =>
    run(() => api.patch(`/productos/${product.id}/stock`, { cantidad: Number(cantidad) }));

  // Nombres para los filtros (esperan texto); los selectores del formulario
  // usan categoryOptions / supplierOptions, que sí llevan el id.
  const categories = ["Todos", ...categoryOptions.map((c) => c.name)];
  const suppliers = supplierOptions.map((s) => s.name);

  return {
    products,
    stats,
    isLoading,
    loadError,
    actionError,
    totalItems,
    searchQuery,
    selectedCategory,
    showFilters,
    currentPage, setCurrentPage,
    itemsPerPage,
    sortBy,
    sortDirection,
    isModalOpen,
    selectedProduct,
    productForm, setProductForm,
    deleteDialogOpen,
    productToDelete,
    statusFilter,
    priceRange,
    stockFilter,
    supplierFilter,
    categories,
    suppliers,
    categoryOptions,
    supplierOptions,
    sortOptions,
    // se conservan los nombres que ya usaban la página y los componentes
    filteredProducts: products,
    sortedProducts: products,
    paginatedProducts: products,
    totalPages,
    lowStockCount: stats.lowStockCount,
    refresh: fetchProducts,
    handleSearchChange,
    handleToggleFilters,
    handleCloseFilters,
    handleCategoryChange,
    handleSortByChange,
    handleSortDirectionChange,
    handleItemsPerPageChange,
    handleStatusFilterChange,
    handleToggleStatus,
    handleStockFilterChange,
    handleSupplierFilterChange,
    handlePriceMinChange,
    handlePriceMaxChange,
    handleAdjustStock,
    resetFilters,
    handleDelete,
    confirmDelete,
    closeDeleteDialog,
    handleEdit,
    handleView,
    handleNewProduct,
    closeModal,
    handleSaveProduct
  };
}

export { useProductsManagement };
