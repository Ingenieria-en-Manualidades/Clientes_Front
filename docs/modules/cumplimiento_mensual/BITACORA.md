# BITACORA.md

Registro de cambios del modulo `cumplimiento_mensual`.

Cada cambio funcional, tecnico o documental debe registrarse aqui con fecha, motivo, archivos afectados y notas relevantes.

## 2026-05-19

### Bloqueo de doble envio en calidad y evidencias

Motivo:
- Evitar que multiples clicks sobre `Guardar` o `Actualizar` disparen peticiones duplicadas mientras la primera sigue en proceso.

Archivos afectados:
- `components/objetivos/FormChecklist.vue`
- `Clientes_Front/components/objetivos/FormChecklist.vue (line 70)` boton deshabilitado con `isSubmitting`.
- `Clientes_Front/components/objetivos/FormChecklist.vue (line 100)` declaracion de `isSubmitting`.
- `Clientes_Front/components/objetivos/FormChecklist.vue (line 113)` bloqueo de reenvio si ya hay peticion en curso.
- `Clientes_Front/components/objetivos/FormChecklist.vue (line 137)` activacion del bloqueo antes de llamar API.
- `Clientes_Front/components/objetivos/FormChecklist.vue (line 156)` liberacion del bloqueo en `finally`.
- `components/objetivos/FormCalidad.vue`
- `Clientes_Front/components/objetivos/FormCalidad.vue (line 72)` boton deshabilitado con `isSubmitting`.
- `Clientes_Front/components/objetivos/FormCalidad.vue (line 99)` declaracion de `isSubmitting`.
- `Clientes_Front/components/objetivos/FormCalidad.vue (line 117)` bloqueo de reenvio si ya hay peticion en curso.
- `Clientes_Front/components/objetivos/FormCalidad.vue (line 147)` activacion del bloqueo antes de llamar API.
- `Clientes_Front/components/objetivos/FormCalidad.vue (line 172)` liberacion del bloqueo en `finally`.
- `components/objetivos/ModalUpdateFile.vue`
- `Clientes_Front/components/objetivos/ModalUpdateFile.vue (line 62)` boton deshabilitado con `isSubmitting`.
- `Clientes_Front/components/objetivos/ModalUpdateFile.vue (line 113)` declaracion de `isSubmitting`.
- `Clientes_Front/components/objetivos/ModalUpdateFile.vue (line 149)` bloqueo de reenvio si ya hay peticion en curso.
- `Clientes_Front/components/objetivos/ModalUpdateFile.vue (line 166)` activacion del bloqueo antes de llamar API.
- `Clientes_Front/components/objetivos/ModalUpdateFile.vue (line 192)` liberacion del bloqueo en `finally`.
- `docs/modules/cumplimiento_mensual/BITACORA.md`

Cambios realizados:
- Se agrego `isSubmitting` para ignorar nuevos envios durante el guardado o actualizacion.
- Los botones quedan deshabilitados mientras se procesa la peticion.
- El texto de los botones cambia a estado de proceso durante la operacion.
- Las llamadas API quedaron protegidas con `try/finally` para liberar el bloqueo al terminar.

Notas:
- No se modifico la validacion ni el payload enviado a las APIs.

## 2026-05-08

### Documentacion inicial del contexto

Motivo:
- Crear el contexto tecnico y funcional del submodulo Cumplimiento Mensual.

Archivos afectados:
- `docs/modules/cumplimiento_mensual/CONTEXT.md`
- `docs/modules/cumplimiento_mensual/BITACORA.md`

Cambios realizados:
- Se documentaron ruta, menu, formularios de calidad, evidencias PDF, APIs, flujo funcional, riesgos y consideraciones futuras.
