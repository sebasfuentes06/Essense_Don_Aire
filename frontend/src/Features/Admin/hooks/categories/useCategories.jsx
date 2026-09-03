import { useState } from "react";
const mockCategories = [
  {
    id: 1, name: "Exclusivos", description: "Fragancias premium de edici\xF3n limitada", productCount: 8, status: "active", createdAt: "2024-01-15"
  },
  {
    id: 2, name: "Hombre", description: "Perfumes masculinos", productCount: 15, status: "active", createdAt: "2024-01-10"
  },
  {
    id: 3, name: "Mujer", description: "Fragancias femeninas", productCount: 22, status: "active", createdAt: "2024-01-10"
  },
  {
    id: 4, name: "Unisex", description: "Perfumes para todos", productCount: 12, status: "active", createdAt: "2024-01-20"
  },
  {
    id: 5, name: "Ni\xF1os", description: "Fragancias suaves para ni\xF1os", productCount: 5, status: "inactive", createdAt: "2024-02-01"
  }
];
const sortOptions = [
  { value: "name", label: "Nombre" },
  { value: "productCount", label: "Productos" },
  { value: "createdAt", label: "Fecha" }
];
function useCategories() {
  const [categories, setCategories] = useState(mockCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCategoryForDetail, setSelectedCategoryForDetail] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ nombre: "", descripcion: "", estado: true, name: "", description: "", status: "active" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const filteredCategories = categories.filter((cat) => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || cat.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const sortedCategories = [...filteredCategories].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = sortedCategories.slice(startIndex, startIndex + itemsPerPage);
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };
  const handleToggleStatus = (category) => {
    setCategories(categories.map(
      (item) => item.id === category.id ? { ...item, status: item.status === "active" ? "inactive" : "active" } : item
    ));
  };
  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };
  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setCategoryForm({
      nombre: category.nombre ?? category.name ?? "",
      descripcion: category.descripcion ?? category.description ?? "",
      estado: category.estado ?? category.status ?? true,
      name: category.name ?? category.nombre ?? "",
      description: category.description ?? category.descripcion ?? "",
      status: category.status ?? category.estado ?? "active"
    });
    setIsModalOpen(true);
  };
  const openNewCategoryModal = () => {
    setSelectedCategory(null);
    setCategoryForm({ nombre: "", descripcion: "", estado: true, name: "", description: "", status: "active" });
    setIsModalOpen(true);
  };
  const handleShowCategoryDetail = (category) => {
    setSelectedCategoryForDetail(category);
    setDetailModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };
  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedCategoryForDetail(null);
  };
  const handleSaveCategory = () => {
    const nombre = categoryForm.nombre ?? categoryForm.name ?? "";
    const descripcion = categoryForm.descripcion ?? categoryForm.description ?? "";

    if (!String(nombre).trim()) {
      alert("Debe indicar el nombre de la categoría.");
      return;
    }

    const payload = {
      nombre,
      descripcion,
      estado: categoryForm.estado ?? categoryForm.status ?? true,
      name: categoryForm.name ?? categoryForm.nombre ?? "",
      description: categoryForm.description ?? categoryForm.descripcion ?? "",
      status: categoryForm.status ?? categoryForm.estado ?? "active"
    };

    if (selectedCategory) {
      setCategories(categories.map(
        (cat) => cat.id === selectedCategory.id ? { ...cat, ...payload } : cat
      ));
    } else {
      const nextId = Math.max(0, ...categories.map((cat) => cat.id)) + 1;
      setCategories([...categories, { id: nextId, productCount: 0, createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), ...payload }]);
    }
    setIsModalOpen(false);
    setSelectedCategory(null);
  };
  return {
    categories,
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
    selectedCategory,
    detailModalOpen,
    selectedCategoryForDetail,
    categoryForm,
    setCategoryForm,
    deleteDialogOpen,
    categoryToDelete,
    sortOptions,
    filteredCategories,
    sortedCategories,
    totalPages,
    paginatedCategories,
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
export {
  useCategories
};
