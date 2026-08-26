# Pendientes - Programación detallada

## Bugs

1. Invalidar la previsualización cuando cambie el año o la semana.
   - El watcher de `year` solo limpia `week`.
   - Cambiar cualquiera de los controles después de previsualizar conserva `previewRows` y `previewContext`.
   - El botón puede guardar el periodo antiguo mientras la pantalla muestra otro año o semana.

2. Aplicar autorización de página para `view_scheduled_detail`.
   - El permiso solo controla la visibilidad del elemento del menú.
   - Las dos rutas aceptan cualquier sesión que supere `auth` y tenga un cliente seleccionado.
   - Es posible abrir las URLs directamente sin que las páginas comprueben el permiso funcional.

3. Enviar credenciales en las solicitudes del submódulo.
   - La verificación de sesión usa `Authorization: Bearer`, pero `previewExcel`, `saveScheduledDetails` y `listScheduledDetails` no envían el token.
   - El flujo depende actualmente de que los endpoints del backend estén públicos.

4. Mostrar `missing_columns` en los errores de plantilla.
   - El backend devuelve la lista cuando faltan encabezados.
   - El composable solo propaga `errors`, por lo que la página pierde ese detalle.

5. Corregir el estado exitoso cuando no existen filas importables.
   - Una plantilla con encabezados válidos y solo filas omitidas puede devolver `success = true` y `values = []`.
   - La interfaz presenta el mensaje verde de archivo válido, pero no muestra tabla, botón ni explicación adicional.

6. Limpiar datos anteriores cuando falle una recarga del listado.
   - `loadRecords` no vacía `records` antes de solicitar datos ni cuando ocurre un error.
   - En `TableFilters`, las filas existentes se evalúan antes que `errorData`, por lo que una falla posterior puede dejar datos antiguos visibles y ocultar el estado de error.

7. Ajustar el `colspan` de estados en la tabla principal.
   - `TableFilters` calcula `atributes.length + 1`.
   - La tabla de consulta agrega además la columna personalizada `DETALLE`, por lo que carga, error y vacío no abarcan todas las columnas.

8. Evitar títulos de éxito basados únicamente en `response.ok` durante el guardado.
   - `saveScheduledDetails` usa `response.ok ? "Programación guardada" : ...`.
   - Una respuesta HTTP exitosa con `result.success = false` produciría `success = false` con un título de éxito.

9. Normalizar la URL base antes de concatenar rutas.
   - Las llamadas usan `${url}api/...`.
   - Si `GLOBAL_URL_SERVER` no termina en `/`, la URL resultante queda mal formada.

10. Evitar falsos positivos al evaluar permisos serializados.
    - `useModulos` aplica `includes` directamente sobre la cookie `permissions`.
    - Cuando la cookie es texto, se realiza búsqueda por subcadena y no comparación exacta de permisos.

## Mejoras

1. Validar extensión, tamaño y tipo del archivo antes de enviarlo para ofrecer retroalimentación inmediata.

2. Mostrar un resumen de previsualización con filas leídas, válidas, omitidas y rechazadas.

3. Mostrar el nombre y tamaño del archivo seleccionado y ofrecer una acción explícita para retirarlo.

4. Deshabilitar año, semana y archivo mientras existe una previsualización guardable, o solicitar una nueva previsualización al cambiar el contexto.

5. Limpiar de forma coherente el archivo, año y semana después de un guardado exitoso.

6. Agregar filtros de cabecera por año, semana, usuario y rango de fechas en la página de consulta.

7. Incorporar paginación y filtros del lado del servidor cuando aumente el volumen de programaciones.

8. Cargar los detalles de una cabecera bajo demanda en vez de descargar todos los arreglos anidados en la consulta inicial.

9. Formatear las fechas para el usuario con `Intl.DateTimeFormat` en lugar de mostrar directamente `YYYY-MM-DD`.

10. Incorporar cancelación o descarte de solicitudes anteriores si el usuario inicia una nueva previsualización rápidamente.

11. Mejorar la accesibilidad del diálogo, las tablas, los estados de error y los controles de búsqueda.

12. Extraer un componente genérico de pestañas con un nombre independiente de Remisiones.

13. Unificar los mensajes del submódulo con el sistema de notificaciones usado en otras páginas del proyecto.

14. Conservar en la URL o en estado controlado los filtros de consulta cuando el usuario navegue entre carga y listado.

## Deuda técnica

1. Crear pruebas unitarias y de componentes para:
   - cálculo de semanas ISO en años con 52 y 53 semanas;
   - etiquetas de inicio y fin de semana;
   - validaciones de año, semana, archivo y usuario;
   - limpieza de estado al cambiar archivo o periodo;
   - transformación de filas al payload de guardado;
   - conflicto, cancelación y confirmación de reemplazo;
   - renderizado de errores simples, anidados y por fila;
   - archivo válido sin filas importables;
   - búsqueda y filtros de previsualización;
   - carga, error, vacío y recarga del listado;
   - apertura, búsqueda y cierre del modal;
   - autorización por permiso funcional.

2. Crear pruebas del composable para respuestas exitosas, HTTP no exitoso, JSON inválido, error de red y `requires_confirmation`.

3. Extraer el cálculo de semanas ISO a una utilidad tipada y reutilizable.

4. Mover la gestión de previsualización, guardado y reemplazo desde la página a un composable de estado del dominio.

5. Reemplazar los `ref` globales de `ScheduledDetailData.ts` por datos inmutables o estado creado por consumidor cuando no sea necesario compartir mutaciones.

6. Centralizar el cliente HTTP del proyecto para URL base, token, `Accept`, parseo seguro, errores y normalización de respuestas.

7. Agregar validación de esquema en tiempo de ejecución para las respuestas de la API.

8. Evitar `any` heredado de `DinamicosTableFilters`, `DinamicosPaginator` y `DinamicosDropDownList` en el flujo del submódulo.

9. Corregir el tipo `Number` de `OptionDropdown.value` a `number` y tipar el `v-model` del selector de semana.

10. Revisar el nombre `atributes` del componente de tabla y migrarlo de forma compatible a `attributes`.

11. Gestionar la carga inicial del listado con un patrón de ciclo de vida explícito (`onMounted`, `useAsyncData` o equivalente) en vez de invocar una promesa no esperada al final del setup.

12. Separar el estilo global `.dialog-scheduled-detail` o limitarlo de forma encapsulada para evitar colisiones de clases.

13. Documentar y versionar formalmente el contrato compartido con `IENM_ADMIN` para evitar duplicación manual de tipos.

14. Agregar scripts de lint y comprobación de tipos específicos al flujo de verificación del proyecto.

## Validaciones

1. Validar en frontend el máximo de 10 MB y las extensiones permitidas antes de llamar a la API.

2. Validar que el valor de `username` tenga el formato esperado y corresponda a la sesión, sin confiar únicamente en la cookie visible.

3. Validar `view_scheduled_detail` al entrar a las dos rutas y definir una redirección o pantalla de acceso denegado.

4. Invalidar filas y confirmación pendiente si cambian año, semana, archivo o usuario.

5. Confirmar que el periodo devuelto por la API coincida con el periodo solicitado antes de habilitar el guardado.

6. Rechazar o explicar una previsualización sin valores importables.

7. Validar en tiempo de ejecución que cada fila incluya fechas, cliente, SKU, producto, actividad y total con tipos compatibles.

8. Validar que el arreglo de guardado no esté vacío aunque el estado visual se modifique por una condición inesperada.

9. Validar que no existan duplicados de cliente, SKU y producto antes de enviar, para ofrecer un error inmediato además de la validación backend.

10. Validar y presentar correctamente errores Laravel generales, errores por fila y `missing_columns`.

11. Verificar el `Content-Type` antes de ejecutar `response.json()` y conservar el estado HTTP original en los mensajes.

12. Validar que las fechas del listado tengan formato reconocible antes de recortarlas.

13. Validar que `weekly_scheduled_detail` siempre sea un arreglo antes de abrir el modal.

14. Definir el comportamiento cuando `client_name` sea nulo por un cliente eliminado o no resoluble.

15. Verificar que el cliente seleccionado en sesión sea relevante para todos los clientes incluidos en el archivo o retirar esa precondición del middleware para estas rutas.

## Dudas funcionales

1. ¿El permiso `view_scheduled_detail` permite cargar, reemplazar y consultar, o se requieren permisos separados por operación?

2. ¿Las programaciones deben ser visibles para todos los usuarios o solo para quien las cargó?

3. ¿El cliente seleccionado en `idCliente` debe limitar el archivo y el listado, aunque actualmente el archivo admite varios clientes?

4. ¿El usuario debe poder cambiar año o semana después de previsualizar sin perder los datos?

5. ¿Una previsualización sin filas importables es exitosa o debe mostrarse como advertencia/error?

6. ¿Los totales iguales a cero deben aparecer en la tabla o permanecer omitidos por el backend?

7. ¿`activity_id` debe enviarse y persistirse o solo sirve como comprobación temporal durante la previsualización?

8. ¿El reemplazo debe sustituir toda la semana o permitir seleccionar filas específicas?

9. ¿Después de guardar se debe permanecer en la carga, limpiar todo o navegar automáticamente a la consulta?

10. ¿La consulta necesita filtros por usuario, cliente, año y semana desde el servidor?

11. ¿Se debe mostrar historial de detalles reemplazados o únicamente el conjunto activo?

12. ¿El nombre de cliente debe conservar el texto del Excel o mostrar siempre el nombre vigente del catálogo?

13. ¿Los archivos `.xls` antiguos siguen siendo un formato requerido o puede limitarse la interfaz a `.xlsx`?

14. ¿El periodo debe seleccionarse manualmente o también debe validarse contra información contenida en el archivo?

15. ¿Qué nivel de detalle técnico debe mostrarse al usuario cuando una fila no coincide con cliente o actividad?

