# PENDING.md

Pendientes centralizados del modulo `Unidades Diarias` / `Unidades Programadas`.

Este archivo debe registrar solo trabajo pendiente: bugs, mejoras, deuda tecnica, validaciones y dudas funcionales. No debe usarse como historia de cambios ni bitacora.

> Estado actual: el modulo permite crear metas mensuales de unidades, crear unidades diarias, consultar metas, consultar unidades diarias y actualizar registros segun permisos y ventanas de fecha.

## Bugs

1. Revisar diferencia entre regla documentada y calculo de ventana diaria.
   - El contexto funcional habla de 3 dias antes.
   - En `ModalUnitsDaily.vue` se menciona `minDate.setDate(today - 4)`.
   - Confirmar regla real antes de modificar.

2. Revisar formateo de unidades con separador de miles.
   - Se limpian puntos con `replace(".", "")`.
   - Esto solo remueve el primer separador.
   - Valores con mas de un punto pueden enviarse mal.

3. Revisar duplicacion de areas en listas.
   - `listAreas` podria agregar opciones sin limpiar arrays previos.
   - Si el componente no se destruye al cambiar cliente, pueden duplicarse areas.

4. Revisar estado compartido de filtros de area.
   - La tabla mensual modifica `headers.value[3].options.labels`.
   - Puede afectar otros usos del composable si comparten referencia.

5. Revisar contrato de `getUnidadesDiariasID`.
   - Retorna `data.meta_unidades` aunque conceptualmente carga una unidad diaria.
   - Confirmar estructura real antes de cambiar modal de actualizacion diaria.

6. Corregir textos y caracteres mal codificados.
   - Revisar `programaciÃƒÂ³n` y otros textos visibles en formularios, modales y tablas.

## Mejoras

1. Mejorar estados de carga.
   - Carga de areas.
   - Creacion de meta mensual.
   - Creacion de unidad diaria.
   - Consulta de metas.
   - Consulta de unidades diarias.
   - Actualizaciones.

2. Mejorar mensajes de permisos.
   - Explicar cuando no se muestra formulario mensual o diario por falta de permiso.
   - Explicar cuando no se permite actualizar por ventana de fecha.

3. Mejorar filtros de consulta.
   - Rango de meses.
   - Area.
   - Usuario.
   - Version o estado de actualizacion.

4. Mejorar experiencia en modales.
   - Mostrar datos actuales antes de actualizar.
   - Confirmar motivo en meta mensual.
   - Bloquear botones durante peticiones.

5. Mejorar recorrido guiado.
   - Revisar ingreso mensual, ingreso diario, consulta y modales.
   - Confirmar que `#stepByStep` funcione en ambas rutas.

6. Mostrar reglas de fecha de forma clara.
   - Mes actual/siguiente para metas mensuales.
   - Ventana diaria para registros y actualizaciones.
   - Excepciones por `DEVUSER` o permisos especiales.

## Deuda tecnica

1. Tipar respuestas de metas, unidades diarias y areas.
   - Reducir uso de `any[]` en tablas y modales.
   - Mantener `interfaces/objetives.ts` actualizado.

2. Centralizar reglas de fecha.
   - Mes permitido para metas.
   - Ventana para unidades diarias.
   - Excepciones por permisos y `DEVUSER`.

3. Centralizar permisos del modulo.
   - `form_unidades_mensuales`.
   - `form_unidades_diarios`.
   - `update_unidades_mensuales`.
   - `update_unidades_diarias`.
   - `insert_all_daily units`.
   - `update_all_daily units`.

4. Revisar permisos con espacios.
   - `insert_all_daily units` y `update_all_daily units` tienen espacios.
   - Cualquier cambio debe coordinarse con backend, login y cookies.

5. Revisar helpers de formato numerico.
   - Reemplazar limpieza parcial de separadores por una funcion robusta.
   - Definir soporte para decimales si aplica.

6. Separar estado de tablas y filtros.
   - Evitar mutar headers compartidos.
   - Crear opciones de filtro por instancia si hace falta.

7. Revisar rutas y nombres del modulo.
   - Contexto habla de DailyUnits.
   - Ruta real esta bajo `/objetivos`.
   - `AGENTS.md` menciona una ruta antigua `pages/unidades-diarias.vue`.

## Validaciones

1. Validar cliente activo antes de crear o consultar.

2. Validar area obligatoria.

3. Validar unidades obligatorias.
   - Deben ser numericas.
   - No deben ser negativas.
   - Definir si aceptan decimales.

4. Validar fecha mensual.
   - Obligatoria.
   - Mes actual y siguiente para usuarios normales.
   - Sin limite para `DEVUSER` si esa regla sigue vigente.

5. Validar fecha diaria.
   - Obligatoria.
   - Ventana permitida para usuarios normales.
   - Sin limite para `DEVUSER` o permiso especial si aplica.

6. Validar existencia de meta mensual asociada.
   - Backend valida finalmente.
   - Front debe mostrar mensaje claro cuando no exista meta para cliente, area y mes.

7. Validar motivo de actualizacion mensual.
   - Obligatorio.
   - Definir longitud minima.

8. Validar actualizacion diaria.
   - Valor obligatorio.
   - Permiso requerido.
   - Ventana de fecha vigente.

9. Validar filtro por rango de meses.
   - Mes inicial y final validos.
   - Mes inicial menor o igual al final.

10. Validar doble envio.
   - Bloquear botones durante creacion y actualizacion.

## Dudas funcionales

1. La ventana diaria correcta es 3 dias antes o 4 dias antes?

2. Las unidades aceptan decimales o solo enteros?

3. Una meta mensual puede actualizarse mas de una vez?

4. Cada actualizacion mensual debe versionar siempre la meta?

5. Las unidades diarias se reasignan automaticamente cuando cambia una meta mensual?

6. Que usuarios deben tener permisos especiales sin limite de fecha?

7. `DEVUSER` debe seguir siendo excepcion fija en frontend?

8. Debe existir auditoria visible para cada actualizacion mensual o diaria?

9. Si no existe meta mensual para una unidad diaria, se debe ofrecer crearla desde el mismo flujo?

10. Las areas inactivas de Groot deben mostrarse o filtrarse?

11. La consulta debe incluir metas sin unidades diarias asociadas?

12. Los permisos con espacios deben mantenerse o migrarse a nombres normalizados?
