# CONTEXT.md

## Objetivo
 el modulo frontend `Encuesta`, usado para registrar la encuesta de satisfaccion del cliente y consultar respuestas ya registradas en el ano actual.

## Alcance frontend
- Mostrar encuesta de satisfaccion.
- Bloquear envio hasta aceptar politica de tratamiento de datos.
- Cargar informacion del contacto asociado al usuario.
- Cargar lista de cargos.
- Cargar lista de clientes de encuesta.
- Registrar respuestas simples, booleanas y tipo radio.
- Deshabilitar la encuesta si el usuario ya respondio en el año actual.
- Mostrar mensajes de exito, error y validacion.

## Ruta
1. `/encuesta/`
   - Archivo: `pages/encuesta/index.vue`.
   - `layout: "default"`.
   - `middleware: "auth"`.
   - `requiresAuth: true`.

## Ubicacion en menu
- Archivo: `composables/menuItems.ts`.
- Nombre: `Encuesta`.
- Ruta: `/encuesta/`.
- Permiso: `view_encuesta`.
- Recorrido guiado: `stepByStep: false`.

## Archivos relevantes
- `pages/encuesta/index.vue`.
- `components/PolicyGate.vue`.
- `components/PolicyModal.vue`.
- `composables/survey/surveyApis.ts`.
- `composables/usePolicy.ts`.
- `interfaces/survey.ts`.
- `Clientes_Back/app/Http/Controllers/SurveyController.php`.
- Modelos backend en `Clientes_Back/app/Models/survey/`.

## Composables API
### `useSurveyApis`
Usa `config.public.apiBackendCliente`.

Metodos:
- `getListCharges()`
  - `GET api/listCharges`.
- `getListClients()`
  - `GET api/listClients`.
- `getInfoUser(username)`
  - `GET api/getInformationUser/{username}`.
- `setSaveSurvey(survey, answer)`
  - `POST api/saveSurvey`.

### `usePolicy`
- Consulta estado de aceptacion de politica.
- Carga contenido/version de politica cuando aplica.
- Permite condicionar el envio de encuesta.

## Flujo funcional
1. El usuario entra a `/encuesta/`.
2. Se valida autenticacion.
3. `PolicyGate` revisa si el usuario acepto la politica.
4. Si no acepto, se muestra aviso y no se habilita el formulario.
5. Si acepto, se cargan cargos, clientes e informacion del usuario.
6. Si ya existe encuesta del ano actual, se llenan respuestas y se deshabilita la edicion.
7. Si no existe, el usuario responde la encuesta.
8. El frontend valida campos obligatorios.
9. Se envia `survey` y `answers` a `saveSurvey`.
10. Backend guarda encuesta, trazabilidad y respuestas.

## Backend relevante
- `SurveyController@getListCharges`.
- `SurveyController@getListClients`.
- `SurveyController@getInformationUser`.
- `SurveyController@setSaveSurvey`.
- Al guardar, backend:
  - Busca usuario por `username`.
  - Busca `CustomerContact`.
  - Crea `Survey`.
  - Crea trazabilidad en `CustomerContactHasSurvey`.
  - Guarda respuestas segun tipo.
  - Encola correo `ThankYouSurveyMail` si hay email.

## Cookies usadas
- `usuario`: se envia como `username`.
- `token`: requerido por middleware general.

## Riesgos y puntos de atencion
- La encuesta depende de politica de privacidad aceptada.
- El frontend asume que el ultimo cargo es `Otro...`.
- Si no hay `CustomerContact` para el usuario, backend responde error.
- La encuesta se bloquea si ya existe respuesta del ano actual.
- Algunos textos tienen codificacion incorrecta.

## Consideraciones futuras
1. Si cambian preguntas, actualizar `answers` inicial y backend.
2. Si cambian tipos de respuesta, actualizar `SurveyController@setSaveSurvey`.
3. Registrar cambios en `docs/modules/encuesta/BITACORA.md`.
