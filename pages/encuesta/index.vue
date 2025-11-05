<template>
  <div class="relative h-full rounded-3xl flex flex-col lg:flex-row">
    <title>Encuesta</title>
    <!-- El Gate puede cerrarse, pero el envío queda bloqueado hasta aceptar -->
    <PolicyGate :blockApp="false" :autoCheck="true" />

    <!-- Columna izquierda -->
    <aside class="w-full lg:w-[20%] flex flex-col items-center justify-center p-4">
      <header class="text-center w-full">
        <img
          src="/assets/img/IM INGENIERIA CENTRADO-slogan.png"
          alt="IM Ingeniería"
          class="w-full h-auto mx-auto mb-4 max-w-[120px] sm:max-w-[160px] md:max-w-[220px]"
        />
        <img
          src="/assets/img/LOGOS-IM.png"
          alt="Certificaciones"
          class="w-full h-auto mx-auto mb-4 max-w-[120px] sm:max-w-[160px] md:max-w-[220px]"
        />
      </header>
    </aside>

    <section
      class="w-full h-full rounded-r-3xl overflow-auto lg:w-[80%] flex flex-col items-center bg-gradient-to-br from-azulIENM/10 via-white to-azulClaroIENM/20"
    >
      <h1 class="mx-auto mt-4 p-4 text-center inline-block text-azulIENM text-xl md:text-2xl  border-b-4 border-amarilloIENM">
        Encuesta de Satisfacción
      </h1>

      <!-- Aviso si NO ha aceptado -->
      <div
        v-if="!dataProcessing"
        class="mt-6 max-w-3xl mx-auto rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800"
      >
        Debes aceptar la Política de Tratamiento de Datos
        <span v-if="version"> (versión {{ version }})</span>
        para continuar con la encuesta.
      </div>

      <section class="h-full">
        <!-- Información básica -->
        <section v-if="dataProcessing" class="mt-10 text-center">
          <h2 class="mx-auto inline-block text-azulIENM text-lg md:text-xl  border-b-[3px] border-amarilloIENM pb-1">
            Información básica
          </h2>

          <div class="mt-4 grid gap-4 max-w-3xl mx-auto text-left">
            <DinamicosInputText
              v-model="survey.fullname"
              :label="'1. Ingrese su nombre completo'"
              :displayFlex="false"
              :warning="errorsSurvey.fullname"
              :disabled="true"
            />
            <DinamicosDropDownList
              :label="'2. Ingrese su cargo'"
              :displayFlex="false"
              :options="charges"
              v-model="survey.charge_id"
              :warning="errorsSurvey.charge_id"
              :disabled="surveyDisabled.charge_id"
            />
            <DinamicosInputText
              v-model="survey.another_charge"
              :label="'Por favor ingrese el otro cargo'"
              :displayFlex="false"
              :visible="survey.charge_id === charges?.at(-1)?.value ? true : false"
              :warning="errorsSurvey.another_charge"
              :disabled="surveyDisabled.another_charge"
            />
            <DinamicosDropDownList
              :label="'3. Ingrese el nombre de su empresa, CEDI y su ciudad'"
              :displayFlex="false"
              :options="clients"
              v-model="survey.clients_id"
              :warning="errorsSurvey.clients_id"
              :disabled="surveyDisabled.clients_id"
            />
            <DinamicosInputNumber
              v-model="survey.cellphone"
              :label="'4. Ingrese su número de contacto'"
              :displayFlex="false"
              :disabled="true"
            />
            <DinamicosInputText
              v-model="survey.email"
              :label="'5. Ingrese su correo electrónico'"
              :displayFlex="false"
              :disabled="true"
            />
          </div>
        </section>

        <!-- Satisfacción -->
        <section v-if="dataProcessing" class="mt-10 text-center">
          <h2 class="mx-auto inline-block text-azulIENM text-lg md:text-xl  border-b-[3px] border-amarilloIENM pb-1">
            Satisfacción
          </h2>

          <div class="mt-4 max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-left">
            <p class="text-lg ">Instrucciones</p>
            <p class="text-sm text-slate-700">Califica los enunciados según los siguientes criterios:</p>
            <ul class="mt-2 flex flex-wrap gap-3 text-sm">
              <li class="chip">3 = Satisfecho/a</li>
              <li class="chip">2 = Medianamente Satisfecho/a</li>
              <li class="chip">1 = Insatisfecho/a</li>
            </ul>
          </div>

          <div class="mt-4 space-y-4 max-w-3xl mx-auto text-left">
            <DinamicosInputRadio
              v-model="answers[0].answer"
              :label="'6. ¿Qué tan satisfecho/a está con el cumplimiento del servicio prestado en cuenta a: programa de producción o plan de armado, cargues y descargues de productos, envíos o despachos de mercancías?'"
              :displayFlex="true"
              :options="optionsSatisfaction"
              :info="'(según aplique en su sector).'"
              :warning="answers[0].errorAnswer"
              :disabled="answers[0].disabled"
            />
            <DinamicosInputTextArea
              v-model="answers[0].observation"
              :label="'7. Observación'"
              :displayFlex="false"
              :warning="answers[0].errorObservation"
              :disabled="answers[0].disabled"
            />
            <DinamicosInputRadio
              v-model="answers[1].answer"
              :label="'8. ¿Qué tan satisfecho/a se encuentra usted con el acompañamiento y gestión de solicitudes o sugerencias al servicio prestado?'"
              :displayFlex="true"
              :options="optionsSatisfaction"
              :warning="answers[1].errorAnswer"
              :disabled="answers[1].disabled"
            />
            <DinamicosInputTextArea
              v-model="answers[1].observation"
              :label="'9. Observación'"
              :displayFlex="false"
              :warning="answers[1].errorObservation"
              :disabled="answers[1].disabled"
            />
            <DinamicosInputRadio
              v-model="answers[2].answer"
              :label="'10. ¿Qué tan satisfecho/a está con el cumplimiento del requerimiento de personal en cuanto a: tiempo de respuesta de solicitudes e idoneidad del mismo?'"
              :displayFlex="true"
              :options="optionsSatisfaction"
              :warning="answers[2].errorAnswer"
              :disabled="answers[2].disabled"
            />
            <DinamicosInputTextArea
              v-model="answers[2].observation"
              :label="'11. Observación'"
              :displayFlex="false"
              :warning="answers[2].errorObservation"
              :disabled="answers[2].disabled"
            />
            <DinamicosInputRadio
              v-model="answers[3].answer"
              :label="'12. ¿Qué tan satisfecho/a está en la respuesta oportuna a reclamos y novedades internas presentadas en el servicio?'"
              :displayFlex="true"
              :options="optionsSatisfaction"
              :warning="answers[3].errorAnswer"
              :disabled="answers[3].disabled"
            />
            <DinamicosInputTextArea
              v-model="answers[3].observation"
              :label="'13. Observación'"
              :displayFlex="false"
              :warning="answers[3].errorObservation"
              :disabled="answers[3].disabled"
            />
          </div>
        </section>

        <!-- Necesidades -->
        <section v-if="dataProcessing" class="mt-10 text-center">
          <h2 class="mx-auto inline-block text-azulIENM text-lg md:text-xl  border-b-[3px] border-amarilloIENM pb-1">
            Necesidades
          </h2>

          <div class="mt-4 max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 text-left">
            <p class="text-lg ">¡Gracias por tu participación!</p>
            <p class="text-sm text-slate-700">Tu feedback nos ayuda a mejorar. Por favor, continúa con la encuesta.</p>
          </div>

          <div class="mt-4 space-y-4 max-w-3xl mx-auto text-left">
            <DinamicosInputRadio
              v-model="answers[4].answer"
              :label="'14. ¿Usted tendría en cuenta a IM Ingeniería SAS, como su aliado estratégico en sus planes de expansión y crecimiento dentro de la compañía?'"
              :displayFlex="false"
              :options="optionsNeeds"
              :warning="answers[4].errorAnswer"
              :disabled="answers[4].disabled"
            />
            <DinamicosInputTextArea
              v-model="answers[4].observation"
              :label="'15. ¿Por qué?'"
              :displayFlex="false"
              :warning="answers[4].errorObservation"
              :disabled="answers[4].disabled"
            />
            <DinamicosInputText
              v-model="answers[5].answer"
              :label="'16. De acuerdo a los resultados mensuales de la operación, ¿Qué tipo de información está interesado en recibir?'"
              :displayFlex="false"
              :warning="answers[5].errorAnswer"
              :disabled="answers[5].disabled"
            />
            <DinamicosInputText
              v-model="answers[6].answer"
              :label="'17. Describa las necesidades y expectativas del servicio.'"
              :displayFlex="false"
              :warning="answers[6].errorAnswer"
              :disabled="answers[6].disabled"
            />
          </div>

          <!-- CTA -->
          <div class="mt-6 max-w-3xl mx-auto">
            <button
              type="button"
              @click="submit"
              class="w-full flex items-center justify-center gap-2 rounded-2xl text-white  py-3 shadow-lg active:scale-[0.99] transition disabled:cursor-not-allowed"
              :class="dataProcessing ? 'bg-gradient-to-r from-verdeIENM to-verdeOscIENM hover:opacity-95' : 'bg-gray-400'"
              :disabled="answers[6].disabled"
            >
              ENVIAR
            </button>
          </div>

          <p class="mt-6 text-2xl text-azulIENM/90 ">
            ¡Gracias por tu tiempo y valiosa opinión!
          </p>
        </section>
      </section>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import type { Survey, AnswerSurvey } from "../../interfaces/survey";
import { useSurveyApis } from "../../composables/survey/surveyApis";
import type { OptionDropdown } from "../../interfaces/componentesDinamicos";
import PolicyGate from "../../components/PolicyGate.vue";
import { usePolicy } from "../../composables/usePolicy";
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";


definePageMeta({
  layout: "default",
  middleware: "auth",
  requiresAuth: true,
});
/* ---------- Política de datos ---------- */
const { accepted, version, content, fetchStatus, fetchPolicy } = usePolicy()
// dataProcessing = solo si YA aceptó
const dataProcessing = computed(() => accepted.value === true)

/* ---------- Catálogos & encuesta ---------- */
const charges = ref<OptionDropdown[] | undefined>();
const clients = ref<OptionDropdown[] | undefined>();
const username = useCookie("usuario");

const optionsSatisfaction = ref<OptionDropdown[]>([
  { label: "1", value: "Insatisfecho" },
  { label: "2", value: "Medianamente Satisfecho" },
  { label: "3", value: "Satisfecho" },
]);
const optionsNeeds = ref<OptionDropdown[]>([
  { label: "Si", value: "true" },
  { label: "No", value: "false" }
]);

const isSubmitting = ref(false);
const survey = ref<Survey>({
  start_time: new Date(),
  fullname: null,
  charge_id: null,
  clients_id: null,
  cellphone: "",
  email: "",
  username: String(username.value),
  another_charge: null
});

const surveyDisabled = ref({
  charge_id: false,
  clients_id: false,
  another_charge: false,
});

const errorsSurvey = ref({ fullname: "", charge_id: "", clients_id: "", another_charge: "" });

const answers = ref<AnswerSurvey[]>([
  { question_id: 1, type: "input_radio_answer", answer: null, observation: null, errorAnswer: null, observationRequired: true,  errorObservation: null, disabled: false },
  { question_id: 2, type: "input_radio_answer", answer: null, observation: null, errorAnswer: null, observationRequired: true,  errorObservation: null, disabled: false },
  { question_id: 3, type: "input_radio_answer", answer: null, observation: null, errorAnswer: null, observationRequired: true,  errorObservation: null, disabled: false },
  { question_id: 4, type: "input_radio_answer", answer: null, observation: null, errorAnswer: null, observationRequired: true,  errorObservation: null, disabled: false },
  { question_id: 5, type: "boolean_answer",     answer: null, observation: null, errorAnswer: null, observationRequired: true,  errorObservation: null, disabled: false },
  { question_id: 6, type: "simple_answer",      answer: null, observation: null, errorAnswer: null, observationRequired: false, errorObservation: null, disabled: false },
  { question_id: 7, type: "simple_answer",      answer: null, observation: null, errorAnswer: null, observationRequired: false, errorObservation: null, disabled: false },
]);

const toast = useToast();
const { getListCharges, getListClients, getInfoUser, setSaveSurvey } = useSurveyApis();

/* ---------- Cargar listas (tras aceptar) ---------- */
const loadLists = async () => {
  const [responseCharges, responseClients, responseInfoUser] = await Promise.all([
    getListCharges(), getListClients(), getInfoUser(String(username.value))
  ])

  if (responseCharges.success) charges.value = responseCharges.data
  else toast.add({ severity: "error", summary: responseCharges.title, detail: responseCharges.message, life: 5000 })

  if (responseClients.success) clients.value = responseClients.data
  else toast.add({ severity: "error", summary: responseClients.title, detail: responseClients.message, life: 5000 })

  if (responseInfoUser.success) {
    survey.value.fullname = responseInfoUser.data.customer.fullname;
    survey.value.cellphone = responseInfoUser.data.customer.cellphone;
    survey.value.email = responseInfoUser.data.customer.email;

    // En caso de que el cliente ya haya respondido la encuesta en el año actual, la encuesta se inhabilitara y llenara sola.
    if (responseInfoUser.data.survey) {
      const surveyComplete = responseInfoUser.data.survey;
      for (const k in surveyDisabled.value) {
        surveyDisabled.value[k] = true;
      }

      survey.value.fullname = surveyComplete.survey.fullname;
      survey.value.clients_id = surveyComplete.survey.clients_id;
      survey.value.charge_id = surveyComplete.survey.charge_id;
      survey.value.another_charge = surveyComplete.survey.another_charge;
      
      answers.value.map(ans => {
        ans.disabled = true;
        switch (ans.type) {
          case "input_radio_answer":
            const answerRadio = surveyComplete.answersInputRadio.filter(a => a.question_id === ans.question_id);
            ans.answer = answerRadio[0].value_option;
            ans.observation = answerRadio[0].observation;
            break;

          case "boolean_answer":
            const answerBool = surveyComplete.answersBooleans.filter(a => a.question_id === ans.question_id);
            ans.answer = answerBool[0].answer;
            ans.observation = answerBool[0].observation;
            break;

          case "simple_answer":
            const answerSimple = surveyComplete.answersSimples.filter(a => a.question_id === ans.question_id);
            ans.answer = answerSimple[0].description;
            break;
          default:
            console.error("Tipo de pregunta no existente.");
            break;
        }
      });
    }
  } else {
    toast.add({ severity: "error", summary: responseInfoUser.title, detail: responseInfoUser.message, life: 5000 })
  }
}

onMounted(async () => {
  if (accepted.value === null) await fetchStatus()
  if (accepted.value === false) await fetchPolicy()
  if (accepted.value === true) await loadLists()
})

// Cuando el usuario acepte en el modal, cargar listas
watch(accepted, async (val) => {
  if (val === true && (!charges.value || !clients.value)) await loadLists()
})

/* ---------- Guardar encuesta ---------- */
const submit = async () => {
  if (isSubmitting.value) return

  if (!dataProcessing.value) {
    toast.add({
      severity: "warn",
      summary: "Política de datos",
      detail: "Debes aceptar la Política de Tratamiento de Datos para continuar.",
      life: 5000,
    })
    return
  }

  const missing: boolean[] = []
  errorsSurvey.value.fullname = ""
  errorsSurvey.value.charge_id = ""
  errorsSurvey.value.clients_id = ""
  errorsSurvey.value.another_charge = ""

  if (!survey.value.fullname)              { errorsSurvey.value.fullname   = "Esta campo es obligatorio."; missing.push(true) }
  if (survey.value.charge_id === null)     { errorsSurvey.value.charge_id  = "Esta campo es obligatorio."; missing.push(true) }
  if (survey.value.clients_id === null)    { errorsSurvey.value.clients_id = "Esta campo es obligatorio."; missing.push(true) }
  if (survey.value.charge_id === charges.value[charges.value?.length - 1].value) { 
    if (!survey.value.another_charge) { errorsSurvey.value.another_charge = "Este campo es obligatorio."; missing.push(true) }
  }

  answers.value.forEach(a => {
    a.errorAnswer = (!a.answer && a.answer !== 0) ? "Este campo es obligatorio." : null
    if (!a.answer && a.answer !== 0) missing.push(true)

    if (a.observationRequired === true) {
      a.errorObservation = (!a.observation || a.observation === "") ? "La observación es obligatoria." : null
      if (!a.observation || a.observation === "") missing.push(true)
    }
  })

  if (missing.length > 0) {
    toast.add({
      severity: "error",
      summary: "Faltan campos por llenar",
      detail: `Faltan ${missing.length} campos obligatorios por responder.`,
      life: 5000,
    })
    return
  }

  isSubmitting.value = true;
  const response = await setSaveSurvey(survey.value, answers.value)
  if (response.success) {
    for (const k in surveyDisabled.value) {surveyDisabled.value[k] = true;}
    answers.value.map(ans => {ans.disabled = true;});
  }
  
  toast.add({
    severity: response.success ? "success" : "error",
    summary: response.title,
    detail: response.message,
    life: 5000,
  })
  isSubmitting.value = false;
}
</script>

<style scoped>
.chip { @apply rounded-full bg-azulIENM/10 px-3 py-1 text-azulIENM border border-azulIENM/20; }
:deep(.p-scrollpanel) { @apply rounded-2xl; }
:deep(.p-scrollpanel-bar) { @apply bg-azulIENM/40 hover:bg-azulIENM transition-colors; }
:deep(.p-scrollpanel-content) { @apply pr-2; }
</style>
