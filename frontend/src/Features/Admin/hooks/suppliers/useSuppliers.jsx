import { useState } from "react";
const mockSuppliers = [
  {
    id: 1, name: "Fragancias Premium SA", contact: "Juan Garc\xEDa", email: "juan@fragpremium.com", phone: "+34 91 234 5678", city: "Madrid", products: ["Essence Royale", "Golden Mist", "Ocean Breeze"],
    rating: 4.8,
    reviews: 42, status: "active", since: "2022-01-15", totalOrders: 45,
    totalSpent: 45e3
  },
  {
    id: 2, name: "Perfumes Internacionales", contact: "Mar\xEDa L\xF3pez", email: "maria@perfintl.com", phone: "+34 93 456 7890", city: "Barcelona", products: ["Noir Elegance", "Velvet Rose"],
    rating: 4.5,
    reviews: 28, status: "active", since: "2022-06-20", totalOrders: 32,
    totalSpent: 32e3
  },
  {
    id: 3, name: "Aromas del Mundo", contact: "Carlos Rodr\xEDguez", email: "carlos@aromasmundo.es", phone: "+34 95 678 9012", city: "Sevilla", products: ["Rose Oud", "Lavender Dreams", "Citrus Splash"],
    rating: 4.3,
    reviews: 18, status: "active", since: "2023-03-10", totalOrders: 22,
    totalSpent: 18500
  }
];
const sortOptions = [
  { value: "name", label: "Nombre" },
  { value: "totalSpent", label: "Total Gastado" },
  { value: "totalOrders", label: "N\xFAmero \xD3rdenes" },
  { value: "rating", label: "Calificaci\xF3n" }
];
function useSuppliers() {
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierForm, setSupplierForm] = useState({ nombre: "", contacto: "", email: "", telefono: "", ciudad: "", estado: true, name: "", contact: "", phone: "", city: "", status: "active" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [detailSupplier, setDetailSupplier] = useState(null);
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) || supplier.city.toLowerCase().includes(searchQuery.toLowerCase()) || supplier.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSuppliers = sortedSuppliers.slice(startIndex, startIndex + itemsPerPage);
  const handleDelete = (supplier) => {
    setSupplierToDelete(supplier);
    setDeleteDialogOpen(true);
  };
  const confirmDelete = () => {
    if (supplierToDelete) {
      setSuppliers(suppliers.filter((s) => s.id !== supplierToDelete.id));
      setDeleteDialogOpen(false);
      setSupplierToDelete(null);
    }
  };
  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setSupplierForm({
      nombre: supplier.nombre ?? supplier.name ?? "",
      contacto: supplier.contacto ?? supplier.contact ?? "",
      email: supplier.email ?? "",
      telefono: supplier.telefono ?? supplier.phone ?? "",
      ciudad: supplier.ciudad ?? supplier.city ?? "",
      estado: supplier.estado ?? supplier.status ?? true,
      name: supplier.name ?? supplier.nombre ?? "",
      contact: supplier.contact ?? supplier.contacto ?? "",
      phone: supplier.phone ?? supplier.telefono ?? "",
      city: supplier.city ?? supplier.ciudad ?? "",
      status: supplier.status ?? supplier.estado ?? "active"
    });
    setIsModalOpen(true);
  };
  const handleView = (supplier) => {
    setSelectedSupplier(supplier);
    setSupplierForm({
      nombre: supplier.nombre ?? supplier.name ?? "",
      contacto: supplier.contacto ?? supplier.contact ?? "",
      email: supplier.email ?? "",
      telefono: supplier.telefono ?? supplier.phone ?? "",
      ciudad: supplier.ciudad ?? supplier.city ?? "",
      estado: supplier.estado ?? supplier.status ?? true,
      name: supplier.name ?? supplier.nombre ?? "",
      contact: supplier.contact ?? supplier.contacto ?? "",
      phone: supplier.phone ?? supplier.telefono ?? "",
      city: supplier.city ?? supplier.ciudad ?? "",
      status: supplier.status ?? supplier.estado ?? "active"
    });
    setIsModalOpen(true);
  };
  const handleNewSupplier = () => {
    setSelectedSupplier(null);
    setSupplierForm({ nombre: "", contacto: "", email: "", telefono: "", ciudad: "", estado: true, name: "", contact: "", phone: "", city: "", status: "active" });
    setIsModalOpen(true);
  };
  const handleSaveSupplier = () => {
    const nombre = supplierForm.nombre ?? supplierForm.name ?? "";
    const contacto = supplierForm.contacto ?? supplierForm.contact ?? "";
    const email = supplierForm.email ?? "";
    const telefono = supplierForm.telefono ?? supplierForm.phone ?? "";

    if (!String(nombre).trim()) {
      alert("Debe indicar el nombre del proveedor.");
      return;
    }
    if (!String(contacto).trim()) {
      alert("Debe indicar el nombre del contacto.");
      return;
    }
    if (String(email).trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      alert("El correo electrónico no es válido.");
      return;
    }
    if (String(telefono).trim() && !/^[+()\d\s-]{7,}$/.test(String(telefono).trim())) {
      alert("El teléfono no es válido.");
      return;
    }

    const payload = {
      nombre,
      contacto,
      email,
      telefono,
      ciudad: supplierForm.ciudad ?? supplierForm.city ?? "",
      estado: supplierForm.estado ?? supplierForm.status ?? true,
      name: supplierForm.name ?? supplierForm.nombre ?? "",
      contact: supplierForm.contact ?? supplierForm.contacto ?? "",
      phone: supplierForm.phone ?? supplierForm.telefono ?? "",
      city: supplierForm.city ?? supplierForm.ciudad ?? "",
      status: supplierForm.status ?? supplierForm.estado ?? "active"
    };

    if (selectedSupplier) {
      setSuppliers(suppliers.map(
        (supplier) => supplier.id === selectedSupplier.id ? { ...supplier, ...payload } : supplier
      ));
    } else {
      const nextId = Math.max(0, ...suppliers.map((supplier) => supplier.id)) + 1;
      setSuppliers([...suppliers, {
        id: nextId,
        products: [],
        totalOrders: 0,
        totalSpent: 0,
        rating: 0,
        reviews: 0,
        since: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        ...payload
      }]);
    }
    setIsModalOpen(false);
    setSelectedSupplier(null);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
  };
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSupplierToDelete(null);
  };
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };
  const handleToggleStatus = (supplier) => {
    setSuppliers(suppliers.map(
      (item) => item.id === supplier.id ? { ...item, status: item.status === "active" ? "inactive" : "active" } : item
    ));
  };
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter((s) => s.status === "active").length;
  const totalProducts = suppliers.reduce((sum, s) => sum + s.products.length, 0);
  const avgRating = (suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1);
  return {
    // raw state
    suppliers,
    setSuppliers,
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
    selectedSupplier,
    setSelectedSupplier,
    supplierForm,
    setSupplierForm,
    deleteDialogOpen,
    setDeleteDialogOpen,
    supplierToDelete,
    setSupplierToDelete,
    detailSupplier,
    setDetailSupplier,
    // static options
    sortOptions,
    // derived data
    filteredSuppliers,
    sortedSuppliers,
    totalPages,
    startIndex,
    paginatedSuppliers,
    totalSuppliers,
    activeSuppliers,
    totalProducts,
    avgRating,
    // handlers
    handleDelete,
    confirmDelete,
    handleEdit,
    handleView,
    handleNewSupplier,
    handleSaveSupplier,
    handleCloseModal,
    handleCloseDeleteDialog,
    handleSearchChange,
    handleStatusFilterChange,
    handleToggleStatus
  };
}
export {
  useSuppliers
};
