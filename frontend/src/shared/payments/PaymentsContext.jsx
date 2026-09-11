import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { mockSales } from "../../Features/Admin/hooks/sales/useSales";

/**
 * Store de pagos y abonos.
 *
 * Regla central, igual que en la base de datos (Database/data_base.sql v5):
 * el saldo NO se guarda en ningún lado. Se calcula restando los abonos al
 * total de la venta. Si se guardara, tarde o temprano las dos cifras
 * dejarían de coincidir.
 */

const PAYMENT_STATUS = {
  PAID: "paid",
  PARTIAL: "partial",
  PENDING: "pending",
  CANCELLED: "cancelled"
};

const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PAID]: "Pagada",
  [PAYMENT_STATUS.PARTIAL]: "Abonada",
  [PAYMENT_STATUS.PENDING]: "Pendiente",
  [PAYMENT_STATUS.CANCELLED]: "Anulada"
};

const PAYMENT_STATUS_VARIANTS = {
  [PAYMENT_STATUS.PAID]: "success",
  [PAYMENT_STATUS.PARTIAL]: "warning",
  [PAYMENT_STATUS.PENDING]: "danger",
  [PAYMENT_STATUS.CANCELLED]: "default"
};

const METHOD_LABELS = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
  mixed: "Mixto"
};

const METHOD_OPTIONS = Object.entries(METHOD_LABELS).map(([value, label]) => ({ value, label }));

const mockPayments = [
  { id: 1, folio: "PAG-001", saleId: 1, saleFolio: "VTA-001", customer: "Ana Martínez",    seller: "Carlos Vendedor", date: "2024-06-01", amount: 100,    method: "cash",     reference: "Abono inicial en tienda" },
  { id: 2, folio: "PAG-002", saleId: 1, saleFolio: "VTA-001", customer: "Ana Martínez",    seller: "Carlos Vendedor", date: "2024-06-03", amount: 79.98,  method: "transfer", reference: "Saldo por Nequi" },
  { id: 3, folio: "PAG-003", saleId: 2, saleFolio: "VTA-002", customer: "Carlos Rodríguez", seller: "María Vendedora", date: "2024-06-01", amount: 79.99,  method: "card",     reference: "Pago total con tarjeta" },
  { id: 4, folio: "PAG-004", saleId: 3, saleFolio: "VTA-003", customer: "María González",   seller: "Carlos Vendedor", date: "2024-06-01", amount: 100,    method: "cash",     reference: "Primer abono" },
  { id: 5, folio: "PAG-005", saleId: 5, saleFolio: "VTA-005", customer: "Laura Cliente",    seller: "Carlos Vendedor", date: "2024-06-02", amount: 80,     method: "transfer", reference: "Abono desde la app" }
];

const PaymentsContext = createContext(undefined);

const round = (value) => Number(value.toFixed(2));

function nextFolio(payments) {
  const numbers = payments
    .map((payment) => Number(String(payment.folio).replace("PAG-", "")))
    .filter((value) => Number.isFinite(value));
  const next = (numbers.length ? Math.max(...numbers) : 0) + 1;
  return `PAG-${String(next).padStart(3, "0")}`;
}

function PaymentsProvider({ children }) {
  const [payments, setPayments] = useState(mockPayments);

  /**
   * Estado de cada venta: cuánto se ha abonado, cuánto falta y en qué
   * situación está. Se recalcula solo cuando cambian los abonos.
   */
  const salesWithBalance = useMemo(() => {
    return mockSales.map((sale) => {
      const salePayments = payments.filter((payment) => payment.saleId === sale.id);
      const paid = round(salePayments.reduce((sum, payment) => sum + payment.amount, 0));
      const balance = round(sale.total - paid);

      let paymentStatus;
      if (sale.status === "cancelled") paymentStatus = PAYMENT_STATUS.CANCELLED;
      else if (paid >= sale.total) paymentStatus = PAYMENT_STATUS.PAID;
      else if (paid > 0) paymentStatus = PAYMENT_STATUS.PARTIAL;
      else paymentStatus = PAYMENT_STATUS.PENDING;

      return {
        id: sale.id,
        folio: sale.folio,
        date: sale.date,
        customer: sale.customer,
        seller: sale.seller,
        total: sale.total,
        paid,
        balance: Math.max(0, balance),
        paymentStatus,
        payments: salePayments
      };
    });
  }, [payments]);

  /** Estado de cuenta agregado por cliente (las anuladas no cuentan). */
  const statements = useMemo(() => {
    const byCustomer = new Map();

    for (const sale of salesWithBalance) {
      if (sale.paymentStatus === PAYMENT_STATUS.CANCELLED) continue;

      const current = byCustomer.get(sale.customer) ?? {
        customer: sale.customer,
        salesCount: 0,
        openSales: 0,
        invoiced: 0,
        paid: 0,
        balance: 0,
        sales: []
      };

      current.salesCount += 1;
      if (sale.paymentStatus !== PAYMENT_STATUS.PAID) current.openSales += 1;
      current.invoiced += sale.total;
      current.paid += sale.paid;
      current.balance += sale.balance;
      current.sales.push(sale);

      byCustomer.set(sale.customer, current);
    }

    return [...byCustomer.values()].map((statement) => ({
      ...statement,
      invoiced: round(statement.invoiced),
      paid: round(statement.paid),
      balance: round(statement.balance)
    }));
  }, [salesWithBalance]);

  const getSale = useCallback(
    (saleId) => salesWithBalance.find((sale) => sale.id === saleId) ?? null,
    [salesWithBalance]
  );

  const getStatement = useCallback(
    (customer) => statements.find((statement) => statement.customer === customer) ?? null,
    [statements]
  );

  /** Registra un abono. El monto no puede exceder el saldo de la venta. */
  const createPayment = useCallback(({ saleId, amount, method, date, reference }) => {
    const sale = salesWithBalance.find((candidate) => candidate.id === saleId);
    if (!sale) return { ok: false, error: "La venta no existe." };
    if (sale.paymentStatus === PAYMENT_STATUS.CANCELLED) {
      return { ok: false, error: "No se pueden registrar abonos sobre una venta anulada." };
    }

    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      return { ok: false, error: "El monto debe ser mayor a cero." };
    }
    if (value > sale.balance) {
      return { ok: false, error: `El monto excede el saldo pendiente ($${sale.balance.toFixed(2)}).` };
    }

    setPayments((prev) => [
      {
        id: Date.now(),
        folio: nextFolio(prev),
        saleId: sale.id,
        saleFolio: sale.folio,
        customer: sale.customer,
        seller: sale.seller,
        date: date || new Date().toISOString().slice(0, 10),
        amount: round(value),
        method,
        reference: reference ?? ""
      },
      ...prev
    ]);

    return { ok: true };
  }, [salesWithBalance]);

  const updatePayment = useCallback((id, changes) => {
    setPayments((prev) =>
      prev.map((payment) => (payment.id === id ? { ...payment, ...changes } : payment))
    );
  }, []);

  const deletePayment = useCallback((id) => {
    setPayments((prev) => prev.filter((payment) => payment.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      payments,
      salesWithBalance,
      statements,
      getSale,
      getStatement,
      createPayment,
      updatePayment,
      deletePayment
    }),
    [payments, salesWithBalance, statements, getSale, getStatement, createPayment, updatePayment, deletePayment]
  );

  return <PaymentsContext.Provider value={value}>{children}</PaymentsContext.Provider>;
}

function usePaymentsStore() {
  const context = useContext(PaymentsContext);
  if (context === undefined) {
    throw new Error("usePaymentsStore debe usarse dentro de un PaymentsProvider");
  }
  return context;
}

export {
  PaymentsProvider,
  usePaymentsStore,
  PAYMENT_STATUS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_VARIANTS,
  METHOD_LABELS,
  METHOD_OPTIONS
};
