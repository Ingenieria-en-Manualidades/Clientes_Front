# PENDING.md

Pendientes centralizados del submodulo `Metas`.

Este archivo debe registrar solo trabajo pendiente: bugs, mejoras, deuda tecnica, validaciones y dudas funcionales. No debe usarse como historia de cambios ni bitacora.

> Estado actual: `Metas` permite registrar metas mensuales porcentuales del cliente activo y crear el tablero SAE asociado.

## Bugs

1. Revisar validacion numerica con regex.
   - El regex actual `/[0-9]/` solo verifica que exista algun digito.
   - Puede aceptar valores con caracteres no numericos mezclados.

2. Revisar atomicidad entre meta y tablero SAE.
   - Primero se crea la meta y luego el tablero asociado.
   - Si falla `createTableroSae`, puede quedar una meta sin tablero.

3. Corregir textos y caracteres mal codificados.
   - Revisar labels de metas, mensajes de validacion y toasts.

4. Revisar limpieza del formulario despues de guardar.
   - Confirmar que todos los campos vuelvan a estado inicial.
   - Evitar que queden datos del cliente o mes anterior.

5. Revisar doble envio de metas.
   - Confirmar que el boton quede bloqueado mientras se ejecuta la peticion.
   - Evitar duplicados por doble click.

## Mejoras

1. Mejorar feedback al crear meta.
   - Mostrar estado de carga.
   - Mostrar resultado de creacion de meta y tablero de forma clara.

2. Mejorar mensajes cuando ya existe meta del mes.
   - Mostrar cliente, mes y causa del rechazo si backend lo entrega.

3. Mejorar recorrido guiado.
   - Confirmar que todos los pasos del tour existan y sean visibles.

4. Evaluar resumen previo al envio.
   - Mes seleccionado.
   - Cliente activo.
   - Valores porcentuales.

5. Mejorar consistencia con otros submodulos de Tablero SAE.
   - Validaciones.
   - Toasters.
   - Estados de carga.
   - Limpieza de formularios.

## Deuda tecnica

1. Centralizar validacion porcentual.
   - Usar una validacion robusta para numeros entre 0 y 100.
   - Evitar depender de regex parcial.

2. Tipar payload y respuesta de `createMeta` y `createTableroSae`.
   - Evitar `any` en datos de metas.
   - Mantener alineacion con `interfaces/objetives.ts`.

3. Revisar flujo de creacion meta + tablero.
   - Definir manejo de rollback, reintento o mensaje si falla el segundo paso.

4. Revisar dependencia de `idCliente`.
   - Definir comportamiento si no hay cliente activo.
   - Evitar enviar `cliente_endpoint_id` invalido.

5. Documentar contrato de payload.
   - `fecha`.
   - `cumplimiento`.
   - `eficienciaProductiva`.
   - `calidad`.
   - `desperdicioME`.
   - `desperdicioPP`.
   - `cliente_endpoint_id`.

## Validaciones

1. Validar mes obligatorio.

2. Validar cliente activo obligatorio.

3. Validar que todos los campos porcentuales sean obligatorios.

4. Validar valores numericos reales.
   - No permitir letras ni simbolos mezclados.
   - Definir si se aceptan decimales.

5. Validar rango `0-100`.
   - Cumplimiento Plan de Armado.
   - Eficiencia Productiva.
   - Inspeccion de Calidad.
   - Desperdicios M.E.
   - Desperdicios P.P.

6. Validar duplicados por cliente y mes.
   - Confirmar si se bloquea desde frontend, backend o ambos.

7. Validar doble envio.
   - Bloquear formulario durante guardado.

## Dudas funcionales

1. Se puede crear mas de una meta por cliente y mes?

2. Si falla la creacion del tablero SAE, se debe eliminar la meta creada?

3. Las metas aceptan decimales o solo enteros?

4. Los desperdicios son porcentajes positivos de 0 a 100 o admiten otra escala?

5. Se pueden editar metas despues de creadas o solo crear nuevas?

6. Que usuarios pueden crear metas mensuales?

7. El mes permitido debe limitarse al actual, futuro o cualquier mes?

8. El frontend debe consultar si ya existe meta antes de enviar?
