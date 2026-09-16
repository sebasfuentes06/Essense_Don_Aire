-- ============================================================
-- PARCHE 01 — vistas de proveedores y roles, y nombre único de proveedor
-- ============================================================
--
-- Para qué es: `data_base.sql` crea la base desde cero y borra lo que haya.
-- Este parche aplica los mismos cambios sobre una base que YA existe y tiene
-- datos, sin tocar ni una fila.
--
--     psql -U postgres -d essence_don_aire -f Database/parche_01_proveedores_y_roles.sql
--
-- Se puede correr varias veces sin problema.
--
-- Qué corrige:
--
-- 1. vw_frontend_proveedores multiplicaba "Total comprado".
--    Unía `compras` y `productos` en el mismo FROM. Son dos tablas
--    independientes que cuelgan del mismo proveedor, así que PostgreSQL
--    devolvía el producto cruzado: 2 compras × 2 productos = 4 filas, y cada
--    compra entraba dos veces en el SUM. Un proveedor con dos compras de
--    $100.000 reportaba $400.000.
--
-- 2. vw_frontend_roles repetía los permisos.
--    Mismo error de forma, distinto síntoma: une `rol_permiso` y `usuarios`,
--    y array_agg (sin DISTINCT) devolvía cada permiso una vez por usuario del
--    rol. Vendedor tiene 29 permisos y 2 usuarios: la vista entregaba 58
--    entradas. Las casillas del formulario igual salían bien marcadas, pero
--    el contador decía "58 de 56 permisos seleccionados".
--
-- 3. proveedores.nombre no era único.
--    Dos proveedores con el mismo nombre son indistinguibles en la tabla y en
--    los selectores de Productos y Compras. Además `npm run seed:demo` decía
--    ser idempotente apoyándose en un ON CONFLICT DO NOTHING que no tenía
--    ningún UNIQUE contra el cual chocar: cada corrida insertaba tres copias.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Proveedores: cada agregado en su propia subconsulta
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW vw_frontend_proveedores AS
SELECT
    p.id_proveedor AS id,
    p.nombre AS name,
    p.contacto AS contact,
    p.email,
    p.telefono AS phone,
    p.ciudad AS city,
    p.calificacion::NUMERIC(2,1) AS rating,
    p.cantidad_resenas AS reviews,
    CASE WHEN p.estado THEN 'active' ELSE 'inactive' END AS status,
    p.fecha_alta AS since,
    compra."totalOrders",
    compra."totalSpent",
    prod."totalProducts"
FROM proveedores p
LEFT JOIN LATERAL (
    SELECT COUNT(*)::INT AS "totalOrders",
           COALESCE(SUM(c.total), 0)::NUMERIC(12,2) AS "totalSpent"
      FROM compras c
     WHERE c.id_proveedor = p.id_proveedor
) compra ON TRUE
LEFT JOIN LATERAL (
    SELECT COUNT(*)::INT AS "totalProducts"
      FROM productos pr
     WHERE pr.id_proveedor = p.id_proveedor
) prod ON TRUE;

-- ------------------------------------------------------------
-- 2. Roles: permisos sin repetir
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW vw_frontend_roles AS
SELECT
    r.id_rol AS id,
    r.nombre AS name,
    r.descripcion AS description,
    COALESCE(array_agg(DISTINCT rp.id_permiso) FILTER (WHERE rp.id_permiso IS NOT NULL), '{}') AS permissions,
    COUNT(DISTINCT u.id_usuario)::INT AS "usersCount",
    CASE WHEN r.estado THEN 'active' ELSE 'inactive' END AS status,
    r.created_at AS "createdAt"
FROM roles r
LEFT JOIN rol_permiso rp ON rp.id_rol = r.id_rol
LEFT JOIN usuarios u ON u.id_rol = r.id_rol
GROUP BY r.id_rol;

-- ------------------------------------------------------------
-- 3. Nombre de proveedor único
-- ------------------------------------------------------------
-- Si ya hay nombres repetidos (por haber corrido seed:demo más de una vez),
-- la restricción no se puede crear. En ese caso el parche NO borra nada por
-- su cuenta —alguno de los duplicados puede tener productos o compras
-- colgando— sino que avisa cuáles son para que se revisen a mano.
DO $$
DECLARE
    repetidos TEXT;
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_proveedores_nombre') THEN
        RAISE NOTICE 'El nombre de proveedor ya era único. Nada que hacer.';
        RETURN;
    END IF;

    SELECT string_agg(nombre, ', ') INTO repetidos
      FROM (SELECT nombre FROM proveedores GROUP BY nombre HAVING COUNT(*) > 1) d;

    IF repetidos IS NOT NULL THEN
        RAISE NOTICE '--------------------------------------------------------------';
        RAISE NOTICE 'No se pudo crear la restricción: hay proveedores repetidos.';
        RAISE NOTICE 'Nombres duplicados: %', repetidos;
        RAISE NOTICE 'Revisa cuál copia conservar (mira si alguna tiene productos o';
        RAISE NOTICE 'compras asociadas), borra las sobrantes y vuelve a correr esto.';
        RAISE NOTICE '--------------------------------------------------------------';
        RETURN;
    END IF;

    ALTER TABLE proveedores ADD CONSTRAINT uq_proveedores_nombre UNIQUE (nombre);
    RAISE NOTICE 'Listo: proveedores.nombre ahora es único.';
END $$;

-- ------------------------------------------------------------
-- Comprobación
-- ------------------------------------------------------------
SELECT id, name, "totalOrders", "totalSpent", "totalProducts"
  FROM vw_frontend_proveedores
 ORDER BY id;

SELECT name AS rol,
       array_length(permissions, 1) AS "permisos en la vista",
       (SELECT COUNT(*) FROM rol_permiso rp WHERE rp.id_rol = v.id) AS "permisos reales"
  FROM vw_frontend_roles v
 ORDER BY id;
