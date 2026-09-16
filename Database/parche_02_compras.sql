-- ============================================================
-- PARCHE 02 — los abonos de la vista de compras
-- ============================================================
--
--     cd backend
--     npm run db:sql -- ../Database/parche_02_compras.sql
--
-- Se puede correr varias veces sin problema. No toca ni una fila de datos:
-- solo reemplaza la definición de la vista.
--
-- Qué corrige:
--
-- `vw_frontend_compras` armaba la lista de abonos con json_agg(pc.*), que
-- devuelve las columnas crudas de la tabla: id_pago, id_metodo_pago, monto,
-- fecha_pago. Dos problemas con eso:
--
--   1. El método de pago llegaba como un número. Para mostrar "Transferencia"
--      el frontend tendría que pedir aparte el catálogo de métodos y cruzarlo
--      a mano, teniendo la base ese nombre a un JOIN de distancia.
--
--   2. Las llaves no coinciden con las que usa el resto de la vista, que ya
--      viene en inglés (items trae productName, quantity, unitCost). Mezclar
--      los dos idiomas en el mismo objeto obliga a recordar cuál es cuál en
--      cada componente.
--
-- Ahora los abonos salen como {id, date, amount, method, methodCode,
-- reference}, ordenados del más viejo al más nuevo, que es como se lee un
-- historial de pagos.
-- ============================================================

CREATE OR REPLACE VIEW vw_frontend_compras AS
SELECT
    c.id_compra AS id,
    c.folio,
    c.fecha_compra AS date,
    c.id_proveedor AS "supplierId",
    p.nombre AS "supplierName",
    c.subtotal,
    c.impuesto AS tax,
    c.total,
    c.pagado AS paid,
    c.saldo AS balance,
    c.estado AS status,
    COALESCE(json_agg(json_build_object(
        'productId', dc.id_producto,
        'productName', pr.nombre,
        'quantity', dc.cantidad,
        'unitCost', dc.precio_costo,
        'subtotal', dc.subtotal
    )) FILTER (WHERE dc.id_detalle_compra IS NOT NULL), '[]'::json) AS items,
    COALESCE((
        SELECT json_agg(json_build_object(
            'id', pc.id_pago,
            'date', pc.fecha_pago,
            'amount', pc.monto,
            'method', mp.nombre,
            'methodCode', mp.codigo,
            'reference', pc.referencia
        ) ORDER BY pc.fecha_pago, pc.id_pago)
        FROM pagos_compra pc
        JOIN metodo_pago mp ON mp.id_metodo_pago = pc.id_metodo_pago
        WHERE pc.id_compra = c.id_compra
    ), '[]'::json) AS payments
FROM compras c
JOIN proveedores p ON p.id_proveedor = c.id_proveedor
LEFT JOIN detalle_compra dc ON dc.id_compra = c.id_compra
LEFT JOIN productos pr ON pr.id_producto = dc.id_producto
GROUP BY c.id_compra, p.nombre;

-- ------------------------------------------------------------
-- Comprobación
-- ------------------------------------------------------------
SELECT folio, status, total, paid, balance, payments
  FROM vw_frontend_compras
 ORDER BY id
 LIMIT 5;
