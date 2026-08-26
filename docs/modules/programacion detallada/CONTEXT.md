# Contexto - Programación detallada

## Objetivo

Proporcionar una interfaz para cargar, previsualizar, guardar, reemplazar y consultar programaciones semanales detalladas por cliente, SKU y producto. El frontend guía la selección del periodo, muestra los errores devueltos por la API y permite revisar los datos antes de confirmar su persistencia.

## Alcance

- Mostrar el acceso `Tablero Sae > Programación Detallada` según el permiso de menú `view_scheduled_detail`.
- Proteger las páginas mediante el middleware de autenticación `auth` y exigir que exista un cliente seleccionado en la sesión frontend.
- Seleccionar un año y una semana ISO válida para ese año.
- Seleccionar un archivo Excel `.xlsx` o `.xls` y enviarlo al backend para su lectura; el navegador no procesa localmente el contenido del archivo.
- Presentar los detalles válidos devueltos por la previsualización y los errores asociados a filas del Excel.
- Buscar y filtrar localmente las filas previsualizadas.
- Guardar la previsualización y solicitar confirmación cuando la API informa que ya existe una programación del usuario para el mismo año y semana.
- Consultar todas las cabeceras devueltas por la API y abrir un modal con sus detalles semanales.
- Buscar y filtrar localmente los detalles del modal.
- El frontend no crea ni consulta tablas de base de datos directamente, no distribuye valores por día y no calcula cumplimiento.

## Usuarios

- Usuarios autenticados del módulo de objetivos o planeación.
- El menú muestra el submódulo a quienes tengan `view_scheduled_detail` dentro de la cookie `permissions`.
- Las páginas usan el layout `default`, el middleware `auth` y `requiresAuth: true`.
- El middleware también exige las cookies `idCliente` y `nameClient`, aunque las solicitudes de Programación detallada no envían el cliente seleccionado y el archivo puede contener varios clientes.
- El nombre atribuido a la previsualización y al guardado proviene de la cookie `usuario`.

## Rutas y navegación

### `/objetivos/programacion-detallada`

- Archivo: `pages/objetivos/programacion-detallada.vue`.
- Pestaña: `Cargar archivo`.
- Función: selección del periodo, carga, previsualización, búsqueda, guardado y confirmación de reemplazo.

### `/objetivos/programacion-detallada-table`

- Archivo: `pages/objetivos/programacion-detallada-table.vue`.
- Pestaña: `Consultar`.
- Función: listado de programaciones y visualización de sus detalles.

Ambas páginas comparten las pestañas declaradas en `ScheduledDetailData.ts` y renderizadas mediante `components/remisiones/TabPanelRemisiones.vue`.

## Flujo funcional

### Acceso

1. `useModulos` lee la cookie `permissions` y establece la visibilidad del elemento `Programación Detallada` cuando encuentra `view_scheduled_detail`.
2. Al navegar a cualquiera de las dos rutas, el middleware `auth` llama `verificarLogin`.
3. `verificarLogin` comprueba la cookie `token` contra `POST api/verificarTokenLogin` usando `Authorization: Bearer`.
4. Si el token no es válido, falta el cliente seleccionado o falla la verificación, se redirige a `/login`.

La comprobación de `view_scheduled_detail` solo controla la visibilidad del menú; las páginas no validan directamente ese permiso.

### Selección de periodo

1. `DinamicosInputCalendar` permite elegir un año y entrega un objeto `Date`.
2. `weekOptions` calcula cuántas semanas ISO tiene ese año usando el 28 de diciembre.
3. Para cada semana se calcula el lunes inicial y el domingo final en UTC.
4. `DinamicosDropDownList` presenta etiquetas como `Semana 1 — lunes ... al domingo ...`.
5. Cuando cambia el año, el watcher actual limpia únicamente la semana seleccionada.

### Previsualización

1. El usuario selecciona un archivo mediante un `input type="file"` con `accept=".xlsx,.xls"`.
2. `handlePreview` exige año, semana, archivo y cookie `usuario`.
3. El composable crea `FormData` con `archivo`, `year`, `week` y `username`.
4. `previewExcel` envía `POST {apiBackendCliente}api/scheduled-detail/preview` con `Accept: application/json`.
5. Si la respuesta es válida, la página conserva el contexto devuelto (`year`, `week`, `username`) y muestra las filas en `DinamicosTableFilters`.
6. La tabla permite filtrar por nombre de cliente mediante checklist y buscar por SKU, producto o total semanal.
7. Si la API devuelve `errors`, `validationErrorDetails` aplana errores simples o agrupados y muestra el número de fila cuando la clave es numérica.

Cambiar el archivo limpia la previsualización, los errores, la búsqueda y cualquier confirmación pendiente.

### Guardado y reemplazo

1. El botón `Guardar programación` solo aparece cuando `previewRows` contiene al menos una fila.
2. `getSaveRequest` usa el contexto conservado por la previsualización y transforma cada fila a `client_id`, `sku`, `producto` y `value`.
3. No se envían `start_date`, `end_date`, `nombre_cliente` ni `activity_id` al guardar.
4. `saveScheduledDetails` envía JSON a `POST {apiBackendCliente}api/scheduled-detail/store`.
5. Si la API responde HTTP `409` con `requires_confirmation = true`, se abre un `Dialog` de PrimeVue.
6. Al confirmar, se repite la solicitud original con `replace_existing = true`.
7. Durante cada solicitud se deshabilitan los botones correspondientes y cambia su texto para indicar el estado de carga.
8. Después de un guardado exitoso se limpian filas, contexto, errores y confirmación; el año, semana y archivo seleccionado permanecen visibles.

### Consulta

1. Al ejecutar el setup de `programacion-detallada-table.vue`, `loadRecords()` solicita `GET {apiBackendCliente}api/scheduled-detail`.
2. Las fechas de inicio y fin se presentan tomando los primeros diez caracteres del valor recibido.
3. `DinamicosTableFilters` muestra las cabeceras con paginación local de cinco elementos por página.
4. El botón de detalle abre un `Dialog` con la cabecera seleccionada y otra tabla para sus detalles.
5. La tabla del modal permite filtrar clientes mediante checklist y buscar por SKU, producto o usuario.
6. Al cerrar el modal se limpia la selección y la búsqueda del detalle.

## Tablas de interfaz y campos clave

El frontend no accede directamente a PostgreSQL. En este documento, “tablas” se refiere a las tablas visuales y a las estructuras TypeScript que representan los contratos de la API.

### Formulario de carga

- `year`: `Date | null` en la interfaz; se envía como año numérico.
- `week`: `number | null`; número de semana ISO.
- `selectedFile`: `File | null`; archivo elegido por el usuario.
- `username`: cookie `usuario`; se envía como string.
- `previewContext`: copia de `year`, `week` y `username` confirmados por la respuesta de previsualización.
- `previewRows`: arreglo de `ScheduledDetailPreviewRow`.
- `validationErrors`: errores de la API agrupados por campo o fila.
- `pendingSaveRequest`: payload conservado mientras se solicita confirmación de reemplazo.

### Tabla de previsualización

Tipo: `ScheduledDetailPreviewRow`.

- `start_date`: fecha inicial de la semana.
- `end_date`: fecha final de la semana.
- `nombre_cliente`: nombre proveniente del archivo y validado por la API.
- `client_id`: identificador resuelto por la API.
- `sku`: código separado desde `APO:Producto`.
- `producto`: descripción separada desde `APO:Producto`.
- `activity_id`: actividad resuelta durante la previsualización; no se envía en el guardado.
- `value`: total semanal.

Las columnas visibles son fecha inicial, fecha final, nombre de cliente, SKU, producto y total semanal. `client_id` y `activity_id` no se muestran.

### Payload de guardado

Tipo: `ScheduledDetailSaveRequest`.

- `year`: año ISO previsualizado.
- `week`: semana ISO previsualizada.
- `username`: usuario previsualizado.
- `values`: arreglo no vacío esperado por la API.
- `values[].client_id`: cliente.
- `values[].sku`: SKU.
- `values[].producto`: producto.
- `values[].value`: total semanal.
- `replace_existing`: booleano opcional que solo se agrega después de confirmar el reemplazo.

### Tabla principal de consulta

Tipo: `ScheduledDetailListRow`.

- `scheduled_detail_id`: identificador de cabecera.
- `year`: año.
- `week_number`: semana.
- `week_start_date`: fecha inicial formateada como `YYYY-MM-DD`.
- `week_end_date`: fecha final formateada como `YYYY-MM-DD`.
- `username`: usuario atribuido.
- `weekly_scheduled_detail`: arreglo de detalles incluido en cada registro.

### Tabla del modal de detalle

Tipo: `WeeklyScheduledDetailListRow`.

- `weekly_scheduled_detail_id`: identificador del detalle; está tipado, pero no se presenta como columna.
- `client_name`: cliente; cuando falta o queda vacío se muestra `Sin cliente`.
- `sku`: SKU.
- `product`: producto.
- `weekly_total`: total semanal.
- `username`: usuario atribuido al detalle.

## Contratos de API

### Previsualizar

- Método: `POST`.
- Ruta relativa: `api/scheduled-detail/preview`.
- Cuerpo: `FormData`.
- Encabezado explícito: `Accept: application/json`.
- Respuesta normalizada: `ScheduledDetailApiResponse<ScheduledDetailPreviewData>`.
- Títulos frontend: `Archivo válido`, `No fue posible previsualizar` o `Error de conexión`.

### Guardar

- Método: `POST`.
- Ruta relativa: `api/scheduled-detail/store`.
- Cuerpo: JSON.
- Encabezado explícito: `Content-Type: application/json`.
- Respuesta normalizada: `ScheduledDetailSaveResponse`.
- `requires_confirmation` de la API se transforma a `requiresConfirmation`.

### Listar

- Método: `GET`.
- Ruta relativa: `api/scheduled-detail`.
- Respuesta normalizada: `ScheduledDetailApiResponse<ScheduledDetailListRow[]>`.
- No envía filtros, paginación ni parámetros.

Los tres métodos usan `config.public.apiBackendCliente` como URL base y manejan errores de red o parseo mediante `try/catch`.

## Archivos relevantes

### Implementación principal

- `pages/objetivos/programacion-detallada.vue`: carga, selección de periodo, previsualización, mensajes, guardado y reemplazo.
- `pages/objetivos/programacion-detallada-table.vue`: consulta, estados de carga, modal y filtros de detalle.
- `composables/objetivos/useScheduledDetailApi.ts`: tipos, construcción de solicitudes y normalización de respuestas.
- `composables/objetivos/ScheduledDetailData.ts`: pestañas y metadatos de la tabla principal.
- `composables/menuItems.ts`: ubicación del submódulo y permiso de visibilidad.

### Componentes compartidos

- `components/dinamicos/InputCalendar.vue`: selector de año basado en `Calendar` de PrimeVue.
- `components/dinamicos/DropDownList.vue`: selector nativo de semana.
- `components/dinamicos/TableFilters.vue`: tabla, estados, filtros y conexión con el paginador.
- `components/dinamicos/ChecklistFilter.vue`: filtros por cliente.
- `components/dinamicos/Paginator.vue`: paginación local de cinco filas.
- `components/remisiones/TabPanelRemisiones.vue`: navegación entre carga y consulta.
- `Dialog`, `ScrollPanel`, `ProgressSpinner` y `Calendar`: componentes de PrimeVue autoimportados.

### Autenticación y configuración

- `middleware/auth.ts`: valida sesión y cliente seleccionado.
- `composables/login/validaciones.ts`: verifica el token contra el backend.
- `server/api/front/cookiesRemisiones.post.ts`: almacena `token`, `usuario`, `permissions` y clientes en cookies.
- `nuxt.config.ts`: define `runtimeConfig.public.apiBackendCliente` desde `GLOBAL_URL_SERVER` y configura PrimeVue en modo `unstyled`.
- `assets/css/main.css`, `tailwind.config.js` y `presets/aura`: base visual compartida.

### Interfaces relacionadas

- `interfaces/filters.ts`: `HeaderWithFilters` y `WarningTable`.
- `interfaces/componentesDinamicos.ts`: `ItemTabPanel` y `OptionDropdown`.

### Backend externo

- `IENM_ADMIN/app/Http/Controllers/ScheduledDetailController.php`.
- `IENM_ADMIN/routes/api.php`.
- Tablas persistidas por el backend: `clients.scheduled_detail` y `clients.weekly_scheduled_detail`.

El backend es una dependencia externa del frontend; la interfaz no conoce la conexión de base de datos ni ejecuta consultas directas.

## Reglas de negocio

- El periodo se selecciona como año y semana ISO.
- El selector solo ofrece las semanas que realmente existen en el año elegido.
- El archivo es obligatorio para previsualizar y el input sugiere extensiones `.xlsx` y `.xls`.
- La previsualización exitosa es el origen del contexto y de las filas enviadas al guardado.
- El botón de guardado solo se presenta si la API devolvió al menos una fila.
- La interfaz no permite editar manualmente las filas previsualizadas.
- El reemplazo requiere una respuesta de conflicto de la API y una confirmación explícita del usuario.
- Cancelar el diálogo no modifica la programación existente y descarta el payload pendiente.
- Una respuesta exitosa de guardado retira la previsualización de la pantalla.
- La consulta muestra el conjunto completo retornado por la API y realiza paginación, filtros y búsquedas en memoria.
- La visibilidad en el menú depende de `view_scheduled_detail` y la entrada padre depende de `view_objetivos`.
- El usuario enviado proviene de la cookie `usuario`.

## Validaciones actuales

### Antes de previsualizar

- Año obligatorio.
- Semana obligatoria y comprendida entre `1` y `53`.
- Semana seleccionable únicamente después de elegir año.
- Archivo obligatorio.
- Cookie `usuario` obligatoria.
- `accept=".xlsx,.xls"` limita el selector visual del navegador, pero no constituye una validación de seguridad.

### Respuesta de previsualización

- La página solo considera exitosa la operación cuando el HTTP es exitoso y `result.success` es verdadero.
- Los errores de validación recibidos en `result.errors` se muestran por clave o fila.
- El frontend no revalida cliente, SKU, producto, actividad ni total; utiliza el resultado del backend.
- El campo `missing_columns` que puede devolver la API no está incluido en el contrato ni se presenta al usuario.

### Antes de guardar

- Debe existir `previewContext`.
- Debe haber filas previsualizadas para que el botón esté disponible.
- Se bloquean nuevos clics mientras `isSaving` es verdadero.
- La confirmación no se puede ejecutar sin `pendingSaveRequest`.

### Consulta

- No existen entradas del usuario que se envíen al backend.
- Las búsquedas convierten texto y valores a minúsculas antes de aplicar `includes`.
- `client_name` vacío o nulo se normaliza visualmente como `Sin cliente`.
- Las fechas se recortan sin validar su formato antes de mostrarlas.

## Dependencias

- Nuxt 3: rutas por archivos, middleware, autoimportación, cookies y `runtimeConfig`.
- Vue 3: `ref`, `computed`, `watch`, `v-model` y Composition API.
- TypeScript: contratos de solicitudes, respuestas, filas y estado.
- PrimeVue 3 en modo `unstyled`: calendario, diálogos, scroll, spinner y efectos visuales.
- Tailwind CSS y el preset Aura local: distribución responsive y estilos.
- Componentes dinámicos compartidos: tablas, filtros, calendario, selector y paginador.
- `GLOBAL_URL_SERVER`, expuesta como `config.public.apiBackendCliente`.
- Cookies `token`, `permissions`, `usuario`, `idCliente` y `nameClient`.
- Backend `IENM_ADMIN`: validación de Excel, resolución de catálogos, persistencia y listado.
- API del navegador: `fetch`, `FormData`, `File` e `Intl.DateTimeFormat`.

La dependencia `xlsx` está instalada en el proyecto, pero este submódulo no la usa; el archivo se procesa en el backend con PhpSpreadsheet.

## Riesgos

- Ocultar el menú no impide abrir directamente las rutas; cualquier usuario autenticado con cliente seleccionado puede intentar acceder a ambas páginas.
- Las llamadas propias del submódulo no envían el token `Bearer`, por lo que dependen de endpoints backend sin autenticación o de una futura adaptación del contrato.
- `username` se toma de una cookie accesible al frontend y se envía como dato de auditoría.
- Después de previsualizar, cambiar el año o la semana no invalida las filas ni `previewContext`; la pantalla puede mostrar un periodo nuevo mientras el guardado conserva el periodo anterior.
- El filtro `accept` no comprueba tamaño, MIME ni contenido antes de subir el archivo.
- La interfaz no muestra `missing_columns`, aunque el backend lo devuelve cuando la plantilla está incompleta.
- Una previsualización exitosa sin filas importables muestra un mensaje positivo, pero no explica por qué no aparece el botón de guardado.
- La URL se concatena como `${apiBackendCliente}api/...`; la configuración debe terminar en `/`.
- Todas las programaciones y detalles se descargan en una sola respuesta y se mantienen en memoria.
- No hay validación en tiempo de ejecución de la forma del JSON; una respuesta incompatible puede producir estados parciales o errores de renderizado.
- El listado conserva `records` durante una recarga; si una solicitud posterior falla, los datos anteriores pueden prevalecer visualmente sobre el estado de error del componente compartido.
- La verificación de permisos del menú usa `includes` sobre el valor de la cookie, lo que puede comportarse como búsqueda por subcadena si la cookie se serializa como texto.
- No existen pruebas automatizadas específicas para estas páginas o el composable.

## Consideraciones

- `idCliente` es obligatorio para superar el middleware, pero no forma parte de los payloads de Programación detallada.
- La semana mostrada se calcula en UTC para evitar desplazamientos de fecha; el año se obtiene con `Date.getFullYear()` del valor del calendario.
- El contexto de guardado proviene de la respuesta de previsualización, no de los controles visibles en el momento del clic.
- `activity_id` forma parte de la fila previsualizada, pero se descarta al construir `ScheduledDetailSaveRequest`.
- El nombre del cliente se muestra desde la previsualización; en la consulta se usa `client_name` devuelto por el listado.
- La tabla compartida agrega una primera columna vacía para controles y pagina cinco elementos por defecto.
- Los filtros y búsquedas no modifican `previewRows`; el guardado incluye todas las filas previsualizadas, no solo las visibles.
- `ScheduledDetailData.ts` exporta `ref` a nivel de módulo, por lo que las pestañas y metadatos son estado compartido entre consumidores.
- El componente de pestañas conserva un nombre ligado a Remisiones aunque se reutiliza en este submódulo.
- Cualquier cambio en los nombres de campos debe coordinarse con `useScheduledDetailApi.ts`, ambas páginas y el contrato de `IENM_ADMIN`.

