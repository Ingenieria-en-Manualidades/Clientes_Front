# PENDING.md

Pendientes centralizados del modulo `Encuesta`.

Este archivo debe registrar solo trabajo pendiente: bugs, mejoras, deuda tecnica, validaciones y dudas funcionales. No debe usarse como historia de cambios ni bitacora.

> Estado actual: `Encuesta` permite registrar la encuesta de satisfaccion del cliente, condicionada por aceptacion de politica de tratamiento de datos y bloqueo por respuesta anual existente.

## Bugs

1. Corregir textos y caracteres mal codificados.
   - Revisar apariciones de `aÃ±o`, tildes y signos en preguntas, mensajes y politica.

2. Revisar dependencia del ultimo cargo como `Otro...`.
   - El frontend asume que el ultimo cargo de la lista representa la opcion otro.
   - Si backend cambia el orden, la logica puede fallar.

3. Validar comportamiento cuando no existe `CustomerContact`.
   - Backend responde error si no encuentra contacto asociado.
   - Front debe mostrar mensaje claro y no dejar el formulario en estado confuso.

4. Revisar bloqueo por encuesta ya respondida en el ano actual.
   - Confirmar que el frontend deshabilite todos los campos y no permita reenvio.
   - Confirmar que las respuestas cargadas coincidan con el backend.

5. Revisar carga inicial de datos.
   - Cargos, clientes e informacion de usuario se cargan antes de guardar.
   - Definir comportamiento si una de estas peticiones falla.

## Mejoras

1. Mejorar mensajes de politica de datos.
   - Diferenciar politica no aceptada, error cargando politica y usuario sin permiso.

2. Mejorar feedback al guardar encuesta.
   - Mostrar carga.
   - Bloquear boton durante envio.
   - Evitar doble envio.

3. Mejorar experiencia cuando la encuesta ya fue respondida.
   - Mostrar claramente que la respuesta es de solo lectura.
   - Mostrar ano de la respuesta registrada.

4. Mejorar manejo de errores parciales.
   - Si fallan cargos, clientes o usuario, indicar que parte fallo.
   - Permitir reintentar carga si aplica.

5. Revisar accesibilidad de preguntas.
   - Labels claros.
   - Estados requeridos visibles.
   - Radios y booleanos navegables por teclado.

## Deuda tecnica

1. Tipar respuestas de `surveyApis.ts`.
   - Cargos.
   - Clientes.
   - Informacion del usuario.
   - Respuesta de guardado.

2. Evitar dependencia del orden de la lista de cargos.
   - Usar identificador, nombre o bandera explicita para `Otro...`.

3. Centralizar validaciones de respuestas.
   - Separar preguntas obligatorias, booleanas y radio.
   - Evitar reglas dispersas dentro de la pagina.

4. Revisar estructura de `answers` inicial.
   - Mantenerla sincronizada con preguntas y backend.
   - Documentar ids o claves esperadas.

5. Revisar contrato con `usePolicy`.
   - Confirmar version de politica, aceptacion y bloqueo de envio.

## Validaciones

1. Validar aceptacion de politica antes de habilitar envio.

2. Validar usuario desde cookie `usuario`.
   - No consultar ni guardar si esta vacio.

3. Validar informacion del contacto.
   - Nombre.
   - Cargo.
   - Cliente.
   - Email si aplica.

4. Validar respuestas obligatorias.
   - Preguntas simples.
   - Preguntas booleanas.
   - Preguntas tipo radio.

5. Validar respuesta `Otro...`.
   - Si el usuario selecciona otro cargo, exigir texto adicional si negocio lo requiere.





6. Validar bloqueo por año.
   - No permitir segunda respuesta en el mismo ano si backend ya tiene encuesta.

7. Validar doble envio.
   - Bloquear boton mientras `saveSurvey` esta en curso.

8. Validar errores de correo.
   - Si backend no puede encolar correo de agradecimiento, definir si afecta el guardado o solo se informa.

## Dudas funcionales

1. La encuesta se responde una vez por usuario, por contacto o por cliente al ano?

2. Se puede editar una encuesta ya enviada?

3. Quien puede desbloquear o corregir una respuesta anual?

4. La politica debe aceptarse una vez por version o una vez para siempre?

5. Que debe pasar si cambia la politica despues de responder la encuesta?

6. El cargo `Otro...` debe venir identificado desde backend?

7. Si no existe `CustomerContact`, se debe permitir completar datos manualmente?

8. El correo de agradecimiento es obligatorio para considerar exitoso el registro?

9. Que preguntas son obligatorias y cuales opcionales?
