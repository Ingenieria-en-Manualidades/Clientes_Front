# Contexto - Clientes

## Objetivo

Documentar el submodulo administrativo `Clientes`, usado para consultar y administrar clientes relacionados con usuarios, encuestas y operaciones del sistema.

## Ubicacion

- Padre: `Administracion`.
- Ruta frontend: `pages/administration/clients.vue`.
- Menu: `composables/menuItems.ts`.
- Componentes: `components/clients/ModalFormUpdateClient.vue`.
- Composables: `composables/administration/clientsApi.ts` y `composables/administration/dataClients.ts`.
- Interfaces: `interfaces/clients.ts`.

## Permisos

- El grupo padre `Administracion` requiere `view_administration`.
- El submodulo `Clientes` requiere `view_clients`.
- Para ver `Administracion > Clientes`, el usuario debe tener ambos permisos: `view_administration` y `view_clients`.
- Los permisos directos asignados desde Usuarios deben llegar en la respuesta de login para que el menu pueda evaluar `view_clients`.

## Fuentes De Datos

El modulo distingue dos fuentes visibles:

1. Esquema `Clients` / tabla backend `clientes`.
   - Endpoint: `GET api/getClients`.
   - Campos visuales: `id`, `nombre`, `ID Endpoint`.
   - `ID Endpoint` corresponde a `cliente_endpoint_id`.
   - Esta tabla se relaciona con usuarios por medio de `cliente_user`.

2. Esquema `surveys` / tabla `surveys.clients`.
   - Endpoint: `GET api/listClients`.
   - Campos visuales: `cliente_id`, `name`, `feed_value`, `cost_center`, `overtime`, `city_id`.
   - En backend el identificador puede venir como `clients_id`; frontend lo normaliza visualmente a `cliente_id`.

## Flujo Actual

1. El usuario entra a `Administracion > Clientes`.
2. La pantalla carga en paralelo clientes del esquema `Clients` y clientes del esquema `surveys`.
3. El usuario alterna entre las vistas `Clientes` y `Surveys`.
4. Cada vista tiene buscador independiente.
5. El boton `Sincronizar` consume `POST api/syncClients`, sincroniza desde `public.cliente` y luego recarga ambas fuentes visibles.
   - Backend sincroniza todos los `public.cliente` hacia `clientes`.
   - Backend marca como deshabilitados los clientes con `public.cliente.deleted_at` lleno o `activo` diferente de `s`, propagando `deleted_at` hacia `clientes`.
   - Backend actualiza `surveys.clients` si el cliente ya existe por `clients_id` o nombre.
   - Backend crea en `surveys.clients` solo si el cliente existe en `public.clientes_activos`.
   - Backend crea o actualiza clientes deshabilitados en `surveys.clients` con `deleted_at` lleno y `active = false`.
   - Si no existe `public.clientes_activos`, Backend omite la sincronizacion de `surveys.clients`.
6. En la vista `Clientes` se puede editar `nombre` y `cliente_endpoint_id`.
7. En la vista `Clientes` se pueden crear clientes nuevos con `nombre` y `cliente_endpoint_id`.
8. En la vista `Clientes` se puede abrir el detalle de usuarios asociados por medio de `cliente_user`.
9. En la vista `Clientes` se puede deshabilitar o habilitar un cliente desde `ACCIONES`; backend sincroniza ese estado con `surveys.clients` si existe el equivalente.
10. En la vista `Surveys` se puede abrir el detalle de usuarios asociados.
11. En la vista `Surveys` se puede editar `name`, `feed_value`, `cost_center`, `overtime` y `city_id`.

## Backend Relacionado

- `GET api/getClients`.
- `GET api/listClients`.
- `GET api/getUsersByClient/{id}`.
- `GET api/getUsersBySurveyClient/{id}`.
- `POST api/createClient`.
- `POST api/syncClients`.
- `PUT api/setStatusClient/{id}`.
- `PUT api/updateClient/{id}`.
- `PUT api/updateSurveyClient/{id}`.

## Consideraciones

- La sincronizacion real usa `public.cliente` como fuente.
- La sincronizacion actualiza `clientes` usando `public.cliente.cliente_id` como `cliente_endpoint_id`.
- `public.cliente.deleted_at` lleno o `public.cliente.activo` diferente de `s` se interpreta como cliente deshabilitado.
- Los clientes deshabilitados se sincronizan con `deleted_at` lleno en `clientes` y `surveys.clients`; si vuelven activos en la fuente, se restauran dejando `deleted_at` en `NULL`.
- `surveys.clients.clients_id` debe quedar igual a `public.cliente.cliente_id`; backend alinea ese ID al crear o actualizar por nombre.
- La edicion actual aplica al esquema `Clients` / tabla `clientes`.
- La creacion actual aplica al esquema `Clients` / tabla `clientes`.
- La edicion de `surveys.clients` no crea clientes nuevos en surveys; solo actualiza registros existentes.
- La sincronizacion de `surveys.clients` depende de `public.clientes_activos`; si esa tabla no existe, no se crean ni se actualizan registros en Surveys.
- La relacion con usuarios depende de `cliente_user`, donde `cliente_id` apunta al `id` interno de `clientes`.
- En la vista `Surveys`, el modal de usuarios usa `GET api/getUsersBySurveyClient/{id}` porque `surveys.clients.clients_id` debe mapearse primero contra `clientes.cliente_endpoint_id`.
