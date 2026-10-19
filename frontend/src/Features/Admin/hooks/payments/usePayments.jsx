import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../../../shared/auth";
import { pagos, ventas, num } from "../../../../shared/negocio";

/**
 * Pagos conectados a la API de la app móvil.
 *
 * Equipo: "Por aprobar" (lo que reportan los clientes), "Cartera" (ventas con
 * saldo agrupadas por cliente) e "Historial". Solo el Administrador aprueba,
 * rechaza o anula; el Vendedor registra abonos.
 *
 * Cliente: sus compras con saldo (paga con Wompi o reporta una transferencia
 * con comprobante) y el historial de sus pagos. La API ya filtra lo suyo.
 */
function usePayments() {
  const { user } = useAuth();
  const isClient = user?.role === "Cliente";
  const isAdmin = user?.role === "Administrador";

  const [tab, setTab] = useState(isClient ? "saldos" : "por_aprobar");
  const [payments, setPayments] = useState([]);
  const [cartera, setCartera] = useState(null);
  const [openSales, setOpenSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [payingSale, setPayingSale] = useState(null); // venta a la que se le registra/reporta un pago
  const [viewingPayment, setViewingPayment] = useState(null);
  const [rejectingPayment, setRejectingPayment] = useState(null);
  const [voidingPayment, setVoidingPayment] = useState(null);
  const [wompiBusy, setWompiBusy] = useState(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [lista, extra] = await Promise.all([
        pagos.listar(),
        isClient ? ventas.listar({ estado_pago: "con_saldo" }) : pagos.pendientes()
      ]);
      setPayments(lista);
      if (isClient) setOpenSales(extra);
      else setCartera(extra);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [isClient]);

  useEffect(() => {
    reload();
  }, [reload]);

  const porAprobar = useMemo(() => payments.filter((p) => p.status === "pendiente"), [payments]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return payments.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (methodFilter !== "all" && p.method !== methodFilter) return false;
      if (!q) return true;
      return [p.invoice, p.customer, p.reference].some((v) => String(v ?? "").toLowerCase().includes(q));
    });
  }, [payments, searchQuery, statusFilter, methodFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = useMemo(() => {
    const aplicados = payments.filter((p) => p.status === "aplicado");
    const mes = new Date();
    const delMes = aplicados.filter((p) => {
      const d = new Date(p.date);
      return d.getMonth() === mes.getMonth() && d.getFullYear() === mes.getFullYear();
    });
    const suma = (xs) => xs.reduce((s, p) => s + p.amount, 0);
    return {
      porAprobarCount: porAprobar.length,
      porAprobarValue: suma(porAprobar),
      cartera: isClient ? openSales.reduce((s, v) => s + v.balance, 0) : num(cartera?.total_pendiente),
      carteraVentas: isClient ? openSales.length : Number(cartera?.cantidad_ventas ?? 0),
      carteraClientes: Number(cartera?.cantidad_clientes ?? 0),
      cobradoMes: suma(delMes),
      pagadoTotal: suma(aplicados),
      rechazados: payments.filter((p) => p.status === "rechazado").length
    };
  }, [payments, porAprobar, cartera, openSales, isClient]);

  const resetPage = (fn) => (v) => {
    fn(v);
    setCurrentPage(1);
  };

  /** Registra (equipo) o reporta (cliente) un pago. El cuerpo ya viene armado. */
  const savePayment = async (body) => {
    const { mensaje } = await pagos.registrar(body);
    toast.success(mensaje || (isClient ? "Pago reportado. Lo revisaremos pronto." : "Pago registrado."));
    setPayingSale(null);
    await reload();
  };

  const approve = async (p) => {
    try {
      toast.success(await pagos.aprobar(p.id));
      setViewingPayment(null);
      await reload();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const confirmReject = async (motivo) => {
    const msg = await pagos.rechazar(rejectingPayment.id, motivo);
    toast.success(msg || "Pago rechazado.");
    setRejectingPayment(null);
    setViewingPayment(null);
    await reload();
  };

  const confirmVoid = async (motivo) => {
    const msg = await pagos.anular(voidingPayment.id, motivo);
    toast.success(msg || "Pago anulado.");
    setVoidingPayment(null);
    setViewingPayment(null);
    await reload();
  };

  /** Crea el link de Wompi y lo abre (cliente) o lo copia (equipo). */
  const payWithWompi = async (sale) => {
    // La ventana se abre antes de la llamada para que el navegador no la bloquee.
    const ventana = isClient ? window.open("about:blank", "_blank") : null;
    setWompiBusy(sale.id);
    try {
      const link = await pagos.linkWompi(sale.id);
      if (ventana) {
        ventana.location.href = link.url;
        toast.success("Abrimos Wompi en otra pestaña. Cuando pagues, tu saldo se actualiza solo.");
      } else {
        try {
          await navigator.clipboard.writeText(link.url);
          toast.success("Link de Wompi copiado. Compártelo con el cliente.");
        } catch {
          toast.success(`Link de Wompi: ${link.url}`, { duration: 15000 });
        }
      }
    } catch (e) {
      ventana?.close();
      toast.error(e.message);
    } finally {
      setWompiBusy(null);
    }
  };

  const uploadProof = async (p, comprobante) => {
    await pagos.subirComprobante(p.id, comprobante);
    toast.success("Comprobante actualizado.");
    setViewingPayment((v) => (v && v.id === p.id ? { ...v, hasProof: true } : v));
    await reload();
  };

  return {
    isClient,
    isAdmin,
    tab,
    setTab,
    payments,
    porAprobar,
    cartera,
    openSales,
    isLoading,
    error,
    reload,
    filtered,
    paginated,
    stats,
    searchQuery,
    handleSearchChange: resetPage(setSearchQuery),
    statusFilter,
    handleStatusFilterChange: resetPage(setStatusFilter),
    methodFilter,
    handleMethodFilterChange: resetPage(setMethodFilter),
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage: resetPage(setItemsPerPage),
    totalPages,
    payingSale,
    setPayingSale,
    viewingPayment,
    setViewingPayment,
    rejectingPayment,
    setRejectingPayment,
    voidingPayment,
    setVoidingPayment,
    wompiBusy,
    savePayment,
    approve,
    confirmReject,
    confirmVoid,
    payWithWompi,
    uploadProof
  };
}

export { usePayments };
