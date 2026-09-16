-- ============================================================
-- COMPROBAR — ¿quedó bien instalada esta base?
-- ============================================================
--
--     cd backend
--     npm run db:sql -- ../Database/comprobar.sql
--
-- No modifica nada: solo cuenta. Sirve sobre todo después de instalar la base
-- en la nube, para saber si el esquema y las semillas entraron completos antes
-- de descubrirlo en plena sustentación.
--
-- Para apuntar a la copia de Neon en vez de a la de tu equipo, en PowerShell:
--     $env:DATABASE_URL = "postgresql://...la-de-Neon..."
--
-- El script imprime contra qué base está trabajando, así que no hay que
-- adivinar cuál de las dos estás mirando.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Estructura: ¿están las 17 tablas y las 12 vistas?
-- ------------------------------------------------------------
SELECT
    COUNT(*) FILTER (WHERE table_type = 'BASE TABLE')::INT AS "tablas (esperadas 17)",
    COUNT(*) FILTER (WHERE table_type = 'VIEW')::INT       AS "vistas (esperadas 12)"
  FROM information_schema.tables
 WHERE table_schema = 'public';

-- ------------------------------------------------------------
-- 2. Catálogos: los que el sistema necesita para funcionar
-- ------------------------------------------------------------
SELECT
    (SELECT COUNT(*) FROM roles)::INT        AS "roles (4)",
    (SELECT COUNT(*) FROM permisos)::INT     AS "permisos (56)",
    (SELECT COUNT(*) FROM rol_permiso)::INT  AS "permisos asignados (107)",
    (SELECT COUNT(*) FROM metodo_pago)::INT  AS "métodos de pago (4)",
    (SELECT COUNT(*) FROM categorias)::INT   AS "categorías";

-- ------------------------------------------------------------
-- 3. Semillas: ¿corrieron `npm run seed` y `npm run seed:demo`?
-- ------------------------------------------------------------
SELECT
    (SELECT COUNT(*) FROM usuarios)::INT     AS "usuarios (4 tras npm run seed)",
    (SELECT COUNT(*) FROM proveedores)::INT  AS "proveedores (3 tras seed:demo)",
    (SELECT COUNT(*) FROM productos)::INT    AS "productos (6 tras seed:demo)",
    (SELECT COUNT(*) FROM compras)::INT      AS "compras",
    (SELECT COUNT(*) FROM ventas)::INT       AS "ventas";

-- ------------------------------------------------------------
-- 4. Los permisos por rol
-- ------------------------------------------------------------
-- Las dos columnas tienen que coincidir. Si "en la vista" sale más alto, falta
-- aplicar parche_01: array_agg estaba repitiendo cada permiso una vez por
-- usuario del rol.
SELECT r.nombre AS rol,
       (SELECT COUNT(*) FROM rol_permiso rp WHERE rp.id_rol = r.id_rol)::INT AS "permisos reales",
       COALESCE(array_length(v.permissions, 1), 0)                           AS "en la vista",
       (SELECT COUNT(*) FROM usuarios u WHERE u.id_rol = r.id_rol)::INT      AS usuarios
  FROM roles r
  LEFT JOIN vw_frontend_roles v ON v.id = r.id_rol
 ORDER BY r.id_rol;

-- ------------------------------------------------------------
-- 5. Las cuentas que pueden entrar
-- ------------------------------------------------------------
-- La contraseña no se puede leer: está cifrada con bcrypt, que es de una sola
-- vía. Lo que sí se comprueba es que el hash exista y tenga la pinta correcta
-- (los de bcrypt empiezan por $2a$, $2b$ o $2y$). Si alguna dijera "NO", esa
-- cuenta se sembró mal y no va a poder iniciar sesión.
SELECT u.correo,
       r.nombre AS rol,
       CASE WHEN u.contrasena LIKE '$2%' THEN 'sí' ELSE 'NO' END AS "contraseña cifrada",
       CASE WHEN u.estado THEN 'activo' ELSE 'inactivo' END      AS estado
  FROM usuarios u
  JOIN roles r ON r.id_rol = u.id_rol
 ORDER BY u.id_usuario;

-- ------------------------------------------------------------
-- 6. Los parches de base: ¿están aplicados?
-- ------------------------------------------------------------
SELECT
    CASE WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_proveedores_nombre')
         THEN 'sí' ELSE 'NO — corre parche_01' END AS "parche 01 (nombre de proveedor único)",
    CASE WHEN pg_get_viewdef('vw_frontend_proveedores'::regclass) ILIKE '%LATERAL%'
         THEN 'sí' ELSE 'NO — corre parche_01' END AS "parche 01 (total comprado sin inflar)",
    CASE WHEN pg_get_viewdef('vw_frontend_roles'::regclass) ILIKE '%DISTINCT rp.id_permiso%'
         THEN 'sí' ELSE 'NO — corre parche_01' END AS "parche 01 (permisos sin repetir)",
    CASE WHEN pg_get_viewdef('vw_frontend_compras'::regclass) ILIKE '%methodCode%'
         THEN 'sí' ELSE 'NO — corre parche_02' END AS "parche 02 (abonos con método)";
