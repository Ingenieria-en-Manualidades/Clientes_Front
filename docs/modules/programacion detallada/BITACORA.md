# Bitácora - Programación detallada

Registro de cambios relevantes del frontend de `Programación detallada`. Las entradas iniciales fueron reconstruidas a partir de los archivos y sus fechas disponibles en el workspace, porque esta copia no conserva historial Git propio del submódulo.

## 2026-08-04

### Creación del flujo frontend

Qué se hizo:

- Se agregaron las páginas `programacion-detallada.vue` y `programacion-detallada-table.vue`.
- Se creó `useScheduledDetailApi.ts` con los contratos TypeScript y las operaciones de previsualización, guardado y consulta.
- Se creó `ScheduledDetailData.ts` para centralizar pestañas, columnas y atributos del listado.
- Se incorporaron selección de año y semana, carga de Excel, tabla de previsualización, listado de programaciones y modal de detalle.

Por qué se hizo:

- Se necesitaba una interfaz para revisar una programación semanal antes de guardarla y consultar posteriormente las programaciones registradas.

Impacto del cambio:

- El usuario puede ejecutar el flujo completo desde el módulo de objetivos sin procesar el Excel en el navegador.
- Los contratos del submódulo quedan tipados y concentrados en un composable de API.
- La carga y la consulta se presentan como dos vistas conectadas mediante pestañas.

## 2026-08-05

### Integración con navegación, permisos y tablas compartidas

Qué se hizo:

- Se agregó `Programación Detallada` dentro de `Tablero Sae` en `composables/menuItems.ts`.
- La visibilidad del acceso quedó asociada al permiso `view_scheduled_detail`.
- Las páginas quedaron configuradas con layout `default`, middleware `auth` y `requiresAuth: true`.
- Se reutilizaron los componentes dinámicos de calendario, selector, tabla, checklist y paginador, además del panel de pestañas existente.

Por qué se hizo:

- El submódulo debía integrarse en la navegación y conservar los patrones de sesión, permisos y componentes visuales del proyecto.

Impacto del cambio:

- El acceso aparece en el menú de los usuarios cuyo valor de permisos contiene `view_scheduled_detail`.
- La navegación exige sesión válida y cliente seleccionado.
- Las tablas heredan filtros, estados y paginación local compartidos con otros módulos.

## 2026-08-11

### Validación visible y confirmación de reemplazo

Qué se hizo:

- El flujo disponible incorporó mensajes diferenciados de éxito, validación y conexión.
- Se mostraron errores del backend por campo o número de fila.
- Se agregó búsqueda sobre las filas previsualizadas y los detalles consultados.
- Se incorporó el manejo de `requires_confirmation` y el diálogo para repetir el guardado con `replace_existing = true`.
- Se agregaron estados `isLoading` e `isSaving` para bloquear acciones repetidas durante las solicitudes.

Por qué se hizo:

- La carga necesitaba informar problemas concretos de la plantilla y evitar que una programación existente fuera sustituida sin confirmación explícita.

Impacto del cambio:

- El usuario puede corregir filas identificadas antes de guardar.
- Los dobles clics sobre acciones en curso quedan limitados por los estados de carga.
- El reemplazo se ejecuta únicamente después de aceptar el diálogo de confirmación.

## 2026-08-19

### Documentación frontend inicial

Qué se hizo:

- Se creó `docs/programacion detallada` en el proyecto frontend.
- Se agregaron `CONTEXT.md`, `BITACORA.md` y `PENDING.md`.
- Se documentaron las rutas, estados, tablas visuales, contratos TypeScript, validaciones, dependencias, riesgos y asuntos pendientes del frontend.

Por qué se hizo:

- Se requería una fuente de contexto específica del frontend para futuras intervenciones humanas o asistidas por IA.

Impacto del cambio:

- El funcionamiento actual queda centralizado sin mezclarlo con el historial ni con el trabajo pendiente.
- Los cambios relevantes del frontend quedan registrados por separado.
- Los bugs, mejoras, validaciones y dudas funcionales quedan reunidos en un único documento.

