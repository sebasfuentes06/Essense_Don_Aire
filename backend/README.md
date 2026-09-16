# API de Essence Don Aire

Node + Express + PostgreSQL, sin ORM: las consultas van en SQL parametrizado
y las lecturas se apoyan en las vistas de contrato del script de base de datos.

Para publicarla en internet, ver [DESPLIEGUE.md](./DESPLIEGUE.md).

## Puesta en marcha (en tu equipo)

```bash
cd backend
npm install
cp .env.example .env      # y completar PGPASSWORD y JWT_SECRET
npm run db:setup          # crea el esquema desde Database/data_base.sql
npm run seed              # crea los usuarios de prueba
npm run seed:demo         # crea proveedores y productos de ejemplo
npm run dev               # API en http://localhost:4000
```

También puedes crear la base desde pgAdmin abriendo `Database/data_base.sql`;
`npm run db:setup` hace lo mismo desde la terminal, y es la única forma cuando
la base está en la nube.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta la API y la reinicia al guardar cambios |
| `npm start` | La levanta sin recarga automática |
| `npm run db:setup` | Vacía el esquema y corre `Database/data_base.sql` |
| `npm run seed` | Crea las 4 cuentas de prueba |
| `npm run seed:demo` | Crea proveedores y productos de ejemplo |

## Cuentas de prueba

Todas con la contraseña `Essence2026*`:

| Correo | Perfil |
|---|---|
| admin@essence.com | Administrador |
| carlos@essence.com | Vendedor |
| maria@essence.com | Vendedor |
| laura@essence.com | Cliente |

## Autenticación

El login devuelve un **JWT** que hay que mandar en cada petición protegida:

```
Authorization: Bearer <token>
```

Los permisos **no** viajan dentro del token: se leen de la tabla `rol_permiso`
en cada petición. Así, si un administrador le cambia los permisos a un rol, el
cambio aplica de inmediato y no queda congelado hasta que el token expire.

Códigos de respuesta:

| Código | Significa |
|---|---|
| `401` | No hay token, está vencido, o las credenciales no son correctas |
| `403` | Hay sesión, pero el perfil no tiene ese permiso |
| `409` | La operación choca con una regla de negocio (duplicado, registro en uso, último administrador) |
| `400` | Datos inválidos; la respuesta trae `details` con el error de cada campo |

## Endpoints

### Sistema

| Método | Ruta | Permiso |
|---|---|---|
| GET | `/` | — (portada con la lista de recursos) |
| GET | `/api/health` | — (estado de la API y de la base) |

### Autenticación

| Método | Ruta | Permiso |
|---|---|---|
| POST | `/api/auth/login` | — |
| POST | `/api/auth/register` | — (solo perfiles Cliente y Vendedor) |
| GET | `/api/auth/me` | sesión iniciada |
| PATCH | `/api/auth/password` | sesión iniciada (cambia la propia contraseña) |

`PATCH /api/auth/password` recibe `{ actual, nueva, confirmacion }` y exige la
contraseña actual: tener el token no basta para cambiarla.

### Usuarios

| Método | Ruta | Permiso |
|---|---|---|
| GET | `/api/usuarios` | `users.view` |
| GET | `/api/usuarios/roles` | `users.view` |
| GET | `/api/usuarios/:id` | `users.view` |
| POST | `/api/usuarios` | `users.create` |
| PUT | `/api/usuarios/:id` | `users.edit` |
| PATCH | `/api/usuarios/:id/estado` | `users.edit` |
| PATCH | `/api/usuarios/:id/password` | `users.edit` |
| DELETE | `/api/usuarios/:id` | `users.delete` |

Reglas propias de este módulo:

- El sistema nunca puede quedarse **sin un administrador activo**: no se puede
  desactivar, eliminar ni degradar al último que quede.
- Nadie puede desactivarse, eliminarse ni cambiarse el rol a sí mismo.
- No se puede eliminar una cuenta con ventas, compras o pedidos asociados; el
  error dice cuántos y propone desactivarla para conservar el historial.
- El listado excluye a los **Clientes** por defecto (tienen su propio módulo).
  Con `?incluirClientes=1` aparecen.

### Categorías

| Método | Ruta | Permiso |
|---|---|---|
| GET | `/api/categorias` | `categories.view` |
| GET | `/api/categorias/:id` | `categories.view` |
| POST | `/api/categorias` | `categories.create` |
| PUT | `/api/categorias/:id` | `categories.edit` |
| PATCH | `/api/categorias/:id/estado` | `categories.edit` |
| DELETE | `/api/categorias/:id` | `categories.delete` |

### Productos

| Método | Ruta | Permiso |
|---|---|---|
| GET | `/api/productos` | `products.view` |
| GET | `/api/productos/opciones` | `products.view` (categorías y proveedores para los formularios) |
| GET | `/api/productos/:id` | `products.view` |
| POST | `/api/productos` | `products.create` |
| PUT | `/api/productos/:id` | `products.edit` |
| PATCH | `/api/productos/:id/estado` | `products.edit` |
| PATCH | `/api/productos/:id/stock` | `products.edit` |
| DELETE | `/api/productos/:id` | `products.delete` |

### Parámetros de los listados

Todos los `GET` de listado aceptan los mismos parámetros, y el filtrado, el
orden y la paginación los resuelve PostgreSQL, no el navegador:

| Parámetro | Valores |
|---|---|
| `search` | texto libre |
| `status` | `active`, `inactive`, `all` |
| `sortBy` | columna (lista blanca por módulo) |
| `sortDir` | `asc`, `desc` |
| `page` | número de página, desde 1 |
| `limit` | filas por página, máximo 100 |

La respuesta viene como:

```json
{
  "data": [ ... ],
  "stats": { "total": 3, "activos": 3, "inactivos": 0 },
  "meta": { "total": 3, "page": 1, "limit": 10, "totalPages": 1 }
}
```

## Decisiones de diseño

- **Sin ORM.** El esquema y las 12 vistas de contrato ya existen; un ORM las
  ignoraría y volvería a inventar el modelo.
- **Consultas parametrizadas siempre.** Ningún valor del usuario se concatena
  dentro del SQL. Las columnas de ordenamiento van por lista blanca, porque
  esas no se pueden parametrizar.
- **Contraseñas con bcrypt.** Nunca se guardan ni se devuelven en texto plano.
- **Permisos leídos de la base en cada petición**, no dentro del token.
- **Login con mensaje genérico.** "Correo o contraseña incorrectos" para los
  dos casos, y se compara igual contra un hash descartable cuando el correo no
  existe, para que el tiempo de respuesta no delate qué correos están
  registrados.
- **Saldos derivados, no guardados.** El saldo de una venta se calcula a partir
  de sus pagos; no hay una columna que se pueda desincronizar.
- **La misma aplicación corre local y en Vercel.** `src/server.js` exporta la
  app y solo abre un puerto cuando no está en un entorno serverless.
