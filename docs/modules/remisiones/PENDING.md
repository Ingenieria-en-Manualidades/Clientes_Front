# PENDING.md

Pendientes centralizados del modulo `Remisiones`.

Este archivo debe registrar solo trabajo pendiente: bugs, mejoras, deuda tecnica, validaciones y dudas funcionales. No debe usarse como historia de cambios ni bitacora.

> Estado actual: `Remisiones` consulta datos desde Groot y permite gestionar remisiones pendientes, aprobadas y rechazadas del cliente activo.

## Bugs

1. Corregir textos y caracteres mal codificados.
   - Revisar tablas, modales, tabs, mensajes de error y estados vacios.

2. Revisar filtrado por estado en frontend.
   - Pendientes usa `estado === null`.
   - Aprobadas usa `estado === "Aprobado"`.
   - Rechazadas usa `estado === "Rechazado"`.
   - Si Groot cambia los valores, las vistas quedan vacias.

3. Revisar manejo de errores de Groot.
   - Mostrar mensaje claro cuando Groot no responde, token falla o cliente no existe.

4. Revisar refresco despues de aprobar o rechazar.
   - Confirmar que la remision cambie de vista sin datos obsoletos.
   - Confirmar que el contador de pendientes se actualice.

5. Revisar generacion/exportacion de PDF.
   - Confirmar que solo aplique a remisiones aprobadas.
   - Manejar errores de datos incompletos o respuesta invalida.

## Mejoras

1. Mejorar estados de carga por vista.
   - Pendientes.
   - Aprobadas.
   - Rechazadas.
   - Preview.
   - Exportacion PDF.

2. Mejorar mensajes de estados vacios.
   - Sin pendientes.
   - Sin aprobadas.
   - Sin rechazadas.
   - Sin resultados por filtro de fecha.

3. Mejorar filtros de fecha.
   - Indicar si se esta filtrando por fecha unica o rango.
   - Permitir limpiar filtro facilmente.
   - Validar rango invertido antes de consultar.

4. Mejorar confirmacion de aprobacion y rechazo.
   - Mostrar numero de remision y cliente.
   - Confirmar motivo obligatorio para rechazo.

5. Mejorar recorrido guiado.
   - Revisar pasos en tabs, filtros, preview y acciones.

6. Evaluar busqueda adicional.
   - Numero de remision.
   - Estado.
   - Cliente.
   - Fechas.

## Deuda tecnica

1. Tipar contrato de Groot.
   - Evitar `any` en remisiones, preview y respuestas de gestion.
   - Mantener sincronizado `interfaces/remisiones.ts`.

2. Centralizar estados de remision.
   - Evitar strings repetidos `Aprobado`, `Rechazado` y `null` en varias vistas.
   - Crear constantes o helper compartido.

3. Revisar composable `datosRemisiones.ts`.
   - Confirmar que `setConsultar` maneje fecha unica, rango, vacios e invalidos.

4. Revisar dependencia de `idCliente`.
   - Evitar llamadas a Groot con cliente vacio.
   - Mostrar mensaje si no hay cliente activo.

5. Revisar uso de `tokenRemisiones`.
   - Debe venir siempre desde `runtimeConfig`.
   - No hardcodear ni tocar variables de entorno.

6. Evitar duplicacion entre vistas de pendientes, aprobadas y rechazadas.
   - Revisar si comparten carga, filtros y estados.
   - Mantener diferencias de acciones por estado.

## Validaciones

1. Validar cliente activo antes de listar remisiones.

2. Validar token/configuracion de Groot desde runtimeConfig.

3. Validar filtro por fecha unica.
   - Fecha valida.
   - Formato esperado `YYYY-MM-DD`.

4. Validar filtro por rango.
   - Fecha inicial obligatoria.
   - Fecha final obligatoria.
   - Fecha inicial menor o igual a fecha final.

5. Validar aprobacion.
   - Remision pendiente.
   - Numero de remision valido.
   - Evitar doble envio.

6. Validar rechazo.
   - Remision pendiente.
   - Motivo obligatorio.
   - Longitud minima del motivo si negocio lo requiere.
   - Evitar doble envio.

7. Validar preview.
   - Numero de remision obligatorio.
   - Mostrar error si no hay detalle.

8. Validar PDF.
   - Solo para remisiones aprobadas.
   - Manejar respuesta vacia o error de generacion.

## Dudas funcionales

1. Los estados de Groot son definitivos o pueden cambiar de nombre?

2. Se debe permitir revertir una aprobacion o rechazo?

3. El rechazo requiere motivo minimo o catalogo de motivos?

4. Que usuarios pueden aprobar o rechazar remisiones?

5. Las remisiones aprobadas deben poder exportarse siempre o solo durante un periodo?

6. El filtro por fecha debe consultar a Groot o filtrar localmente?

7. Que debe pasar si Groot esta caido?

8. El contador de pendientes debe actualizarse en tiempo real o solo al entrar al modulo?

9. Debe existir auditoria visible de aprobacion/rechazo?
