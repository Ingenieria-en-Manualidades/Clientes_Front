# BITACORA.md

Registro de cambios del modulo `cumplimiento_diario`.

Cada cambio funcional, tecnico o documental debe registrarse aqui con fecha, motivo, archivos afectados y notas relevantes.

## 2026-05-19

### Bloqueo de doble envio en cumplimiento diario

Motivo:
- Evitar que multiples clicks sobre botones de ingreso disparen peticiones repetidas mientras la primera sigue en proceso.

Archivos afectados:
- `components/objetivos/FormProduccion.vue`
- `Clientes_Front/components/objetivos/FormProduccion.vue (line 36)` boton planificada deshabilitado con `isSubmittingPlanificada`.
- `Clientes_Front/components/objetivos/FormProduccion.vue (line 71)` boton modificada deshabilitado con `isSubmittingModificada`.
- `Clientes_Front/components/objetivos/FormProduccion.vue (line 95)` declaracion de `isSubmittingPlanificada`.
- `Clientes_Front/components/objetivos/FormProduccion.vue (line 96)` declaracion de `isSubmittingModificada`.
- `Clientes_Front/components/objetivos/FormProduccion.vue (line 103)` bloqueo de reenvio en planificada.
- `Clientes_Front/components/objetivos/FormProduccion.vue (line 118)` activacion del bloqueo en planificada antes de llamar API.
- `Clientes_Front/components/objetivos/FormProduccion.vue (line 132)` liberacion del bloqueo de planificada en `finally`.
- `Clientes_Front/components/objetivos/FormProduccion.vue (line 144)` bloqueo de reenvio en modificada.
- `Clientes_Front/components/objetivos/FormProduccion.vue (line 159)` activacion del bloqueo en modificada antes de llamar API.
- `Clientes_Front/components/objetivos/FormProduccion.vue (line 173)` liberacion del bloqueo de modificada en `finally`.
- `components/objetivos/FormIndicadores.vue`
- `Clientes_Front/components/objetivos/FormIndicadores.vue (line 82)` boton deshabilitado con `isSubmitting`.
- `Clientes_Front/components/objetivos/FormIndicadores.vue (line 105)` declaracion de `isSubmitting`.
- `Clientes_Front/components/objetivos/FormIndicadores.vue (line 123)` bloqueo de reenvio si ya hay peticion en curso.
- `Clientes_Front/components/objetivos/FormIndicadores.vue (line 155)` activacion del bloqueo antes de llamar API.
- `Clientes_Front/components/objetivos/FormIndicadores.vue (line 179)` liberacion del bloqueo en `finally`.
- `components/objetivos/FormAccidentes.vue`
- `Clientes_Front/components/objetivos/FormAccidentes.vue (line 57)` boton deshabilitado con `isSubmitting`.
- `Clientes_Front/components/objetivos/FormAccidentes.vue (line 80)` declaracion de `isSubmitting`.
- `Clientes_Front/components/objetivos/FormAccidentes.vue (line 88)` bloqueo de reenvio si ya hay peticion en curso.
- `Clientes_Front/components/objetivos/FormAccidentes.vue (line 104)` activacion del bloqueo antes de llamar API.
- `Clientes_Front/components/objetivos/FormAccidentes.vue (line 128)` liberacion del bloqueo en `finally`.
- `docs/modules/cumplimiento_diario/BITACORA.md`

Cambios realizados:
- Se agrego `isSubmitting` en los formularios del modulo.
- En produccion se separo el bloqueo de `Planificada` y `Modificada` para no cruzar estados entre botones.
- Los botones quedan deshabilitados mientras se procesa la peticion.
- El texto de los botones cambia a estado de proceso durante el envio.
- Las llamadas API quedaron protegidas con `try/finally` para liberar el bloqueo al terminar.

Notas:
- No se modifico la validacion ni el payload enviado a las APIs.
- `FormAccidentes.vue` no tiene carpeta documental propia en `docs/modules`; se registra aqui por su integracion con formularios de objetivos.

## 2026-05-08

### Documentacion inicial del contexto

Motivo:
- Crear el contexto tecnico y funcional del submodulo Cumplimiento Diario.

Archivos afectados:
- `docs/modules/cumplimiento_diario/CONTEXT.md`
- `docs/modules/cumplimiento_diario/BITACORA.md`

Cambios realizados:
- Se documentaron ruta, menu, formularios de produccion e indicadores, APIs, flujo funcional, riesgos y consideraciones futuras.
