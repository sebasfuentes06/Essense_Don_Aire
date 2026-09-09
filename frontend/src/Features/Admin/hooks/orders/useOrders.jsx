import { useMemo, useState } from "react";
import { useAuth, ROLES } from "../../../../shared/auth";
import { useOrdersStore, ORDER_STATUS } from "../../../../shared/orders";

const sortOptions = [
  { value: "date", label: "Fecha" },
  { value: "folio", label: "Folio" },
  { value: "customer", label: "Cliente" },
  { value: "total", label: "Total" }
];

const emptyForm = {
  customer: "",
  channel: "web",
  deliveryDate: "",
  notes: "",
  items: []
};

/**
 * Estado de pantalla del módulo Pedidos: alcance por rol, filtros,
 * ordenamiento, paginación y modales. Los datos salen del OrdersContext.
 */
function useOrders() {
  const { user, role, can } = useAuth();
  const store = useOrdersStore();

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
  const [orderForm, setOrderForm] = useState(emptyForm);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const onlyOwn = can("orders.own");
  const isClient = role === ROLES.CLIENT;

  /**
   * Alcance:
   *  - Administrador: todos los pedidos.
   *  - Cliente: solo aquellos donde él es el cliente.
   *  - Vendedor: los suyos MÁS los que aún no tienen vendedor asignado
   *    (pedidos que entraron por la web y alguien debe atender).
   */
  const visibleOrders = useMemo(() => {
    if (!onlyOwn) return store.orders;
    if (isClient) return store.orders.filter((order) => order.customer === user?.name);
    return store.orders.filter((order) => order.seller === user?.name || order.seller === null);
  }, [store.orders, onlyOwn, isClient, user?.name]);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return visibleOrders.filter((order) => {
      const matchSearch =
        !query ||
        order.folio.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query);
      const matchStatus = statusFilter === "all" || order.status === statusFilter;
      const matchChannel = channelFilter === "all" || order.channel === channelFilter;
      return matchSearch && matchStatus && matchChannel;
    });
  }, [visibleOrders, searchQuery, statusFilter, channelFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aValue = typeof a[sortBy] === "string" ? a[sortBy].toLowerCase() : a[sortBy];
      const bValue = typeof b[sortBy] === "string" ? b[sortBy].toLowerCase() : b[sortBy];
      if (aValue === bValue) return 0;
      return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });
  }, [filtered, sortBy, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = useMemo(() => {
    const pending = visibleOrders.filter((o) => o.status === ORDER_STATUS.PENDING);
    const confirmed = visibleOrders.filter((o) => o.status === ORDER_STATUS.CONFIRMED);
    return {
      totalOrders: visibleOrders.length,
      pendingCount: pending.length,
      confirmedCount: confirmed.length,
      pendingValue: pending.reduce((sum, o) => sum + o.total, 0)
    };
  }, [visibleOrders]);

  /* ------------------------------ reglas por rol ------------------------- */

  /** El Vendedor y el Cliente solo intervienen pedidos que sigan pendientes. */
  const restrictedToPending = onlyOwn;

  const canEditOrder = (order) =>
    can("orders.edit") && (!restrictedToPending || order.status === ORDER_STATUS.PENDING);

  const canDeleteOrder = (order) =>
    can("orders.delete") && (!restrictedToPending || order.status === ORDER_STATUS.PENDING);

  const canCancelOrder = (order) =>
    (can("orders.cancel") || can("orders.status")) && order.status === ORDER_STATUS.PENDING;

  const canConfirmOrder = (order) =>
    can("orders.status") && order.status === ORDER_STATUS.PENDING;

  const canConvertOrder = (order) =>
    can("orders.convert") && order.status !== ORDER_STATUS.CANCELLED && !order.saleId;

  /* -------------------------------- acciones ----------------------------- */

  const resetPage = () => setCurrentPage(1);

  const handleSearchChange = (value) => { setSearchQuery(value); resetPage(); };
  const handleStatusFilterChange = (value) => { setStatusFilter(value); resetPage(); };
  const handleChannelFilterChange = (value) => { setChannelFilter(value); resetPage(); };

  const handleNewOrder = () => {
    setEditingOrder(null);
    setOrderForm({ ...emptyForm, customer: isClient ? user?.name ?? "" : "" });
    setIsFormOpen(true);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setOrderForm({
      customer: order.customer,
      channel: order.channel,
      deliveryDate: order.deliveryDate ?? "",
      notes: order.notes ?? "",
      items: order.items.map((item) => ({ ...item }))
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingOrder(null);
    setOrderForm(emptyForm);
  };

  const handleSaveOrder = () => {
    const subtotal = Number(orderForm.items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));

    if (editingOrder) {
      store.updateOrder(editingOrder.id, {
        customer: orderForm.customer.trim(),
        channel: orderForm.channel,
        deliveryDate: orderForm.deliveryDate || null,
        notes: orderForm.notes,
        items: orderForm.items,
        subtotal,
        total: subtotal
      });
    } else {
      store.createOrder({
        customer: orderForm.customer.trim(),
        // si lo crea un vendedor queda a su nombre; si lo crea el cliente, sin asignar
        seller: isClient ? null : user?.name ?? null,
        items: orderForm.items,
        channel: orderForm.channel,
        notes: orderForm.notes,
        deliveryDate: orderForm.deliveryDate || null
      });
    }

    handleCloseForm();
  };

  const handleDeleteRequest = (order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) store.deleteOrder(orderToDelete.id);
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  return {
    // datos
    orders: visibleOrders,
    filtered,
    sorted,
    paginated,
    stats,
    sortOptions,
    onlyOwn,
    isClient,

    // filtros y paginacion
    searchQuery, handleSearchChange,
    statusFilter, handleStatusFilterChange,
    channelFilter, handleChannelFilterChange,
    sortBy, setSortBy,
    sortDirection, setSortDirection,
    currentPage, setCurrentPage,
    itemsPerPage, setItemsPerPage,
    totalPages,

    // modales
    detailOrder, setDetailOrder,
    isFormOpen, editingOrder, orderForm, setOrderForm,
    deleteDialogOpen, orderToDelete,
    closeDeleteDialog: () => setDeleteDialogOpen(false),

    // acciones
    handleNewOrder,
    handleEditOrder,
    handleCloseForm,
    handleSaveOrder,
    handleDeleteRequest,
    confirmDelete,
    confirmOrder: (order) => store.setOrderStatus(order.id, ORDER_STATUS.CONFIRMED),
    cancelOrder: (order) => store.cancelOrder(order.id),
    convertToSale: (order) => store.convertToSale(order.id, user?.name ?? null),

    // permisos calculados
    canEditOrder,
    canDeleteOrder,
    canCancelOrder,
    canConfirmOrder,
    canConvertOrder
  };
}

export { useOrders };
