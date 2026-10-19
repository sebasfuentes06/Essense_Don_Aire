import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../../../shared/auth";
import { ventas, pagos } from "../../../../shared/negocio";

const sortOptions = [
  { value: "date", label: "Fecha" },
  { value: "total", label: "Total" },
  { value: "balance", label: "Saldo" },
  { value: "customer", label: "Cliente" }
];

/**
 * Ventas contra la API de la app móvil. Una venta descuenta stock y genera
 * factura; el método de pago es obligatorio. Solo el Administrador anula.
 */
function useSales() {
  const { user, can } = useAuth();
  const isAdmin = user?.role === "Administrador";

  const [all, setAll] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [detailSale, setDetailSale] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [cancellingSale, setCancellingSale] = useState(null);
  const [payingSale, setPayingSale] = useState(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      setAll(await ventas.listar());
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const lista = all.filter((v) => {
      if (statusFilter === "anulada" && v.status !== "anulada") return false;
      if (["pendiente", "parcial", "pagada"].includes(statusFilter) && (v.status === "anulada" || v.paymentStatus !== statusFilter)) return false;
      if (channelFilter !== "all" && v.channel !== channelFilter) return false;
      if (!q) return true;
      return [v.invoice, v.customer, v.orderCode, v.seller].some((x) => String(x ?? "").toLowerCase().includes(q));
    });
    const dir = sortDirection === "desc" ? -1 : 1;
    return lista.sort((a, b) => {
      if (sortBy === "date") return (new Date(a.date) - new Date(b.date)) * dir;
      const x = a[sortBy];
      const y = b[sortBy];
      if (typeof x === "number") return (x - y) * dir;
      return String(x ?? "").localeCompare(String(y ?? ""), "es") * dir;
    });
  }, [all, searchQuery, statusFilter, channelFilter, sortBy, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = useMemo(() => {
    const vigentes = all.filter((v) => v.status !== "anulada");
    const hoy = new Date();
    const delMes = vigentes.filter((v) => {
      const d = new Date(v.date);
      return d.getMonth() === hoy.getMonth() && d.getFullYear() === hoy.getFullYear();
    });
    return {
      count: vigentes.length,
      monthTotal: delMes.reduce((s, v) => s + v.total, 0),
      monthCount: delMes.length,
      balance: vigentes.reduce((s, v) => s + v.balance, 0),
      withBalance: vigentes.filter((v) => v.balance > 0).length,
      cancelled: all.length - vigentes.length
    };
  }, [all]);

  const reset = (fn) => (v) => {
    fn(v);
    setCurrentPage(1);
  };

  /** Abre el detalle (con productos, pagos y links de Wompi). */
  const openDetail = async (sale) => {
    setDetailSale(sale);
    try {
      setDetailSale(await ventas.obtener(sale.id));
    } catch (e) {
      toast.error(e.message);
    }
  };

  const refreshDetail = async (id) => {
    await reload();
    try {
      setDetailSale(await ventas.obtener(id));
    } catch {
      /* el detalle se queda con lo que tenía */
    }
  };

  const createSale = async (body) => {
    const { venta, mensaje } = await ventas.crear(body);
    toast.success(mensaje || "Venta registrada.");
    setIsFormOpen(false);
    await reload();
    openDetail(venta);
  };

  const confirmCancel = async (motivo) => {
    const { mensaje } = await ventas.anular(cancellingSale.id, motivo);
    toast.success(mensaje || "Venta anulada.");
    const id = cancellingSale.id;
    setCancellingSale(null);
    if (detailSale?.id === id) await refreshDetail(id);
    else await reload();
  };

  const savePayment = async (body) => {
    const { mensaje } = await pagos.registrar(body);
    toast.success(mensaje || "Abono registrado.");
    const id = payingSale.id;
    setPayingSale(null);
    if (detailSale?.id === id) await refreshDetail(id);
    else await reload();
  };

  const createWompiLink = async (sale) => {
    try {
      const link = await pagos.linkWompi(sale.id);
      try {
        await navigator.clipboard.writeText(link.url);
        toast.success("Link de Wompi creado y copiado. Compártelo con el cliente.");
      } catch {
        toast.success("Link de Wompi creado.");
      }
      await refreshDetail(sale.id);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return {
    isAdmin,
    canCreate: can("sales.create"),
    all,
    isLoading,
    error,
    reload,
    filtered,
    paginated,
    stats,
    sortOptions,
    searchQuery,
    handleSearchChange: reset(setSearchQuery),
    statusFilter,
    handleStatusFilterChange: reset(setStatusFilter),
    channelFilter,
    handleChannelFilterChange: reset(setChannelFilter),
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage: reset((v) => setItemsPerPage(Number(v))),
    totalPages,
    detailSale,
    setDetailSale,
    openDetail,
    isFormOpen,
    setIsFormOpen,
    createSale,
    cancellingSale,
    setCancellingSale,
    confirmCancel,
    payingSale,
    setPayingSale,
    savePayment,
    createWompiLink
  };
}

export { useSales };
