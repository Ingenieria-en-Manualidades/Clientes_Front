# BITACORA.md

Registro de cambios del modulo `usuarios`.

Cada cambio funcional, tecnico o documental debe registrarse aqui con fecha, motivo, archivos afectados y notas relevantes.

## 2026-05-08

### Documentacion inicial del contexto

Motivo:
- Crear el contexto tecnico y funcional del submodulo Usuarios.

Archivos afectados:
- `docs/modules/usuarios/CONTEXT.md`
- `docs/modules/usuarios/BITACORA.md`

Cambios realizados:
- Se documentaron ruta, menu, tabla de usuarios, modales, composable API, endpoints backend, flujo funcional, riesgos y consideraciones futuras.

## 2026-05-20

### Correccion de bloqueo en login local

Motivo:
- Evitar que el formulario de login quede cargando indefinidamente cuando una peticion del flujo de autenticacion no responde o falla.

Archivos afectados:
- `components/LoginForm.vue`
- `composables/loginApi.ts`
- `composables/login/validaciones.ts`
- `server/api/front/cookiesRemisiones.post.ts`
- `server/api/front/cookieClienteid.post.ts`
- `server/api/front/deleteCookiesRem.delete.ts`

Cambios realizados:
- Se agrego manejo de error con apagado garantizado del loader en el formulario.
- Se agregaron timeouts a las peticiones del flujo de login.
- Se ajustaron rutas internas de Nuxt a `/api/front/...`.
- Se cambio limpieza de cookies en validacion de login a `$fetch` para que funcione en SSR.
- Se ajustaron cookies locales para no exigir `secure` fuera de produccion.

## 2026-05-20

### Preservar contrasena al actualizar usuarios

Motivo:
- Evitar que la edicion de datos, rol, clientes o permisos reemplace la contrasena real del usuario.

Archivos afectados:
- `components/users/ModalFormUpdateUser.vue`
- `composables/administration/dataUsers.ts`

Cambios realizados:
- El formulario de actualizacion envia `password` y `password_confirmation` como `null` cuando no se modifica la contrasena.
- La validacion de usuarios ahora permite omitir contrasena en modo actualizacion sin afectar la validacion de creacion.

## 2026-05-21

### Mejora visual de selecciones en usuarios

Motivo:
- Evitar que las listas de permisos y clientes seleccionados se extiendan demasiado dentro de los formularios de usuarios.

Archivos afectados:
- `components/dinamicos/InputSearchList.vue`

Cambios realizados:
- Se agrego un contenedor con altura maxima y scroll interno para las selecciones.
- Se mejoro el estilo de los chips seleccionados, incluyendo truncado de textos largos y boton de quitar mas compacto.

## 2026-05-21

### Correccion de cookies en login local con build

Motivo:
- Evitar que el login falle cuando se prueba un build local por HTTP y las cookies se marcan como seguras.

Archivos afectados:
- `server/api/front/cookiesRemisiones.post.ts`
- `server/api/front/cookieClienteid.post.ts`

Cambios realizados:
- Las cookies ahora usan `secure` y `sameSite: none` solo cuando la peticion llega por HTTPS.
- En HTTP local se usan cookies compatibles con desarrollo para que el navegador pueda guardarlas.

## 2026-05-26

### Permiso de Clientes en administracion

Motivo:
- Permitir asignar desde la vista de Usuarios el permiso para que un usuario vea el submodulo `Clientes`.
- Mantener el comportamiento de seguridad del menu: el grupo `Administracion` requiere `view_administration`.

Archivos afectados:
- `composables/menuItems.ts`

Cambios realizados:
- Se agrego `Clientes` como submodulo de `Administracion` con permiso `view_clients`.
- La visibilidad esperada queda:
  - `view_administration` para ver el grupo `Administracion`.
  - `view_users` para ver `Usuarios`.
  - `view_clients` para ver `Clientes`.
- Se verifico que el usuario `DEVUSER` debe tener `view_administration`, `view_users` y `view_clients` para ver ambos submodulos.

## 2026-05-29

### Mensaje de login para credenciales invalidas

Motivo:
- Reemplazar el titulo tecnico `Error 422` por un mensaje claro para el usuario cuando falla el login por credenciales.

Archivos afectados:
- `composables/loginApi.ts`
- `components/LoginForm.vue`

Cambios realizados:
- `loginApi.login` usa `title` y `message` devueltos por el backend en errores de autenticacion.
- El toast del formulario ahora puede mostrar `Credenciales incorrectas` y `Usuario o contraseña incorrectos.`.
- Se mantiene mensaje generico solo para fallos inesperados de red/servidor.

Verificacion:
- `npm run build`
- Resultado: build exitoso con warnings conocidos no bloqueantes.
