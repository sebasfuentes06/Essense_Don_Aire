import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth";
import { pedidos } from "../negocio/servicios";

/**
 * Pedidos, contra la API unificada (los mismos de la app móvil).
 *
 * Vive en un contexto porque el pedido se crea desde el Catálogo/carrito y se
 * consulta desde el módulo Pedidos y el inicio del cliente. La API ya filtra
 * por rol: un Cliente solo recibe sus pedidos.
 */

const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled"
};

const STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: "Pendiente",
  [ORDER_STATUS.CONFIRMED]: "Confirmado",
  [ORDER_STATUS.CANCELLED]: "Cancelado"
};

const STATUS_VARIANTS = {
  [ORDER_STATUS.PENDING]: "warning",
  [ORDER_STATUS.CONFIRMED]: "success",
  [ORDER_STATUS.CANCELLED]: "danger"
};

const CHANNEL_LABELS = {
  app: "App / Web",
  whatsapp: "WhatsApp",
  punto_fisico: "Punto físico"
};

const OrdersContext = createContext(undefined);

function OrdersProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }
    setIsLoading(true);
    try {
      setOrders(await pedidos.listar());
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Se cargan al entrar (y se limpian al salir o cambiar de usuario).
  useEffect(() => {
    reload();
  }, [reload, user?.id]);

  /** Reemplaza (o agrega) un pedido en la lista sin volver a pedir todo. */
  const upsert = useCallback((pedido) => {
    setOrders((prev) => (prev.some((o) => o.id === pedido.id) ? prev.map((o) => (o.id === pedido.id ? { ...o, ...pedido } : o)) : [pedido, ...prev]));
    return pedido;
  }, []);

  const fetchOrder = useCallback(async (id) => upsert(await pedidos.obtener(id)), [upsert]);

  /** body: { id_cliente?, canal?, metodo_pago, items, direccion_entrega?, notas?, comprobante?, referencia_pago? } */
  const createOrder = useCallback(async (body) => {
    const { pedido, mensaje } = await pedidos.crear(body);
    upsert(pedido);
    return { order: pedido, message: mensaje };
  }, [upsert]);

  const updateOrder = useCallback(async (id, body) => upsert(await pedidos.actualizar(id, body)), [upsert]);
  const cancelOrder = useCallback(async (id, motivo) => upsert(await pedidos.cancelar(id, motivo)), [upsert]);

  /** body: { metodo_pago, descuento?, pago_inicial? } -> la venta creada */
  const convertToSale = useCallback(async (id, body) => {
    const r = await pedidos.convertir(id, body);
    await fetchOrder(id);
    return r;
  }, [fetchOrder]);

  const uploadProof = useCallback(async (id, comprobante) => {
    await pedidos.subirComprobante(id, comprobante);
    return fetchOrder(id);
  }, [fetchOrder]);

  const value = useMemo(
    () => ({ orders, isLoading, error, reload, fetchOrder, createOrder, updateOrder, cancelOrder, convertToSale, uploadProof }),
    [orders, isLoading, error, reload, fetchOrder, createOrder, updateOrder, cancelOrder, convertToSale, uploadProof]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

function useOrdersStore() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error("useOrdersStore debe usarse dentro de un OrdersProvider");
  }
  return context;
}

export { OrdersProvider, useOrdersStore, ORDER_STATUS, STATUS_LABELS, STATUS_VARIANTS, CHANNEL_LABELS };
