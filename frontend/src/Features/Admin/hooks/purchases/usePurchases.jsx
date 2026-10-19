import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api, ApiError } from "../../../../shared/api";
import { cargarProductos, num, NOMBRES_METODO, METODOS_ABONO } from "../../../../shared/negocio";

/** Compra de la API de la app -> forma que usan los componentes. */
const ESTADO_PAGO = { pendiente: "pending", parcial: "partial", pagada: "paid", cancelada: "cancelled" };
function aCompra(c) {
  return {
    id: c.id_compra,
    folio: c.folio,
    date: c.fecha,
    supplierId: c.id_proveedor,
    supplierName: c.proveedor,
    subtotal: num(c.subtotal),
    tax: num(c.impuesto),
    total: num(c.total),
    paid: num(c.pagado),
    balance: c.estado === "cancelada" ? 0 : num(c.saldo),
    status: ESTADO_PAGO[c.estado_pago] ?? c.estado_pago,
    notes: c.notas ?? "",
    cancelReason: c.motivo_cancelacion ?? "",
    registeredBy: c.registro ?? "",
    units: Number(c.unidades ?? 0),
    lines: Number(c.lineas ?? 0),
    items: (c.items ?? []).map((i) => ({
      productId: i.id_producto,
      productName: i.nombre,
      sku: i.sku,
      quantity: Number(i.cantidad),
      unitCost: num(i.costo_unitario),
      subtotal: num(i.subtotal)
    })),
    payments: (c.pagos ?? []).map((p) => ({
      id: p.id_pago_compra,
      date: p.fecha,
      amount: num(p.monto),
      method: NOMBRES_METODO[p.metodo] ?? p.metodo,
      methodCode: p.metodo,
      reference: p.referencia ?? ""
    })),
    hasDetail: Array.isArray(c.items)
  };
}
const METODOS_PAGO_COMPRA = METODOS_ABONO.map((m) => ({ id: m, nombre: NOMBRES_METODO[m] }));

/**
 * Compras a proveedores, contra la API de la app móvil (/api/compras).
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

  const [allPurchases, setAllPurchases] = useState([]);

  const fetchPurchases = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      setAllPurchases((await api.todos("/compras")).map(aCompra));
    } catch (error) {
      setAllPurchases([]);
      setLoadError(error instanceof ApiError ? error.message : "No se pudieron cargar las compras.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOpciones = useCallback(async () => {
    try {
      const [prov, folio] = await Promise.all([api.todos("/proveedores", { status: "active" }), api.datos("/compras/siguiente-folio")]);
      setSuppliers(prov.map((p) => ({ id: p.id_proveedor, nombre: p.nombre })));
      setSuggestedFolio(folio?.folio ?? "");
    } catch {
      setSuppliers([]);
    }
    setPaymentMethods(METODOS_PAGO_COMPRA);
  }, []);

  useEffect(() => { fetchPurchases(); }, [fetchPurchases]);
  useEffect(() => { fetchOpciones(); }, [fetchOpciones]);

  // Filtros, orden y paginación en el navegador.
  const filtrados = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const lista = allPurchases.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (supplierFilter !== "all" && supplierFilter !== "" && String(c.supplierId) !== String(supplierFilter)) return false;
      const dia = String(c.date ?? "").slice(0, 10);
      if (dateFrom && dia < dateFrom) return false;
      if (dateTo && dia > dateTo) return false;
      if (!q) return true;
      return [c.folio, c.supplierName, c.notes].some((v) => String(v ?? "").toLowerCase().includes(q));
    });
    const dir = sortDirection === "desc" ? -1 : 1;
    return lista.sort((a, b) => {
      if (sortBy === "date") return (new Date(a.date) - new Date(b.date)) * dir;
      const x = a[sortBy];
      const y = b[sortBy];
      if (typeof x === "number") return (x - y) * dir;
      return String(x ?? "").localeCompare(String(y ?? ""), "es") * dir;
    });
  }, [allPurchases, searchTerm, statusFilter, supplierFilter, dateFrom, dateTo, sortBy, sortDirection]);

  useEffect(() => {
    setExportRows(filtrados);
    setTotalItems(filtrados.length);
    setTotalPages(Math.max(1, Math.ceil(filtrados.length / itemsPerPage)));
    setPurchases(filtrados.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    const vigentes = allPurchases.filter((c) => c.status !== "cancelled");
    setStats({
      total: allPurchases.length,
      porPagar: vigentes.filter((c) => c.balance > 0).length,
      canceladas: allPurchases.length - vigentes.length,
      totalComprado: vigentes.reduce((s, c) => s + c.total, 0),
      saldoPendiente: vigentes.reduce((s, c) => s + c.balance, 0)
    });
  }, [filtrados, allPurchases, currentPage, itemsPerPage]);

  /**
   * Al elegir proveedor se ofrecen SOLO sus productos: la API rechaza una
   * compra con productos de otro proveedor (productos.id_proveedor dice a
   * quién se le compra cada uno).
   */
  const idProveedorForm = purchaseForm.id_proveedor;
  useEffect(() => {
    if (!idProveedorForm) {
      setSupplierProducts([]);
      return;
    }
    let cancelado = false;
    setLoadingProducts(true);
    cargarProductos({ proveedor: idProveedorForm })
      .then((lista) => {
        if (!cancelado) setSupplierProducts(lista.map((p) => ({ id: p.id, nombre: p.name, sku: p.sku, stock: p.stock, precio: p.price })));
      })
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
      const r = await accion();
      if (r?.mensaje) toast.success(r.mensaje);
      await fetchPurchases();
      await fetchOpciones();
      return { ok: true, resultado: r?.datos?.id_compra ? aCompra(r.datos) : null };
    } catch (error) {
      setActionError(error instanceof ApiError ? error.message : "No se pudo completar la operación.");
      if (error?.details) setFormErrors({ ...error.details, fecha_compra: error.details.fecha });
      return { ok: false, error: error.message };
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
      id_proveedor: Number(purchaseForm.id_proveedor),
      // Si es la fecha de hoy se deja que la API ponga la hora actual.
      ...(purchaseForm.fecha_compra && purchaseForm.fecha_compra !== new Date().toISOString().slice(0, 10) && { fecha: `${purchaseForm.fecha_compra}T12:00:00` }),
      impuesto: purchaseForm.impuesto === "" ? 0 : Number(purchaseForm.impuesto),
      items: (purchaseForm.items ?? []).map((item) => ({
        id_producto: Number(item.id_producto),
        cantidad: Number(item.cantidad),
        costo_unitario: Number(item.precio_costo)
      }))
    };

    const { ok } = await run(() => api.post("/compras", payload));
    if (ok) handleClosePurchaseForm();
  };

  /* ---------------------------------------------------------------- */
  /* Detalle                                                           */
  /* ---------------------------------------------------------------- */

  const handleViewDetail = async (purchase) => {
    setActionError("");
    setDetailPurchase(purchase);
    try {
      setDetailPurchase(aCompra(await api.datos(`/compras/${purchase.id}`)));
    } catch (error) {
      setActionError(error.message);
    }
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
        metodo: paymentForm.id_metodo_pago,
        monto: Number(paymentForm.monto),
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

  /** Cancelar pide el motivo; si la API lo bloquea, el diálogo muestra por qué. */
  const confirmCancel = async (motivo) => {
    if (!purchaseToCancel) return;
    const { ok, resultado, error } = await run(() => api.post(`/compras/${purchaseToCancel.id}/cancelar`, { motivo }));
    if (!ok) throw new Error(error);
    if (detailPurchase?.id === purchaseToCancel.id) setDetailPurchase(resultado);
    setCancelDialogOpen(false);
    setPurchaseToCancel(null);
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
