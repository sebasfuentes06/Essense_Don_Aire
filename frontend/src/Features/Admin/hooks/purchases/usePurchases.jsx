import { useState } from "react";
const mockPurchases = [
  {
    id: 1, folio: "OC-001", date: "2024-05-15", supplierId: 1, supplierName: "Fragancias Premium SA", items: [
      { productName: "Essence Royale (x50)", quantity: 50, unitCost: 45 },
      { productName: "Noir Elegance (x30)", quantity: 30, unitCost: 38 }
    ],
    subtotal: 3390,
    tax: 542.4,
    total: 3932.4,
    paid: 3932.4,
    balance: 0, status: "paid", payments: []
  },
  {
    id: 2, folio: "OC-002", date: "2024-05-20", supplierId: 2, supplierName: "Perfumes Internacionales", items: [
      { productName: "Golden Mist (x40)", quantity: 40, unitCost: 40 }
    ],
    subtotal: 1600,
    tax: 256,
    total: 1856,
    paid: 1e3,
    balance: 856, status: "partial", payments: []
  },
  {
    id: 3, folio: "OC-003", date: "2024-06-01", supplierId: 3, supplierName: "Aromas del Mundo", items: [
      { productName: "Rose Oud (x25)", quantity: 25, unitCost: 52 }
    ],
    subtotal: 1300,
    tax: 208,
    total: 1508,
    paid: 0,
    balance: 1508, status: "pending", payments: []
  }
];
const mockSuppliers = [
  { id: 1, name: "Fragancias Premium SA" },
  { id: 2, name: "Perfumes Internacionales" },
  { id: 3, name: "Aromas del Mundo" }
];
const availableProducts = [
  { id: 1, name: "Essence Royale", price: 89.99, stock: 45 },
  { id: 2, name: "Noir Elegance", price: 74.99, stock: 12 },
  { id: 3, name: "Golden Mist", price: 79.99, stock: 5 },
  { id: 4, name: "Velvet Rose", price: 69.99, stock: 28 },
  { id: 5, name: "Ocean Breeze", price: 64.99, stock: 0 }
];
const initialPurchaseForm = {
  folio: "",
  id_proveedor: "",
  fecha_compra: "",
  estado: "pending",
  subtotal: 0,
  impuesto: 0,
  total: 0,
  items: [],
  supplierId: "",
  date: "",
  status: "pending",
  tax: 0
};
const sortOptions = [
  { value: "date", label: "Fecha" },
  { value: "folio", label: "Folio" },
  { value: "supplierName", label: "Proveedor" },
  { value: "total", label: "Total" }
];
function usePurchases() {
  const [purchases, setPurchases] = useState(mockPurchases);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [detailPurchase, setDetailPurchase] = useState(null);
  const [isPurchaseFormOpen, setIsPurchaseFormOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [purchaseForm, setPurchaseForm] = useState(initialPurchaseForm);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState(null);
  const filtered = purchases.filter((p) => {
    const matchSearch = p.folio.toLowerCase().includes(searchQuery.toLowerCase()) || p.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const matchSupplier = supplierFilter === "all" || p.supplierName === supplierFilter;
    const matchDateFrom = !dateFrom || p.date >= dateFrom;
    const matchDateTo = !dateTo || p.date <= dateTo;
    return matchSearch && matchStatus && matchSupplier && matchDateFrom && matchDateTo;
  });
  const sorted = [...filtered].sort((a, b) => {
    const aValue = typeof a[sortBy] === "string" ? a[sortBy].toLowerCase() : a[sortBy];
    const bValue = typeof b[sortBy] === "string" ? b[sortBy].toLowerCase() : b[sortBy];
    return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
  });
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPurchased = purchases.reduce((s, p) => s + p.total, 0);
  const totalBalance = purchases.reduce((s, p) => s + p.balance, 0);
  const pendingCount = purchases.filter((p) => p.status === "pending" || p.status === "partial").length;
  const handleViewDetail = (purchase) => {
    setDetailPurchase(purchase);
  };
  const handleCloseDetail = () => {
    setDetailPurchase(null);
  };
  const handleNewPurchase = () => {
    setSelectedPurchase(null);
    setPurchaseForm(initialPurchaseForm);
    setIsPurchaseFormOpen(true);
  };
  const handleClosePurchaseForm = () => {
    setIsPurchaseFormOpen(false);
    setSelectedPurchase(null);
    setPurchaseForm(initialPurchaseForm);
  };
  const handleSavePurchase = () => {
    const supplierId = Number(purchaseForm.id_proveedor ?? purchaseForm.supplierId ?? 0);
    const supplier = mockSuppliers.find((item) => item.id === supplierId);
    if (!supplier) {
      alert("Debe seleccionar un proveedor válido.");
      return;
    }

    const folio = String(purchaseForm.folio ?? "").trim();
    const fechaCompra = purchaseForm.fecha_compra ?? purchaseForm.date ?? "";
    const subtotal = Number(purchaseForm.subtotal ?? 0);
    const impuesto = Number(purchaseForm.impuesto ?? purchaseForm.tax ?? 0);
    const total = Number(purchaseForm.total ?? 0);
    const estadoPersist = purchaseForm.estado ?? purchaseForm.status ?? "pending";

    if (!folio) {
      alert("Debe indicar un folio.");
      return;
    }
    if (!fechaCompra) {
      alert("Debe indicar una fecha.");
      return;
    }
    if (!estadoPersist) {
      alert("Debe seleccionar un estado.");
      return;
    }
    if (!Array.isArray(purchaseForm.items) || purchaseForm.items.length === 0) {
      alert("Debe agregar al menos un producto a la compra.");
      return;
    }
    if (subtotal < 0) {
      alert("El subtotal no puede ser negativo.");
      return;
    }
    if (impuesto < 0) {
      alert("El impuesto no puede ser negativo.");
      return;
    }
    if (!total || total <= 0) {
      alert("El total debe ser mayor a 0.");
      return;
    }

    const isPaid = estadoPersist === "paid";
    const purchaseData = {
      ...purchaseForm,
      folio,
      id_proveedor: supplierId,
      fecha_compra: fechaCompra,
      estado: estadoPersist,
      subtotal,
      impuesto,
      total,
      supplierId,
      supplierName: supplier.name,
      date: purchaseForm.date ?? purchaseForm.fecha_compra,
      status: estadoPersist,
      tax: impuesto,
      paid: isPaid ? total : 0,
      balance: isPaid ? 0 : total,
      payments: purchaseForm.payments || []
    };

    if (selectedPurchase) {
      setPurchases(purchases.map((purchase) => purchase.id === selectedPurchase.id ? { ...purchase, ...purchaseData } : purchase));
    } else {
      const nextId = Math.max(0, ...purchases.map((purchase) => purchase.id)) + 1;
      setPurchases([...purchases, { id: nextId, ...purchaseData }]);
    }
    handleClosePurchaseForm();
  };
  const handleCancelPurchase = (purchase) => {
    if (purchase.status === "cancelled") return;
    setPurchases(purchases.map((item) => item.id === purchase.id ? { ...item, status: "cancelled" } : item));
    if (detailPurchase?.id === purchase.id) {
      setDetailPurchase({ ...purchase, status: "cancelled" });
    }
  };
  const handleDeleteRequest = (purchase) => {
    setPurchaseToDelete(purchase);
    setDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPurchaseToDelete(null);
  };
  const confirmDelete = () => {
    if (purchaseToDelete) {
      setPurchases(purchases.filter((p) => p.id !== purchaseToDelete.id));
      setDeleteDialogOpen(false);
      setPurchaseToDelete(null);
    }
  };
  return {
    purchases,
    suppliers: mockSuppliers,
    availableProducts,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    supplierFilter,
    setSupplierFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    detailPurchase,
    setDetailPurchase,
    isPurchaseFormOpen,
    selectedPurchase,
    purchaseForm,
    setPurchaseForm,
    deleteDialogOpen,
    purchaseToDelete,
    filtered,
    sorted,
    sortOptions,
    totalPages,
    paginated,
    totalPurchased,
    totalBalance,
    pendingCount,
    handleViewDetail,
    handleCloseDetail,
    handleNewPurchase,
    handleClosePurchaseForm,
    handleSavePurchase,
    handleCancelPurchase,
    handleDeleteRequest,
    closeDeleteDialog,
    confirmDelete
  };
}
export {
  usePurchases
};
