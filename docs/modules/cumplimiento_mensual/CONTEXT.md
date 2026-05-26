# CONTEXT.md

## Objetivo
el submodulo `Cumplimiento Mensual`, usado para registrar calificaciones mensuales de calidad y sus evidencias PDF.

## Alcance frontend
- Registrar calificacion mensual de `checklist`.
- Registrar calificacion mensual de `inspeccion_sol`.
- Cargar evidencia PDF por cada registro.
- Listar evidencias asociadas al cliente.
- Exportar/descargar evidencias.
- Actualizar evidencias existentes.
- Mostrar estados vacios, carga y error.
- Ejecutar recorrido guiado con `#stepByStep`.

## Ruta
1. `/objetivos/calidad`
   - Archivo: `pages/objetivos/calidad.vue`.
   - `layout: "default"`.
   - `middleware: "auth"`.
   - `requiresAuth: true`.

## Ubicacion en menu
- Padre: `Tablero Sae`.
- Nombre: `Cumplimiento Mensual`.
- Ruta: `/objetivos/calidad`.
- Permiso: `view_objetivos_calidad`.
- Recorrido guiado: `stepByStep: true`.

## Archivos relevantes
- `pages/objetivos/calidad.vue`.
- `components/objetivos/FormChecklist.vue`.
- `components/objetivos/FormCalidad.vue`.
- `components/objetivos/ModalUpdateFile.vue`.
- `components/dinamicos/Tabla.vue`.
- `composables/objetivos/useObjetivosApi.ts`.
- `composables/objetivos/useFilesApi.ts`.
- `composables/objetivos/driver.ts`.
- `interfaces/objetives.ts`.

## Composables API
### `useObjetivosApi`
- `createCalidad(objCalidad)`
  - `POST api/guardarCalidad`.
  - Luego llama `createFile`.
- `createFile(objArchivo)`
  - `POST api/guardarArchivo`.
- `listarFiles(clienteID)`
  - `POST api/listarArchivos`.
- `descargarArchivo(urlArchivo, nombreArchivo)`
  - `POST api/descargar-pdf`.

### `useFilesApi`
- `updateFile(objArchivo)`
  - `POST api/deleteFile`.
  - Luego vuelve a crear evidencia con `guardarArchivo`.

## Flujo funcional
1. Usuario entra a `/objetivos/calidad`.
2. Front lista archivos con `listarFiles(idCliente)`.
3. Usuario registra `checklist` o `inspeccion_sol`.
4. Front valida mes, calificacion y archivo PDF.
5. Front envia calidad.
6. Backend devuelve `tablero_sae_id`.
7. Front sube evidencia a `guardarArchivo`.
8. Tabla de evidencias se refresca.
9. Usuario puede descargar o actualizar evidencia.

## Cookies usadas
- `idCliente`: cliente activo.

## Backend relacionado
- `CalidadController`.
- `FileController`.
- Rutas:
  - `POST /api/guardarCalidad`.
  - `POST /api/listarArchivos`.
  - `POST /api/guardarArchivo`.
  - `POST /api/descargar-pdf`.
  - `POST /api/deleteFile`.

## Reglas de negocio frontend
- Archivo obligatorio.
- Archivo debe ser PDF.
- Calificacion debe estar entre 0 y 100.
- Tipos actuales:
  - `checklist`.
  - `inspeccion_sol`.

## Riesgos y puntos de atencion
- El guardado es secuencial: primero calidad, luego archivo.
- Si falla archivo despues de guardar calidad, puede quedar registro sin evidencia.
- `updateFile` borra primero y luego crea nuevo archivo.
- `yearFile` usa ano actual, no necesariamente ano del mes seleccionado.
- Algunos textos tienen codificacion incorrecta.

## Consideraciones futuras
1. Revisar atomicidad entre calidad y archivo.
2. Mantener tipos de formulario coordinados con backend.
3. Registrar cambios en `docs/modules/cumplimiento_mensual/BITACORA.md`.
