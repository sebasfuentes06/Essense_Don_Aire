import { useCallback, useEffect, useMemo, useState } from "react";
import { api, ApiError } from "../../../../shared/api";
import { cargarProductos, cargarCategorias, cargarProveedores } from "../../../../shared/negocio";

const sortOptions = [
  { value: "name", label: "Nombre" },
  { value: "price", label: "Precio" },
  { value: "stock", label: "Stock" },
  { value: "category", label: "Categoría" },
  { value: "sku", label: "SKU" }
];

const emptyForm = {
  nombre: "", sku: "", descripcion: "", precio: "", stock: "", stock_minimo: "",
  id_categoria: "", id_proveedor: "", estado: true,
  imagenActual: null, // URL de la foto guardada
  imagenNueva: null, // { base64, tipo_mime, vista } elegida y aún sin subir
  quitarImagen: false
};

const emptyStats = { total: 0, activos: 0, lowStockCount: 0, inventoryValue: 0 };

/**
 * Productos, contra la API de la app móvil (la misma base de datos).
 *
 * Se trae el inventario completo (de a 100) y se filtra, ordena y pagina en
 * el navegador, así las tarjetas de arriba cuentan TODO el inventario. La
 * foto se sube aparte (PUT /productos/:id/imagen), igual que en la app.
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

  const [allProducts, setAllProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      setAllProducts(await cargarProductos());
    } catch (error) {
      setAllProducts([]);
      setLoadError(error instanceof ApiError ? error.message : "No se pudieron cargar los productos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  /** Los catálogos se piden una sola vez: cambian poco. */
  useEffect(() => {
    let cancelado = false;
    Promise.all([cargarCategorias(), cargarProveedores()])
      .then(([categorias, proveedores]) => {
        if (cancelado) return;
        setCategoryOptions(categorias.map((c) => ({ id: c.id, name: c.name })));
        setSupplierOptions(proveedores);
      })
      .catch(() => { /* si falla, los selectores quedan vacíos y el listado ya avisa del error */ });
    return () => { cancelado = true; };
  }, []);

  // Filtros, orden y paginación en el navegador.
  const filtrados = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const min = priceRange.min === "" ? null : Number(priceRange.min);
    const max = priceRange.max === "" ? null : Number(priceRange.max);
    const lista = allProducts.filter((p) => {
      if (selectedCategory !== "Todos" && p.category !== selectedCategory) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (supplierFilter !== "all" && p.supplier !== supplierFilter) return false;
      if (stockFilter === "low" && !(p.stock > 0 && p.stock <= p.minStock)) return false;
      if (stockFilter === "out" && p.stock > 0) return false;
      if (stockFilter === "in" && p.stock <= p.minStock) return false;
      if (min !== null && p.price < min) return false;
      if (max !== null && p.price > max) return false;
      if (!q) return true;
      return [p.name, p.sku, p.description, p.category, p.supplier].some((v) => String(v ?? "").toLowerCase().includes(q));
    });
    const dir = sortDirection === "desc" ? -1 : 1;
    return lista.sort((a, b) => {
      const x = a[sortBy];
      const y = b[sortBy];
      if (typeof x === "number") return (x - y) * dir;
      return String(x ?? "").localeCompare(String(y ?? ""), "es") * dir;
    });
  }, [allProducts, searchQuery, selectedCategory, statusFilter, supplierFilter, stockFilter, priceRange.min, priceRange.max, sortBy, sortDirection]);

  useEffect(() => {
    const paginas = Math.max(1, Math.ceil(filtrados.length / itemsPerPage));
    setTotalItems(filtrados.length);
    setTotalPages(paginas);
    setProducts(filtrados.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    setStats({
      total: allProducts.length,
      activos: allProducts.filter((p) => p.status === "active").length,
      lowStockCount: allProducts.filter((p) => p.status === "active" && p.stock <= p.minStock).length,
      inventoryValue: allProducts.reduce((t, p) => t + p.price * p.stock, 0)
    });
  }, [filtrados, allProducts, currentPage, itemsPerPage]);

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
    run(() => api.put(`/productos/${product.id}`, { estado: product.status !== "active" }));

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
      estado: product.status === "active",
      imagenActual: product.image,
      imagenNueva: null,
      quitarImagen: false
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
      precio: Number(productForm.precio),
      stock: Number(productForm.stock || 0),
      stock_minimo: Number(productForm.stock_minimo || 0),
      id_categoria: Number(productForm.id_categoria),
      id_proveedor: Number(productForm.id_proveedor),
      estado: productForm.estado === true || productForm.estado === "true" || productForm.estado === "active"
    };

    const ok = await run(async () => {
      const r = selectedProduct
        ? await api.put(`/productos/${selectedProduct.id}`, payload)
        : await api.post("/productos", payload);
      const id = r?.datos?.id_producto ?? selectedProduct?.id;
      // La foto va aparte: si falla, el producto ya quedó guardado y se avisa.
      try {
        if (productForm.imagenNueva) {
          await api.put(`/productos/${id}/imagen`, {
            base64: productForm.imagenNueva.base64,
            tipo_mime: productForm.imagenNueva.tipo_mime
          });
        } else if (productForm.quitarImagen && selectedProduct?.image) {
          await api.delete(`/productos/${id}/imagen`);
        }
      } catch (e) {
        throw new ApiError(`El producto se guardó, pero la foto no: ${e.message}`, { status: e.status });
      }
    });

    if (ok) closeModal();
  };

  /** Suma o resta unidades sin abrir el formulario completo. */
  const handleAdjustStock = (product, cantidad) =>
    run(() => api.put(`/productos/${product.id}`, { stock: Math.max(0, product.stock + Number(cantidad)) }));

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
    filteredProducts: filtrados,
    sortedProducts: filtrados,
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
