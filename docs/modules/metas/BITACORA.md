# BITACORA.md

Registro de cambios del modulo `metas`.

Cada cambio funcional, tecnico o documental debe registrarse aqui con fecha, motivo, archivos afectados y notas relevantes.

## 2026-05-14

### Bloqueo de doble envio en formulario de metas

Motivo:
- Evitar que multiples clicks sobre `Guardar` creen metas duplicadas mientras la primera peticion sigue en proceso.

Archivos afectados:
- `components/objetivos/FormObjetivosMen.vue`
- `Clientes_Front/components/objetivos/FormObjetivosMen.vue (line 103)` boton deshabilitado con `isSubmitting`.
- `Clientes_Front/components/objetivos/FormObjetivosMen.vue (line 132)` declaracion de `isSubmitting`.
- `Clientes_Front/components/objetivos/FormObjetivosMen.vue (line 147)` bloqueo de reenvio si ya hay peticion en curso.
- `Clientes_Front/components/objetivos/FormObjetivosMen.vue (line 192)` activacion del bloqueo antes de llamar API.
- `Clientes_Front/components/objetivos/FormObjetivosMen.vue (line 222)` liberacion del bloqueo en `finally`.
- `docs/modules/metas/BITACORA.md`

Cambios realizados:
- Se agrego `isSubmitting` para ignorar nuevos envios durante el guardado.
- El boton `Guardar` queda deshabilitado mientras se procesa la peticion.
- El texto del boton cambia a `Guardando...` durante el envio.

## 2026-05-08

### Documentacion inicial del contexto

Motivo:
- Crear el contexto tecnico y funcional del submodulo Metas de Tablero SAE.

Archivos afectados:
- `docs/modules/metas/CONTEXT.md`
- `docs/modules/metas/BITACORA.md`

Cambios realizados:
- Se documentaron ruta, menu, formulario mensual, APIs, flujo funcional, backend relacionado, riesgos y consideraciones futuras.
