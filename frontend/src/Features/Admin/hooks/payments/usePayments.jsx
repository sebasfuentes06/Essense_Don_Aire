import { useMemo, useState } from "react";
import { useAuth, ROLES } from "../../../../shared/auth";
import { usePaymentsStore, PAYMENT_STATUS } from "../../../../shared/payments";

const sortOptions = [
  { value: "date", label: "Fecha" },
  { value: "folio", label: "Folio" },
  { value: "customer", label: "Cliente" },
  { value: "amount", label: "Monto" }
];

const emptyForm = {
  saleId: "",
  amount: "",
  method: "cash",
  date: new Date().toISOString().slice(0, 10),
  reference: ""
};

/**
 * Estado de pantalla del módulo Pagos y Abonos.
 * El alcance depende del rol: el Administrador ve todo, el Vendedor lo de
 * sus ventas y el Cliente únicamente lo suyo.
 */
function usePayments() {
  const { user, role, can } = useAuth();
  const store = usePaymentsStore();

  const [tab, setTab] = useState("abonos");
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [statementCustomer, setStatementCustomer] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);

  const onlyOwn = can("payments.own");
  const isClient = role === ROLES.CLIENT;
  const name = user?.name ?? "";

  /* --------------------------------- alcance --------------------------- */

  const visiblePayments = useMemo(() => {
    if (!onlyOwn) return store.payments;
    if (isClient) return store.payments.filter((payment) => payment.customer === name);
    return store.payments.filter((payment) => payment.seller === name);
  }, [store.payments, onlyOwn, isClient, name]);

  const visibleSales = useMemo(() => {
    if (!onlyOwn) return store.salesWithBalance;
    if (isClient) return store.salesWithBalance.filter((sale) => sale.customer === name);
    return store.salesWithBalance.filter((sale) => sale.seller === name);
  }, [store.salesWithBalance, onlyOwn, isClient, name]);

  const visibleStatements = useMemo(() => {
    if (!onlyOwn) return store.statements;
    if (isClient) return store.statements.filter((statement) => statement.customer === name);
    // el Vendedor ve el estado de cuenta de los clientes a los que le vendió
    const myCustomers = new Set(visibleSales.map((sale) => sale.customer));
    return store.statements.filter((statement) => myCustomers.has(statement.customer));
  }, [store.statements, onlyOwn, isClient, name, visibleSales]);

  /* -------------------------------- filtros ---------------------------- */

  const filteredPayments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return visiblePayments.filter((payment) => {
      const matchSearch =
        !query ||
        payment.folio.toLowerCase().includes(query) ||
        payment.saleFolio.toLowerCase().includes(query) ||
        payment.customer.toLowerCase().includes(query);
      const matchMethod = methodFilter === "all" || payment.method === methodFilter;
      return matchSearch && matchMethod;
    });
  }, [visiblePayments, searchQuery, methodFilter]);

  const sortedPayments = useMemo(() => {
    return [...filteredPayments].sort((a, b) => {
      const aValue = typeof a[sortBy] === "string" ? a[sortBy].toLowerCase() : a[sortBy];
      const bValue = typeof b[sortBy] === "string" ? b[sortBy].toLowerCase() : b[sortBy];
      if (aValue === bValue) return 0;
      return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });
  }, [filteredPayments, sortBy, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedPayments.length / itemsPerPage));
  const paginatedPayments = sortedPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  /** Estado de cuenta filtrado: "pendientes" es el reporte de saldos abiertos. */
  const filteredStatements = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return visibleStatements.filter((statement) => {
      const matchSearch = !query || statement.customer.toLowerCase().includes(query);
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "pending" ? statement.balance > 0 : statement.balance === 0);
      return matchSearch && matchStatus;
    });
  }, [visibleStatements, searchQuery, statusFilter]);

  /* --------------------------------- KPIs ------------------------------ */

  const stats = useMemo(() => {
    const active = visibleSales.filter((sale) => sale.paymentStatus !== PAYMENT_STATUS.CANCELLED);
    return {
      invoiced: Number(active.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)),
      collected: Number(active.reduce((sum, sale) => sum + sale.paid, 0).toFixed(2)),
      balance: Number(active.reduce((sum, sale) => sum + sale.balance, 0).toFixed(2)),
      openSales: active.filter((sale) => sale.balance > 0).length,
      paymentsCount: visiblePayments.length
    };
  }, [visibleSales, visiblePayments]);

  /** Ventas a las que todavía se les puede abonar (para el formulario). */
  const payableSales = useMemo(
    () => visibleSales.filter((sale) => sale.balance > 0 && sale.paymentStatus !== PAYMENT_STATUS.CANCELLED),
    [visibleSales]
  );

  /* -------------------------------- acciones --------------------------- */

  const resetPage = () => setCurrentPage(1);

  const handleSearchChange = (value) => { setSearchQuery(value); resetPage(); };
  const handleMethodFilterChange = (value) => { setMethodFilter(value); resetPage(); };
  const handleStatusFilterChange = (value) => { setStatusFilter(value); resetPage(); };

  const handleNewPayment = (sale = null) => {
    setForm({ ...emptyForm, saleId: sale ? String(sale.id) : String(payableSales[0]?.id ?? "") });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setForm(emptyForm);
    setFormError("");
  };

  const handleSavePayment = () => {
    const result = store.createPayment({
      saleId: Number(form.saleId),
      amount: form.amount,
      method: form.method,
      date: form.date,
      reference: form.reference
    });

    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    handleCloseForm();
  };

  const handleDeleteRequest = (payment) => {
    setPaymentToDelete(payment);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (paymentToDelete) store.deletePayment(paymentToDelete.id);
    setDeleteDialogOpen(false);
    setPaymentToDelete(null);
  };

  return {
    tab, setTab,
    onlyOwn, isClient,

    payments: paginatedPayments,
    allFilteredPayments: sortedPayments,
    statements: filteredStatements,
    payableSales,
    stats,
    sortOptions,

    searchQuery, handleSearchChange,
    methodFilter, handleMethodFilterChange,
    statusFilter, handleStatusFilterChange,
    sortBy, setSortBy,
    sortDirection, setSortDirection,
    currentPage, setCurrentPage,
    itemsPerPage, setItemsPerPage,
    totalPages,

    isFormOpen, form, setForm, formError,
    handleNewPayment, handleCloseForm, handleSavePayment,

    statementCustomer, setStatementCustomer,
    getStatement: store.getStatement,

    deleteDialogOpen, paymentToDelete,
    closeDeleteDialog: () => setDeleteDialogOpen(false),
    handleDeleteRequest, confirmDelete
  };
}

export { usePayments };
