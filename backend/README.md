# API de Essence Don Aire

Node + Express + PostgreSQL, sin ORM: las consultas van en SQL parametrizado
y las lecturas se apoyan en las vistas de contrato del script de base de datos.

## Puesta en marcha

```bash
# 1. Crear la base de datos con el script (desde pgAdmin o psql)
#    Database/data_base.sql

cd backend
npm install
cp .env.example .env      # y completar PGPASSWORD y JWT_SECRET
npm run seed              # crea los usuarios de prueba
npm run dev               # API en http://localhost:4000
```

## Cuentas de prueba

Todas con la contraseña `Essence2026*`:

| Correo | Perfil |
|---|---|
| admin@essence.com | Administrador |
| carlos@essence.com | Vendedor |
| maria@essence.com | Vendedor |
| laura@essence.com | Cliente |

## Endpoints

| Método | Ruta | Permiso |
|---|---|---|
| GET | `/api/health` | — |
| POST | `/api/auth/login` | — |
| POST | `/api/auth/register` | — (solo perfiles Cliente y Vendedor) |
| GET | `/api/auth/me` | sesión iniciada |
| GET | `/api/categorias` | `categories.view` |
| GET | `/api/categorias/:id` | `categories.view` |
| POST | `/api/categorias` | `categories.create` |
| PUT | `/api/categorias/:id` | `categories.edit` |
| PATCH | `/api/categorias/:id/estado` | `categories.edit` |
| DELETE | `/api/categorias/:id` | `categories.delete` |

`GET /api/categorias` acepta `?search=`, `?status=active|inactive|all`,
`?sortBy=`, `?sortDir=asc|desc`, `?page=`, `?limit=`.

## Decisiones

- **Sin ORM.** El esquema y las 12 vistas de contrato ya existen; un ORM las ignoraría.
- **Contraseñas con bcrypt.** Nunca se guardan ni se devuelven en texto plano.
- **Permisos leídos de la BD en cada petición.** Si un administrador cambia los
  permisos de un rol, aplica de inmediato sin esperar a que expire el token.
- **Login con mensaje genérico.** "Correo o contraseña incorrectos" para los dos
  casos, para no revelar qué correos están registrados.
