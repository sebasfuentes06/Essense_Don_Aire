# Estructura de Módulos - Guía Rápida

## Estructura de Carpetas

Cada módulo en la carpeta `Features` sigue la siguiente estructura:

```
moduleNames/
├── components/
│   ├── index.ts          # Exporta todos los componentes
│   └── [ComponentName].tsx
└── hooks/
    ├── index.ts          # Exporta todos los hooks
    └── use[HookName].ts
```

Además, cada módulo tiene su página correspondiente en:
```
pages/
└── ModuleName.tsx        # Página principal del módulo
```

## Módulos Disponibles

- ✅ **Auth** - Módulo de autenticación (Login, Register, ForgotPassword)
- ✅ **Admin/Layout** - Layout base para el panel administrativo
- ✅ **Categories** - Gestión de categorías
- ✅ **Customers** - Gestión de clientes
- ✅ **Dashboard** - Panel de control
- ✅ **ProductCatalog** - Catálogo de productos
- ✅ **ProductsManagement** - Gestión de productos
- ✅ **Purchases** - Gestión de compras
- ✅ **Reports** - Reportes
- ✅ **Roles** - Gestión de roles
- ✅ **Sales** - Gestión de ventas
- ✅ **Suppliers** - Gestión de proveedores
- ✅ **Users** - Gestión de usuarios

## Cómo Agregar Componentes

1. Crea tu componente en `moduleNames/components/ComponentName.tsx`
2. Exporta el componente en `moduleNames/components/index.ts`
3. Importa desde `../components` en tu página

### Ejemplo:

```typescript
// components/UserCard.tsx
export const UserCard = ({ user }) => {
  return <div>{user.name}</div>;
};

// components/index.ts
export { UserCard } from './UserCard';

// pages/Users.tsx
import { UserCard } from '../users/components';
```

## Cómo Agregar Hooks

1. Crea tu hook en `moduleNames/hooks/useHookName.ts`
2. Exporta el hook en `moduleNames/hooks/index.ts`
3. Importa desde `../hooks` en tu componente

### Ejemplo:

```typescript
// hooks/useUsers.ts
export const useUsers = () => {
  const [users, setUsers] = useState([]);
  return { users, setUsers };
};

// hooks/index.ts
export { useUsers } from './useUsers';

// components/UserList.tsx
import { useUsers } from '../hooks';
```

## Siguiente Paso: Paso 3.1 para cada módulo

Para cada módulo, sigue el mismo patrón que en **Auth**:

1. **Componentes principales:**
   - Componente wrapper/contenedor del módulo
   - Componentes reutilizables específicos del módulo

2. **Hooks específicos:**
   - Lógica de estado
   - Llamadas a API
   - Validaciones

3. **Páginas:**
   - Mantén el archivo `.tsx` en la carpeta `pages/`
   - Este archivo importará y usará los componentes del módulo

---

Para más detalles sobre la estructura de Auth que sirve como referencia, consulta la carpeta `src/Features/Auth`.
