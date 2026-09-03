import { useState } from "react";
const mockProducts = [
  {
    id: 1, name: "Essence Royale", category: "Exclusivos", price: 89.99,
    stock: 45,
    minStock: 20, supplier: "Fragancias Premium SA", status: "active", sku: "ESS-ROY-001", description: "Fragancia premium con notas de \xE1mbar y vainilla", images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=400"]
  },
  {
    id: 2, name: "Noir Elegance", category: "Hombre", price: 74.99,
    stock: 12,
    minStock: 20, supplier: "Perfumes Internacionales", status: "active", sku: "NOI-ELE-002", description: "Aroma masculino intenso con notas de madera", images: ["https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400"]
  },
  {
    id: 3, name: "Golden Mist", category: "Mujer", price: 79.99,
    stock: 5,
    minStock: 15, supplier: "Fragancias Premium SA", status: "active", sku: "GOL-MIS-003", description: "Fragancia femenina floral con toques c\xEDtricos", images: ["https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400"]
  },
  {
    id: 4, name: "Velvet Rose", category: "Mujer", price: 69.99,
    stock: 28,
    minStock: 15, supplier: "Perfumes Internacionales", status: "active", sku: "VEL-ROS-004", description: "Delicada mezcla de rosas y jazm\xEDn", images: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400"]
  },
  {
    id: 5, name: "Ocean Breeze", category: "Unisex", price: 64.99,
    stock: 0,
    minStock: 25, supplier: "Fragancias Premium SA", status: "inactive", sku: "OCE-BRE-005", description: "Aroma fresco marino con notas acu\xE1ticas", images: ["https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400"]
  }
];
const categories = ["Todos", "Exclusivos", "Hombre", "Mujer", "Unisex"];
const sortOptions = [
  { value: "name", label: "Nombre" },
  { value: "price", label: "Precio" },
  { value: "stock", label: "Stock" },
  { value: "category", label: "Categor\xEDa" }
];
function useProductsManagement() {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productForm, setProductForm] = useState({ nombre: "", descripcion: "", precio: "", stock: "", stock_minimo: "", id_categoria: "", id_proveedor: "", sku: "", imagen: "", estado: true, name: "", description: "", category: "Unisex", price: "", minStock: "", supplier: "", imageUrl: "", status: "active" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [stockFilter, setStockFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const suppliers = Array.from(new Set(products.map((p) => p.supplier)));
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    const matchesPrice = (!priceRange.min || product.price >= Number(priceRange.min)) && (!priceRange.max || product.price <= Number(priceRange.max));
    const matchesStock = stockFilter === "all" || stockFilter === "low" && product.stock < product.minStock || stockFilter === "normal" && product.stock >= product.minStock;
    const matchesSupplier = supplierFilter === "all" || product.supplier === supplierFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesPrice && matchesStock && matchesSupplier;
  });
  const sortedProducts = [...filteredProducts].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  const lowStockCount = products.filter((p) => p.stock < p.minStock).length;
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };
  const handleCloseFilters = () => {
    setShowFilters(false);
  };
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };
  const handleSortByChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };
  const handleSortDirectionChange = (dir) => {
    setSortDirection(dir);
    setCurrentPage(1);
  };
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };
  const handleToggleStatus = (product) => {
    setProducts(products.map(
      (item) => item.id === product.id ? { ...item, status: item.status === "active" ? "inactive" : "active" } : item
    ));
  };
  const handleStockFilterChange = (e) => {
    setStockFilter(e.target.value);
    setCurrentPage(1);
  };
  const handleSupplierFilterChange = (e) => {
    setSupplierFilter(e.target.value);
    setCurrentPage(1);
  };
  const handlePriceMinChange = (e) => {
    setPriceRange({ ...priceRange, min: e.target.value });
    setCurrentPage(1);
  };
  const handlePriceMaxChange = (e) => {
    setPriceRange({ ...priceRange, max: e.target.value });
    setCurrentPage(1);
  };
  const resetFilters = () => {
    setStatusFilter("all");
    setPriceRange({ min: "", max: "" });
    setStockFilter("all");
    setSupplierFilter("all");
    setSelectedCategory("Todos");
  };
  const handleDelete = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };
  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setProductForm({
      nombre: product.nombre ?? product.name ?? "",
      descripcion: product.descripcion ?? product.description ?? "",
      precio: product.precio ?? product.price ?? "",
      stock: product.stock ?? "",
      stock_minimo: product.stock_minimo ?? product.minStock ?? "",
      id_categoria: product.id_categoria ?? product.category ?? "",
      id_proveedor: product.id_proveedor ?? product.supplier ?? "",
      sku: product.sku ?? "",
      imagen: product.imagen ?? product.images?.[0] ?? "",
      estado: product.estado ?? product.status ?? true,
      name: product.name ?? product.nombre ?? "",
      description: product.description ?? product.descripcion ?? "",
      category: product.category ?? product.id_categoria ?? "Unisex",
      price: product.price ?? product.precio ?? "",
      minStock: product.minStock ?? product.stock_minimo ?? "",
      supplier: product.supplier ?? product.id_proveedor ?? "",
      imageUrl: product.imageUrl ?? product.imagen ?? product.images?.[0] ?? "",
      status: product.status ?? product.estado ?? "active"
    });
    setIsModalOpen(true);
  };
  const handleView = (product) => {
    setSelectedProduct(product);
    setProductForm({
      nombre: product.nombre ?? product.name ?? "",
      descripcion: product.descripcion ?? product.description ?? "",
      precio: product.precio ?? product.price ?? "",
      stock: product.stock ?? "",
      stock_minimo: product.stock_minimo ?? product.minStock ?? "",
      id_categoria: product.id_categoria ?? product.category ?? "",
      id_proveedor: product.id_proveedor ?? product.supplier ?? "",
      sku: product.sku ?? "",
      imagen: product.imagen ?? product.images?.[0] ?? "",
      estado: product.estado ?? product.status ?? true,
      name: product.name ?? product.nombre ?? "",
      description: product.description ?? product.descripcion ?? "",
      category: product.category ?? product.id_categoria ?? "Unisex",
      price: product.price ?? product.precio ?? "",
      minStock: product.minStock ?? product.stock_minimo ?? "",
      supplier: product.supplier ?? product.id_proveedor ?? "",
      imageUrl: product.imageUrl ?? product.imagen ?? product.images?.[0] ?? "",
      status: product.status ?? product.estado ?? "active"
    });
    setIsModalOpen(true);
  };
  const handleNewProduct = () => {
    setSelectedProduct(null);
    setProductForm({ nombre: "", descripcion: "", precio: "", stock: "", stock_minimo: "", id_categoria: "", id_proveedor: "", sku: "", imagen: "", estado: true, name: "", description: "", category: "Unisex", price: "", minStock: "", supplier: "", imageUrl: "", status: "active" });
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };
  const handleSaveProduct = () => {
    const nombre = productForm.nombre ?? productForm.name ?? "";
    const sku = productForm.sku ?? "";
    const precio = Number(productForm.precio ?? productForm.price ?? 0);
    const stock = Number(productForm.stock ?? 0);
    const stockMinimo = Number(productForm.stock_minimo ?? productForm.minStock ?? 0);
    const idCategoria = Number(productForm.id_categoria ?? productForm.category ?? 0);
    const idProveedor = Number(productForm.id_proveedor ?? productForm.supplier ?? 0);

    if (!String(nombre).trim()) {
      alert("Debe indicar el nombre del producto.");
      return;
    }
    if (!String(sku).trim()) {
      alert("Debe indicar el SKU del producto.");
      return;
    }
    if (!idCategoria || idCategoria <= 0) {
      alert("Debe seleccionar una categoría.");
      return;
    }
    if (!idProveedor || idProveedor <= 0) {
      alert("Debe seleccionar un proveedor.");
      return;
    }
    if (precio <= 0) {
      alert("El precio debe ser mayor a 0.");
      return;
    }
    if (stock < 0) {
      alert("El stock no puede ser negativo.");
      return;
    }
    if (stockMinimo < 0) {
      alert("El stock mínimo no puede ser negativo.");
      return;
    }

    const payload = {
      nombre,
      descripcion: productForm.descripcion ?? productForm.description ?? "",
      precio,
      stock,
      stock_minimo: stockMinimo,
      id_categoria: idCategoria,
      id_proveedor: idProveedor,
      sku,
      imagen: productForm.imagen ?? productForm.imageUrl ?? "",
      estado: productForm.estado ?? productForm.status ?? true,
      name: productForm.name ?? productForm.nombre ?? "",
      description: productForm.description ?? productForm.descripcion ?? "",
      category: productForm.category ?? productForm.id_categoria ?? "Unisex",
      price: Number(productForm.price ?? productForm.precio ?? 0),
      minStock: Number(productForm.minStock ?? productForm.stock_minimo ?? 0),
      supplier: productForm.supplier ?? productForm.id_proveedor ?? "",
      imageUrl: productForm.imageUrl ?? productForm.imagen ?? "",
      status: productForm.status ?? productForm.estado ?? "active"
    };

    if (selectedProduct) {
      setProducts(products.map(
          (product) => product.id === selectedProduct.id ? {
            ...product,
            ...payload,
            images: payload.imageUrl ? [payload.imageUrl] : product.images,
            price: Number(payload.price),
            stock: Number(payload.stock),
            minStock: Number(payload.minStock)
          } : product
      ));
    } else {
      const nextId = Math.max(0, ...products.map((product) => product.id)) + 1;
      setProducts([...products, {
        id: nextId, images: payload.imageUrl ? [payload.imageUrl] : [],
        ...payload,
        price: Number(payload.price),
        stock: Number(payload.stock),
        minStock: Number(payload.minStock),
        status: payload.status
      }]);
    }
    setIsModalOpen(false);
    setSelectedProduct(null);
  };
  return {
    products,
    searchQuery,
    selectedCategory,
    showFilters,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    sortBy,
    sortDirection,
    isModalOpen,
    selectedProduct,
    productForm,
    setProductForm,
    deleteDialogOpen,
    productToDelete,
    statusFilter,
    priceRange,
    stockFilter,
    supplierFilter,
    categories,
    sortOptions,
    suppliers,
    filteredProducts,
    sortedProducts,
    totalPages,
    paginatedProducts,
    lowStockCount,
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
export {
  useProductsManagement
};
