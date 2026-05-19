# PENDING.md

Pendientes centralizados del submodulo `Cumplimiento Mensual`.

Este archivo debe registrar solo trabajo pendiente: bugs, mejoras, deuda tecnica, validaciones y dudas funcionales. No debe usarse como historia de cambios ni bitacora.

> Estado actual: `Cumplimiento Mensual` permite registrar calificaciones mensuales de calidad con evidencia PDF, listar evidencias, descargarlas y actualizarlas.

## Bugs

1. Revisar atomicidad entre calidad y archivo.
   - Primero se guarda la calidad y luego se sube la evidencia.
   - Si falla la subida del archivo, puede quedar una calificacion sin evidencia.

2. Revisar actualizacion de evidencias.
   - `updateFile` borra primero y luego crea un nuevo archivo.
   - Si falla la nueva carga, puede perderse la evidencia anterior.

3. Revisar calculo de `yearFile`.
   - Usa el ano actual, no necesariamente el ano del mes seleccionado.
   - Puede generar inconsistencias al cargar evidencias de meses de otro ano.

4. Corregir textos y caracteres mal codificados.
   - Revisar labels, estados vacios, mensajes de carga y errores.
   - Normalizar tildes visibles en formularios y tabla.

5. Validar comportamiento al descargar PDF.
   - Confirmar que errores de archivo inexistente, URL invalida o permisos se muestren correctamente.

## Mejoras

1. Mejorar estado de carga por operacion.
   - Guardar calidad.
   - Subir evidencia.
   - Descargar PDF.
   - Actualizar evidencia.

2. Mejorar mensajes cuando no hay evidencias.
   - Diferenciar sin registros, error de red y cliente sin datos.

3. Mostrar datos claros de cada evidencia.
   - Tipo de registro.
   - Mes.
   - Ano.
   - Nombre del archivo.
   - Fecha de carga o actualizacion.

4. Mejorar confirmacion antes de reemplazar evidencia.
   - Advertir que se actualizara el archivo existente.
   - Evitar reemplazos accidentales.

5. Revisar recorrido guiado.
   - Confirmar que el tour funciona en formularios, tabla y modal de actualizacion.

## Deuda tecnica

1. Separar la responsabilidad de guardar calidad y guardar archivo.
   - Mantener flujo coordinado, pero con errores claramente manejados.
   - Definir rollback o recuperacion si falla un paso.

2. Tipar payloads de calidad y archivos.
   - Evitar `any` para respuestas de `guardarCalidad`, `guardarArchivo`, `listarArchivos` y `descargar-pdf`.

3. Revisar nombres de endpoints y metodos.
   - `updateFile` usa `deleteFile` y luego crea archivo.
   - Documentar o renombrar para que la intencion sea clara.

4. Centralizar validaciones de archivo.
   - Tipo PDF.
   - Tamano maximo.
   - Archivo obligatorio.
   - Nombre permitido.

5. Revisar dependencia de `idCliente`.
   - Definir comportamiento cuando no exista cliente activo.
   - Evitar peticiones con cliente vacio.

## Validaciones

1. Validar mes obligatorio.

2. Validar que la calificacion sea numerica.

3. Validar calificacion entre 0 y 100.

4. Validar archivo obligatorio para registros nuevos.

5. Validar que el archivo sea PDF.

6. Validar tamano maximo del PDF.
   - Definir limite con negocio/backend.

7. Validar tipo de calidad.
   - `checklist`.
   - `inspeccion_sol`.
   - Evitar enviar tipos no soportados.

8. Validar cliente activo antes de listar, guardar o actualizar.

9. Validar doble envio.
   - Bloquear botones mientras se guarda calidad o archivo.

10. Validar reemplazo de evidencia.
   - Confirmar archivo nuevo antes de borrar o reemplazar el anterior.

## Dudas funcionales

1. Si falla la carga del PDF despues de guardar calidad, se debe eliminar la calidad creada?

2. Si falla el reemplazo de evidencia, se debe conservar el archivo anterior?

3. Se puede registrar mas de una evidencia por tipo y mes?

4. El ano de la evidencia debe salir del mes seleccionado o de la fecha actual?

5. Las calificaciones aceptan decimales o solo enteros?

6. Cual es el tamano maximo permitido para PDF?

7. Se deben permitir otros formatos ademas de PDF?

8. Quienes pueden actualizar evidencias ya cargadas?

9. Debe existir historial de evidencias reemplazadas?
