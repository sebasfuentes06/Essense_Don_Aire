/**
 * Definicion de roles y permisos de Essence Don Aire.
 *
 * La matriz de permisos sale directamente del Story Mapping del proyecto
 * (hoja "STORY MAPPING", filas Administrador / Vendedor / Cliente).
 *
 * Los ids de permiso siguen el mismo formato que la tabla `permisos` del
 * script de base de datos (Database/data_base.sql): "<modulo>.<accion>",
 * para que cuando se conecte el backend se puedan mapear 1 a 1.
 */

const ROLES = {
  ADMIN: "Administrador",
  SELLER: "Vendedor",
  CLIENT: "Cliente"
};

const ROLE_LIST = [
  {
    value: ROLES.ADMIN,
    label: "Administrador",
    description: "Acceso completo a todos los modulos del sistema"
  },
  {
    value: ROLES.SELLER,
    label: "Vendedor",
    description: "Ventas, catalogo, clientes y su dashboard personal"
  },
  {
    value: ROLES.CLIENT,
    label: "Cliente",
    description: "Catalogo de productos y su cuenta personal"
  }
];

/**
 * Permisos por rol.
 * "modulo.view"   -> puede entrar al modulo (habilita la ruta y el item del menu)
 * "modulo.create" -> puede crear registros
 * "modulo.edit"   -> puede editar registros
 * "modulo.delete" -> puede eliminar registros
 * "modulo.own"    -> solo ve/gestiona sus propios registros
 * "modulo.toggle" -> puede activar/desactivar el registro (switch de estado)
 * "orders.status"  -> puede mover el pedido entre estados
 * "orders.convert" -> puede convertir el pedido en venta
 * "orders.cancel"  -> puede cancelar su propio pedido mientras siga pendiente
 */
const PERMISSIONS_BY_ROLE = {
  [ROLES.ADMIN]: [
    "dashboard.view",
    "catalog.view", "catalog.edit",
    "products.view", "products.create", "products.edit", "products.delete",
    "categories.view", "categories.create", "categories.edit", "categories.delete",
    "sales.view", "sales.create", "sales.edit", "sales.delete", "sales.cancel",
    "orders.view", "orders.create", "orders.edit", "orders.delete", "orders.status", "orders.convert",
    "purchases.view", "purchases.create", "purchases.edit", "purchases.delete",
    "customers.view", "customers.create", "customers.edit", "customers.delete", "customers.toggle",
    "suppliers.view", "suppliers.create", "suppliers.edit", "suppliers.delete", "suppliers.toggle",
    "users.view", "users.create", "users.edit", "users.delete",
    "roles.view", "roles.create", "roles.edit", "roles.delete",
    "profile.view", "profile.edit"
  ],

  // Vendedor: story mapping fila 7.
  // Puede operar catalogo, ventas propias, clientes y stock.
  // NO elimina nada, NO ve usuarios ni roles ni reportes globales.
  [ROLES.SELLER]: [
    "dashboard.view",
    "catalog.view",
    "products.view", "products.edit",
    "categories.view", "categories.create", "categories.edit",
    "sales.view", "sales.create", "sales.own", "sales.cancel",
    // "orders.own" limita edicion y borrado a los pedidos aun pendientes
    "orders.view", "orders.own", "orders.create", "orders.edit", "orders.delete", "orders.convert",
    "purchases.view",
    "customers.view", "customers.create", "customers.edit",
    "suppliers.view",
    "profile.view", "profile.edit"
  ],

  // Cliente: story mapping fila 9.
  // Solo lectura del catalogo + su propia cuenta.
  [ROLES.CLIENT]: [
    "dashboard.view",
    "catalog.view",
    // el Cliente crea pedidos desde el carrito y solo puede cancelar los pendientes
    "orders.view", "orders.own", "orders.create", "orders.cancel",
    "profile.view", "profile.edit"
  ]
};

function getPermissions(role) {
  return PERMISSIONS_BY_ROLE[role] ?? [];
}

function roleCan(role, permission) {
  return getPermissions(role).includes(permission);
}

export { ROLES, ROLE_LIST, PERMISSIONS_BY_ROLE, getPermissions, roleCan };
