import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth, ROLES } from "../../../../shared/auth";
import { useOrdersStore, ORDER_STATUS } from "../../../../shared/orders";

const sortOptions = [
  { value: "date", label: "Fecha" },
  { value: "folio", label: "Código" },
  { value: "customer", label: "Cliente" },
  { value: "total", label: "Total" }
];

/**
 * Estado de pantalla del módulo Pedidos. Los datos vienen de la API (la
 * misma de la app móvil), que ya decide qué ve cada rol: el Cliente solo
 * recibe sus pedidos.
 */
function useOrders() {
  const { role, can } = useAuth();
  const store = useOrdersStore();
  const isClient = role === ROLES.CLIENT;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [detailOrder, setDetailOrder] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [convertingOrder, setConvertingOrder] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return store.orders.filter((o) => {
      const matchSearch = !q || o.folio.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      const matchChannel = channelFilter === "all" || o.channel === channelFilter;
      return matchSearch && matchStatus && matchChannel;
    });
  }, [store.orders, searchQuery, statusFilter, channelFilter]);

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        const av = typeof a[sortBy] === "string" ? a[sortBy].toLowerCase() : a[sortBy];
        const bv = typeof b[sortBy] === "string" ? b[sortBy].toLowerCase() : b[sortBy];
        if (av === bv) return 0;
        return sortDirection === "asc" ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
      }),
    [filtered, sortBy, sortDirection]
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = useMemo(() => {
    const pending = store.orders.filter((o) => o.status === ORDER_STATUS.PENDING);
    return {
      totalOrders: store.orders.length,
      pendingCount: pending.length,
      confirmedCount: store.orders.filter((o) => o.status === ORDER_STATUS.CONFIRMED).length,
      pendingValue: pending.reduce((s, o) => s + o.total, 0)
    };
  }, [store.orders]);

  // Reglas (la API valida lo mismo): solo se tocan pedidos pendientes;
  // convertir en venta es del equipo.
  const canEditOrder = (o) => can("orders.edit") && o.status === ORDER_STATUS.PENDING && !isClient;
  const canCancelOrder = (o) => (can("orders.cancel") || can("orders.edit")) && o.status === ORDER_STATUS.PENDING;
  const canConvertOrder = (o) => can("orders.convert") && o.status === ORDER_STATUS.PENDING;

  const resetPage = (fn) => (v) => {
    fn(v);
    setCurrentPage(1);
  };

  /** Abre el detalle con los productos (la lista no los trae). */
  const openDetail = async (order) => {
    setDetailOrder(order);
    try {
      setDetailOrder(await store.fetchOrder(order.id));
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleNewOrder = () => {
    setEditingOrder(null);
    setIsFormOpen(true);
  };

  const handleEditOrder = async (order) => {
    try {
      setEditingOrder(order.hasDetail ? order : await store.fetchOrder(order.id));
      setIsFormOpen(true);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingOrder(null);
  };

  /** body: cuerpo de la API (lo arma el formulario). */
  const handleSaveOrder = async (body) => {
    if (editingOrder) {
      const o = await store.updateOrder(editingOrder.id, body);
      toast.success(`Pedido ${o.folio} actualizado.`);
    } else {
      const { message } = await store.createOrder(body);
      toast.success(message ?? "Pedido registrado.");
    }
    handleCloseForm();
  };

  const confirmCancel = async (motivo) => {
    const o = await store.cancelOrder(cancellingOrder.id, motivo);
    toast.success(`Pedido ${o.folio} cancelado.`);
    if (detailOrder?.id === o.id) setDetailOrder(o);
  };

  const confirmConvert = async (body) => {
    const { mensaje } = await store.convertToSale(convertingOrder.id, body);
    toast.success(mensaje ?? "Pedido convertido en venta.");
    setConvertingOrder(null);
    setDetailOrder(null);
  };

  return {
    orders: store.orders,
    isLoading: store.isLoading,
    error: store.error,
    reload: store.reload,
    filtered,
    paginated,
    stats,
    sortOptions,
    isClient,
    searchQuery,
    handleSearchChange: resetPage(setSearchQuery),
    statusFilter,
    handleStatusFilterChange: resetPage(setStatusFilter),
    channelFilter,
    handleChannelFilterChange: resetPage(setChannelFilter),
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    detailOrder,
    setDetailOrder,
    openDetail,
    isFormOpen,
    editingOrder,
    convertingOrder,
    setConvertingOrder,
    cancellingOrder,
    setCancellingOrder,
    handleNewOrder,
    handleEditOrder,
    handleCloseForm,
    handleSaveOrder,
    confirmCancel,
    confirmConvert,
    uploadProof: store.uploadProof,
    canEditOrder,
    canCancelOrder,
    canConvertOrder
  };
}

export { useOrders };
