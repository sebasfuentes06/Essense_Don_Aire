import { useCallback, useEffect, useMemo, useState } from "react";
import { api, ApiError } from "../../../../shared/api";

const sortOptions = [
  { value: "name", label: "Nombre" },
  { value: "productCount", label: "N° de productos" },
  { value: "createdAt", label: "Fecha de creación" }
];

const emptyForm = { nombre: "", descripcion: "", estado: true };

/**
 * Categorías, ya contra la API.
 *
 * El filtrado, el orden y la paginación los hace PostgreSQL, no el navegador:
 * se le mandan como parámetros a /api/categorias. Con cinco categorías da
 * igual, pero con cinco mil es la diferencia entre una tabla instantánea y
 * una que descarga todo para mostrar diez filas.
 */
function useCategories() {
  const [categories, setCategories] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCategoryForDetail, setSelectedCategoryForDetail] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [actionError, setActionError] = useState("");

  /** Trae la página actual con los filtros aplicados. */
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const { data, meta } = await api.get("/categorias", {
        search: searchQuery,
        status: statusFilter,
        sortBy,
        sortDir: sortDirection,
        page: currentPage,
        limit: itemsPerPage
      });
      setCategories(data);
      setTotalItems(meta.total);
      setTotalPages(meta.totalPages);
    } catch (error) {
      setCategories([]);
      setTotalItems(0);
      setLoadError(error instanceof ApiError ? error.message : "No se pudieron cargar las categorías.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, sortBy, sortDirection, currentPage, itemsPerPage]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const resetPage = () => setCurrentPage(1);
  const handleSearchChange = (value) => { setSearchQuery(value); resetPage(); };
  const handleStatusFilterChange = (value) => { setStatusFilter(value); resetPage(); };

  /** Envuelve una acción de escritura: refresca la lista y traduce el error. */
  const run = async (accion) => {
    setActionError("");
    try {
      await accion();
      await fetchCategories();
      return true;
    } catch (error) {
      setActionError(error instanceof ApiError ? error.message : "No se pudo completar la operación.");
      if (error?.details) setFormErrors(error.details);
      return false;
    }
  };

  const handleToggleStatus = (category) =>
    run(() => api.patch(`/categorias/${category.id}/estado`, { estado: category.status !== "active" }));

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    const ok = await run(() => api.delete(`/categorias/${categoryToDelete.id}`));
    if (ok) {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
    setActionError("");
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setCategoryForm({
      nombre: category.name ?? "",
      descripcion: category.description ?? "",
      estado: category.status === "active"
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openNewCategoryModal = () => {
    setSelectedCategory(null);
    setCategoryForm(emptyForm);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleShowCategoryDetail = (category) => {
    setSelectedCategoryForDetail(category);
    setDetailModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setCategoryForm(emptyForm);
    setFormErrors({});
    setActionError("");
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedCategoryForDetail(null);
  };

  const handleSaveCategory = async () => {
    setFormErrors({});
    const payload = {
      nombre: categoryForm.nombre,
      descripcion: categoryForm.descripcion,
      estado: categoryForm.estado
    };

    const ok = await run(() =>
      selectedCategory
        ? api.put(`/categorias/${selectedCategory.id}`, payload)
        : api.post("/categorias", payload)
    );

    if (ok) closeModal();
  };

  // Nombres conservados para no tocar la página ni los componentes que ya los usan.
  const paginatedCategories = categories;
  const sortedCategories = categories;
  const filteredCategories = categories;

  const stats = useMemo(() => ({ total: totalItems }), [totalItems]);

  return {
    categories,
    isLoading,
    loadError,
    actionError,
    formErrors,
    totalItems,
    stats,
    searchQuery, setSearchQuery,
    currentPage, setCurrentPage,
    itemsPerPage, setItemsPerPage,
    sortBy, setSortBy,
    sortDirection, setSortDirection,
    statusFilter, setStatusFilter,
    isModalOpen, setIsModalOpen,
    selectedCategory,
    detailModalOpen,
    selectedCategoryForDetail,
    categoryForm, setCategoryForm,
    deleteDialogOpen,
    categoryToDelete,
    sortOptions,
    filteredCategories,
    sortedCategories,
    paginatedCategories,
    totalPages,
    refresh: fetchCategories,
    handleSearchChange,
    handleStatusFilterChange,
    handleToggleStatus,
    handleDelete,
    confirmDelete,
    closeDeleteDialog,
    handleEdit,
    openNewCategoryModal,
    handleShowCategoryDetail,
    closeModal,
    handleCloseDetailModal,
    handleSaveCategory
  };
}

export { useCategories };
