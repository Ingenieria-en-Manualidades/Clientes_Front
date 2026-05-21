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
