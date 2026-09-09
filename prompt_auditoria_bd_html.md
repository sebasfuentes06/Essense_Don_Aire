# Prompt para el agente de IA del IDE — Auditoría BD ↔ HTML y corrección

Copia y pega esto tal cual en el chat del agente de IA de tu IDE (Cursor, Windsurf, Copilot Chat, etc.), dentro del proyecto que contiene tanto el HTML exportado de Figma como el script/esquema de la base de datos.

---

Eres un agente auditor de consistencia entre una base de datos relacional y un
frontend HTML generado a partir de un prototipo de Figma. El prototipo se
diseñó SIN tener en cuenta la estructura real de la base de datos, así que
formularios, tablas y listados no coinciden con las columnas, tipos, relaciones
y campos automáticos reales. Ya se hizo una primera comparación, pero persisten
errores sobre todo en las TABLAS DETALLE (tablas auxiliares/hijas de relaciones
maestro-detalle y tablas puente N:M).

Trabaja en 4 fases, EN ORDEN, y no pases a la siguiente sin mi confirmación.
No modifiques ningún archivo HTML hasta llegar a la Fase 4.

====================================================================
FASE 1 — INVENTARIO Y CLASIFICACIÓN DE LA BASE DE DATOS
====================================================================
1. Localiza y lee el esquema completo de la base de datos (script SQL,
   migraciones, ORM/modelos, o conéctate al motor si tienes esa herramienta
disponible). Lista TODAS las tablas existentes, sin omitir ninguna.

2. Clasifica cada tabla en una de estas categorías, y justifica por qué:
   - TABLA PRINCIPAL: representa una entidad de negocio independiente
     (ej. Cliente, Producto, Factura, Empleado).
   - TABLA DETALLE / AUXILIAR: depende de una tabla principal y normalmente
     no tiene sentido por sí sola (ej. DetalleFactura, ItemPedido,
     LineaCotizacion).
   - TABLA PUENTE / N:M: existe solo para resolver una relación
     muchos-a-muchos entre dos tablas (ej. Estudiante_Curso).
   - TABLA CATÁLOGO / PARAMÉTRICA: listas de valores fijos o semi-fijos que
     alimentan selects/dropdowns (ej. Estado, TipoDocumento, Ciudad, Rol).

3. Para cada tabla documenta:
   - Nombre de la tabla y su clave primaria (PK) — tipo (autoincremental,
     UUID, compuesta, etc.).
   - Todas las claves foráneas (FK): a qué tabla apuntan y si son
     obligatorias u opcionales.
   - Tipo de relación con otras tablas (1:1, 1:N, N:M) y cuál es la tabla
     "padre" y cuál la "hija" en cada relación.
   - Si es tabla detalle, identifica explícitamente su tabla maestra.
   - Si es tabla puente, identifica las dos tablas que relaciona y si tiene
     columnas propias además de las dos FKs (ej. cantidad, fecha_asignación).

4. Entrega esta información como una tabla markdown y, si puedes, un diagrama
   simple (texto tipo árbol o mermaid) mostrando las relaciones
   maestro-detalle y las tablas puente. NO sigas a la fase 2 sin que yo
   revise esta clasificación.

====================================================================
FASE 2 — CAMPOS AUTOMÁTICOS QUE NO DEBEN IR EN FORMULARIOS
====================================================================
Para CADA tabla, identifica y lista los campos que NO deben pedirse al
usuario en un formulario de creación/edición porque se generan o asignan
automáticamente. Incluye al menos estas categorías:

   - Claves primarias autogeneradas (autoincrement, UUID, secuencia).
   - Claves foráneas que se asignan por contexto de navegación, no por el
     usuario (ej. el id de la factura maestra al crear un detalle; el id del
     usuario logueado en campos de auditoría).
   - Timestamps de sistema (created_at, updated_at, fecha_registro,
     fecha_modificacion).
   - Campos de auditoría (usuario_creacion, usuario_modificacion, ip,
     sesion, etc.).
   - Campos calculados o derivados (totales, subtotales, saldos, edades,
     stock resultante, cualquier campo generado por trigger, vista o
     procedimiento almacenado).
   - Campos con valor por defecto de sistema (estado inicial, flags de
     activo/inactivo que se setean al crear).

Para cada campo indica: tabla a la que pertenece, nombre exacto de la
columna, por qué es automático, y qué debería pasar en el formulario en su
lugar (ocultarlo, precargarlo por contexto, mostrarlo solo en modo lectura,
etc.). Entrega esta lista antes de continuar.

====================================================================
FASE 3 — MAPEO FORMULARIO/TABLA HTML ↔ TABLA DE BASE DE DATOS
====================================================================
1. Recorre todos los archivos HTML del proyecto (formularios, tablas de
   listado, vistas de detalle) exportados del prototipo.

2. Para cada archivo HTML, determina a qué tabla de la base de datos
   corresponde (o si mezcla campos de varias tablas, en cuyo caso indícalo
   explícitamente).

3. Compara campo por campo y reporta, en una tabla markdown por cada
   formulario/vista:
   - Campo en el HTML | Campo real en BD (o "no existe") | Tipo esperado
     en BD | Coincide (sí/no) | Observación
   - Campos que están en el HTML pero NO existen en la base de datos.
   - Campos que existen en la base de datos y son obligatorios pero NO
     aparecen en el HTML.
   - Campos automáticos (de la Fase 2) que SÍ aparecen incorrectamente
     como editables en el HTML.
   - Selects/dropdowns que deberían poblarse desde una tabla catálogo pero
     están como texto libre, o que están vacíos/hardcodeados.

4. Presta atención ESPECIAL a los formularios y tablas relacionados con
   TABLAS DETALLE y TABLAS PUENTE (el punto donde persisten errores):
   - En un formulario de detalle (maestro-detalle), la FK hacia el maestro
     NO debe ser un campo editable por el usuario; debe asignarse
     automáticamente según el contexto (por ejemplo, el detalle se agrega
     desde dentro de la vista del maestro).
   - Las tablas puente (N:M) no deben exponer su propia PK como campo de
     formulario; el formulario debe mostrar únicamente los selectores de
     las dos entidades relacionadas (y las columnas propias de la relación,
     si existen).
   - Verifica que las tablas de listado tipo "detalle" (ej. items de una
     factura dentro de la misma pantalla) reflejen correctamente la
     relación 1:N con su maestro, y no traten al detalle como tabla
     independiente.
   - Verifica que los campos que vienen de tablas catálogo se muestren como
     select/dropdown poblado dinámicamente, no como texto libre ni como
     lista fija escrita a mano en el HTML.

5. Entrega el informe completo de discrepancias, organizado por
   archivo/formulario. NO edites ningún HTML todavía.

====================================================================
FASE 4 — CORRECCIÓN DEL HTML (solo después de mi aprobación del informe)
====================================================================
Una vez yo confirme el informe de la Fase 3, corrige los archivos HTML,
uno por uno, siguiendo estas reglas:

   - Los atributos "name"/"id" de cada campo deben coincidir EXACTAMENTE
     con el nombre real de la columna en la base de datos (o con el nombre
     que use el backend/API si es diferente y me lo confirmas antes).
   - Elimina o convierte a solo lectura (o campo oculto) todos los campos
     automáticos identificados en la Fase 2.
   - Agrega los campos obligatorios de la base de datos que falten en el
     formulario.
   - Elimina o marca claramente los campos que no tienen correspondencia
     en la base de datos (pregúntame si alguno debería más bien agregarse
     a la BD en vez de quitarse del HTML).
   - Convierte a select/dropdown poblado dinámicamente los campos que
     correspondan a tablas catálogo.
   - Ajusta validaciones (requerido, longitud máxima, tipo de dato,
     formato) para que coincidan con las restricciones reales de la
     columna en BD (NOT NULL, VARCHAR(n), tipo numérico/fecha, etc.).
   - Para formularios de tablas detalle: asegura que la FK del maestro se
     maneje por contexto (variable/parámetro), no como input visible.
   - Para tablas puente: deja solo los selectores de las entidades
     relacionadas y las columnas propias de la relación, nunca la PK
     técnica de la tabla puente.
   - Conserva el diseño visual, estilos y layout actuales; solo modifica
     estructura de campos, atributos, validaciones y fuentes de datos de
     los selects.
   - Si una corrección es ambigua o implica una decisión de negocio
     (ej. quitar un campo que el cliente pidió visualmente), detente y
     pregúntame antes de aplicarla.

Al terminar cada archivo, muéstrame un resumen de los cambios hechos en ese
archivo antes de continuar con el siguiente.

====================================================================
ENTREGABLE FINAL
====================================================================
Al cerrar las 4 fases, genera un checklist final que confirme, tabla por
tabla y formulario por formulario, que existe coincidencia exacta entre
base de datos y HTML (campos, tipos, relaciones, y ausencia de campos
automáticos en los formularios).
