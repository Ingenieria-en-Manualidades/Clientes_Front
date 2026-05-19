# PENDING.md

Pendientes centralizados del submodulo `Cumplimiento Diario`.

Este archivo debe registrar solo trabajo pendiente: bugs, mejoras, deuda tecnica, validaciones y dudas funcionales. No debe usarse como historia de cambios ni bitacora.

> Estado actual: `Cumplimiento Diario` permite registrar produccion planificada, produccion modificada e indicadores diarios del cliente activo.

## Bugs

1. Revisar limites de fecha comentados en los formularios.
   - `FormProduccion` y `FormIndicadores` mencionan limites de fecha, pero actualmente no se aplican desde los inputs.
   - Confirmar si esto permite registrar fechas fuera del periodo esperado.

2. Corregir textos y caracteres mal codificados.
   - Revisar labels, mensajes de validacion y toasts del modulo.
   - Normalizar tildes y signos visibles para el usuario.

3. Revisar limpieza del objeto `objObjetivo` despues de guardar.
   - El objeto se reutiliza entre produccion planificada, produccion modificada e indicadores.
   - Validar que no queden datos residuales entre envios.

4. Validar uso compartido de `updateObjetivos`.
   - Se usa para produccion modificada e indicadores diarios.
   - Confirmar que el payload enviado en cada caso no pise campos no relacionados.

5. Revisar mensajes de error cuando backend rechaza el registro.
   - Confirmar que se muestre el `title` y `message` correctos.
   - Evitar mensajes genericos cuando falte cliente, fecha o meta asociada.

## Mejoras

1. Mejorar feedback visual durante guardado.
   - Bloquear boton mientras se ejecuta la peticion.
   - Mostrar estado de carga por formulario.
   - Evitar doble envio.

2. Unificar comportamiento entre formularios diarios.
   - Produccion planificada.
   - Produccion modificada.
   - Indicadores diarios.
   - Mantener criterios consistentes de validacion, limpieza y toasts.

3. Mejorar recorrido guiado.
   - Confirmar que todos los elementos referenciados por `#stepByStep` existan.
   - Revisar que el tour no falle en pantallas pequenas.

4. Mejorar mensajes de campos obligatorios.
   - Indicar con claridad si falta fecha, valor o indicador.
   - Diferenciar errores de validacion local de errores del backend.

5. Evaluar resumen previo al envio.
   - Mostrar fecha, cliente y valores antes de confirmar cambios importantes.
   - Reducir errores de captura diaria.

## Deuda tecnica

1. Revisar tipado del objeto de objetivos diarios.
   - Evitar `any` en payloads y respuestas cuando sea posible.
   - Mantener alineacion con `interfaces/objetives.ts`.

2. Separar payloads por caso de uso.
   - Produccion planificada.
   - Produccion modificada.
   - Indicadores diarios.
   - Evitar que un mismo objeto mutable transporte campos innecesarios.

3. Centralizar validaciones numericas.
   - Reutilizar una funcion para no negativos y porcentajes `0-100`.
   - Evitar validaciones duplicadas en componentes.

4. Revisar contrato de `createObjetivos` y `updateObjetivos`.
   - Confirmar campos obligatorios por endpoint.
   - Documentar diferencias entre crear y actualizar.

5. Revisar dependencias del cliente activo.
   - `idCliente` se obtiene desde cookie.
   - Definir comportamiento si la cookie no existe, esta vencida o tiene valor invalido.

## Validaciones

1. Validar que la fecha sea obligatoria antes de enviar.

2. Validar que la fecha pertenezca al rango permitido por negocio.
   - Confirmar si aplica dia actual, periodo abierto o reglas por cliente.

3. Validar produccion planificada.
   - Debe ser numero.
   - No debe aceptar negativos.
   - Definir si acepta decimales.

4. Validar produccion modificada.
   - Debe ser numero.
   - No debe aceptar negativos.
   - Definir si puede ser menor, igual o mayor a la planificada.

5. Validar indicadores diarios.
   - Cumplimiento plan armado entre 0 y 100.
   - Calidad entre 0 y 100.
   - Desperfecto M.E. entre 0 y 100.
   - Desperfecto P.P. entre 0 y 100.

6. Validar cliente activo.
   - No enviar registros si `idCliente` esta vacio.
   - Mostrar mensaje claro para seleccionar cliente.

7. Validar doble envio.
   - Bloquear formularios mientras hay peticion activa.
   - Evitar registros duplicados por doble click.

## Dudas funcionales

1. Deben reactivarse los limites de fecha en produccion e indicadores?

2. Que rango de fechas puede registrar un usuario normal?

3. Existen permisos especiales para registrar dias anteriores o futuros?

4. La produccion modificada puede registrarse sin produccion planificada previa?

5. Los indicadores diarios pueden registrarse sin produccion del dia?

6. Si ya existe registro para una fecha, se debe actualizar o bloquear duplicados?

7. Los porcentajes aceptan decimales o solo enteros?

8. Que debe ocurrir si falla `updateObjetivos` despues de crear una produccion planificada?
