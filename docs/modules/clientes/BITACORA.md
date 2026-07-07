# Bitacora - Clientes

Registro de cambios del submodulo `Clientes`.

## 2026-05-22

### Creacion del submodulo

- Se agrego `Clientes` como submodulo dentro de `Administracion`.
- Se creo la ruta `pages/administration/clients.vue`.
- Se agregaron composables e interfaces para listar clientes.

Archivos:
- `composables/menuItems.ts`
- `pages/administration/clients.vue`
- `composables/administration/clientsApi.ts`
- `composables/administration/dataClients.ts`
- `interfaces/clients.ts`

### Separacion por esquemas

- Se separo la visualizacion entre clientes del esquema `Clients` y clientes del esquema `surveys`.
- Se agregaron campos especificos para cada fuente.
- Se agrego boton `Actualizar / sincronizar` para recargar ambas listas.

### Edicion de cliente

- Se agrego accion de editar en la vista `Clientes`.
- Se creo modal para actualizar `nombre` y `cliente_endpoint_id`.
- Se conecto el modal con `PUT api/updateClient/{id}`.

Archivos:
- `components/clients/ModalFormUpdateClient.vue`
- `pages/administration/clients.vue`
- `composables/administration/clientsApi.ts`

### Creacion y edicion extendida

- Se agrego modal para crear clientes en el esquema `Clients`.
- Se conecto la creacion con `POST api/createClient`.
- Se agrego accion de editar en la vista `Surveys`.
- Se creo modal para actualizar campos de `surveys.clients`.
- Se conecto la edicion con `PUT api/updateSurveyClient/{id}`.

Archivos:
- `components/clients/ModalFormCreateClient.vue`
- `components/clients/ModalFormUpdateSurveyClient.vue`
- `pages/administration/clients.vue`
- `composables/administration/clientsApi.ts`
- `interfaces/clients.ts`

### Sincronizacion real desde public

- Se cambio el boton a `Sincronizar`.
- Se conecto el boton con `POST api/syncClients`.
- El frontend recarga las tablas de `Clientes` y `Surveys` despues de una sincronizacion exitosa.
- Backend separa destinos: `clientes` se sincroniza desde `public.cliente`.
- Backend actualiza `surveys.clients` por `clients_id` o nombre, y solo crea nuevos registros si el cliente existe en `public.clientes_activos`.

Archivos:
- `pages/administration/clients.vue`
- `composables/administration/clientsApi.ts`

### Usuarios asociados

- Se agrego accion con icono de usuarios en la vista `Clientes`.
- Se creo modal para listar usuarios asociados al cliente seleccionado.
- Se conecto con `GET api/getUsersByClient/{id}`.

Archivos:
- `components/clients/ModalClientUsers.vue`
- `pages/administration/clients.vue`
- `composables/administration/clientsApi.ts`
- `interfaces/clients.ts`

## 2026-05-25

### Usuarios asociados en Surveys

- Se agrego la accion con icono de usuarios en la vista `Surveys`.
- Se reutilizo `ModalClientUsers.vue` con la propiedad `source="surveys"`.
- Se agrego `getUsersBySurveyClient` en `clientsApi.ts`.
- La vista `Surveys` consume `GET api/getUsersBySurveyClient/{id}` usando el `cliente_id` normalizado desde `surveys.clients.clients_id`.
- Esto permite identificar que usuarios estan asociados al cliente de encuestas desde la columna `ACCIONES`.

Archivos:
- `components/clients/ModalClientUsers.vue`
- `pages/administration/clients.vue`
- `composables/administration/clientsApi.ts`

## 2026-05-26

### Visibilidad por permiso `view_clients`

- Se agrego el submodulo `Clientes` debajo de `Administracion` con permiso propio `view_clients`.
- Se mantuvo la regla del menu: `Administracion` solo aparece con `view_administration`.
- Para ver `Clientes`, el usuario debe tener `view_administration` y `view_clients`.
- Se corrigio una prueba intermedia que mostraba `Administracion` cuando solo existia un submodulo visible; esa regla se retiro para no exponer administracion a usuarios sin permiso padre.

Archivos:
- `composables/menuItems.ts`

## 2026-05-28

### Pruebas unitarias del submodulo Clientes

- Se configuro Vitest para pruebas unitarias del frontend.
- Se agregaron scripts:
  - `npm run test:unit`
  - `npm run test:unit:clients`
- Se agregaron pruebas para `useDataClients`.
- Se validan headers y atributos de tablas para `Clientes` y `Surveys`.
- Se valida la normalizacion de datos del backend:
  - `clientes.id`, `clientes.nombre`, `clientes.cliente_endpoint_id`.
  - `surveys.clients.clients_id`, `name`, `feed_value`, `cost_center`, `overtime`, `city_id`.
- Se agregaron pruebas para `useClientsApi`.
- Se validan llamadas a endpoints:
  - `GET api/getClients`.
  - `GET api/listClients`.
  - `GET api/getUsersByClient/{id}`.
  - `GET api/getUsersBySurveyClient/{id}`.
  - `POST api/createClient`.
  - `POST api/syncClients`.
  - `PUT api/updateClient/{id}`.
  - `PUT api/updateSurveyClient/{id}`.
- Se validan respuestas exitosas, errores del backend y error generico cuando falla `fetch`.
- Se agregaron pruebas para `ModalClientUsers`.
- Se valida que el modal:
  - consulte usuarios desde clientes normales;
  - consulte usuarios desde Surveys cuando `source="surveys"`;
  - normalice estados `Activo`, `Inactivo` y `Eliminado`;
  - muestre mensaje vacio cuando backend responde `Usuarios no encontrados.`;
  - muestre toast y mensaje fallback ante errores inesperados.

Archivos:
- `package.json`
- `package-lock.json`
- `vitest.config.ts`
- `tests/unit/clients/dataClients.spec.ts`
- `tests/unit/clients/clientsApi.spec.ts`
- `tests/unit/clients/ModalClientUsers.spec.ts`

### Ejecucion de pruebas

Comando usado:

```powershell
npm run test:unit:clients
```

Resultado:
- 18 pruebas exitosas.
- 3 archivos de prueba exitosos.

## 2026-05-29

### Sincronizacion visible de Clientes y Surveys

Motivo:
- Aclarar el comportamiento del boton `Sincronizar` y validar que las vistas carguen los clientes desde sus schemas reales.

Cambios realizados:
- La vista `Clientes` carga registros desde `clients.clientes` mediante `GET api/getClients`.
- La vista `Surveys` carga registros desde `surveys.clients` mediante `GET api/listClients`.
- El boton `Sincronizar` consume `POST api/syncClients` y recarga ambas fuentes al finalizar exitosamente.
- Se confirmo que el backend alinea `surveys.clients.clients_id` con `public.cliente.cliente_id`, por lo que el frontend recibe el ID correcto normalizado como `cliente_id`.

Verificacion:
- `npm run build`
- Resultado: build exitoso con warnings conocidos no bloqueantes.

Archivos:
- `pages/administration/clients.vue`
- `composables/administration/clientsApi.ts`
- `composables/administration/dataClients.ts`
- `docs/modules/clientes/CONTEXT.md`

## 2026-06-04

### Sincronizacion visible de clientes deshabilitados

- Se documento que el boton `Sincronizar` tambien propaga clientes deshabilitados desde `public.cliente`.
- Un cliente se considera deshabilitado cuando `public.cliente.deleted_at` viene lleno o `activo` es diferente de `s`.
- Backend deja esos clientes con `deleted_at` lleno en `clientes` y `surveys.clients`.
- En `surveys.clients`, ademas marca `active = false`.
- Si el cliente vuelve activo en la fuente, la sincronizacion restaura `deleted_at = NULL`.

Archivos:
- `docs/modules/clientes/CONTEXT.md`
