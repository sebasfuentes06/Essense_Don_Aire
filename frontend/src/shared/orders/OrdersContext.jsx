import { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * Store de pedidos.
 *
 * Vive en un contexto (y no dentro de un hook de pantalla) porque el pedido
 * se crea desde el Catálogo y se consulta desde el módulo Pedidos: los dos
 * necesitan la misma lista. Cuando exista el backend, cada función de aquí
 * se convierte en una llamada a la API y los componentes no cambian.
 *
 * La forma de cada pedido replica la vista `vw_frontend_pedidos` del script
 * de base de datos (Database/data_base.sql).
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
  web: "Web",
  whatsapp: "WhatsApp",
  fisico: "Punto físico"
};

const mockOrders = [
  {
    id: 1, folio: "PED-001", date: "2024-06-01", deliveryDate: "2024-06-05",
    customer: "Laura Cliente", seller: "Carlos Vendedor", channel: "web",
    items: [
      { productId: 1, productName: "Essence Royale", quantity: 1, unitPrice: 89.99, discount: 0, subtotal: 89.99 },
      { productId: 4, productName: "Velvet Rose", quantity: 2, unitPrice: 69.99, discount: 0, subtotal: 139.98 }
    ],
    subtotal: 229.97, discount: 0, total: 229.97,
    notes: "Entregar en la tarde.",
    status: ORDER_STATUS.PENDING, saleId: null
  },
  {
    id: 2, folio: "PED-002", date: "2024-05-30", deliveryDate: "2024-06-02",
    customer: "Ana Martínez", seller: "Carlos Vendedor", channel: "fisico",
    items: [
      { productId: 2, productName: "Noir Elegance", quantity: 1, unitPrice: 74.99, discount: 0, subtotal: 74.99 }
    ],
    subtotal: 74.99, discount: 0, total: 74.99,
    notes: "",
    status: ORDER_STATUS.CONFIRMED, saleId: 1
  },
  {
    id: 3, folio: "PED-003", date: "2024-06-02", deliveryDate: null,
    customer: "Laura Cliente", seller: null, channel: "web",
    items: [
      { productId: 3, productName: "Golden Mist", quantity: 1, unitPrice: 79.99, discount: 0, subtotal: 79.99 }
    ],
    subtotal: 79.99, discount: 0, total: 79.99,
    notes: "Pedido hecho desde el catálogo, sin vendedor asignado.",
    status: ORDER_STATUS.PENDING, saleId: null
  },
  {
    id: 4, folio: "PED-004", date: "2024-05-28", deliveryDate: null,
    customer: "Carlos Rodríguez", seller: "María Vendedora", channel: "whatsapp",
    items: [
      { productId: 6, productName: "Midnight Dream", quantity: 3, unitPrice: 84.99, discount: 0, subtotal: 254.97 }
    ],
    subtotal: 254.97, discount: 0, total: 254.97,
    notes: "El cliente canceló por teléfono.",
    status: ORDER_STATUS.CANCELLED, saleId: null
  },
  {
    id: 5, folio: "PED-005", date: "2024-06-01", deliveryDate: "2024-06-06",
    customer: "María González", seller: "María Vendedora", channel: "whatsapp",
    items: [
      { productId: 1, productName: "Essence Royale", quantity: 2, unitPrice: 89.99, discount: 10, subtotal: 169.98 }
    ],
    subtotal: 179.98, discount: 10, total: 169.98,
    notes: "",
    status: ORDER_STATUS.CONFIRMED, saleId: null
  }
];

const OrdersContext = createContext(undefined);

/** Suma los subtotales de una lista de items. */
function sumItems(items) {
  return items.reduce((total, item) => total + item.subtotal, 0);
}

function nextFolio(orders) {
  const numbers = orders
    .map((order) => Number(String(order.folio).replace("PED-", "")))
    .filter((value) => Number.isFinite(value));
  const next = (numbers.length ? Math.max(...numbers) : 0) + 1;
  return `PED-${String(next).padStart(3, "0")}`;
}

function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(mockOrders);

  /**
   * Crea un pedido. `seller` va en null cuando lo genera el propio cliente
   * desde el catálogo: queda pendiente de que un vendedor lo tome.
   */
  const createOrder = useCallback(({ customer, seller = null, items, channel = "web", notes = "", deliveryDate = null, discount = 0 }) => {
    const normalized = items.map((item) => ({
      productId: item.productId ?? item.id,
      productName: item.productName ?? item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice ?? item.price,
      discount: item.discount ?? 0,
      subtotal: Number((((item.unitPrice ?? item.price) * item.quantity) - (item.discount ?? 0)).toFixed(2))
    }));

    const subtotal = Number(sumItems(normalized).toFixed(2));
    let created;

    setOrders((prev) => {
      created = {
        id: Date.now(),
        folio: nextFolio(prev),
        date: new Date().toISOString().slice(0, 10),
        deliveryDate,
        customer,
        seller,
        channel,
        items: normalized,
        subtotal,
        discount,
        total: Number((subtotal - discount).toFixed(2)),
        notes,
        status: ORDER_STATUS.PENDING,
        saleId: null
      };
      return [created, ...prev];
    });

    return created;
  }, []);

  const updateOrder = useCallback((id, changes) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, ...changes } : order)));
  }, []);

  const setOrderStatus = useCallback((id, status) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)));
  }, []);

  const cancelOrder = useCallback((id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id && order.status === ORDER_STATUS.PENDING
          ? { ...order, status: ORDER_STATUS.CANCELLED }
          : order
      )
    );
  }, []);

  const deleteOrder = useCallback((id) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  }, []);

  /**
   * Convierte el pedido en venta. En la BD esto llena `pedidos.id_venta`;
   * aquí simulamos el id que devolvería el backend.
   */
  const convertToSale = useCallback((id, seller = null) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id && order.status !== ORDER_STATUS.CANCELLED && !order.saleId
          ? {
              ...order,
              status: ORDER_STATUS.CONFIRMED,
              seller: order.seller ?? seller,
              saleId: Date.now()
            }
          : order
      )
    );
  }, []);

  const value = useMemo(
    () => ({ orders, createOrder, updateOrder, setOrderStatus, cancelOrder, deleteOrder, convertToSale }),
    [orders, createOrder, updateOrder, setOrderStatus, cancelOrder, deleteOrder, convertToSale]
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

export {
  OrdersProvider,
  useOrdersStore,
  ORDER_STATUS,
  STATUS_LABELS,
  STATUS_VARIANTS,
  CHANNEL_LABELS
};
