import { useState } from "react";
const mockCustomers = [
  {
    id: 1, name: "Mar\xEDa Gonz\xE1lez", email: "maria.gonzalez@email.com", phone: "+1 234 567 8901", address: "Calle Principal 123", city: "Ciudad de M\xE9xico", totalPurchases: 12,
    totalSpent: 1250.5, status: "active", joinDate: "2024-01-15", lastPurchase: "2024-06-01"
  },
  {
    id: 2, name: "Carlos Rodr\xEDguez", email: "carlos.r@email.com", phone: "+1 234 567 8902", address: "Av. Reforma 456", city: "Guadalajara", totalPurchases: 8,
    totalSpent: 890, status: "active", joinDate: "2024-02-10", lastPurchase: "2024-05-28"
  },
  {
    id: 3, name: "Ana Mart\xEDnez", email: "ana.martinez@email.com", phone: "+1 234 567 8903", address: "Colonia Centro 789", city: "Monterrey", totalPurchases: 25,
    totalSpent: 2340.75, status: "active", joinDate: "2023-11-05", lastPurchase: "2024-06-02"
  },
  {
    id: 4, name: "Luis Hern\xE1ndez", email: "luis.h@email.com", phone: "+1 234 567 8904", address: "Boulevard 321", city: "Puebla", totalPurchases: 3,
    totalSpent: 340.25, status: "inactive", joinDate: "2024-03-20", lastPurchase: "2024-04-15"
  }
];
const sortOptions = [
  { value: "name", label: "Nombre" },
  { value: "totalSpent", label: "Total Gastado" },
  { value: "totalPurchases", label: "Compras" },
  { value: "joinDate", label: "Fecha Registro" }
];
function useCustomers() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewMode, setViewMode] = useState("edit");
  const [customerForm, setCustomerForm] = useState({ nombre: "", correo: "", contrasena: "", telefono: "", ciudad: "", estado: true, name: "", email: "", password: "", phone: "", city: "", status: "active" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || customer.email.toLowerCase().includes(searchQuery.toLowerCase()) || customer.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = sortedCustomers.slice(startIndex, startIndex + itemsPerPage);
  const handleDelete = (customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };
  const confirmDelete = () => {
    if (customerToDelete) {
      setCustomers(customers.filter((c) => c.id !== customerToDelete.id));
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };
  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setCustomerForm({
      nombre: customer.nombre ?? customer.name ?? "",
      correo: customer.correo ?? customer.email ?? "",
      contrasena: "",
      telefono: customer.telefono ?? customer.phone ?? "",
      ciudad: customer.ciudad ?? customer.city ?? "",
      estado: customer.estado ?? customer.status ?? true,
      name: customer.name ?? customer.nombre ?? "",
      email: customer.email ?? customer.correo ?? "",
      password: "",
      phone: customer.phone ?? customer.telefono ?? "",
      city: customer.city ?? customer.ciudad ?? "",
      status: customer.status ?? customer.estado ?? "active"
    });
    setViewMode("edit");
    setIsModalOpen(true);
  };
  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setCustomerForm({
      nombre: customer.nombre ?? customer.name ?? "",
      correo: customer.correo ?? customer.email ?? "",
      telefono: customer.telefono ?? customer.phone ?? "",
      ciudad: customer.ciudad ?? customer.city ?? "",
      estado: customer.estado ?? customer.status ?? true,
      name: customer.name ?? customer.nombre ?? "",
      email: customer.email ?? customer.correo ?? "",
      phone: customer.phone ?? customer.telefono ?? "",
      city: customer.city ?? customer.ciudad ?? "",
      status: customer.status ?? customer.estado ?? "active"
    });
    setViewMode("details");
    setIsModalOpen(true);
  };
  const handleNewCustomer = () => {
    setSelectedCustomer(null);
    setCustomerForm({ nombre: "", correo: "", contrasena: "", telefono: "", ciudad: "", estado: true, name: "", email: "", password: "", phone: "", city: "", status: "active" });
    setViewMode("edit");
    setIsModalOpen(true);
  };
  const handleSaveCustomer = () => {
    const nombre = customerForm.nombre ?? customerForm.name ?? "";
    const correo = customerForm.correo ?? customerForm.email ?? "";
    const passwordValue = customerForm.contrasena ?? customerForm.password ?? "";
    const telefono = customerForm.telefono ?? customerForm.phone ?? "";
    const ciudad = customerForm.ciudad ?? customerForm.city ?? "";

    if (!String(nombre).trim()) {
      alert("Debe indicar el nombre completo.");
      return;
    }
    if (!String(correo).trim()) {
      alert("Debe indicar un correo electrónico.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(correo).trim())) {
      alert("El correo electrónico no es válido.");
      return;
    }
    if (!selectedCustomer && !String(passwordValue).trim()) {
      alert("La contraseña es obligatoria.");
      return;
    }
    if (String(telefono).trim() && !/^[+()\d\s-]{7,}$/.test(String(telefono).trim())) {
      alert("El teléfono no es válido.");
      return;
    }
    if (!String(ciudad).trim()) {
      alert("Debe indicar la ciudad.");
      return;
    }

    const payload = {
      nombre,
      correo,
      contrasena: passwordValue,
      telefono,
      ciudad,
      estado: customerForm.estado ?? customerForm.status ?? true,
      name: customerForm.name ?? customerForm.nombre ?? "",
      email: customerForm.email ?? customerForm.correo ?? "",
      password: passwordValue,
      phone: customerForm.phone ?? customerForm.telefono ?? "",
      city: customerForm.city ?? customerForm.ciudad ?? "",
      status: customerForm.status ?? customerForm.estado ?? "active"
    };

    if (selectedCustomer) {
      setCustomers(customers.map(
        (customer) => customer.id === selectedCustomer.id
          ? { ...customer, ...payload, password: passwordValue || customer.password }
          : customer
      ));
    } else {
      const nextId = Math.max(0, ...customers.map((customer) => customer.id)) + 1;
      setCustomers([...customers, { id: nextId, totalPurchases: 0, totalSpent: 0, joinDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), ...payload }]);
    }
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };
  const handleToggleStatus = (customer) => {
    setCustomers(customers.map(
      (c) => c.id === customer.id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c
    ));
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };
  const updateCustomerFormField = (field, value) => {
    setCustomerForm((prev) => ({ ...prev, [field]: value }));
  };
  return {
    // data
    customers,
    sortOptions,
    filteredCustomers,
    sortedCustomers,
    paginatedCustomers,
    totalPages,
    // state
    searchQuery,
    currentPage,
    itemsPerPage,
    sortBy,
    sortDirection,
    statusFilter,
    isModalOpen,
    selectedCustomer,
    viewMode,
    customerForm,
    deleteDialogOpen,
    customerToDelete,
    // setters
    setSearchQuery,
    setCurrentPage,
    setItemsPerPage,
    setSortBy,
    setSortDirection,
    setStatusFilter,
    setIsModalOpen,
    setSelectedCustomer,
    setViewMode,
    setCustomerForm,
    setDeleteDialogOpen,
    setCustomerToDelete,
    // handlers
    handleDelete,
    confirmDelete,
    handleEdit,
    handleView,
    handleNewCustomer,
    handleSaveCustomer,
    handleToggleStatus,
    closeModal,
    closeDeleteDialog,
    handleSearchChange,
    handleStatusFilterChange,
    updateCustomerFormField
  };
}
export {
  useCustomers
};
