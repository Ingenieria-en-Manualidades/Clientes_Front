# CONTEXT.md

## Objetivo
el submodulo `Cumplimiento Diario`, usado para registrar produccion diaria e indicadores diarios del cliente activo.

## Alcance frontend
- Registrar produccion planificada.
- Registrar produccion modificada.
- Registrar indicadores diarios:
  - Cumplimiento plan armado.
  - Calidad.
  - Desperfecto M.E.
  - Desperfecto P.P.
- Validar campos obligatorios.
- Validar numeros no negativos y porcentajes entre 0 y 100.
- Ejecutar recorrido guiado con `#stepByStep`.

## Ruta
1. `/objetivos/diarios`
   - Archivo: `pages/objetivos/diarios.vue`.
   - `layout: "default"`.
   - `middleware: "auth"`.
   - `requiresAuth: true`.

## Ubicacion en menu
- Padre: `Tablero Sae`.
- Nombre: `Cumplimiento Diarios`.
- Ruta: `/objetivos/diarios`.
- Permiso: `view_objetivos_diarios`.
- Recorrido guiado: `stepByStep: true`.

## Archivos relevantes
- `pages/objetivos/diarios.vue`.
- `components/objetivos/FormProduccion.vue`.
- `components/objetivos/FormIndicadores.vue`.
- `composables/objetivos/useObjetivosApi.ts`.
- `composables/objetivos/datosObjetivos.ts`.
- `composables/objetivos/driver.ts`.
- `interfaces/objetives.ts`.

## Composables API
### `useObjetivosApi`
- `createObjetivos(objObjetivos)`
  - `POST api/guardarObjetivos`.
- `updateObjetivos(objObjetivos)`
  - `POST api/actualizarObjetivos`.

### `datosObjetivos`
- `objObjetivo`.
- `getFecha`.
- `getFechaMaxMin`.
- `setCheckMaxMinNumber`.

## Flujo funcional
1. Usuario entra a `/objetivos/diarios`.
2. Registra produccion planificada con fecha y valor.
3. Front envia `createObjetivos`.
4. Registra produccion modificada con fecha y valor.
5. Front envia `updateObjetivos`.
6. Registra indicadores diarios.
7. Front valida campos y porcentajes.
8. Front envia `updateObjetivos`.

## Cookies usadas
- `idCliente`: cliente activo enviado como `cliente_id`.

## Backend relacionado
- `ObjetivoController`.
- Rutas:
  - `POST /api/guardarObjetivos`.
  - `POST /api/actualizarObjetivos`.

## Reglas de negocio frontend
- Produccion planificada y modificada no aceptan numeros negativos.
- Indicadores porcentuales deben estar entre 0 y 100.
- Los limites de fecha existen comentados en el codigo; actualmente no se aplican desde los inputs.

## Riesgos y puntos de atencion
- Las restricciones de fecha estan comentadas en `FormProduccion` y `FormIndicadores`.
- `updateObjetivos` se usa tanto para produccion modificada como para indicadores.
- El objeto `objObjetivo` se reutiliza y se limpia manualmente.
- Algunos textos tienen codificacion incorrecta.

## Consideraciones futuras
1. Confirmar con negocio si deben reactivarse limites de fecha.
2. Revisar validacion numerica de inputs.
3. Registrar cambios en `docs/modules/cumplimiento_diario/BITACORA.md`.
