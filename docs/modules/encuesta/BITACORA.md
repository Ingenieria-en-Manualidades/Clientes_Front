# BITACORA.md

Registro de cambios del modulo `encuesta`.

Cada cambio funcional, tecnico o documental debe registrarse aqui con fecha, motivo, archivos afectados y notas relevantes.

## 2026-05-19

### Bloqueo visual de doble envio en encuesta

Motivo:
- Alinear el estado visual del boton `ENVIAR` con el bloqueo existente de `isSubmitting`.

Archivos afectados:
- `pages/encuesta/index.vue`
- `Clientes_Front/pages/encuesta/index.vue (line 225)` boton `ENVIAR` deshabilitado con `isSubmitting`.
- `Clientes_Front/pages/encuesta/index.vue (line 276)` declaracion de `isSubmitting`.
- `Clientes_Front/pages/encuesta/index.vue (line 382)` bloqueo de reenvio si ya hay peticion en curso.
- `Clientes_Front/pages/encuesta/index.vue (line 428)` activacion del bloqueo antes de llamar API.
- `Clientes_Front/pages/encuesta/index.vue (line 430)` inicio de `try` para proteger la llamada API.
- `Clientes_Front/pages/encuesta/index.vue (line 446)` liberacion del bloqueo en `finally`.
- `docs/modules/encuesta/BITACORA.md`

Cambios realizados:
- El boton `ENVIAR` queda deshabilitado mientras `isSubmitting` esta activo.
- Se conserva el bloqueo existente al inicio del metodo `submit`.
- La llamada API quedo protegida con `try/finally` para liberar el bloqueo al terminar.

Notas:
- No se modifico la validacion ni el payload enviado a la API.

## 2026-05-08

### Documentacion inicial del contexto

Motivo:
- Crear el contexto tecnico y funcional del modulo Encuesta.

Archivos afectados:
- `docs/modules/encuesta/CONTEXT.md`
- `docs/modules/encuesta/BITACORA.md`

Cambios realizados:
- Se documentaron ruta, menu, politica de datos, composables, backend relacionado, flujo funcional, riesgos y consideraciones futuras.
