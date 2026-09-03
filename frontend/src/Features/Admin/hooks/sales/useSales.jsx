import { useState } from "react";
const mockSales = [
  {
    id: 1, folio: "VTA-001", date: "2024-06-01", customer: "Ana Mart\xEDnez",
    seller: "Carlos Vendedor", items: [
      { productId: 1, productName: "Essence Royale", quantity: 2, unitPrice: 89.99, discount: 0 }
    ],
    subtotal: 179.98,
    discount: 0,
    total: 179.98, paymentMethod: "card", status: "completed"
  },
  {
    id: 2, folio: "VTA-002", date: "2024-06-01", customer: "Carlos Rodr\xEDguez",
    seller: "Mar\xEDa Vendedora", items: [
      { productId: 3, productName: "Golden Mist", quantity: 1, unitPrice: 79.99, discount: 0 }
    ],
    subtotal: 79.99,
    discount: 0,
    total: 79.99, paymentMethod: "cash", status: "completed"
  },
  {
    id: 3, folio: "VTA-003", date: "2024-05-31", customer: "Mar\xEDa Gonz\xE1lez",
    seller: "Carlos Vendedor", items: [
      { productId: 1, productName: "Essence Royale", quantity: 3, unitPrice: 89.99, discount: 15 }
    ],
    subtotal: 269.97,
    discount: 40.5,
    total: 229.47, paymentMethod: "transfer", status: "completed"
  },
  {
    id: 4, folio: "VTA-004", date: "2024-05-30", customer: "Luis Hern\xE1ndez",
    seller: "Mar\xEDa Vendedora", items: [
      { productId: 2, productName: "Noir Elegance", quantity: 2, unitPrice: 74.99, discount: 0 }
    ],
    subtotal: 149.98,
    discount: 0,
    total: 149.98, paymentMethod: "mixed", status: "cancelled"
  }
];
const mockSellers = ["Carlos Vendedor", "Mar\xEDa Vendedora", "Admin Principal"];
const sortOptions = [
  { value: "date", label: "Fecha" },
  { value: "folio", label: "Folio" },
  { value: "customer", label: "Cliente" },
  { value: "total", label: "Total" }
];
const initialSaleForm = {
  id_cliente: "",
  id_usuario: "",
  fecha_venta: new Date().toISOString().slice(0, 10),
  id_metodo_pago: 1,
  total: "",
  customer: "",
  seller: "",
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: "cash"
};
function useSales() {
  const [sales, setSales] = useState(mockSales);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sellerFilter, setSellerFilter] = useState("all");
  const [detailSale, setDetailSale] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [saleToCancel, setSaleToCancel] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const [isSaleFormOpen, setIsSaleFormOpen] = useState(false);
  const [saleForm, setSaleForm] = useState(initialSaleForm);
  const filtered = sales.filter((s) => {
    const matchSearch = s.folio.toLowerCase().includes(searchQuery.toLowerCase()) || s.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    const matchSeller = sellerFilter === "all" || s.seller === sellerFilter;
    return matchSearch && matchStatus && matchSeller;
  });
  const sorted = [...filtered].sort((a, b) => {
    const aValue = typeof a[sortBy] === "string" ? a[sortBy].toLowerCase() : a[sortBy];
    const bValue = typeof b[sortBy] === "string" ? b[sortBy].toLowerCase() : b[sortBy];
    return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
  });
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalRevenue = sales.filter((s) => s.status === "completed").reduce((sum, s) => sum + s.total, 0);
  const avgTicket = sales.filter((s) => s.status === "completed").length > 0 ? totalRevenue / sales.filter((s) => s.status === "completed").length : 0;
  const completedCount = sales.filter((s) => s.status === "completed").length;
  const todayCount = sales.filter((s) => s.date === "2024-06-01").length;
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };
  const handleSellerFilterChange = (value) => {
    setSellerFilter(value);
    setCurrentPage(1);
  };
  const handleViewDetail = (sale) => {
    setDetailSale(sale);
  };
  const handleNewSale = () => {
    setSaleForm(initialSaleForm);
    setIsSaleFormOpen(true);
  };
  const handleCloseSaleForm = () => {
    setIsSaleFormOpen(false);
    setSaleForm(initialSaleForm);
  };
  const handleSaveSale = () => {
    const cliente = Number(saleForm.id_cliente ?? saleForm.customer ?? 0);
    const vendedor = Number(saleForm.id_usuario ?? saleForm.seller ?? 0);
    const metodoPago = Number(saleForm.id_metodo_pago ?? saleForm.paymentMethod ?? 0);
    const fechaVenta = saleForm.fecha_venta ?? saleForm.date ?? "";
    const total = Number(saleForm.total ?? 0);

    if (!cliente || cliente <= 0) {
      alert("Debe indicar un cliente válido.");
      return;
    }
    if (!vendedor || vendedor <= 0) {
      alert("Debe seleccionar un vendedor válido.");
      return;
    }
    if (!fechaVenta) {
      alert("Debe indicar una fecha.");
      return;
    }
    if (!metodoPago || metodoPago <= 0) {
      alert("Debe seleccionar un método de pago.");
      return;
    }
    if (!total || total <= 0) {
      alert("El total debe ser mayor a 0.");
      return;
    }

    const nextId = Math.max(0, ...sales.map((sale) => sale.id)) + 1;
    const nextFolio = `VTA-${String(nextId).padStart(3, "0")}`;
    const payload = {
      id_cliente: cliente,
      id_usuario: vendedor,
      fecha_venta: fechaVenta,
      id_metodo_pago: metodoPago,
      total,
      date: saleForm.date ?? saleForm.fecha_venta,
      customer: saleForm.customer ?? saleForm.id_cliente,
      seller: saleForm.seller ?? saleForm.id_usuario,
      paymentMethod: saleForm.paymentMethod ?? saleForm.id_metodo_pago ?? "cash",
      status: "completed"
    };
    setSales([...sales, {
      id: nextId,
      folio: nextFolio,
      items: [],
      subtotal: total,
      discount: 0,
      ...payload
    }]);
    handleCloseSaleForm();
  };
  const handleCloseDetail = () => {
    setDetailSale(null);
  };
  const handleCancel = (sale) => {
    setSaleToCancel(sale);
    setCancelDialogOpen(true);
  };
  const closeCancelDialog = () => {
    setCancelDialogOpen(false);
    setSaleToCancel(null);
  };
  const confirmCancel = () => {
    if (saleToCancel) {
      setSales(sales.map((s) => s.id === saleToCancel.id ? { ...s, status: "cancelled" } : s));
      setCancelDialogOpen(false);
      setSaleToCancel(null);
    }
  };
  const handleDelete = (sale) => {
    setSaleToDelete(sale);
    setDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSaleToDelete(null);
  };
  const confirmDelete = () => {
    if (saleToDelete) {
      setSales(sales.filter((sale) => sale.id !== saleToDelete.id));
      closeDeleteDialog();
    }
  };
  return {
    sales,
    sellers: mockSellers,
    searchQuery,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    statusFilter,
    sellerFilter,
    detailSale,
    setDetailSale,
    deleteDialogOpen,
    saleToDelete,
    isSaleFormOpen,
    saleForm,
    setSaleForm,
    cancelDialogOpen,
    saleToCancel,
    filtered,
    sorted,
    sortOptions,
    totalPages,
    paginated,
    totalRevenue,
    avgTicket,
    completedCount,
    todayCount,
    handleSearchChange,
    handleStatusFilterChange,
    handleSellerFilterChange,
    handleViewDetail,
    handleNewSale,
    handleCloseSaleForm,
    handleSaveSale,
    handleCloseDetail,
    handleCancel,
    closeCancelDialog,
    confirmCancel,
    handleDelete,
    closeDeleteDialog,
    confirmDelete
  };
}
export {
  useSales
};
