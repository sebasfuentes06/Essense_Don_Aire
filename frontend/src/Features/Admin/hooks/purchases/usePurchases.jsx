import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../../../../shared/api";

/**
 * Compras a proveedores, ya contra la API.
 *
 * Es el primer módulo que no solo guarda: mueve el inventario. Por eso hay
 * tres cosas que cambian respecto a los CRUD anteriores.
 *
 * 1. No hay edición. Una compra registrada ya sumó al stock y es el soporte
 *    de lo que se le debe al proveedor. Si quedó mal, se cancela —lo que
 *    devuelve el stock— y se hace otra.
 *
 * 2. El estado no se elige. Antes había un desplegable con Pendiente /
 *    Parcial / Pagado y nada impedía marcar "Pagado" una compra que nadie
 *    pagó. Ahora sale de los abonos registrados.
 *
 * 3. El costo se escribe. El formulario anterior tomaba el `unitCost` del
 *    PRECIO DE VENTA del producto, que es lo que le cobras al cliente, no lo
 *    que le pagas al proveedor. Con eso, toda compra quedaba registrada por
 *    un valor más alto del real y el margen del negocio desaparecía.
 */

const sortOptions = [
  { value: "date", label: "Fecha" },
  { value: "folio", label: "Folio" },
  { value: "supplierName", label: "Proveedor" },
  { value: "total", label: "Total" },
  { value: "balance", label: "Saldo" }
];

const emptyStats = {
  total: 0,
  porPagar: 0,
  canceladas: 0,
  totalComprado: 0,
  saldoPendiente: 0
};

const emptyForm = {
  folio: "",
  id_proveedor: "",
  fecha_compra: new Date().toISOString().slice(0, 10),
  impuesto: "",
  items: []
};

const emptyPago = { id_metodo_pago: "", monto: "", referencia: "" };

function usePurchases() {
  const [purchases, setPurchases] = useState([]);
  const [exportRows, setExportRows] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [suppliers, setSuppliers] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [suggestedFolio, setSuggestedFolio] = useState("");
  const [supplierProducts, setSupplierProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isPurchaseFormOpen, setIsPurchaseFormOpen] = useState(false);
  const [purchaseForm, setPurchaseForm] = useState(emptyForm);

  const [detailPurchase, setDetailPurchase] = useState(null);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [purchaseToPay, setPurchaseToPay] = useState(null);
  const [paymentForm, setPaymentForm] = useState(emptyPago);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [purchaseToCancel, setPurchaseToCancel] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState(null);

  // Se espera a que la persona deje de escribir: sin esto, "Fragancias"
  // dispara diez peticiones, una por letra.
  useEffect(() => {
    const id = setTimeout(() => {
      setSearchTerm(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(id);
  }, [searchQuery]);

  const filtros = {
    search: searchTerm,
    status: statusFilter,
    supplierId: supplierFilter,
    from: dateFrom,
    to: dateTo,
    sortBy,
    sortDir: sortDirection
  };

  const fetchPurchases = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const { data, stats: resumen, meta } = await api.get("/compras", {
        search: searchTerm,
        status: statusFilter,
        supplierId: supplierFilter,
        from: dateFrom,
        to: dateTo,
        sortBy,
        sortDir: sortDirection,
        page: currentPage,
        limit: itemsPerPage
      });
      setPurchases(data ?? []);
      setStats(resumen ?? emptyStats);
      setTotalItems(meta?.total ?? 0);
      setTotalPages(meta?.totalPages ?? 1);
    } catch (error) {
      setPurchases([]);
      setTotalItems(0);
      setLoadError(error instanceof ApiError ? error.message : "No se pudieron cargar las compras.");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, statusFilter, supplierFilter, dateFrom, dateTo, sortBy, sortDirection, currentPage, itemsPerPage]);

  /**
   * Las filas del CSV. Van aparte porque la tabla solo tiene en memoria la
   * página actual: exportar eso se llevaría diez filas de cincuenta sin avisar.
   */
  const fetchExportRows = useCallback(async () => {
    try {
      const { data } = await api.get("/compras", { ...filtros, page: 1, limit: 100 });
      setExportRows(data ?? []);
    } catch {
      setExportRows([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, supplierFilter, dateFrom, dateTo, sortBy, sortDirection]);

  const fetchOpciones = useCallback(async () => {
    try {
      const { proveedores, metodosPago, folioSugerido } = await api.get("/compras/opciones");
      setSuppliers(proveedores ?? []);
      setPaymentMethods(metodosPago ?? []);
      setSuggestedFolio(folioSugerido ?? "");
    } catch {
      setSuppliers([]);
      setPaymentMethods([]);
    }
  }, []);

  useEffect(() => { fetchPurchases(); }, [fetchPurchases]);
  useEffect(() => { fetchExportRows(); }, [fetchExportRows]);
  useEffect(() => { fetchOpciones(); }, [fetchOpciones]);

  /**
   * Al elegir proveedor se traen SUS productos.
   *
   * La lista no es un adorno: la API rechaza una compra que traiga productos
   * de otro proveedor, porque `productos.id_proveedor` dice a quién se le
   * compra cada uno. Ofrecer solo los suyos evita que alguien arme una compra
   * entera y se entere al guardar.
   */
  const idProveedorForm = purchaseForm.id_proveedor;
  useEffect(() => {
    if (!idProveedorForm) {
      setSupplierProducts([]);
      return;
    }
    let cancelado = false;
    setLoadingProducts(true);
    api
      .get(`/compras/proveedores/${idProveedorForm}/productos`)
      .then(({ productos }) => { if (!cancelado) setSupplierProducts(productos ?? []); })
      .catch(() => { if (!cancelado) setSupplierProducts([]); })
      .finally(() => { if (!cancelado) setLoadingProducts(false); });
    return () => { cancelado = true; };
  }, [idProveedorForm]);

  const resetPage = () => setCurrentPage(1);
  const handleSearchChange = (value) => setSearchQuery(value);
  const conReset = (setter) => (value) => { setter(value); resetPage(); };

  /**
   * Envuelve una escritura. Los resguardos de este módulo responden con
   * explicaciones concretas —"Ocean Breeze trajo 20 y quedan 3 en
   * existencia"— y eso es justo lo que hay que mostrar, no un error genérico.
   */
  const run = async (accion) => {
    setActionError("");
    try {
      const resultado = await accion();
      await fetchPurchases();
      await fetchExportRows();
      await fetchOpciones();
      return { ok: true, resultado };
    } catch (error) {
      setActionError(error instanceof ApiError ? error.message : "No se pudo completar la operación.");
      if (error?.details) setFormErrors(error.details);
      return { ok: false };
    }
  };

  /* ---------------------------------------------------------------- */
  /* Registrar una compra                                              */
  /* ---------------------------------------------------------------- */

  const handleNewPurchase = () => {
    setPurchaseForm({ ...emptyForm, folio: suggestedFolio });
    setFormErrors({});
    setActionError("");
    setIsPurchaseFormOpen(true);
  };

  const handleClosePurchaseForm = () => {
    setIsPurchaseFormOpen(false);
    setPurchaseForm(emptyForm);
    setSupplierProducts([]);
    setFormErrors({});
    setActionError("");
  };

  const handleSavePurchase = async () => {
    setFormErrors({});
    const payload = {
      folio: purchaseForm.folio,
      id_proveedor: purchaseForm.id_proveedor,
      fecha_compra: purchaseForm.fecha_compra || undefined,
      impuesto: purchaseForm.impuesto === "" ? 0 : purchaseForm.impuesto,
      items: (purchaseForm.items ?? []).map((item) => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        precio_costo: item.precio_costo
      }))
    };

    const { ok } = await run(() => api.post("/compras", payload));
    if (ok) handleClosePurchaseForm();
  };

  /* ---------------------------------------------------------------- */
  /* Detalle                                                           */
  /* ---------------------------------------------------------------- */

  const handleViewDetail = (purchase) => {
    setActionError("");
    setDetailPurchase(purchase);
  };
  const handleCloseDetail = () => setDetailPurchase(null);

  /* ---------------------------------------------------------------- */
  /* Abonos                                                            */
  /* ---------------------------------------------------------------- */

  const handleOpenPayment = (purchase) => {
    setPurchaseToPay(purchase);
    // Se propone el saldo completo: es lo que se paga la mayoría de las veces,
    // y si es un abono parcial se corrige el número sin tener que escribirlo
    // todo desde cero.
    setPaymentForm({ ...emptyPago, monto: String(purchase.balance ?? "") });
    setFormErrors({});
    setActionError("");
    setPaymentModalOpen(true);
  };

  const handleClosePayment = () => {
    setPaymentModalOpen(false);
    setPurchaseToPay(null);
    setPaymentForm(emptyPago);
    setFormErrors({});
    setActionError("");
  };

  const handleSavePayment = async () => {
    if (!purchaseToPay) return;
    setFormErrors({});
    const { ok, resultado } = await run(() =>
      api.post(`/compras/${purchaseToPay.id}/pagos`, {
        id_metodo_pago: paymentForm.id_metodo_pago,
        monto: paymentForm.monto,
        referencia: paymentForm.referencia
      })
    );
    if (ok) {
      // Si el detalle está abierto sobre esta misma compra, se refresca con lo
      // que devolvió el servidor para que el historial y el saldo no queden
      // mostrando la versión anterior.
      if (detailPurchase?.id === purchaseToPay.id) setDetailPurchase(resultado);
      handleClosePayment();
    }
  };

  const handleAnularPago = async (purchase, pago) => {
    const { ok, resultado } = await run(() =>
      api.delete(`/compras/${purchase.id}/pagos/${pago.id}`)
    );
    if (ok && detailPurchase?.id === purchase.id) setDetailPurchase(resultado);
  };

  /* ---------------------------------------------------------------- */
  /* Cancelar y eliminar                                               */
  /* ---------------------------------------------------------------- */

  const handleCancelRequest = (purchase) => {
    setActionError("");
    setPurchaseToCancel(purchase);
    setCancelDialogOpen(true);
  };

  const closeCancelDialog = () => {
    setCancelDialogOpen(false);
    setPurchaseToCancel(null);
    setActionError("");
  };

  const confirmCancel = async () => {
    if (!purchaseToCancel) return;
    const { ok, resultado } = await run(() => api.patch(`/compras/${purchaseToCancel.id}/cancelar`));
    if (ok) {
      if (detailPurchase?.id === purchaseToCancel.id) setDetailPurchase(resultado);
      setCancelDialogOpen(false);
      setPurchaseToCancel(null);
    }
    // Si falló, el diálogo se queda abierto con el motivo: casi siempre es que
    // tiene abonos o que la mercancía ya salió, y conviene leerlo.
  };

  const handleDeleteRequest = (purchase) => {
    setActionError("");
    setPurchaseToDelete(purchase);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPurchaseToDelete(null);
    setActionError("");
  };

  const confirmDelete = async () => {
    if (!purchaseToDelete) return;
    const { ok } = await run(() => api.delete(`/compras/${purchaseToDelete.id}`));
    if (ok) {
      if (detailPurchase?.id === purchaseToDelete.id) setDetailPurchase(null);
      setDeleteDialogOpen(false);
      setPurchaseToDelete(null);
    }
  };

  // Mismos nombres de siempre: la página y la tabla ya trabajan con ellos.
  const paginated = purchases;
  const filtered = purchases;

  return {
    purchases,
    exportRows,
    suppliers,
    paymentMethods,
    suggestedFolio,
    supplierProducts,
    loadingProducts,
    isLoading,
    loadError,
    actionError,
    formErrors,
    stats,
    totalItems,
    searchQuery,
    handleSearchChange,
    statusFilter,
    setStatusFilter: conReset(setStatusFilter),
    supplierFilter,
    setSupplierFilter: conReset(setSupplierFilter),
    dateFrom,
    setDateFrom: conReset(setDateFrom),
    dateTo,
    setDateTo: conReset(setDateTo),
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    sortOptions,
    filtered,
    paginated,
    totalPages,
    isPurchaseFormOpen,
    purchaseForm,
    setPurchaseForm,
    detailPurchase,
    paymentModalOpen,
    purchaseToPay,
    paymentForm,
    setPaymentForm,
    cancelDialogOpen,
    purchaseToCancel,
    deleteDialogOpen,
    purchaseToDelete,
    refresh: fetchPurchases,
    handleNewPurchase,
    handleClosePurchaseForm,
    handleSavePurchase,
    handleViewDetail,
    handleCloseDetail,
    handleOpenPayment,
    handleClosePayment,
    handleSavePayment,
    handleAnularPago,
    handleCancelRequest,
    closeCancelDialog,
    confirmCancel,
    handleDeleteRequest,
    closeDeleteDialog,
    confirmDelete
  };
}

export { usePurchases, sortOptions };
