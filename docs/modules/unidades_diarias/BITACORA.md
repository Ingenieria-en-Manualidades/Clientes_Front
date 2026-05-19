# BITACORA.md

Registro de cambios del modulo `unidades_diarias`.

Cada vez que se realice un cambio funcional, tecnico o documental sobre este modulo, se debe agregar una nueva entrada en este archivo con fecha, resumen, motivo, archivos afectados y notas relevantes.

Formato recomendado para nuevas entradas:

```md
## YYYY-MM-DD

### Titulo corto del cambio

Motivo:
- Por que se realizo el cambio.

Archivos afectados:
- `ruta/del/archivo`

Cambios realizados:
- Detalle concreto del cambio.

Notas:
- Riesgos, pendientes o decisiones importantes.
```

## 2026-05-19

### Bloqueo de doble envio en formularios de unidades

Motivo:
- Evitar que multiples clicks sobre botones de guardar o actualizar disparen peticiones duplicadas mientras la primera sigue en proceso.

Archivos afectados:
- `components/objetivos/FormUnitsMonthly.vue`
- `Clientes_Front/components/objetivos/FormUnitsMonthly.vue (line 33)` boton deshabilitado con `isSubmitting`.
- `Clientes_Front/components/objetivos/FormUnitsMonthly.vue (line 58)` declaracion de `isSubmitting`.
- `Clientes_Front/components/objetivos/FormUnitsMonthly.vue (line 88)` bloqueo de reenvio si ya hay peticion en curso.
- `Clientes_Front/components/objetivos/FormUnitsMonthly.vue (line 114)` activacion del bloqueo antes de llamar API.
- `Clientes_Front/components/objetivos/FormUnitsMonthly.vue (line 133)` liberacion del bloqueo en `finally`.
- `components/objetivos/FormUnitsDaily.vue`
- `Clientes_Front/components/objetivos/FormUnitsDaily.vue (line 33)` boton deshabilitado con `isSubmitting`.
- `Clientes_Front/components/objetivos/FormUnitsDaily.vue (line 61)` declaracion de `isSubmitting`.
- `Clientes_Front/components/objetivos/FormUnitsDaily.vue (line 94)` bloqueo de reenvio si ya hay peticion en curso.
- `Clientes_Front/components/objetivos/FormUnitsDaily.vue (line 120)` activacion del bloqueo antes de llamar API.
- `Clientes_Front/components/objetivos/FormUnitsDaily.vue (line 140)` liberacion del bloqueo en `finally`.
- `components/objetivos/ModalUpdateUnits.vue`
- `Clientes_Front/components/objetivos/ModalUpdateUnits.vue (line 42)` boton deshabilitado con `isSubmitting`.
- `Clientes_Front/components/objetivos/ModalUpdateUnits.vue (line 67)` declaracion de `isSubmitting`.
- `Clientes_Front/components/objetivos/ModalUpdateUnits.vue (line 101)` bloqueo de reenvio si ya hay peticion en curso.
- `Clientes_Front/components/objetivos/ModalUpdateUnits.vue (line 120)` activacion del bloqueo antes de llamar API.
- `Clientes_Front/components/objetivos/ModalUpdateUnits.vue (line 147)` liberacion del bloqueo en `finally`.
- `components/objetivos/ModalUpdateUnitsDaily.vue`
- `Clientes_Front/components/objetivos/ModalUpdateUnitsDaily.vue (line 38)` boton deshabilitado con `isSubmitting`.
- `Clientes_Front/components/objetivos/ModalUpdateUnitsDaily.vue (line 76)` declaracion de `isSubmitting`.
- `Clientes_Front/components/objetivos/ModalUpdateUnitsDaily.vue (line 96)` bloqueo de reenvio si ya hay peticion en curso.
- `Clientes_Front/components/objetivos/ModalUpdateUnitsDaily.vue (line 108)` activacion del bloqueo antes de llamar API.
- `Clientes_Front/components/objetivos/ModalUpdateUnitsDaily.vue (line 135)` liberacion del bloqueo en `finally`.
- `docs/modules/unidades_diarias/BITACORA.md`

Cambios realizados:
- Se agrego `isSubmitting` en los formularios y modales del modulo.
- Los botones quedan deshabilitados mientras se procesa la peticion.
- El texto de los botones cambia a estado de proceso durante el envio o actualizacion.
- Las llamadas API quedaron protegidas con `try/finally` para liberar el bloqueo al terminar.

Notas:
- No se modifico la validacion ni el payload enviado a las APIs.

## 2026-05-07

### Documentacion inicial del contexto del modulo

Motivo:
- Dejar documentado el funcionamiento tecnico y funcional del modulo frontend de Unidades Programadas / Unidades Diarias.
- Tener una referencia para futuros cambios sobre registro, consulta y actualizacion de metas mensuales y unidades diarias.

Archivos afectados:
- `docs/modules/unidades_diarias/CONTEXT.md`

Cambios realizados:
- Se documento el objetivo del modulo.
- Se documento el alcance frontend del modulo.
- Se registraron las rutas usadas:
  - `/objetivos/unidades`
  - `/objetivos/unidadesTable`
- Se documento la ubicacion en menu bajo `Tablero Sae > Unidades programadas`.
- Se listaron archivos frontend relevantes del modulo.
- Se documentaron componentes principales:
  - `pages/objetivos/unidades.vue`
  - `pages/objetivos/unidadesTable.vue`
  - `components/objetivos/FormUnitsMonthly.vue`
  - `components/objetivos/FormUnitsDaily.vue`
  - `components/objetivos/ModalUnitsDaily.vue`
  - `components/objetivos/ModalUpdateUnits.vue`
  - `components/objetivos/ModalUpdateUnitsDaily.vue`
  - `components/objetivos/ModalReasonUpdateGoal.vue`
- Se documentaron composables API:
  - `composables/objetivos/UnitsApi.ts`
  - `composables/objetivos/UnitsDailyApi.ts`
- Se documentaron interfaces relevantes:
  - `Units`
  - `UnitsDaily`
  - `Area`
  - `ApiPromiseStandard<T>`
- Se documentaron datos de tabla y tabs desde `UnitsData.ts`.
- Se registraron permisos usados:
  - `view_objetivos_unidades`
  - `form_unidades_mensuales`
  - `form_unidades_diarios`
  - `update_unidades_mensuales`
  - `update_unidades_diarias`
  - `insert_all_daily units`
  - `update_all_daily units`
- Se documentaron cookies usadas:
  - `permissions`
  - `idCliente`
  - `usuario`
- Se documentaron variables de entorno/runtimeConfig usadas.
- Se documentaron los flujos funcionales:
  - Crear meta mensual.
  - Crear unidad diaria.
  - Consultar metas y unidades diarias.
  - Actualizar meta mensual.
  - Actualizar unidad diaria.
- Se documentaron reglas de negocio reflejadas en frontend.
- Se documentaron endpoints backend usados por el frontend.
- Se agregaron riesgos y puntos de atencion.
- Se agregaron consideraciones para cambios futuros.

Fechas conocidas:
- `CONTEXT.md` fue creado el `2026-05-07 10:38:45`.
- `CONTEXT.md` fue modificado el `2026-05-07 10:48:10`.

Notas:
- La fecha exacta viene del sistema de archivos local.
- Como la carpeta `docs/modules/unidades_diarias` aparece no versionada en Git, no hay historial de commits para reconstruir cambios mas detallados.

## 2026-05-08

### Creacion de archivos de seguimiento del modulo

Motivo:
- Preparar archivos para seguimiento documental del modulo.
- Registrar cambios futuros de forma ordenada.

Archivos afectados:
- `docs/modules/unidades_diarias/BITACORA.md`
- `docs/modules/unidades_diarias/PENDING.md`

Cambios realizados:
- Se creo `BITACORA.md` para registrar historial de cambios.
- Se creo `PENDING.md` para registrar pendientes del modulo.
- Se agrego esta primera estructura de bitacora y el formato recomendado para nuevas entradas.

Fechas conocidas:
- `BITACORA.md` fue creado el `2026-05-08 12:15:38`.
- `PENDING.md` fue creado el `2026-05-08 12:16:29`.

Notas:
- Al momento de esta entrada, `PENDING.md` esta vacio.
- Desde ahora, cualquier cambio funcional, tecnico o documental sobre `unidades_diarias` debe agregarse en esta bitacora.
