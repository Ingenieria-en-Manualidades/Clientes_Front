# AGENTS.md

## Objetivo Del Archivo

Este archivo define las reglas y el contexto que debe seguir cualquier programador, IA, agente de desarrollo o asistente automatizado que trabaje sobre el frontend de este proyecto.

El frontend está desarrollado en Nuxt 3 y forma parte de un software dividido en varios componentes:

- Frontend: Nuxt 3, Vue 3 y TypeScript.
- Backend: API externa consumida mediante variables de entorno.
- Estilos: Tailwind CSS, CSS local y PrimeVue en modo `unstyled`.
- Control de versiones: Git.

El objetivo principal del agente es ayudar a modificar, revisar, documentar y mejorar el frontend sin romper la estructura existente, los flujos de usuario, la comunicación con el backend, las rutas, los componentes compartidos ni la configuración del proyecto.

---

# 1. Reglas De Trabajo Con Agentes

<h2 id="reglas-para-programadores" style="color: #d4a017;">1.1. Reglas Para Programadores</h2>

El agente debe trabajar siempre con prudencia, respetando la arquitectura actual del proyecto y documentando con claridad cualquier cambio importante.

Reglas obligatorias:

1. No modificar archivos sin identificar primero la ruta exacta del archivo.
2. No eliminar código existente sin revisar referencias y explicar el motivo.
3. No cambiar la estructura general del proyecto sin una razón clara.
4. No mover páginas, componentes, composables, layouts o middleware sin validar el impacto en Nuxt.
5. No hardcodear URLs, tokens, API keys ni valores que deban venir desde `runtimeConfig`.
6. No sobrescribir ni exponer el contenido de `.env`.
7. No duplicar lógica de API si ya existe un composable del dominio.
8. No cambiar nombres de rutas, parámetros, props o campos consumidos por el backend sin revisar el flujo completo.
9. No modificar autenticación, cookies, middleware o recuperación de contraseña sin revisar los archivos relacionados.
10. No introducir librerías nuevas sin una necesidad real y sin actualizar `package.json` y `package-lock.json`.
11. No cambiar el sistema visual base del proyecto sin aprobación.
12. Mantener compatibilidad con Nuxt 3, Vue 3, TypeScript, Tailwind CSS y PrimeVue.
13. Antes de proponer cambios, revisar la página, componente, composable, middleware o endpoint relacionado.
14. Ejecutar una verificación razonable antes de entregar cambios importantes.
15. No modificar componentes dinámicos sin revisar su uso en `components/dinamicos` y su impacto en las páginas que los consumen.
16. No modificar componentes de UI sin revisar su uso en `components/` y validar que el cambio no rompa otras partes del proyecto y justificar el motivo.

---

# 2. Contexto Técnico Del Frontend

## 2.1. Framework Principal

El frontend utiliza Nuxt 3 con Vue 3 y TypeScript.

El agente debe respetar las convenciones de Nuxt:

- `pages/` para rutas.
- `components/` para componentes reutilizables.
- `composables/` para lógica reutilizable, consumo de APIs y helpers de dominio.
- `layouts/` para estructuras visuales compartidas.
- `middleware/` para protección y redirección de rutas.
- `server/api/front/` para endpoints Nitro usados por el frontend.

## 2.2. Estilos Y Componentes Visuales

El proyecto usa Tailwind CSS, archivos CSS locales y PrimeVue configurado con `unstyled: true`.

Antes de modificar UI, el agente debe revisar:

- Componentes existentes en `components/`.
- Controles dinámicos en `components/dinamicos`.
- Estilos globales en `assets/css`.
- Configuración de Tailwind en `tailwind.config.js`.
- Preset de PrimeVue en `presets/aura`.

## 2.3. Configuración Y Variables De Entorno

La configuración de runtime está en `nuxt.config.ts`.

Variables públicas usadas por el proyecto:

- `GLOBAL_URL_SERVER`
- `GLOBAL_URL_FRONT`
- `GLOBAL_URL_SERVER_GROOT`
- `KEY_REFERRALS_URL_SERVER`
- `API_KEY_CLIENTS_BACKEND`
- `VITE_APP_URL`

Estas variables no deben reemplazarse por valores fijos dentro del código.

---

# 3. Orden De Lectura Recomendado

Antes de modificar código, el agente debe revisar en este orden:

1. `AGENTS.md`.
2. `package.json`.
3. `nuxt.config.ts`.
4. `.env`, si existe.
5. La página dentro de `pages/` relacionada con la funcionalidad.
6. Los componentes usados por esa página.
7. Los composables del dominio relacionado.
8. Las interfaces de TypeScript relacionadas en `interfaces/`.
9. Los middleware relacionados, si la ruta está protegida.
10. Los endpoints de `server/api/front/`, si la funcionalidad usa endpoints internos.
11. Archivos de estilos relacionados en `assets/css` o configuración de Tailwind.

Si en el futuro se crea documentación por módulo, revisar también:
1. `docs/modules/${module}/CONTEXT.md`.
2. `docs/modules/${module}/BITACORA.md`.
3. `docs/modules/${module}/PENDING.md`.

---

# 4. Flujo De Contextualización

Antes de crear o modificar una funcionalidad, el agente debe seguir este flujo, Se dedicara a revisar lo que es el Contex


## Paso 1: Identificar El Módulo

El agente debe identificar qué módulo o pantalla se va a modificar.

Ejemplos:

- Login.
- Usuarios.
- Remisiones.
- Objetivos.
- Encuestas.
- Accidentes.
- Recuperación de contraseña.
- Selección de clientes.

## Paso 2: Revisar La Ruta

El agente debe ubicar la vista principal en `pages/` y revisar:

- Nombre de la ruta.
- Layout usado.
- Middleware aplicado.
- Componentes importados.
- Composables consumidos.
- Parámetros de ruta o query params.

## Paso 3: Revisar Componentes Relacionados

El agente debe revisar los componentes que participan en la pantalla antes de modificar lógica o estilos.

Debe validar:

- Props recibidas.
- Eventos emitidos.
- Estados de carga.
- Manejo de errores.
- Validaciones visibles para el usuario.
- Dependencias con componentes dinámicos.

## Paso 4: Revisar Composables Y APIs

El agente debe revisar los composables relacionados antes de crear nuevos métodos.

En los composables, todo método cuyo objetivo sea consumir la API del backend debe usar `try` y `catch`.

Además, la respuesta del método debe retornar un objeto con datos y estas tres variables:

- `success`
- `title`
- `message`

Debe validar:

- URL usada desde `runtimeConfig`.
- Método HTTP.
- Payload enviado.
- Estructura de respuesta esperada.
- Manejo de errores.
- Reutilización en otras páginas o componentes.

## Paso 5: Revisar Impacto Visual Y Responsive

Si el cambio afecta UI, el agente debe revisar que el resultado siga siendo usable en tamaños de pantalla comunes.

Debe prestar atención a:

- Tablas.
- Formularios.
- Modales.
- Menús laterales.
- Botones de acción.
- Estados vacíos.
- Mensajes de error.

---

# 5. Restricciones Operativas

1. Cada cambio debe respetar la estructura actual de carpetas.
2. Cada llamada al backend debe usar la configuración de `runtimeConfig` cuando aplique.
3. Cada formulario debe conservar validaciones de campos requeridos y manejo de errores.
4. Cada tabla o listado debe conservar paginación, filtros o acciones existentes, si aplica.
5. Cada modal debe conservar cierre, confirmación y estados de carga cuando existan.
6. Cada cambio en middleware debe considerar usuarios autenticados, invitados y flujos de redirección.
7. Cada cambio en cookies debe revisar los endpoints relacionados en `server/api/front`.
8. Cada cambio visual debe respetar Tailwind, CSS local y PrimeVue `unstyled`.
9. Cada cambio de dependencias debe reflejarse en `package.json` y `package-lock.json`.
10. Cada cambio importante debe verificarse con `npm run build` cuando sea posible.

---

# 6. Comandos Del Proyecto

Usa npm para instalar, ejecutar y compilar el proyecto.

```bash
npm install
npm run dev
npm run build
npm run preview
```

Flujo de recuperación mencionado en el README cuando faltan dependencias o están desactualizadas:

```bash
npm cache clean --force
npm install
npm run build
```

No hay un script dedicado de pruebas en `package.json` al momento de crear este archivo.

---

# 7. Módulos Y Carpetas Relevantes

## 7.1. Módulos Funcionales

Los módulos principales se organizan entre `pages/`, `components/` y `composables/`.

Ejemplos relevantes:

- `pages/remisiones` con `components/remisiones` y `composables/remisiones`.
- `pages/objetivos` con `components/objetivos` y `composables/objetivos`.
- `pages/administration` con `components/users` y `composables/administration`.
- `pages/login.vue` con `components/LoginForm.vue` y composables de login.
- `pages/recuperacion.vue` con `components/RecuperacionForm.vue` y composables de recuperación.
- `pages/seleccion-clientes.vue` con `components/SeleccionClientes.vue` y composables de clientes.
- `pages/unidades-diarias.vue` con composables de unidades diarias.

## 7.2. Archivos Ignorados En Nuxt

En `nuxt.config.ts` existe una lista `ignore` con rutas de `improductividades`.

Antes de trabajar sobre esos archivos, el agente debe revisar si están activos en el build o si Nuxt los está ignorando.

---

# 8. Seguridad En Git Y Edición

1. No revertir cambios locales no relacionados.
2. No sobrescribir `.env`.
3. No eliminar archivos sin buscar referencias con `rg`.
4. No modificar `package-lock.json` manualmente.
5. No mezclar refactors amplios con correcciones pequeñas.
6. No entregar cambios sin informar qué archivos fueron modificados.
7. No asumir que una pantalla funciona igual que otra sin revisar su implementación.

---

# 9. Verificación Antes De Entregar

Antes de finalizar cambios importantes, el agente debe intentar ejecutar:

```bash
npm run build
```

Para cambios visuales o de interacción, también se recomienda ejecutar:

```bash
npm run dev
```

Si no se puede verificar, el agente debe documentar claramente el motivo.
