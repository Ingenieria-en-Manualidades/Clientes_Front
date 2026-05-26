# PENDING.md

Pendientes centralizados del submodulo `Usuarios`.

Este archivo debe registrar solo trabajo pendiente: bugs, mejoras, deuda tecnica, validaciones y dudas funcionales. No debe usarse como historia de cambios ni bitacora.

> Estado actual: `Usuarios` pertenece a `Administracion` y permite listar, filtrar, crear, actualizar, resetear, habilitar y deshabilitar usuarios.

## Bugs

1. Corregir mensaje de estado vacio en la tabla.
   - Actualmente se muestra "Sin ninguna meta registrada." cuando no hay usuarios.
   - Debe usar un texto propio del modulo, por ejemplo "Sin usuarios registrados.".

2. Revisar el import de `definePageMeta` en `pages/administration/users.vue`.
   - Actualmente se importa desde `../node_modules/nuxt/dist/pages/runtime/composables`.
   - Validar si debe eliminarse el import y usar la macro de Nuxt directamente.
   - Confirmar que el build no falle por resolucion de rutas internas de Nuxt.

3. Revisar busqueda por correo en la tabla.
   - El filtro incluye el campo `email`.
   - La normalizacion de datos en `setFixDataUsers` no asigna `email` al objeto `UserTable`.
   - Definir si el correo debe mostrarse, filtrarse o retirarse del arreglo de busqueda.

4. Corregir textos y caracteres mal codificados.
   - Revisar labels como correo electronico, numero de celular, contrasena y mensajes de confirmacion.
   - Revisar signos de interrogacion y tildes en modales de reset y habilitar/deshabilitar.

5. Revisar reset de usuario sin estado de carga.
   - El modal se cierra y abre durante la peticion.
   - No bloquea el boton de confirmacion mientras espera respuesta.
   - Puede permitir acciones repetidas si la API tarda.

6. Revisar habilitar/deshabilitar usuario sin bloqueo de envio.
   - No existe `isLoading` para impedir doble confirmacion.
   - Puede generar solicitudes duplicadas sobre el mismo usuario.

7. Revisar actualizacion de usuario tipo empleado.
   - Al cargar empleados, `plant` inicia en `0`.
   - Confirmar si el empleado actual aparece correctamente cuando no se ha seleccionado planta.
   - Validar que no se pierda informacion al cambiar planta o empleado.

8. Revisar asignacion de `fullname`, `email` y `cellphone` desde empleados.
   - En algunos puntos se usan nombres de propiedades diferentes (`nombre`, `nombre_completo`, `email`, `celular`).
   - Confirmar que coincidan con la respuesta real de `getEmployeesImec`.

## Mejoras

1. Mejorar mensajes del modulo.
   - Unificar textos de exito, error, validacion y advertencia.
   - Evitar mensajes heredados de metas, permisos u otros modulos.
   - Mostrar mensajes claros cuando no haya usuarios, roles, permisos, clientes o empleados.

2. Agregar tooltips o labels accesibles a las acciones de tabla.
   - Resetear usuario.
   - Editar usuario.
   - Habilitar o deshabilitar usuario.
   - Mantener iconos, pero hacer clara la accion para usuarios finales.

3. Mejorar estados de carga.
   - Mostrar carga al listar usuarios.
   - Mostrar carga al crear, actualizar, resetear, habilitar y deshabilitar.
   - Bloquear botones mientras la peticion esta en curso.

4. Mejorar cierre y limpieza de modales.
   - Al crear usuario exitosamente, evaluar si el modal debe cerrarse o limpiar el formulario y permanecer abierto.
   - Al actualizar usuario exitosamente, cerrar modal y limpiar estado interno.
   - Al cancelar, limpiar errores y datos temporales.

5. Evaluar mostrar mas datos en la tabla.
   - Correo.
   - Celular.
   - Rol.
   - Estado activo/inactivo.
   - Clientes asociados.

6. Mejorar filtro de usuarios.
   - Confirmar campos buscables.
   - Evaluar filtros por tipo de usuario, rol, estado y cliente.
   - Mantener sincronizacion entre lista filtrada y lista cacheada.

7. Revisar experiencia responsive.
   - Confirmar que formularios de crear y actualizar funcionen bien en pantallas pequenas.
   - Revisar botones de acciones en tabla cuando hay poco ancho.
   - Revisar altura fija de tabla.

8. Separar permisos por accion.
   - Ver usuarios.
   - Crear usuarios.
   - Editar usuarios.
   - Resetear usuarios.
   - Habilitar/deshabilitar usuarios.

## Deuda tecnica

1. Tipar correctamente las respuestas de API.
   - Evitar `any` en respuestas de usuarios, empleados, roles, permisos y clientes.
   - Crear interfaces para los datos crudos recibidos del backend cuando aplique.

2. Tipar errores en bloques `catch`.
   - Actualmente se usa `error.message` sin validar el tipo de `error`.
   - Estandarizar una funcion helper para convertir errores desconocidos en mensajes seguros.

3. Estandarizar el retorno de metodos en `usersApi.ts`.
   - Todos deben devolver `{ success, title, message, data }` cuando aplique.
   - Evitar respuestas con estructura variable entre metodos.

4. Revisar uso de `apiKeyBackend` como Bearer token.
   - Confirmar si las operaciones administrativas deben usar token de backend, token de sesion de usuario o ambos.
   - Mantener el uso de `runtimeConfig`; no hardcodear ni modificar variables de entorno.

5. Limpiar imports y codigo no usado.
   - `ModalResetUser.vue` importa elementos que no usa.
   - `ModalFormUpdateUser.vue` conserva variables y bloques comentados relacionados con contrasena.
   - `dataUsers.ts` tiene imports no usados o comentados.

6. Extraer logica compartida entre crear y actualizar usuario.
   - Carga de listas.
   - Manejo de empleados por planta.
   - Bloqueo de campos para usuarios tipo empleado.
   - Validaciones comunes.

7. Revisar `setReviewFields`.
   - El arreglo inicia con 8 posiciones, pero puede usar indice 8 para `employee_id`.
   - Definir una estructura mas legible para errores por campo.

8. Revisar normalizacion en `setFixDataUsers`.
   - Documentar campos esperados desde backend.
   - Evitar perder datos utiles como email, rol o clientes si la tabla los necesita.

9. Revisar nombres y tipos de `User`.
   - `clients` y `permissions` estan tipados como `string[] | null`, pero los dropdowns pueden manejar numeros.
   - `rol` esta como `number | null`, pero en actualizacion se asigna desde `response.data.roles[0]`.
   - `employee_id` cambia entre `string`, `number` y `null` en distintos puntos.

## Validaciones

1. Validar formato de correo electronico en creacion y actualizacion.

2. Validar numero de celular.
   - Definir longitud permitida.
   - Confirmar si acepta indicativo, espacios o solo numeros.

3. Validar nombre completo.
   - Confirmar minimo de palabras para generar username.
   - Definir comportamiento cuando el nombre no permite crear usuario automaticamente.

4. Validar nombre de usuario.
   - Confirmar longitud minima y maxima.
   - Confirmar caracteres permitidos.
   - Validar duplicados antes de enviar o manejar claramente el error del backend.

5. Validar contrasena en creacion.
   - Confirmar reglas minimas de seguridad.
   - Confirmar si `Temporal01*` debe seguir siendo valor por defecto.
   - Validar que contrasena y confirmacion coincidan con un mensaje claro.

6. Validar rol obligatorio.
   - Confirmar si todo usuario debe tener exactamente un rol.
   - Definir comportamiento si backend devuelve multiples roles.

7. Validar permisos asignados.
   - Confirmar si los permisos manuales son opcionales.
   - Definir si complementan o reemplazan permisos del rol.

8. Validar clientes asignados.
   - Confirmar si `TODAS` con valor `0` es excluyente.
   - Evitar seleccionar `TODAS` junto con clientes especificos si backend no lo soporta.

9. Validar usuario tipo empleado.
   - Exigir planta cuando el tipo sea empleado, si backend lo requiere.
   - Exigir empleado seleccionado.
   - Confirmar que el empleado pertenezca al cliente/planta seleccionada.

10. Validar usuario tipo cliente.
   - Confirmar si debe tener empleado vacio.
   - Confirmar si puede tener varios clientes.

11. Validar acciones sensibles.
   - Resetear usuario debe pedir confirmacion clara.
   - Deshabilitar usuario debe advertir impacto sobre acceso.
   - Evitar que un usuario se deshabilite a si mismo si no esta permitido.

## Dudas funcionales

1. Quienes pueden crear usuarios?

2. Quienes pueden actualizar usuarios?

3. Quienes pueden resetear contrasenas?

4. Quienes pueden habilitar o deshabilitar usuarios?

5. Un usuario administrador puede editar sus propios permisos o estado?

6. El reset debe generar una contrasena nueva en backend o usar una temporal fija?

7. La contrasena generada o temporal debe mostrarse en pantalla, copiarse al portapapeles o enviarse por otro canal?

8. Al deshabilitar un usuario, se deben cerrar sesiones activas inmediatamente?

9. Los usuarios tipo cliente pueden tener multiples clientes asignados o solo uno?

10. Los usuarios tipo empleado pueden cambiar de empleado asociado despues de creados?

11. Los permisos manuales se suman a los del rol o los reemplazan?

12. Debe existir auditoria para creacion, edicion, reset y cambio de estado?

13. Debe existir busqueda/paginacion desde backend si la cantidad de usuarios crece?

14. Que datos deben mostrarse obligatoriamente en la tabla principal de usuarios?

15. El modulo debe permitir eliminar usuarios definitivamente o solo deshabilitarlos?
