# CONTEXT.md

## Objetivo
Definir el funcionamiento tecnico y funcional del modulo de frontend Unidades Programadas / Unidades Diarias, construido en Nuxt 3, para registrar, consultar y actualizar metas mensuales y unidades diarias por cliente y area.

Este contexto se basa en el modulo backend DailyUnits, pero describe el comportamiento desde la aplicacion frontend.

## Alcance frontend
- Mostrar el acceso al modulo desde el menu Tablero Sae > Unidades programadas.
- Permitir registrar metas mensuales de unidades por cliente y area.
- Permitir registrar unidades diarias asociadas a una meta mensual existente en backend.
- Consultar metas mensuales registradas para el cliente seleccionado.
- Filtrar metas mensuales por rango de meses.
- Consultar unidades diarias asociadas a una meta mensual.
- Actualizar metas mensuales con motivo de actualizacion.
- Actualizar unidades diarias dentro de la ventana permitida por rol/permiso.
- Mostrar mensajes de exito, error, advertencia y estados vacios.
- Ejecutar recorrido guiado cuando la ruta contiene `#stepByStep`.

## Rutas del modulo
- `/objetivos/unidades`
  - Vista de ingreso.
  - Muestra formularios mensual y diario segun permisos.
- `/objetivos/unidadesTable`
  - Vista de consulta.
  - Lista metas mensuales, permite abrir unidades diarias y actualizar registros segun permisos.

Ambas rutas usan:
- `layout: "default"`
- `middleware: "auth"`
- `requiresAuth: true`

## Ubicacion en menu
- Archivo: `composables/menuItems.ts`
- Modulo padre: `Tablero Sae`
- Submodulo: `Unidades programadas`
- Ruta: `/objetivos/unidades`
- Permiso de visibilidad: `view_objetivos_unidades`
- Recorrido guiado: `stepByStep: true`

## Archivos frontend relevantes
- `pages/objetivos/unidades.vue`
- `pages/objetivos/unidadesTable.vue`
- `components/objetivos/FormUnitsMonthly.vue`
- `components/objetivos/FormUnitsDaily.vue`
- `components/objetivos/ModalUnitsDaily.vue`
- `components/objetivos/ModalUpdateUnits.vue`
- `components/objetivos/ModalUpdateUnitsDaily.vue`
- `components/objetivos/ModalReasonUpdateGoal.vue`
- `composables/objetivos/UnitsApi.ts`
- `composables/objetivos/UnitsDailyApi.ts`
- `composables/objetivos/UnitsData.ts`
- `composables/objetivos/driver.ts`
- `interfaces/objetives.ts`
- `interfaces/componentesDinamicos.ts`
- `interfaces/filters.ts`
- `nuxt.config.ts`

## Componentes principales

### `pages/objetivos/unidades.vue`
- Renderiza el tab panel de ingreso/consulta.
- Muestra `FormUnitsMonthly` si el usuario tiene `form_unidades_mensuales`.
- Muestra `FormUnitsDaily` si el usuario tiene `form_unidades_diarios`.
- Lee permisos desde cookie `permissions`.
- Ejecuta el tour `getDriverUnidadesIndex` si el hash coincide con `#stepByStep`.

### `components/objetivos/FormUnitsMonthly.vue`
- Formulario de meta mensual.
- Campos:
  - Fecha mensual.
  - Area.
  - Unidades.
- Consume areas desde `getAreasImec`.
- Crea metas con `createMetaUnidades`.
- Usa cookie `idCliente` como `cliente_endpoint_id`.
- Usa cookie `usuario` como `usuario`.
- Para usuarios distintos a `DEVUSER`, limita la fecha al mes actual y siguiente.
- Para `DEVUSER`, no aplica limite de meses.
- Formatea unidades con separador de miles antes de enviar.

### `components/objetivos/FormUnitsDaily.vue`
- Formulario de unidades diarias.
- Campos:
  - Fecha de programacion.
  - Area.
  - Unidades.
- Consume areas desde `getAreasImec`.
- Crea unidades con `createUnidadesDiarias`.
- Usa cookie `idCliente` como `cliente_endpoint_id`.
- Usa cookie `usuario` como `usuario`.
- Para usuarios sin permiso especial, limita la fecha desde 3 dias antes hasta 1 dia despues.
- Si el usuario es `DEVUSER` o tiene permiso `insert_all_daily units`, no aplica limite de dias.
- El backend puede rechazar el registro si no existe meta mensual asociada para cliente, area y mes.

### `pages/objetivos/unidadesTable.vue`
- Consulta metas mensuales.
- Primero obtiene areas desde `getAreasImec`.
- Luego llama `listMetaUnidades(cliente_endpoint_id, areas)`.
- Usa `DinamicosTableFilters` para tabla y filtros.
- Permite filtrar por rango de meses usando `getFechas`.
- Muestra advertencia si no hay metas registradas.
- Permite:
  - Abrir unidades diarias por meta con `ModalUnitsDaily`.
  - Ver motivo de actualizacion con `ModalReasonUpdateGoal`.
  - Actualizar meta mensual con `ModalUpdateUnits`, si tiene permiso `update_unidades_mensuales`.
- Ejecuta el tour `getDriverUnidadesTable` si el hash coincide con `#stepByStep`.

### `components/objetivos/ModalUnitsDaily.vue`
- Abre el listado de unidades diarias asociadas a una meta.
- Consume `listUnidadesDiarias(meta_unidades_id)`.
- Muestra tabla con fecha de programacion, valor, ultima actualizacion y usuario.
- Muestra advertencia si la meta no tiene unidades diarias.
- Permite abrir actualizacion diaria con `ModalUpdateUnitsDaily`.
- El boton de actualizacion diaria depende de:
  - Permiso `update_unidades_diarias`.
  - Ventana de fechas calculada en frontend.
  - Usuario `DEVUSER` o permiso `update_all_daily units` para saltar la ventana.

### `components/objetivos/ModalUpdateUnits.vue`
- Modal para actualizar meta mensual.
- Carga la meta con `getMetaUnidades(meta_unidades_id)`.
- Envia actualizacion con `updateMetaUnidades`.
- Requiere:
  - Nuevo valor.
  - Motivo de actualizacion.
- Al actualizar correctamente, emite `listTable` para refrescar la tabla.
- El backend maneja el versionado de la meta y reasigna unidades diarias.

### `components/objetivos/ModalUpdateUnitsDaily.vue`
- Modal para actualizar una unidad diaria.
- Carga el registro con `getUnidadesDiariasID(unidades_diarias_id)`.
- Envia actualizacion con `updateUnidadesDiarias`.
- Requiere nuevo valor.
- Al actualizar correctamente, emite `listTable` para refrescar el modal de unidades diarias.

### `components/objetivos/ModalReasonUpdateGoal.vue`
- Muestra el `motivo_actualizacion` de una meta versionada.
- En la tabla principal reemplaza la accion de actualizar cuando existe motivo.

## Composables API

### `composables/objetivos/UnitsApi.ts`
Usa `useRuntimeConfig()`:
- `config.public.apiBackendCliente`
- `config.public.apiGroot`

Metodos:
- `createMetaUnidades(objUnits)`
  - `POST {apiBackendCliente}api/createMetaUnidades`
- `listMetaUnidades(cliente_endpoint_id, areasGroot)`
  - `POST {apiBackendCliente}api/getListUnidadesMeta`
  - Envia `arraysAreas` para que backend pueda mapear areas.
- `getMetaUnidades(meta_unidades_id)`
  - `GET {apiBackendCliente}api/getMetaUnidades/{meta_unidades_id}`
- `updateMetaUnidades(objUnits, meta_unidades_id)`
  - `PUT {apiBackendCliente}api/updateMetaUnidades`
- `getAreasImec(clienteID)`
  - `GET {apiGroot}/api/area/listarCliente/{clienteID}`
- `getFechas(fecha1, fecha2)`
  - Helper local para convertir fechas de filtro a formato `YYYY-MM`.

### `composables/objetivos/UnitsDailyApi.ts`
Usa `useRuntimeConfig()`:
- `config.public.apiBackendCliente`

Metodos:
- `createUnidadesDiarias(objUnitsD)`
  - `POST {apiBackendCliente}api/createUnidadesDiarias`
- `listUnidadesDiarias(meta_unidades_id)`
  - `GET {apiBackendCliente}api/getListUnidadesDiarias/{meta_unidades_id}`
- `getUnidadesDiariasID(unidades_diaria_id)`
  - `GET {apiBackendCliente}api/getUnidadesDiariaID/{unidades_diaria_id}`
- `updateUnidadesDiarias(objUnits, unidades_diarias_id)`
  - `POST {apiBackendCliente}api/updateUnidadesDiarias`

Todos los metodos retornan una estructura estandar:
- `success`
- `title`
- `message`
- `data`, cuando aplica

## Interfaces relevantes
Archivo: `interfaces/objetives.ts`

### `Units`
- `valor`
- `fecha_meta`
- `cliente_endpoint_id`
- `area_id`
- `usuario`
- `motivo_actualizacion`

### `UnitsDaily`
- `valor`
- `fecha_programacion`
- `cliente_endpoint_id`
- `area_id`
- `usuario`

### `Area`
- `area_id`
- `cliente_id`
- `nombre_area`
- `activo`
- `usuario`
- Fechas de auditoria y borrado logico.

### `ApiPromiseStandard<T>`
- `success`
- `title`
- `message`
- `data`

## Datos de tabla y tabs
Archivo: `composables/objetivos/UnitsData.ts`

Tabs:
- `Ingresar` -> `/objetivos/unidades`
- `Consultar` -> `/objetivos/unidadesTable`

Tabla de metas mensuales:
- Headers: id, unidades, mes, area, version, usuario.
- Atributos: `meta_unidades_id`, `valor`, `fecha_meta`, `area_id_groot`, `actualizaciones`, `usuario`.
- El filtro de area usa `area_id_groot`.

Tabla de unidades diarias:
- Headers: fecha de programacion, valor, ultima actualizacion, usuario.
- Atributos: `fecha_programacion`, `valor`, `updated_at`, `usuario`.

## Permisos usados en frontend
- `view_objetivos_unidades`
  - Muestra el submodulo en menu.
- `form_unidades_mensuales`
  - Muestra formulario mensual.
- `form_unidades_diarios`
  - Muestra formulario diario.
- `update_unidades_mensuales`
  - Muestra boton para actualizar metas mensuales.
- `update_unidades_diarias`
  - Muestra boton para actualizar unidades diarias.
- `insert_all_daily units`
  - Permite ingresar unidades diarias sin limite de fechas.
- `update_all_daily units`
  - Permite actualizar unidades diarias sin limite de fechas.

Regla adicional:
- Usuario `DEVUSER` no tiene limites de mes/dia en los formularios y actualizaciones diarias.

## Cookies usadas
- `permissions`
  - Lista de permisos del usuario.
- `idCliente`
  - Cliente seleccionado. Se envia como `cliente_endpoint_id`.
- `usuario`
  - Usuario que crea o actualiza registros.

## Variables de entorno / runtimeConfig
Definidas en `nuxt.config.ts`:
- `GLOBAL_URL_SERVER` -> `config.public.apiBackendCliente`
- `GLOBAL_URL_SERVER_GROOT` -> `config.public.apiGroot`

No hardcodear URLs en componentes ni composables nuevos. Usar siempre `useRuntimeConfig()`.

## Flujo funcional

### Crear meta mensual
1. Usuario entra a `/objetivos/unidades`.
2. Front valida permiso `form_unidades_mensuales`.
3. Carga areas del cliente con `getAreasImec(idCliente)`.
4. Usuario selecciona mes, area y unidades.
5. Front valida campos requeridos.
6. Front envia `valor`, `fecha_meta`, `cliente_endpoint_id`, `area_id`, `usuario` y `motivo_actualizacion: null`.
7. Backend valida duplicados por cliente + area + mes.
8. Front muestra toast de exito o error.

### Crear unidad diaria
1. Usuario entra a `/objetivos/unidades`.
2. Front valida permiso `form_unidades_diarios`.
3. Carga areas del cliente con `getAreasImec(idCliente)`.
4. Usuario selecciona fecha, area y unidades.
5. Front valida campos requeridos y ventana de fecha.
6. Front envia `valor`, `fecha_programacion`, `cliente_endpoint_id`, `area_id` y `usuario`.
7. Backend valida que exista meta mensual para el mismo cliente, area y mes.
8. Front muestra toast de exito o error.

### Consultar metas y unidades diarias
1. Usuario entra a `/objetivos/unidadesTable`.
2. Front carga areas del cliente con `getAreasImec(idCliente)`.
3. Front consulta metas con `listMetaUnidades`.
4. Front muestra metas en `DinamicosTableFilters`.
5. Usuario puede filtrar por fecha mensual.
6. Usuario abre el modal de unidades diarias de una meta.
7. Front consulta `listUnidadesDiarias(meta_unidades_id)`.

### Actualizar meta mensual
1. Usuario debe tener `update_unidades_mensuales`.
2. Usuario abre modal desde la tabla principal.
3. Front carga detalle con `getMetaUnidades`.
4. Usuario ingresa nuevo valor y motivo.
5. Front envia `valor`, `usuario`, `meta_unidades_id` y `motivo_actualizacion`.
6. Backend versiona la meta.
7. Front refresca la tabla.

### Actualizar unidad diaria
1. Usuario debe tener `update_unidades_diarias`.
2. Front valida ventana de fechas, salvo `DEVUSER` o `update_all_daily units`.
3. Usuario abre modal desde el listado diario.
4. Front carga detalle con `getUnidadesDiariasID`.
5. Usuario ingresa nuevo valor.
6. Front envia `valor`, `usuario` y `unidades_diarias_id`.
7. Front refresca el listado diario.

## Reglas de negocio reflejadas en frontend
- La meta mensual solo permite mes actual y siguiente para usuarios normales.
- La meta mensual no limita meses para `DEVUSER`.
- La diaria solo permite desde 3 dias antes hasta 1 dia despues para usuarios normales.
- La diaria no limita fechas para `DEVUSER` o permiso `insert_all_daily units`.
- La actualizacion diaria se muestra dentro de ventana de fechas para usuarios normales.
- La actualizacion diaria no limita fechas para `DEVUSER` o permiso `update_all_daily units`.
- La existencia de meta mensual asociada se valida finalmente en backend.
- Los duplicados se validan finalmente en backend.

## Relacion con backend
El frontend depende de endpoints del backend DailyUnits:
- `POST /createMetaUnidades`
- `POST /getListUnidadesMeta`
- `GET /getMetaUnidades/{meta_unidades_id}`
- `PUT /updateMetaUnidades`
- `POST /createUnidadesDiarias`
- `GET /getListUnidadesDiarias/{meta_unidades_id}`
- `GET /getUnidadesDiariaID/{unidades_diaria_id}`
- `POST /updateUnidadesDiarias`

Tambien depende de Groot/IMEC para areas:
- `GET /api/area/listarCliente/{clienteID}`

El endpoint externo backend `GET /getDailyUnitsOfDay/{date}/{client_id}` no es consumido por este frontend segun la revision actual; esta pensado para integracion con clientes externos.

## Riesgos y puntos de atencion
- La ruta real del modulo esta bajo `/objetivos`, aunque el contexto funcional hable de DailyUnits.
- `AGENTS.md` menciona `pages/unidades-diarias.vue`, pero en el codigo actual la vista real es `pages/objetivos/unidades.vue`.
- Las ventanas de fecha se aplican en frontend; backend debe validar si se requiere enforcement fuerte.
- Los permisos `insert_all_daily units` y `update_all_daily units` contienen espacios, por lo que cualquier cambio de nombre debe coordinarse con backend/login/permisos.
- En `ModalUnitsDaily.vue`, la ventana de actualizacion usa `minDate.setDate(today - 4)`, mientras el texto funcional habla de 3 dias antes; revisar antes de tocar reglas.
- Los campos numericos se formatean con separador de miles y se limpian con `replace(".", "")`; esto solo remueve el primer punto. Para valores con mas de un separador podria requerirse `replaceAll` o regex global.
- Algunos textos muestran caracteres con codificacion incorrecta en archivos actuales, por ejemplo `programaciÃ³n`.
- `getUnidadesDiariasID` retorna `data.meta_unidades` aunque conceptualmente carga una unidad diaria; verificar contrato si se modifica.
- `listAreas` agrega opciones sin limpiar arrays previos; si el componente no se destruye al cambiar cliente podria duplicar areas.
- El filtro de areas en tabla mensual modifica `headers.value[3].options.labels`, que es estado compartido del composable.
- No hay tipos especificos para la respuesta de metas y unidades diarias; se usa `any[]` en tablas.

## Consideraciones para cambios futuros
- Antes de modificar el modulo, revisar primero este archivo y luego:
  1. `pages/objetivos/unidades.vue`
  2. `pages/objetivos/unidadesTable.vue`
  3. `components/objetivos/FormUnitsMonthly.vue`
  4. `components/objetivos/FormUnitsDaily.vue`
  5. `components/objetivos/ModalUnitsDaily.vue`
  6. `components/objetivos/ModalUpdateUnits.vue`
  7. `components/objetivos/ModalUpdateUnitsDaily.vue`
  8. `composables/objetivos/UnitsApi.ts`
  9. `composables/objetivos/UnitsDailyApi.ts`
  10. `interfaces/objetives.ts`
- Mantener el contrato de respuestas `{ success, title, message, data }`.
- No duplicar llamadas API si ya existen en los composables.
- No hardcodear URLs; usar `runtimeConfig`.
- Si se agregan validaciones criticas, idealmente replicarlas en backend.
- Si se cambia el nombre de permisos, actualizar menu, formularios, modales y backend/login.
- Si se cambia estructura de tablas o payloads backend, revisar los atributos en `UnitsData.ts`.
- Si se agregan nuevas pantallas, mantener tabs y navegacion coherentes con `RemisionesTabPanelRemisiones`.
