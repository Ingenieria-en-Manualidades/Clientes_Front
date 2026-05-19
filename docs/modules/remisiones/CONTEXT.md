# CONTEXT.md

## Objetivo
el modulo frontend `Remisiones`, usado para consultar, filtrar, previsualizar y gestionar remisiones del cliente activo.

El modulo consume informacion desde Groot y trabaja con tres estados:
- Pendientes.
- Aprobadas.
- Rechazadas.

## Alcance frontend
- Mostrar remisiones del cliente seleccionado.
- Separar remisiones por estado.
- Filtrar remisiones por una fecha o rango de fechas.
- Previsualizar el detalle de una remision.
- Aprobar o rechazar remisiones pendientes.
- Consultar motivo de remisiones rechazadas.
- Generar/exportar PDF desde remisiones aprobadas.
- Mostrar estados de carga, vacios y errores.
- Ejecutar recorrido guiado con `#stepByStep`.

## Rutas
1. `/remisiones`
   - Vista de remisiones pendientes.
   - Archivo: `pages/remisiones/index.vue`.
2. `/remisiones/Aprobadas`
   - Vista de remisiones aprobadas.
   - Archivo: `pages/remisiones/Aprobadas.vue`.
3. `/remisiones/rechazadas`
   - Vista de remisiones rechazadas.
   - Archivo: `pages/remisiones/rechazadas.vue`.

Todas usan:
- `layout: "default"`.
- `middleware: "auth"`.
- `requiresAuth: true`.

## Ubicacion en menu
- Archivo: `composables/menuItems.ts`.
- Nombre: `Remisiones`.
- Ruta: `/remisiones`.
- Permiso: `view_remisiones`.
- Recorrido guiado: `stepByStep: true`.

## Archivos relevantes
- `pages/remisiones/index.vue`.
- `pages/remisiones/Aprobadas.vue`.
- `pages/remisiones/rechazadas.vue`.
- `components/remisiones/TablaRemisiones.vue`.
- `components/remisiones/ModalPreviewRemision.vue`.
- `components/remisiones/ModalRechazo.vue`.
- `components/remisiones/TabPanelRemisiones.vue`.
- `composables/remisiones/remisionesApi.ts`.
- `composables/remisiones/datosRemisiones.ts`.
- `composables/remisiones/driver.ts`.
- `interfaces/remisiones.ts`.
- `interfaces/mensajes.ts`.

## Composables
### `useRemisionesApi`
- Usa `config.public.apiGroot`.
- Usa `config.public.tokenRemisiones`.
- Metodos:
  - `listarRemisionesPorId(idCliente)`.
  - `listarPreviewRemision(numRemision)`.
  - `agregarRemision(remision, numRemision)`.
  - `getNumRemisionesPen(cliente)`.

### `useDatosRemisiones`
- `setConsultar(tRemision, dataFecha)`.
- Convierte fechas a `YYYY-MM-DD`.
- Filtra por fecha unica o rango.
- Exporta tabs:
  - Pendientes.
  - Aprobadas.
  - Rechazadas.

## Flujo funcional
1. El usuario entra a una ruta de remisiones.
2. El frontend lee cookie `idCliente`.
3. Se consulta Groot con `listarRemisionesPorId(idCliente)`.
4. La vista filtra por estado:
   - `estado === null` para pendientes.
   - `estado === "Aprobado"` para aprobadas.
   - `estado === "Rechazado"` para rechazadas.
5. El usuario puede filtrar por fechas.
6. En pendientes puede abrir detalle y gestionar.
7. Al aprobar o rechazar se llama `agregarRemision`.
8. Las vistas se refrescan con el evento `listar`.

## Variables y cookies
- `idCliente`: cliente activo.
- `GLOBAL_URL_SERVER_GROOT` -> `config.public.apiGroot`.
- `TOKEN_REMISIONES` o equivalente -> `config.public.tokenRemisiones`.

## Riesgos y puntos de atencion
- El modulo depende de Groot, no del backend Laravel principal.
- Las rutas de Groot y el token deben venir desde runtimeConfig.
- El filtrado por estado se hace en frontend.
- Los textos actuales tienen problemas de codificacion en algunos archivos.
- Si cambia el contrato de Groot, revisar `interfaces/remisiones.ts` y `remisionesApi.ts`.

## Consideraciones futuras
1. Mantener tabs sincronizados con `datosRemisiones.ts`.
2. No cambiar estados (`Aprobado`, `Rechazado`, `null`) sin revisar todos los filtros.
3. Registrar cambios en `docs/modules/remisiones/BITACORA.md`.
