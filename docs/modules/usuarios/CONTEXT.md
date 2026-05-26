# CONTEXT.md

## Objetivo
Documentar el submodulo administrativo `Usuarios`, usado para listar, crear, actualizar, resetear y activar/desactivar usuarios desde el frontend Nuxt.

## Alcance frontend
- Listar usuarios.
- Filtrar usuarios por texto.
- Crear usuario.
- Actualizar usuario.
- Resetear usuario.
- Activar o desactivar usuario.
- Cargar roles.
- Cargar permisos.
- Cargar clientes.
- Cargar empleados desde IMEC/Groot segun cliente.
- Mostrar mensajes de exito y error.

## Ruta
1. `/administration/users`
   - Archivo: `pages/administration/users.vue`.
   - `layout: "default"`.
   - `middleware: "auth"`.
   - `requiresAuth: true`.

## Ubicacion en menu
- Padre: `Administracion`.
- Nombre: `Usuarios`.
- Ruta: `/administration/users`.
- Permiso: `view_users`.
- Recorrido guiado: `stepByStep: false`.

## Archivos relevantes
- `pages/administration/users.vue`.
- `components/users/ModalFormCreateUser.vue`.
- `components/users/ModalFormUpdateUser.vue`.
- `components/users/ModalResetUser.vue`.
- `components/users/ModalDisableEnableUser.vue`.
- `composables/administration/usersApi.ts`.
- `composables/administration/dataUsers.ts`.
- `interfaces/users.ts`.
- `interfaces/filters.ts`.

## Composables API
### `useUsersApi`
Usa:
- `config.public.apiBackendCliente`.
- `config.public.apiKeyBackend`.

Metodos principales:
- `getListUsers()`
  - `GET api/getUsers`.
- `setCreateUser(user)`
  - `POST api/createUser`.
- `setUpdateUser(user_id, user)`
  - `PUT api/updateUser/{id}`.
- `setResetUser(user_id)`
  - `GET api/resetUser/{id}`.
- `setEnableDisabledUser(user_id)`
  - `PUT api/setStatusUser/{id}`.
- `getDataUserId(userId)`
  - `GET api/getDataUserId/{id}`.
- `getListRoles()`
  - `GET api/getRoles`.
- `getListPermissions()`
  - `GET api/getListPermissions`.
- `getClients()`
  - `GET api/getClients`.
- `getListEmployees(client_id)`
  - `GET api/getEmployeesImec/{client_id}`.

## Flujo funcional
1. Usuario entra a `/administration/users`.
2. Front llama `getListUsers`.
3. Datos se normalizan con `setFixDataUsers`.
4. Tabla muestra usuarios y acciones.
5. Filtro local busca por:
   - `id`.
   - `num_document`.
   - `fullname`.
   - `username`.
   - `email`.
6. Usuario puede abrir modales para crear, actualizar, resetear o activar/desactivar.
7. Al terminar una accion, el componente emite `list` y se refresca la tabla.

## Backend relacionado
- `Admon\UserController`.
- Rutas API:
  - `GET /api/getUsers`.
  - `GET /api/getRoles`.
  - `GET /api/resetUser/{id}`.
  - `POST /api/createUser`.
  - `PUT /api/updateUser/{id}`.
  - `PUT /api/setStatusUser/{id}`.
  - `GET /api/getDataUserId/{id}`.
  - `GET /api/getEmployeesImec/{clients_id}`.
- Rutas compartidas:
  - `GET /api/getClients`.
  - `GET /api/getListPermissions`.

## Variables y cookies
- `GLOBAL_URL_SERVER` -> `config.public.apiBackendCliente`.
- `API_KEY_BACKEND` o equivalente -> `config.public.apiKeyBackend`.
- `permissions`: usado por menu para visibilidad.

## Riesgos y puntos de atencion
- Algunos endpoints usan `apiKeyBackend` como Bearer token, no el token de sesion del usuario.
- La tabla filtra localmente sobre datos ya cargados.
- El mensaje de tabla vacia dice "Sin ninguna meta registrada.", texto heredado incorrecto para usuarios.
- Cambios en usuarios impactan login, permisos y clientes relacionados.

## Consideraciones futuras
1. Revisar permisos especificos para crear/editar/resetear usuarios.
2. Corregir textos heredados de otros modulos.
3. Registrar cambios en `docs/modules/usuarios/BITACORA.md`.
