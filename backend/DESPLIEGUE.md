# Publicar Essence Don Aire en internet

Al terminar tendrás dos enlaces:

- **La aplicación** — `https://essence-don-aire.vercel.app`
  Se abre, se inicia sesión y se maneja el sistema. Es el que le pasas al jurado.
- **La API** — `https://essence-don-aire-api.vercel.app/api/health`
  Sirve para demostrar que el lado servidor está publicado aparte.

Y una base de datos PostgreSQL en **Neon**, que es la que usan los dos.

> **Tu equipo no se toca.** El PostgreSQL que tienes instalado sigue igual y
> sigue sirviendo para trabajar. Lo que se crea aquí es una **segunda copia**
> en la nube. Son bases distintas: lo que hagas en una no aparece en la otra.

---

## Por qué dos proyectos en Vercel y no uno

El repositorio tiene dos cosas que se construyen distinto: el frontend es un
sitio estático (Vite genera archivos HTML y JS que se sirven tal cual) y la API
es un proceso de Node que responde peticiones. Vercel sabe hacer las dos, pero
no en el mismo proyecto.

La solución es importar el **mismo repositorio dos veces** y decirle a cada
proyecto en qué carpeta mirar:

| Proyecto en Vercel | Root Directory | Qué construye |
|---|---|---|
| `essence-don-aire` | `frontend` | La aplicación React |
| `essence-don-aire-api` | `backend` | La API de Express |

Se despliegan solos cuando haces `git push`, cada uno con lo suyo.

---

## Paso 0 — Antes de tocar nada

### 0.1 Que compile en tu equipo

Un error de construcción es mucho más fácil de leer aquí que en los registros
de Vercel:

```powershell
cd C:\Users\User\Desktop\Proyecto_Figma\frontend
npm run build
```

Tiene que terminar con algo como `✓ built in 8.42s`. Si falla, arréglalo antes
de seguir: en Vercel va a fallar igual.

### 0.2 Que todo esté en GitHub

```powershell
cd C:\Users\User\Desktop\Proyecto_Figma
git status
```

Si aparecen archivos sin confirmar:

```powershell
git add .
git commit -m "Módulos Proveedores y Compras conectados + configuración de despliegue"
git push
```

Verifica en <https://github.com/sebasfuentes06/Essense_Don_Aire> que estén las
carpetas `backend/`, `frontend/` y `Database/`. Vercel construye desde ahí, no
desde tu disco: lo que no esté subido, no existe para el despliegue.

> Tus archivos `.env` **no** se suben, y así debe ser: llevan contraseñas. Las
> variables de la nube se configuran dentro de Vercel.

---

## Paso 1 — La base de datos en Neon

Ya tienes cuenta de Neon del otro proyecto. Aquí se crea un proyecto **nuevo**,
aparte, para no mezclar las dos bases.

1. Entra a <https://console.neon.tech>
2. **New Project**
   - Name: `essence-don-aire`
   - Región: la más cercana a Colombia (`AWS us-east-1` o `us-east-2`)
3. Al crearlo te muestra la cadena de conexión. Copia la que dice
   **Pooled connection** — la que lleva `-pooler` en el nombre del servidor:

   ```
   postgresql://usuario:clave@ep-algo-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

   El `-pooler` reparte las conexiones entre peticiones. Sin él, una API en la
   nube se queda sin cupo (`too many connections`) apenas la usan dos o tres
   personas a la vez, que es justo lo que pasa en una sustentación.

---

## Paso 2 — Llenar esa base desde tu equipo

La base existe pero está vacía. En la nube no hay pgAdmin para abrir el `.sql`
y darle *ejecutar*, así que se manda desde acá.

Abre PowerShell y pega la cadena de Neon en una variable temporal. **Solo vive
en esa ventana**: al cerrarla desaparece, y así no queda escrita en ningún
archivo.

```powershell
cd C:\Users\User\Desktop\Proyecto_Figma\backend
$env:DATABASE_URL = "postgresql://...pega-aquí-la-de-Neon..."
```

Cómo sabes que apunta a Neon y no a tu equipo: los comandos imprimen contra
qué base están trabajando. Si dice `essence_don_aire en 127.0.0.1`, la variable
no quedó puesta.

**1. Las tablas, las vistas y los permisos:**

```powershell
npm run db:sql -- ../Database/data_base.sql
```

**2. Los usuarios, con una contraseña distinta a la de tu equipo:**

```powershell
$env:SEED_PASSWORD = "la-que-tú-elijas"
npm run seed
```

Elige una de verdad. Esa contraseña abre el sistema publicado, y la URL de
Vercel es pública aunque no se la pases a nadie.

> La ayudita gris del login que dice «Cuentas de prueba: admin@ · carlos@…»
> solo se pinta cuando la aplicación corre en tu equipo. En el sitio publicado
> no aparece: el código la envuelve en `import.meta.env.DEV`, y Vite la elimina
> al construir para producción.

**3. Datos de ejemplo, para que la demo no salga vacía:**

```powershell
npm run seed:demo
```

Siembra tres proveedores y seis productos, dos de ellos bajo el mínimo a
propósito para que se vean las alertas de stock bajo.

**4. Comprueba que quedó:**

```powershell
npm run db:sql -- ../Database/comprobar.sql
```

---

## Paso 3 — La API en Vercel

1. <https://vercel.com> → **Add New → Project**
2. Importa `Essense_Don_Aire`
3. **Project Name**: `essence-don-aire-api`
4. **Root Directory**: dale a *Edit* y elige **`backend`** ← esto es lo
   importante; si lo dejas en la raíz, Vercel construye el frontend por error
5. Si te ofrece importar tu `.env` local, **di que no**: esas variables apuntan
   a `localhost`, que desde un servidor de Vercel no existe
6. **Environment Variables**, agrega tres:

   | Nombre | Valor |
   |---|---|
   | `DATABASE_URL` | la cadena de Neon, la misma del paso 2 |
   | `JWT_SECRET` | una cadena larga y aleatoria (abajo cómo generarla) |
   | `CORS_ORIGINS` | `https://*.vercel.app` (se afina en el paso 5) |

7. **Deploy**

Para generar el `JWT_SECRET`, en PowerShell:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Copia lo que imprima. Esa clave es la que firma las sesiones: quien la tenga
puede fabricar un token válido y entrar como administrador sin contraseña. No
la compartas ni la subas al repositorio.

Al terminar, abre `https://essence-don-aire-api.vercel.app/api/health`. Debe
responder:

```json
{"ok":true,"db":"conectada","origenesPermitidos":["https://*.vercel.app"]}
```

Si dice `"sin conexión"`, la `DATABASE_URL` está mal o le falta el `-pooler`.

---

## Paso 4 — La aplicación en Vercel

1. **Add New → Project** → importa **el mismo repositorio otra vez**
2. **Project Name**: `essence-don-aire`
3. **Root Directory**: *Edit* → **`frontend`**
4. Framework Preset: **Vite** (lo detecta solo)
5. **Environment Variables**, una sola:

   | Nombre | Valor |
   |---|---|
   | `VITE_API_URL` | `https://essence-don-aire-api.vercel.app/api` |

   Ojo con el `/api` del final: sin él, el frontend pide
   `https://…vercel.app/proveedores` en vez de `…/api/proveedores` y todo
   responde 404.

6. **Deploy**

> **Por qué hay un `frontend/vercel.json`.** Hace dos cosas que Vercel no
> adivina. La primera es forzar `npm install`: en esa carpeta conviven un
> `package-lock.json` y un `pnpm-lock.yaml`, y Vercel le da prioridad a pnpm
> cuando ve su archivo — pero el `pnpm-workspace.yaml` tiene valores sin
> completar y la instalación se cae. La segunda es el *rewrite* a
> `index.html`: la aplicación usa rutas como `/panel/compras`, que solo
> existen dentro de React. Si alguien recarga la página estando ahí, Vercel
> busca un archivo en esa ruta, no lo encuentra y devuelve 404. El rewrite le
> dice que sirva siempre `index.html` y deje que React resuelva la ruta.

---

## Paso 5 — Cerrar el candado de CORS

Ahora que sabes el dominio real de la aplicación, conviene apretar la lista de
orígenes permitidos. `https://*.vercel.app` deja entrar a **cualquier** sitio
alojado en Vercel, no solo al tuyo.

1. Proyecto `essence-don-aire-api` → **Settings → Environment Variables**
2. Edita `CORS_ORIGINS` y déjalo así:

   ```
   https://essence-don-aire.vercel.app,https://*.vercel.app
   ```

   El comodín se queda para que sigan funcionando los despliegues de vista
   previa, que Vercel crea con un subdominio distinto en cada rama.

   Vale la pena saber qué deja pasar ese comodín: `https://*.vercel.app`
   acepta **cualquier** proyecto alojado en Vercel, no solo el tuyo. No es
   grave —el atacante tendría que tener además una contraseña válida— pero si
   prefieres cerrarlo del todo, pon solo tu dominio:

   ```
   https://essence-don-aire.vercel.app
   ```

   El costo es que las vistas previas de las ramas dejan de poder hablarle a
   la API. Para una sustentación probablemente no las necesitas.

   Lo que el comodín **no** deja pasar es un dominio de más de un nivel:
   `https://essence.otro.vercel.app` queda fuera, porque el patrón no cruza
   puntos.

3. **Deployments** → los tres puntitos del último → **Redeploy**

   Las variables de entorno se leen al construir. Cambiarlas no hace nada
   hasta que vuelvas a desplegar.

---

## Paso 6 — Comprobar que quedó

Abre `https://essence-don-aire.vercel.app` y haz este recorrido:

1. Entra con `admin@essence.com` y la contraseña del paso 2
2. **Proveedores** → las tarjetas muestran 3 / 3 / 6
3. **Compras** → *Nueva Compra*, registra una de 5 unidades
4. **Productos** → el stock de ese producto subió 5
5. Vuelve a **Compras**, cancélala
6. **Productos** → el stock bajó 5

Si eso funciona publicado, funciona todo: pasó por el frontend, por la API y
por PostgreSQL en la nube, incluida una transacción.

Una última prueba que vale la pena: **recarga la página con F5 estando en
`/panel/compras`**. Si vuelve a cargar la pantalla de Compras, el rewrite del
paso 4 está haciendo su trabajo. Si sale un 404, revísalo.

---

## Cada vez que cambies algo

```powershell
git add .
git commit -m "lo que cambiaste"
git push
```

Vercel despliega los dos proyectos solo. Dos salvedades:

- **Si cambiaste el esquema de la base**, el `git push` no la actualiza. Vercel
  despliega código, no estructura de datos. Los cambios de estructura van con
  un parche, desde tu equipo, apuntando a Neon:

  ```powershell
  cd backend
  $env:DATABASE_URL = "postgresql://...la-de-Neon..."
  npm run db:sql -- ../Database/parche_03_loquesea.sql
  ```

  Los parches se pueden correr varias veces sin romper nada, así que si dudas
  si ya lo aplicaste, vuelve a correrlo.

  Los dos parches que ya existen —`parche_01` y `parche_02`— **no** hay que
  correrlos en Neon: son correcciones que ya están incorporadas dentro de
  `data_base.sql`, y la base de la nube se instaló desde ahí. Existen para
  arreglar una base que ya tiene datos, como la de tu equipo. Si quieres
  confirmarlo, la última tabla de `comprobar.sql` te dice si están aplicados.

- **Si cambiaste una variable de entorno**, hay que redesplegar a mano. No
  basta con guardarla.

---

## Cuando algo no funciona

**La aplicación carga pero el login dice «No se pudo conectar con el servidor
(http://localhost:4000/api)».**
Falta `VITE_API_URL` en el proyecto del frontend, o se agregó después de
construir. Agrégala y redespliega. La pista está en el propio mensaje: si
menciona `localhost`, el frontend se quedó con el valor por defecto.

**El login dice que no se pudo conectar, pero con la URL de Vercel.**
Es CORS. Abre `…-api.vercel.app/api/health` y mira `origenesPermitidos`: si el
dominio de tu aplicación no está en esa lista, el navegador bloquea la
petición. Paso 5.

**`/api/health` responde `"db":"sin conexión"`.**
La `DATABASE_URL` está mal escrita, o es la que no lleva `-pooler`.

**Todo respondía y de pronto empieza a fallar con `too many connections`.**
Es la cadena sin `-pooler`. Cámbiala en Vercel y redespliega.

**El despliegue del frontend falla con un error de pnpm.**
No se subió `frontend/vercel.json`. Sin ese archivo Vercel intenta instalar con
pnpm y se cae. Confirma que esté en GitHub.

**Recargar en `/panel/algo` da 404.**
Mismo archivo, la parte del rewrite.

**Entraste al sitio publicado y no hay nada: ni productos ni proveedores.**
Faltó el paso 2.3, `npm run seed:demo`, o se corrió apuntando a tu equipo en
vez de a Neon.

**El login rechaza la contraseña que pusiste en `SEED_PASSWORD`.**
El `npm run seed` se corrió contra tu base local. Vuelve a abrir PowerShell,
pon `$env:DATABASE_URL` **antes** de `$env:SEED_PASSWORD`, y córrelo de nuevo:
el script actualiza la contraseña si el correo ya existe, así que no duplica
usuarios.
