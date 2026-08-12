# Admin Module - Documentation

## Overview

El módulo **Admin** es un conjunto completo de páginas de administración para gestionar todos los aspectos de tu negocio de fragancias. Está organizado en una estructura consistente con tres capas principales:

- **pages**: Páginas completas del módulo (interfaces principales)
- **components**: Componentes reutilizables específicos del módulo
- **hooks**: Hooks personalizados para lógica compartida

---

## 📁 Structure

```
Admin/
├── pages/
│   ├── categories/
│   │   └── Categories.jsx
│   ├── customers/
│   │   └── Customers.jsx
│   ├── dashboard/
│   │   └── Dashboard.jsx
│   ├── productCatalog/
│   │   └── ProductCatalog.jsx
│   ├── productsManagement/
│   │   └── ProductsManagement.jsx
│   ├── purchases/
│   │   └── Purchases.jsx
│   ├── reports/
│   │   └── Reports.jsx
│   ├── roles/
│   │   └── Roles.jsx
│   ├── sales/
│   │   └── Sales.jsx
│   ├── suppliers/
│   │   └── Suppliers.jsx
│   ├── users/
│   │   └── Users.jsx
│   └── index.ts (main exports)
├── components/
│   ├── categories/
│   │   └── index.ts
│   ├── customers/
│   │   └── index.ts
│   ├── dashboard/
│   │   └── index.ts
│   ├── productCatalog/
│   │   └── index.ts
│   ├── productsManagement/
│   │   └── index.ts
│   ├── purchases/
│   │   └── index.ts
│   ├── reports/
│   │   └── index.ts
│   ├── roles/
│   │   └── index.ts
│   ├── sales/
│   │   └── index.ts
│   ├── suppliers/
│   │   └── index.ts
│   └── users/
│       └── index.ts
├── hooks/
│   ├── categories/
│   │   └── index.ts
│   ├── customers/
│   │   └── index.ts
│   ├── dashboard/
│   │   └── index.ts
│   ├── productCatalog/
│   │   └── index.ts
│   ├── productsManagement/
│   │   └── index.ts
│   ├── purchases/
│   │   └── index.ts
│   ├── reports/
│   │   └── index.ts
│   ├── roles/
│   │   └── index.ts
│   ├── sales/
│   │   └── index.ts
│   ├── suppliers/
│   │   └── index.ts
│   └── users/
│       └── index.ts
└── README.md (this file)
```

---

## 📄 Pages Overview

### 1. **Dashboard** 🏠
Panel de control principal con métricas y visualizaciones.
- **Ubicación**: `pages/dashboard/Dashboard.jsx`
- **Funciones principales**:
  - Estadísticas de ventas
  - Gráficos de tendencias
  - Productos más vendidos
  - Alertas de stock bajo

### 2. **Products Management** 📦
Gestión completa del inventario y catálogo de productos.
- **Ubicación**: `pages/productsManagement/ProductsManagement.jsx`
- **Funciones principales**:
  - Búsqueda y filtrado de productos
  - Gestión de stock
  - Edición y eliminación de productos
  - Alertas de stock bajo
  - Exportación de datos

### 3. **Product Catalog** 🛍️
Catálogo público de productos para clientes.
- **Ubicación**: `pages/productCatalog/ProductCatalog.jsx`
- **Funciones principales**:
  - Filtrado por categoría
  - Búsqueda de productos
  - Vista de carrito
  - Información de precio y disponibilidad

### 4. **Customers** 👥
Gestión de base de datos de clientes.
- **Ubicación**: `pages/customers/Customers.jsx`
- **Funciones principales**:
  - Búsqueda avanzada de clientes
  - Información de contacto
  - Historial de compras
  - Filtrado por estado

### 5. **Categories** 🏷️
Administración de categorías de productos.
- **Ubicación**: `pages/categories/Categories.jsx`
- **Funciones principales**:
  - CRUD de categorías
  - Gestión de estado (activo/inactivo)
  - Edición y eliminación

### 6. **Sales** 💳
Historial y gestión de transacciones de ventas.
- **Ubicación**: `pages/sales/Sales.jsx`
- **Funciones principales**:
  - Vista de todas las ventas
  - Filtrado por estado y vendedor
  - Métodos de pago
  - Anulación de ventas

### 7. **Purchases** 🛒
Gestión de órdenes de compra a proveedores.
- **Ubicación**: `pages/purchases/Purchases.jsx`
- **Funciones principales**:
  - Creación de órdenes de compra
  - Seguimiento de pagos
  - Estado de órdenes (pendiente/parcial/pagado)
  - Gestión de proveedores

### 8. **Reports** 📊
Análisis y reportes del negocio.
- **Ubicación**: `pages/reports/Reports.jsx`
- **Funciones principales**:
  - Tendencias de ventas
  - Análisis por categoría
  - Top vendedores
  - Exportación de reportes PDF

### 9. **Users** 👤
Gestión de usuarios del sistema.
- **Ubicación**: `pages/users/Users.jsx`
- **Funciones principales**:
  - Crear/editar/eliminar usuarios
  - Asignación de roles
  - Control de acceso
  - Estado de usuario

### 10. **Roles** 🔐
Administración de roles y permisos.
- **Ubicación**: `pages/roles/Roles.jsx`
- **Funciones principales**:
  - Crear roles personalizados
  - Asignación de permisos
  - Gestión de permisos por módulo
  - Activación/desactivación de roles

### 11. **Suppliers** 🏭
Directorio de proveedores.
- **Ubicación**: `pages/suppliers/Suppliers.jsx`
- **Funciones principales**:
  - Información de contacto
  - Historial de pedidos
  - Calificaciones y reseñas
  - Gestión de relaciones

---

## 🚀 Usage Examples

### Importing Pages

```jsx
// Desde cualquier componente
import { Dashboard, Users, Sales } from '@/Features/Admin/pages';

// O importar directamente
import { Dashboard } from '@/Features/Admin/pages/dashboard/Dashboard';
```

### Using in Routes

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard, Users, Sales, Products } from '@/Features/Admin/pages';

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/users" element={<Users />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/products" element={<ProductsManagement />} />
      {/* ... más rutas */}
    </Routes>
  );
}
```

---

## 🛠️ Common Features

Todas las páginas comparten características comunes:

### Búsqueda y Filtrado
```jsx
// Todos los componentes tienen búsqueda
<input
  type="text"
  placeholder="Buscar..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
```

### Paginación
```jsx
// Las tablas incluyen paginación
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={sortedItems.length}
  itemsPerPage={itemsPerPage}
  onPageChange={setCurrentPage}
/>
```

### Ordenamiento
```jsx
// Soporte para ordenar por diferentes columnas
<SortSelect
  value={sortBy}
  onChange={setSortBy}
  options={sortOptions}
  direction={sortDirection}
  onDirectionChange={setSortDirection}
/>
```

### Acciones CRUD
- ✏️ **Editar**: Abre modal con formulario
- 👁️ **Ver**: Muestra detalles
- 🗑️ **Eliminar**: Con confirmación
- ➕ **Crear**: Nuevo registro

---

## 📊 Data Structure

### Ejemplo: Product
```jsx
{
  id: 1,
  name: 'Essence Royale',
  category: 'Exclusivos',
  price: 89.99,
  stock: 45,
  minStock: 20,
  supplier: 'Fragancias Premium SA',
  status: 'active',
  sku: 'ESS-ROY-001',
  description: 'Fragancia premium...',
  images: ['url-1', 'url-2']
}
```

### Ejemplo: Order
```jsx
{
  id: 1,
  folio: 'OC-001',
  date: '2024-05-15',
  supplierId: 1,
  supplierName: 'Supplier Name',
  items: [...],
  subtotal: 1000,
  tax: 160,
  total: 1160,
  paid: 1160,
  balance: 0,
  status: 'paid' // 'pending' | 'partial' | 'paid'
}
```

---

## 🎯 Next Steps

Para completar la implementación:

1. **Extraer Componentes**: Crear componentes reutilizables en `components/`
   - Formularios de creación/edición
   - Cards de datos
   - Paneles de filtro

2. **Crear Hooks**: Implementar lógica en `hooks/`
   - `useFormValidation()` - Validación de formularios
   - `useTableFiltering()` - Lógica de filtrado
   - `usePagination()` - Control de paginación
   - `useDataFetching()` - Obtener datos de API

3. **Conectar API**: Reemplazar datos mock
   - Implementar llamadas a API
   - Manejo de errores
   - Loading states

4. **Testing**: Agregar tests
   - Tests unitarios
   - Tests de integración
   - Tests E2E

---

## 📦 Dependencies

### UI Components (shadcn/ui)
- Button
- Card
- Table
- Badge
- Modal
- Input
- Select
- DeleteDialog
- Pagination

### Icons (lucide-react)
- Search, Edit, Trash2, Eye, Plus
- ShoppingCart, Users, Settings
- Y muchos más...

### Charts (Recharts)
- LineChart
- BarChart
- PieChart

### Utils
- `cn()` - Class name merger (Tailwind)

---

## 🎨 Styling

Todos los componentes usan **Tailwind CSS** con paleta de colores personalizada:

```css
/* Color Scheme */
--primary: Gold (#C9A227)
--secondary: Brown (#8B7355)
--accent: Light Gold (#D4AF37)
--destructive: Red
--success: Green
--warning: Orange
--info: Blue
```

---

## 🔒 Permissions & Access Control

El módulo integra un sistema de roles y permisos:

```jsx
// Permisos disponibles
dashboard.view      // Ver dashboard
products.view       // Ver productos
products.create     // Crear productos
products.edit       // Editar productos
sales.view         // Ver ventas
customers.view     // Ver clientes
users.view         // Ver usuarios
```

---

## 📝 License

Este módulo es parte del proyecto Figma Design System.

---

## 🤝 Contributing

Para agregar nuevas características:

1. Crear nueva carpeta en `pages/`
2. Implementar página principal en JSX
3. Crear componentes reutilizables en `components/`
4. Implementar hooks en `hooks/`
5. Actualizar `pages/index.ts`
6. Documentar en este README

---

## 📞 Support

Para soporte o preguntas sobre el módulo Admin, contacta al equipo de desarrollo.

**Last Updated**: June 2024
**Version**: 1.0.0
