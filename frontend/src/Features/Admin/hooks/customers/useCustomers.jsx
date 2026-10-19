import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { clientes } from "../../../../shared/negocio";
import { PERSONA_VACIA, personaAApi, erroresApiAPersona } from "../../../../shared/persona";

const sortOptions = [
  { value: "name", label: "Nombre" },
  { value: "balance", label: "Saldo pendiente" },
  { value: "purchases", label: "N° de compras" },
  { value: "lastPurchase", label: "Última compra" },
  { value: "registeredAt", label: "Fecha de registro" }
];

const FORM_VACIO = { ...PERSONA_VACIA, documentType: "CC", notes: "", active: true };

/**
 * Clientes contra la API de la app móvil: misma ficha (tipo y número de
 * documento, celular, municipio de Antioquia) y mismo estado de cuenta.
 */
function useCustomers() {
  const [all, setAll] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [balanceFilter, setBalanceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [formErrors, setFormErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [deletingCustomer, setDeletingCustomer] = useState(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      setAll(await clientes.listar());
    } catch (e) {
      setLoadError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const lista = all.filter((c) => {
      if (statusFilter === "active" && !c.active) return false;
      if (statusFilter === "inactive" && c.active) return false;
      if (balanceFilter === "debt" && !(c.balance > 0)) return false;
      if (balanceFilter === "clear" && c.balance > 0) return false;
      if (!q) return true;
      return [c.name, c.document, c.phone, c.email, c.city].some((v) => String(v ?? "").toLowerCase().includes(q));
    });
    const dir = sortDirection === "desc" ? -1 : 1;
    return lista.sort((a, b) => {
      const x = a[sortBy];
      const y = b[sortBy];
      if (typeof x === "number") return (x - y) * dir;
      return String(x ?? "").localeCompare(String(y ?? ""), "es") * dir;
    });
  }, [all, searchQuery, statusFilter, balanceFilter, sortBy, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = useMemo(
    () => ({
      total: all.length,
      active: all.filter((c) => c.active).length,
      withDebt: all.filter((c) => c.balance > 0).length,
      debt: all.reduce((s, c) => s + c.balance, 0)
    }),
    [all]
  );

  const reset = (fn) => (v) => {
    fn(v);
    setCurrentPage(1);
  };

  const openNew = () => {
    setEditingCustomer(null);
    setForm(FORM_VACIO);
    setFormErrors({});
    setFormError("");
    setIsFormOpen(true);
  };

  const openEdit = (c) => {
    setEditingCustomer(c);
    setForm({
      fullName: c.name,
      documentType: c.documentType || "CC",
      document: c.document,
      phone: c.phone,
      city: c.city,
      address: c.address,
      email: c.email,
      notes: c.notes,
      active: c.active
    });
    setFormErrors({});
    setFormError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCustomer(null);
  };

  const save = async () => {
    setFormError("");
    const body = { ...personaAApi(form), notas: form.notes?.trim() ?? "", ...(editingCustomer && { estado: form.active }) };
    try {
      if (editingCustomer) await clientes.actualizar(editingCustomer.id, body);
      else await clientes.crear(body);
      toast.success(editingCustomer ? "Cliente actualizado." : "Cliente registrado.");
      closeForm();
      await reload();
    } catch (e) {
      setFormError(e.message);
      if (e.details) setFormErrors(erroresApiAPersona(e.details));
    }
  };

  const toggleStatus = async (c) => {
    try {
      await clientes.actualizar(c.id, { estado: !c.active });
      toast.success(c.active ? "Cliente desactivado." : "Cliente activado.");
      await reload();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const confirmDelete = async () => {
    try {
      await clientes.eliminar(deletingCustomer.id);
      toast.success("Cliente eliminado.");
      setDeletingCustomer(null);
      await reload();
    } catch (e) {
      toast.error(e.message);
      setDeletingCustomer(null);
    }
  };

  return {
    all,
    isLoading,
    loadError,
    reload,
    filtered,
    paginated,
    stats,
    sortOptions,
    searchQuery,
    handleSearchChange: reset(setSearchQuery),
    statusFilter,
    handleStatusFilterChange: reset(setStatusFilter),
    balanceFilter,
    handleBalanceFilterChange: reset(setBalanceFilter),
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage: reset((v) => setItemsPerPage(Number(v))),
    totalPages,
    isFormOpen,
    editingCustomer,
    form,
    setForm,
    formErrors,
    formError,
    openNew,
    openEdit,
    closeForm,
    save,
    toggleStatus,
    viewingCustomer,
    setViewingCustomer,
    deletingCustomer,
    setDeletingCustomer,
    confirmDelete
  };
}

export { useCustomers };
