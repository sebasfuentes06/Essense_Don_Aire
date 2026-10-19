# Essence Don Aire — Web del negocio

Panel web (React + Vite + Tailwind) de Essence Don Aire. **Usa la misma API que la app
móvil** (`api_proyecto_formativo`, desplegada en https://api-proyecto-formativo.vercel.app/api),
así que la web y la app ven y modifican los mismos datos: productos, pedidos, ventas, pagos,
clientes, usuarios y compras.

## Correr la web

```bash
cd frontend
npm install
npm run dev        # http://localhost:5175
```

No necesita el backend de la carpeta `backend/` ni su base de datos: se conecta directo a la
API de la app. Para usar otra API (por ejemplo la que corres en tu computador) copia
`frontend/.env.example` como `frontend/.env` y cambia `VITE_API_URL`.

Cuentas de prueba (las mismas de la app): `admin@essence.com`, `vendedor@essence.com`,
`cliente@essence.com`.

## Qué hace cada rol

| Rol | Módulos |
|---|---|
| **Administrador** | Dashboard, catálogo, productos (con foto: subir o buscar en internet), categorías, pedidos, ventas (factura, abonos, Wompi, anular), pagos (aprobar/rechazar los que reportan los clientes, cartera), compras a proveedores, clientes (ficha y estado de cuenta), proveedores, usuarios (aprobar solicitudes de registro) y roles (solo consulta). |
| **Vendedor** | Su dashboard, catálogo, pedidos, ventas, abonos, clientes, y consulta de productos, categorías, proveedores y compras. |
| **Cliente** | Vitrina y catálogo con carrito, pedidos (método de pago; con transferencia el comprobante es obligatorio), sus pagos (Wompi o reportar transferencia) y su perfil. |

Registro con aprobación del administrador, recuperación de contraseña con código al correo y
municipios de Antioquia desde https://api-colombia.com (con lista de respaldo).

## Carpetas

- `frontend/` — la web. `src/shared/negocio/` traduce las respuestas de la API (español) a lo
  que usan las pantallas; `src/shared/persona/` es la ficha de persona (registro y clientes);
  `src/shared/cart/` el carrito.
- `backend/`, `api/` y `Database/` — el backend anterior de la web (Express + otra base en Neon).
  Ya no lo usa la web; se conserva como referencia.

## Despliegue en Vercel

En el proyecto de Vercel de la web, la variable `VITE_API_URL` debe estar **vacía/borrada** o
valer `https://api-proyecto-formativo.vercel.app/api`. Si quedó apuntando a `/api` o a
`localhost:4000`, la web seguiría usando el backend viejo.
