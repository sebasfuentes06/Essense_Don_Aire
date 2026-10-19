import { api } from "../api";
import { num } from "./formato";

/**
 * Traducción entre la API unificada (español, snake_case) y la forma que
 * usan las pantallas de la web. Un solo lugar: si la API cambia un nombre,
 * se corrige aquí y no en cada componente.
 */

// ------------------------------- Pedidos ------------------------------------

export const ESTADO_PEDIDO = { pendiente: "pending", confirmado: "confirmed", cancelado: "cancelled" };

export function aPedido(p) {
  return {
    id: p.id_pedido,
    folio: p.codigo,
    date: p.fecha,
    customer: p.cliente ?? "",
    customerId: p.id_cliente,
    customerPhone: p.cliente_telefono ?? "",
    customerAddress: p.cliente_direccion ?? "",
    seller: null,
    channel: p.canal,
    status: ESTADO_PEDIDO[p.estado] ?? p.estado,
    subtotal: num(p.total),
    discount: 0,
    total: num(p.total),
    notes: p.notas ?? "",
    address: p.direccion_entrega ?? "",
    saleId: p.id_venta ?? null,
    invoice: p.numero_factura ?? null,
    paymentMethod: p.metodo_pago ?? null,
    paymentReference: p.referencia_pago ?? null,
    hasProof: p.tiene_comprobante === true,
    units: Number(p.unidades ?? (p.items ?? []).reduce((s, i) => s + Number(i.cantidad), 0)),
    items: (p.items ?? []).map((i) => ({
      productId: i.id_producto,
      productName: i.nombre,
      sku: i.sku,
      quantity: Number(i.cantidad),
      unitPrice: num(i.precio_unitario),
      discount: 0,
      subtotal: num(i.subtotal),
      stock: i.stock_actual,
      available: i.disponible !== false
    })),
    hasDetail: Array.isArray(p.items)
  };
}

export const pedidos = {
  listar: async (params) => (await api.todos("/pedidos", params)).map(aPedido),
  obtener: async (id) => aPedido(await api.datos(`/pedidos/${id}`)),
  crear: async (body) => {
    const r = await api.post("/pedidos", body);
    return { pedido: aPedido(r.datos), mensaje: r.mensaje };
  },
  actualizar: async (id, body) => aPedido((await api.put(`/pedidos/${id}`, body)).datos),
  cancelar: async (id, motivo) => aPedido((await api.post(`/pedidos/${id}/cancelar`, { motivo })).datos),
  convertir: async (id, body) => {
    const r = await api.post(`/pedidos/${id}/convertir`, body);
    return { venta: aVenta(r.datos), mensaje: r.mensaje };
  },
  subirComprobante: (id, comprobante) => api.put(`/pedidos/${id}/comprobante`, comprobante)
};

// -------------------------------- Ventas -------------------------------------

export function aPago(p) {
  return {
    id: p.id_pago,
    saleId: p.id_venta,
    invoice: p.numero_factura ?? null,
    customer: p.cliente ?? "",
    customerId: p.id_cliente,
    customerPhone: p.cliente_telefono ?? "",
    amount: num(p.monto),
    method: p.metodo,
    reference: p.referencia ?? "",
    note: p.nota ?? "",
    status: p.estado, // aplicado | anulado | pendiente | rechazado
    rejectReason: p.motivo_rechazo ?? "",
    hasProof: p.tiene_comprobante === true,
    date: p.fecha
  };
}

export function aVenta(v) {
  return {
    id: v.id_venta,
    invoice: v.numero_factura,
    date: v.fecha,
    channel: v.canal,
    status: v.estado, // confirmada | anulada
    paymentStatus: v.estado === "anulada" ? "anulada" : v.estado_pago, // pendiente | parcial | pagada
    paymentMethod: v.metodo_pago ?? null,
    subtotal: num(v.subtotal),
    discount: num(v.descuento),
    total: num(v.total),
    paid: num(v.pagado),
    balance: num(v.saldo),
    customer: v.cliente ?? "",
    customerId: v.id_cliente,
    customerPhone: v.cliente_telefono ?? "",
    customerEmail: v.cliente_correo ?? "",
    customerAddress: [v.cliente_direccion, v.cliente_ciudad].filter(Boolean).join(", "),
    customerDocument: v.cliente_documento ?? "",
    orderId: v.id_pedido ?? null,
    orderCode: v.pedido_codigo ?? null,
    seller: v.vendedor ?? null,
    notes: v.notas ?? "",
    cancelReason: v.motivo_anulacion ?? "",
    units: Number(v.unidades ?? 0),
    items: (v.items ?? []).map((i) => ({
      productId: i.id_producto,
      productName: i.nombre,
      sku: i.sku,
      quantity: Number(i.cantidad),
      unitPrice: num(i.precio_unitario),
      subtotal: num(i.subtotal)
    })),
    payments: (v.pagos ?? []).map(aPago),
    wompiLinks: (v.wompi_links ?? []).map((l) => ({
      id: l.id_link,
      amount: num(l.monto),
      url: l.url,
      status: l.estado,
      createdAt: l.creado_en,
      expiresAt: l.expira_en
    })),
    hasDetail: Array.isArray(v.items)
  };
}

export const ventas = {
  listar: async (params) => (await api.todos("/ventas", params)).map(aVenta),
  obtener: async (id) => aVenta(await api.datos(`/ventas/${id}`)),
  crear: async (body) => {
    const r = await api.post("/ventas", body);
    return { venta: aVenta(r.datos), mensaje: r.mensaje };
  },
  anular: async (id, motivo) => {
    const r = await api.post(`/ventas/${id}/anular`, { motivo });
    return { venta: aVenta(r.datos), mensaje: r.mensaje };
  }
};

// -------------------------------- Pagos --------------------------------------

export const pagos = {
  listar: async (params) => (await api.todos("/pagos", params)).map(aPago),
  registrar: async (body) => {
    const r = await api.post("/pagos", body);
    return { pago: aPago(r.datos.pago), mensaje: r.mensaje };
  },
  aprobar: async (id) => (await api.post(`/pagos/${id}/aprobar`)).mensaje,
  rechazar: async (id, motivo) => (await api.post(`/pagos/${id}/rechazar`, { motivo })).mensaje,
  anular: async (id, motivo) => (await api.post(`/pagos/${id}/anular`, { motivo })).mensaje,
  subirComprobante: (id, comprobante) => api.put(`/pagos/${id}/comprobante`, comprobante),
  pendientes: () => api.datos("/pagos/pendientes"),
  datosPago: async () => {
    try {
      return (await api.datos("/pagos/datos-pago")) ?? {};
    } catch {
      return {};
    }
  },
  linkWompi: async (idVenta, monto) => (await api.post("/pagos/wompi/links", { id_venta: idVenta, monto })).datos,
  verificarWompi: async (idTransaccion) => (await api.post("/pagos/wompi/verificar", { id_transaccion: idTransaccion })).mensaje
};

// ------------------------------- Clientes ------------------------------------

export function aCliente(c) {
  return {
    id: c.id_cliente,
    name: c.nombre ?? "",
    email: c.correo ?? "",
    phone: c.telefono ?? "",
    address: c.direccion ?? "",
    city: c.ciudad ?? "",
    documentType: c.tipo_documento ?? "",
    document: c.documento ?? "",
    notes: c.notas ?? "",
    active: c.estado !== false,
    registeredAt: c.fecha_registro ?? null,
    lastPurchase: c.ultima_compra ?? null,
    purchases: Number(c.compras ?? 0),
    balance: num(c.saldo_pendiente),
    raw: c
  };
}

export const clientes = {
  listar: async (params) => (await api.todos("/clientes", params)).map(aCliente),
  obtener: async (id) => aCliente(await api.datos(`/clientes/${id}`)),
  crear: async (body) => aCliente((await api.post("/clientes", body)).datos),
  actualizar: async (id, body) => aCliente((await api.put(`/clientes/${id}`, body)).datos),
  eliminar: (id) => api.delete(`/clientes/${id}`),
  estadoCuenta: (id) => api.datos(`/clientes/${id}/estado-cuenta`),
  historial: (id) => api.datos(`/clientes/${id}/historial`)
};
