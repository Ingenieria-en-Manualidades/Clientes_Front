# CONTEXT.md

## Objetivo
el submodulo `Metas` de Tablero SAE, usado para registrar metas mensuales porcentuales por cliente.

## Alcance frontend
- Seleccionar mes.
- Registrar metas porcentuales:
  - Cumplimiento Plan de Armado.
  - Eficiencia Productiva.
  - Inspeccion de Calidad.
  - Desperdicios M.E.
  - Desperdicios P.P.
- Validar campos obligatorios.
- Validar valores numericos entre 0 y 100.
- Crear meta y tablero SAE asociado.
- Ejecutar recorrido guiado con `#stepByStep`.

## Ruta
1. `/objetivos`
   - Archivo: `pages/objetivos/index.vue`.
   - `layout: "default"`.
   - `middleware: "auth"`.
   - `requiresAuth: true`.

## Ubicacion en menu
- Padre: `Tablero Sae`.
- Nombre: `Metas`.
- Ruta: `/objetivos`.
- Permiso: `view_objetivos_mensuales`.
- Recorrido guiado: `stepByStep: true`.

## Archivos relevantes
- `pages/objetivos/index.vue`.
- `components/objetivos/FormObjetivosMen.vue`.
- `composables/objetivos/useObjetivosApi.ts`.
- `composables/objetivos/datosObjetivos.ts`.
- `composables/objetivos/driver.ts`.
- `interfaces/objetives.ts`.

## Composables API
### `useObjetivosApi`
- `createMeta(objetivosData)`
  - `POST api/guardarMeta`.
  - Si backend responde bien, llama `createTableroSae`.
- `createTableroSae(metaID, clienteID, fecha)`
  - `POST api/guardarTablero`.

### `datosObjetivos`
- `getFecha(date)`.
- `setCheckMaxMinNumber(objMeta)`.

## Flujo funcional
1. Usuario entra a `/objetivos`.
2. Selecciona mes.
3. Ingresa porcentajes de metas.
4. Front valida campos obligatorios.
5. Front valida numeros y rango `0-100`.
6. Front envia:
   - `fecha`.
   - `cumplimiento`.
   - `eficienciaProductiva`.
   - `calidad`.
   - `desperdicioME`.
   - `desperdicioPP`.
   - `cliente_endpoint_id`.
7. Backend crea meta.
8. Front crea registro de tablero SAE asociado.
9. Se limpian campos y se muestra toast.

## Cookies usadas
- `idCliente`: cliente activo enviado como `cliente_endpoint_id`.

## Backend relacionado
- `MetaController`.
- `Tablero_SaeController`.
- Rutas:
  - `POST /api/guardarMeta`.
  - `POST /api/guardarTablero`.

## Riesgos y puntos de atencion
- `regex = /[0-9]/` solo verifica que exista algun digito, no que todo el valor sea numerico.
- El rango porcentual se valida en frontend con `setCheckMaxMinNumber`.
- Si falla `createTableroSae` despues de crear meta, puede quedar meta sin tablero asociado.
- Algunos textos tienen codificacion incorrecta.

## Consideraciones futuras
1. Mantener creacion de meta y tablero coordinada.
2. Si se cambia payload de metas, actualizar `interfaces/objetives.ts`.
3. Registrar cambios en `docs/modules/metas/BITACORA.md`.
