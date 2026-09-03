-- ============================================================
-- ESSENCE DON AIRE - Script de creación de base de datos (v3)
-- Motor: PostgreSQL (pgAdmin 4)
-- Esquema corregido para que concuerde 100% con el frontend
-- (React) ya construido: Admin -> Dashboard, Catálogo, Productos,
-- Categorías, Ventas, Clientes, Proveedores, Compras, Usuarios, Roles.
--
-- Cambios respecto a la v2, y por qué:
--   - Se agregó `sku` a productos (el frontend lo usa como
--     identificador visible en toda la tabla de Productos).
--   - Se eliminó `marcas` y `presentaciones`: el frontend no tiene
--     ningún módulo ni campo para marca o presentación; los
--     productos se relacionan directo con proveedor.
--   - Se eliminaron `modulos`, `privilegios`, `rol_modulo`: el
--     frontend maneja permisos como una lista plana de ~7 permisos
--     por rol (no una matriz módulo x privilegio). Se reemplaza por
--     `permisos` + `rol_permiso`, que sí calza con eso.
--   - Se eliminó `tipo_documento`: ningún formulario del frontend
--     (Usuarios ni Clientes) pide tipo/número de documento.
--   - Se eliminaron `pedidos` y `detalle_pedido`: el panel admin no
--     tiene un módulo de "Pedidos" separado de Ventas.
--   - Se eliminó `campanas`: no hay módulo de campañas en el
--     frontend.
--   - `proveedores` gana `contacto`, `ciudad`, `calificacion` y
--     `fecha_alta`: se editan y se muestran en la pantalla de
--     Proveedores.
--   - `usuarios` se ajustó para servir tanto a Usuarios (staff)
--     como Clientes (el frontend ya los trata como el mismo tipo
--     de entidad, diferenciados por rol): un solo campo `nombre`
--     (el frontend no separa nombre/apellido), + `ciudad` y
--     `ultimo_acceso`/`ultima_compra`.
--   - `compras` gana `folio`, `impuesto`, `pagado`, `saldo`, y su
--     `estado` pasa de boolean a texto con 4 valores
--     (pending/partial/paid/cancelled), tal como lo usa
--     PurchasesTable.jsx.
--   - `ventas` gana `folio` y un `estado` de texto con 3 valores
--     (completed/pending/cancelled), tal como lo usa
--     SalesTable.jsx. Se quitó `id_pedido` (ya no existe pedidos).
--   - Se agregó `pagos_compra` (simétrica a `pagos_ventas`), porque
--     el mock de compras ya trae un arreglo `payments` pensado para
--     esto.
--
-- Si más adelante agregas módulos de Marca, Presentación, Pedidos
-- o Campañas en el frontend, esas tablas se pueden volver a agregar
-- sin tocar el resto del esquema.
-- ============================================================

-- ============================================================
-- 1. SEGURIDAD Y ACCESOS
-- ============================================================

CREATE TABLE roles (
    id_rol          SERIAL PRIMARY KEY,
    nombre          VARCHAR(50) NOT NULL,
    descripcion     VARCHAR(200),
    estado          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Catálogo fijo de permisos, igual a `availablePermissions` en
-- useRoles.jsx (id, name, description, module).
CREATE TABLE permisos (
    id_permiso      VARCHAR(50) PRIMARY KEY,   -- ej. 'products.view'
    nombre          VARCHAR(100) NOT NULL,     -- ej. 'Ver Productos'
    descripcion     VARCHAR(200),
    modulo          VARCHAR(50) NOT NULL       -- ej. 'Productos'
);

-- Relación rol <-> permisos (permissions: string[] en mockRoles)
CREATE TABLE rol_permiso (
    id_rol_permiso  SERIAL PRIMARY KEY,
    id_rol          INT NOT NULL,
    id_permiso      VARCHAR(50) NOT NULL,
    CONSTRAINT uq_rol_permiso
        UNIQUE (id_rol, id_permiso),
    CONSTRAINT fk_rolpermiso_roles
        FOREIGN KEY (id_rol) REFERENCES roles (id_rol)
        ON DELETE CASCADE,
    CONSTRAINT fk_rolpermiso_permisos
        FOREIGN KEY (id_permiso) REFERENCES permisos (id_permiso)
        ON DELETE CASCADE
);

-- ============================================================
-- 2. TABLAS MAESTRAS
-- ============================================================

CREATE TABLE categorias (
    id_categoria    SERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    descripcion     VARCHAR(200),
    estado          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    -- productCount (Categories.jsx) NO se guarda aquí: se calcula
    -- con COUNT(*) sobre productos agrupado por id_categoria.
);

CREATE TABLE metodo_pago (
    id_metodo_pago  SERIAL PRIMARY KEY,
    nombre          VARCHAR(50) NOT NULL,      -- Efectivo/Tarjeta/Transferencia/Mixto
    codigo          VARCHAR(20) NOT NULL UNIQUE, -- cash/card/transfer/mixed (coincide con el frontend)
    estado          BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================
-- 3. PROVEEDORES
-- ============================================================

CREATE TABLE proveedores (
    id_proveedor    SERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    contacto        VARCHAR(100),               -- SupplierFormModal: "contact"
    email           VARCHAR(100),
    telefono        VARCHAR(20),
    ciudad          VARCHAR(100),                -- SupplierFormModal: "city"
    calificacion    NUMERIC(2,1) NOT NULL DEFAULT 0, -- SupplierStats: "rating" (0.0 - 5.0)
    cantidad_resenas INT NOT NULL DEFAULT 0,
    fecha_alta      DATE NOT NULL DEFAULT CURRENT_DATE, -- "since"
    estado          BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT chk_proveedores_calificacion CHECK (calificacion BETWEEN 0 AND 5),
    CONSTRAINT chk_proveedores_resenas CHECK (cantidad_resenas >= 0)
    -- totalOrders y totalSpent (SupplierTable) NO se guardan aquí:
    -- se calculan agregando compras por id_proveedor.
);

-- ============================================================
-- 4. USUARIOS (incluye staff y clientes, diferenciados por id_rol)
-- ============================================================

CREATE TABLE usuarios (
    id_usuario        SERIAL PRIMARY KEY,
    id_rol            INT NOT NULL,
    nombre            VARCHAR(150) NOT NULL,    -- un solo campo, como en UserFormModal/CustomerFormModal
    correo            VARCHAR(100) NOT NULL UNIQUE,
    contrasena        VARCHAR(255) NOT NULL,
    telefono          VARCHAR(20),
    direccion         VARCHAR(150),             -- usado por clientes (CustomerFormModal: "address")
    ciudad            VARCHAR(100),             -- usado por clientes (CustomerFormModal: "city")
    estado            BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_registro    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- "joinDate"
    ultimo_acceso     TIMESTAMP,                -- UserTable: "lastLogin" (staff)
    ultima_compra     TIMESTAMP,                -- CustomerTable: "lastPurchase" (clientes)
    CONSTRAINT fk_usuarios_roles
        FOREIGN KEY (id_rol) REFERENCES roles (id_rol)
    -- totalSpent y totalPurchases (CustomerTable) NO se guardan
    -- aquí: se calculan agregando ventas por id_cliente.
);

-- ============================================================
-- 5. PRODUCTOS Y RELACIONADOS
-- ============================================================

CREATE TABLE productos (
    id_producto     SERIAL PRIMARY KEY,
    id_categoria    INT NOT NULL,
    id_proveedor    INT NOT NULL,
    sku             VARCHAR(30) NOT NULL UNIQUE,  -- ProductTable/ProductFormModal: "sku"
    nombre          VARCHAR(100) NOT NULL,
    descripcion     VARCHAR(250),
    precio          NUMERIC(12,2) NOT NULL DEFAULT 0, -- ProductFormModal: "price"
    stock           INT NOT NULL DEFAULT 0,
    stock_minimo    INT NOT NULL DEFAULT 0,       -- "minStock" (alerta de stock bajo)
    estado          BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_productos_categorias
        FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria),
    CONSTRAINT fk_productos_proveedores
        FOREIGN KEY (id_proveedor) REFERENCES proveedores (id_proveedor),
    CONSTRAINT chk_productos_precio CHECK (precio >= 0),
    CONSTRAINT chk_productos_stock CHECK (stock >= 0),
    CONSTRAINT chk_productos_stock_minimo CHECK (stock_minimo >= 0)
);

-- Coincide con "images: []" en el mock de productos
CREATE TABLE imagenes_producto (
    id_imagen       SERIAL PRIMARY KEY,
    id_producto     INT NOT NULL,
    ruta_imagen     VARCHAR(255) NOT NULL,
    orden           INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_imagenes_productos
        FOREIGN KEY (id_producto) REFERENCES productos (id_producto)
        ON DELETE CASCADE
);

-- ============================================================
-- 6. COMPRAS (a proveedores)
-- ============================================================

CREATE TABLE compras (
    id_compra       SERIAL PRIMARY KEY,
    folio           VARCHAR(20) NOT NULL UNIQUE,  -- PurchasesTable: "OC-001"
    id_proveedor    INT NOT NULL,
    id_usuario      INT NOT NULL,
    fecha_compra    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    subtotal        NUMERIC(12,2) NOT NULL DEFAULT 0,
    impuesto        NUMERIC(12,2) NOT NULL DEFAULT 0,  -- "tax"
    total           NUMERIC(12,2) NOT NULL DEFAULT 0,
    pagado          NUMERIC(12,2) NOT NULL DEFAULT 0,  -- "paid"
    saldo           NUMERIC(12,2) NOT NULL DEFAULT 0,  -- "balance"
    estado          VARCHAR(20) NOT NULL DEFAULT 'pending',
    CONSTRAINT chk_compras_estado
        CHECK (estado IN ('pending', 'partial', 'paid', 'cancelled')), -- PurchasesTable.statusConfig
    CONSTRAINT fk_compras_proveedores
        FOREIGN KEY (id_proveedor) REFERENCES proveedores (id_proveedor),
    CONSTRAINT fk_compras_usuarios
        FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
);

CREATE TABLE detalle_compra (
    id_detalle_compra SERIAL PRIMARY KEY,
    id_compra         INT NOT NULL,
    id_producto       INT NOT NULL,
    cantidad          INT NOT NULL,
    precio_costo      NUMERIC(12,2) NOT NULL,   -- "unitCost"
    subtotal          NUMERIC(12,2) NOT NULL,
    CONSTRAINT fk_detcompra_compras
        FOREIGN KEY (id_compra) REFERENCES compras (id_compra)
        ON DELETE CASCADE,
    CONSTRAINT fk_detcompra_productos
        FOREIGN KEY (id_producto) REFERENCES productos (id_producto),
    CONSTRAINT chk_detcompra_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_detcompra_precio CHECK (precio_costo >= 0),
    CONSTRAINT chk_detcompra_subtotal CHECK (subtotal >= 0)
);

-- Coincide con "payments: []" en mockPurchases (pagos parciales a proveedor)
CREATE TABLE pagos_compra (
    id_pago         SERIAL PRIMARY KEY,
    id_compra       INT NOT NULL,
    id_metodo_pago  INT NOT NULL,
    fecha_pago      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    monto           NUMERIC(12,2) NOT NULL,
    referencia      VARCHAR(100),
    CONSTRAINT fk_pagoscompra_compras
        FOREIGN KEY (id_compra) REFERENCES compras (id_compra)
        ON DELETE CASCADE,
    CONSTRAINT fk_pagoscompra_metodopago
        FOREIGN KEY (id_metodo_pago) REFERENCES metodo_pago (id_metodo_pago)
);

-- ============================================================
-- 7. VENTAS Y PAGOS
-- ============================================================

CREATE TABLE ventas (
    id_venta           SERIAL PRIMARY KEY,
    folio              VARCHAR(20) NOT NULL UNIQUE,  -- SalesTable: "VTA-001"
    id_cliente         INT NOT NULL,
    id_usuario         INT NOT NULL,                 -- vendedor ("seller")
    id_metodo_pago     INT,
    fecha_venta        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    subtotal           NUMERIC(12,2) NOT NULL DEFAULT 0,
    descuento          NUMERIC(12,2) NOT NULL DEFAULT 0,
    total              NUMERIC(12,2) NOT NULL DEFAULT 0,
    estado             VARCHAR(20) NOT NULL DEFAULT 'completed',
    fecha_finalizacion TIMESTAMP,
    CONSTRAINT chk_ventas_estado
        CHECK (estado IN ('completed', 'pending', 'cancelled')), -- SalesTable.statusLabels
    CONSTRAINT fk_ventas_cliente
        FOREIGN KEY (id_cliente) REFERENCES usuarios (id_usuario),
    CONSTRAINT fk_ventas_usuarios
        FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
    CONSTRAINT fk_ventas_metodopago
        FOREIGN KEY (id_metodo_pago) REFERENCES metodo_pago (id_metodo_pago)
);

CREATE TABLE detalle_venta (
    id_detalle_venta SERIAL PRIMARY KEY,
    id_venta         INT NOT NULL,
    id_producto      INT NOT NULL,
    cantidad         INT NOT NULL,
    precio_unitario  NUMERIC(12,2) NOT NULL,
    descuento        NUMERIC(12,2) NOT NULL DEFAULT 0,
    subtotal         NUMERIC(12,2) NOT NULL,
    CONSTRAINT fk_detventa_ventas
        FOREIGN KEY (id_venta) REFERENCES ventas (id_venta)
        ON DELETE CASCADE,
    CONSTRAINT fk_detventa_productos
        FOREIGN KEY (id_producto) REFERENCES productos (id_producto),
    CONSTRAINT chk_detventa_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_detventa_precio CHECK (precio_unitario >= 0),
    CONSTRAINT chk_detventa_descuento CHECK (descuento >= 0),
    CONSTRAINT chk_detventa_subtotal CHECK (subtotal >= 0)
);

CREATE TABLE pagos_ventas (
    id_pago         SERIAL PRIMARY KEY,
    id_venta        INT NOT NULL,
    id_metodo_pago  INT NOT NULL,
    fecha_pago      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    monto           NUMERIC(12,2) NOT NULL,
    referencia      VARCHAR(100),
    CONSTRAINT fk_pagos_ventas
        FOREIGN KEY (id_venta) REFERENCES ventas (id_venta)
        ON DELETE CASCADE,
    CONSTRAINT fk_pagos_metodopago
        FOREIGN KEY (id_metodo_pago) REFERENCES metodo_pago (id_metodo_pago)
);

-- ============================================================
-- 8. DATOS SEMILLA (catálogos que el frontend espera encontrar)
-- ============================================================

INSERT INTO roles (nombre, descripcion, estado) VALUES
    ('Administrador', 'Acceso completo a todas las funcionalidades del sistema', TRUE),
    ('Vendedor', 'Acceso a ventas, productos y clientes', TRUE),
    ('Supervisor', 'Acceso a reportes y supervisión', TRUE),
    ('Cliente', 'Cuenta de cliente de la tienda', TRUE);

INSERT INTO permisos (id_permiso, nombre, descripcion, modulo) VALUES
    ('dashboard.view',  'Ver Dashboard',      'Acceso al panel principal',        'Dashboard'),
    ('products.view',   'Ver Productos',      'Ver listado de productos',         'Productos'),
    ('products.create', 'Crear Productos',    'Crear nuevos productos',           'Productos'),
    ('products.edit',   'Editar Productos',   'Modificar productos existentes',   'Productos'),
    ('sales.view',      'Ver Ventas',         'Ver historial de ventas',          'Ventas'),
    ('customers.view',  'Ver Clientes',       'Ver listado de clientes',          'Clientes'),
    ('users.view',      'Ver Usuarios',       'Ver listado de usuarios',          'Usuarios');

-- Administrador: todos los permisos
INSERT INTO rol_permiso (id_rol, id_permiso)
    SELECT (SELECT id_rol FROM roles WHERE nombre = 'Administrador'), id_permiso FROM permisos;

-- Vendedor y Supervisor: dashboard, productos, ventas, clientes
INSERT INTO rol_permiso (id_rol, id_permiso)
    SELECT r.id_rol, p.id_permiso
    FROM roles r, permisos p
    WHERE r.nombre IN ('Vendedor', 'Supervisor')
      AND p.id_permiso IN ('dashboard.view', 'products.view', 'sales.view', 'customers.view');

INSERT INTO metodo_pago (nombre, codigo, estado) VALUES
    ('Efectivo',      'cash',     TRUE),
    ('Tarjeta',       'card',     TRUE),
    ('Transferencia', 'transfer', TRUE),
    ('Mixto',         'mixed',    TRUE);

INSERT INTO categorias (nombre, descripcion, estado) VALUES
    ('Exclusivos', 'Fragancias premium de edición limitada', TRUE),
    ('Hombre',     'Perfumes masculinos',                    TRUE),
    ('Mujer',      'Fragancias femeninas',                   TRUE),
    ('Unisex',     'Perfumes para todos',                    TRUE),
    ('Niños',      'Fragancias suaves para niños',            FALSE);

-- ============================================================
-- 9. VISTAS DE CONTRATO PARA EL FRONTEND
-- ============================================================
-- Las tablas mantienen nombres normalizados y relaciones por ID. Estas
-- vistas exponen el contrato que usa React (camelCase, nombres legibles
-- y valores derivados) sin duplicar datos calculados en las tablas.

CREATE OR REPLACE VIEW vw_frontend_categorias AS
SELECT
    c.id_categoria AS id,
    c.nombre AS name,
    c.descripcion AS description,
    COUNT(p.id_producto)::INT AS "productCount",
    CASE WHEN c.estado THEN 'active' ELSE 'inactive' END AS status,
    c.created_at AS "createdAt"
FROM categorias c
LEFT JOIN productos p ON p.id_categoria = c.id_categoria
GROUP BY c.id_categoria, c.nombre, c.descripcion, c.estado, c.created_at;

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
    COUNT(DISTINCT c.id_compra)::INT AS "totalOrders",
    COALESCE(SUM(c.total), 0)::NUMERIC(12,2) AS "totalSpent",
    COUNT(DISTINCT pr.id_producto)::INT AS "totalProducts"
FROM proveedores p
LEFT JOIN compras c ON c.id_proveedor = p.id_proveedor
LEFT JOIN productos pr ON pr.id_proveedor = p.id_proveedor
GROUP BY p.id_proveedor, p.nombre, p.contacto, p.email, p.telefono,
         p.ciudad, p.calificacion, p.cantidad_resenas, p.estado, p.fecha_alta;

CREATE OR REPLACE VIEW vw_frontend_productos AS
SELECT
    p.id_producto AS id,
    p.nombre AS name,
    p.descripcion AS description,
    c.nombre AS category,
    p.id_categoria AS "categoryId",
    pr.nombre AS supplier,
    p.id_proveedor AS "supplierId",
    p.sku,
    p.precio AS price,
    p.stock,
    p.stock_minimo AS "minStock",
    CASE WHEN p.estado THEN 'active' ELSE 'inactive' END AS status,
    COALESCE(
        json_agg(ip.ruta_imagen ORDER BY ip.orden, ip.id_imagen)
            FILTER (WHERE ip.id_imagen IS NOT NULL),
        '[]'::json
    ) AS images
FROM productos p
JOIN categorias c ON c.id_categoria = p.id_categoria
JOIN proveedores pr ON pr.id_proveedor = p.id_proveedor
LEFT JOIN imagenes_producto ip ON ip.id_producto = p.id_producto
GROUP BY p.id_producto, c.nombre, pr.nombre;

CREATE OR REPLACE VIEW vw_frontend_usuarios AS
SELECT
    u.id_usuario AS id,
    u.nombre AS name,
    u.correo AS email,
    u.telefono AS phone,
    r.nombre AS role,
    CASE WHEN u.estado THEN 'active' ELSE 'inactive' END AS status,
    u.ultimo_acceso AS "lastLogin",
    u.fecha_registro AS "joinDate"
FROM usuarios u
JOIN roles r ON r.id_rol = u.id_rol;

CREATE OR REPLACE VIEW vw_frontend_clientes AS
SELECT
    u.id_usuario AS id,
    u.nombre AS name,
    u.correo AS email,
    u.telefono AS phone,
    u.direccion AS address,
    u.ciudad AS city,
    COUNT(v.id_venta) FILTER (WHERE v.estado = 'completed')::INT AS "totalPurchases",
    COALESCE(SUM(v.total) FILTER (WHERE v.estado = 'completed'), 0)::NUMERIC(12,2) AS "totalSpent",
    CASE WHEN u.estado THEN 'active' ELSE 'inactive' END AS status,
    u.fecha_registro AS "joinDate",
    MAX(v.fecha_venta) FILTER (WHERE v.estado = 'completed') AS "lastPurchase"
FROM usuarios u
JOIN roles r ON r.id_rol = u.id_rol AND r.nombre = 'Cliente'
LEFT JOIN ventas v ON v.id_cliente = u.id_usuario
GROUP BY u.id_usuario;

CREATE OR REPLACE VIEW vw_frontend_roles AS
SELECT
    r.id_rol AS id,
    r.nombre AS name,
    r.descripcion AS description,
    COALESCE(array_agg(rp.id_permiso) FILTER (WHERE rp.id_permiso IS NOT NULL), '{}') AS permissions,
    COUNT(DISTINCT u.id_usuario)::INT AS "usersCount",
    CASE WHEN r.estado THEN 'active' ELSE 'inactive' END AS status,
    r.created_at AS "createdAt"
FROM roles r
LEFT JOIN rol_permiso rp ON rp.id_rol = r.id_rol
LEFT JOIN usuarios u ON u.id_rol = r.id_rol
GROUP BY r.id_rol;

CREATE OR REPLACE VIEW vw_frontend_ventas AS
SELECT
    v.id_venta AS id,
    v.folio,
    v.fecha_venta AS date,
    cli.nombre AS customer,
    ven.nombre AS seller,
    v.subtotal,
    v.descuento AS discount,
    v.total,
    mp.codigo AS "paymentMethod",
    v.estado AS status,
    COALESCE(json_agg(json_build_object(
        'productId', dv.id_producto,
        'productName', pr.nombre,
        'quantity', dv.cantidad,
        'unitPrice', dv.precio_unitario,
        'discount', dv.descuento
    )) FILTER (WHERE dv.id_detalle_venta IS NOT NULL), '[]'::json) AS items
FROM ventas v
JOIN usuarios cli ON cli.id_usuario = v.id_cliente
JOIN usuarios ven ON ven.id_usuario = v.id_usuario
LEFT JOIN metodo_pago mp ON mp.id_metodo_pago = v.id_metodo_pago
LEFT JOIN detalle_venta dv ON dv.id_venta = v.id_venta
LEFT JOIN productos pr ON pr.id_producto = dv.id_producto
GROUP BY v.id_venta, cli.nombre, ven.nombre, mp.codigo;

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
    COALESCE((SELECT json_agg(pc.*) FROM pagos_compra pc WHERE pc.id_compra = c.id_compra), '[]'::json) AS payments
FROM compras c
JOIN proveedores p ON p.id_proveedor = c.id_proveedor
LEFT JOIN detalle_compra dc ON dc.id_compra = c.id_compra
LEFT JOIN productos pr ON pr.id_producto = dc.id_producto
GROUP BY c.id_compra, p.nombre;

-- ============================================================
-- FIN DEL SCRIPT — 15 tablas + 8 vistas de contrato
-- ============================================================