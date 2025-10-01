<template>
  <div class="flex justify-center font-manrope-r">
    <div class="w-3/4 sm:w-2/4 rounded border border-black py-1 my-2 shadow-xl max-h-[97vh]">
      <ScrollPanel :style="{ height: '100%' }">
        <div class="text-center mb-2">
          <label for="">LOGITO</label>
        </div>
        <div>
          <p class="text-left p-2 font-bold bg-gray-300">Tratamiento de datos</p>
          
          <div v-if="dataProcessing">
            <p class="text-left p-2 font-bold bg-gray-300">Información basica</p>
            <div class="mx-10">
              <div class="my-3">
                <DinamicosInputText
                  v-model="survey.fullname"
                  :label="'2. Ingrese su nombre completo'"
                  :displayFlex="false"
                  :warning="errors.name"
                />
              </div>
              <div class="my-3">
                <DinamicosDropDownList
                  :label="'3. Ingrese su cargo'"
                  :displayFlex="false"
                  :options="charges"
                  v-model="survey.charge_id"
                  :warning="errors.charges"
                />
              </div>
              <div class="my-3">
                <DinamicosDropDownList
                  :label="'4. Ingrese el nombre de su empresa, CEDI y su ciudad'"
                  :displayFlex="false"
                  :options="clients"
                  v-model="survey.clients_id"
                  :warning="errors.company"
                />
              </div>
              <div class="my-3">
                <DinamicosInputNumber
                  v-model="answers.cellphone"
                  :label="'5. Ingrese su número de contacto'"
                  :displayFlex="false"
                  :warning="errors.cellphone"
                />
              </div>
              <div class="my-3">
                <DinamicosInputText
                  v-model="answers.email"
                  :label="'6. Ingrese su correo electrónico'"
                  :displayFlex="false"
                  :warning="errors.email"
                />
              </div>
            </div>
            <p class="text-left p-2 font-bold bg-gray-300">Satisfacción</p>
            <div class="mx-10">
              <div class="my-3">
                <p class="text-2xl font-manrope-b">Instrucciones</p>
                <span class="text-sm">Califica los enunciados según los siguientes criterios:</span>
                <br>
                <span class="text-sm">Esta escala de calificación consta de números desde el 1 al 3, en donde cada número significa lo siguiente:</span>
                <ol>
                  <li class="text-sm"><span class="font-manrope-b">3</span> = Satisfecho/a</li>
                  <li class="text-sm"><span class="font-manrope-b">2</span> = Medianamente Satisfecho/a</li>
                  <li class="text-sm"><span class="font-manrope-b">1</span> = Insatisfecho/a</li>
                </ol>
              </div>
              <div class="my-3">
                <DinamicosInputRadio
                  v-model="answers.radioOne"
                  :label="'7. ¿Qué tan satisfecho/a está con el cumplimiento del servicio  prestado en cuenta a: programa de producción o plan de armado,  cargues y descargues de productos, envíos o despachos de mercancías? '"
                  :displayFlex="true"
                  :options="optionsSatisfaction"
                  :info="'(según aplique en su sector).'"
                  :warning="errors.radioOne"
                />
              </div>
              <div class="my-3">
                <DinamicosInputTextArea
                  v-model="answers.observationsRadioOne"
                  :label="'8. Observación'"
                  :displayFlex="false"
                  :warning="errors.observationsRadioOne"
                />
              </div>
              <div class="my-3">
                <DinamicosInputRadio
                  v-model="answers.radioTwo"
                  :label="'9. ¿Qué tan satisfecho/a se encuentra usted con  el  acompañamiento y gestión de solicitudes o sugerencias al servicio prestado?'"
                  :displayFlex="true"
                  :options="optionsSatisfaction"
                  :warning="errors.radioTwo"
                />
              </div>
              <div class="my-3">
                <DinamicosInputTextArea
                  v-model="answers.observationsRadioTwo"
                  :label="'10. Observación'"
                  :displayFlex="false"
                  :warning="errors.observationsRadioTwo"
                />
              </div>
              <div class="my-3">
                <DinamicosInputRadio
                  v-model="answers.radioThree"
                  :label="'11. ¿Qué tan satisfecho/a está con el cumplimiento del requerimiento de personal en cuanto a: tiempo de respuesta de solicitudes  e  idoneidad  del mismo?'"
                  :displayFlex="true"
                  :options="optionsSatisfaction"
                  :warning="errors.radioThree"
                />
              </div>
              <div class="my-3">
                <DinamicosInputTextArea
                  v-model="answers.observationsRadioThree"
                  :label="'12. Observación'"
                  :displayFlex="false"
                  :warning="errors.observationsRadioThree"
                />
              </div>
              <div class="my-3">
                <DinamicosInputRadio
                  v-model="answers.radioFour"
                  :label="'13. ¿ Qué tan satisfecho/a está en la respuesta oportuna a reclamos y novedades internas presentadas en el servicio?'"
                  :displayFlex="true"
                  :options="optionsSatisfaction"
                  :warning="errors.radioFour"
                />
              </div>
              <div class="my-3">
                <DinamicosInputTextArea
                  v-model="answers.observationsRadioFour"
                  :label="'14. Observación'"
                  :displayFlex="false"
                  :warning="errors.observationsRadioFour"
                />
              </div>
            </div>
            <p class="text-left p-2 font-bold bg-gray-300">Necesidades</p>
            <div class="mx-10">
              <div class="my-3">
                <p class="text-2xl font-manrope-b">¡Gracias por tu participación!</p>
                <span class="text-sm">Ahora, nos gustaría conocer más sobre tus necesidades y expectativas. Tu feedback nos ayudará a seguir mejorando y ofrecerte lo que realmente buscas.¡Por favor, continúa con la encuesta!</span>
              </div>
              <div class="my-3">
                <DinamicosInputRadio
                  v-model="answers.radioFive"
                  :label="'15. ¿Usted tendría en cuenta a IM Ingeniería SAS, como su aliado estratégico en sus planes de expansión y crecimiento dentro de la compañía?'"
                  :displayFlex="false"
                  :options="optionsNeeds"
                  :warning="errors.radioFive"
                />
              </div>
              <div class="my-3">
                <DinamicosInputTextArea
                  v-model="answers.observationsRadioFive"
                  :label="'16. ¿Por qué?'"
                  :displayFlex="false"
                  :warning="errors.observationsRadioFive"
                />
              </div>
              <div class="my-3">
                <DinamicosInputText
                  v-model="answers.questionSeventeen"
                  :label="'17. De acuerdo a los resultados mensuales de la operación, ¿ Qué tipo de información esta interesado en recibir?'"
                  :displayFlex="false"
                  :warning="errors.questionSeventeen"
                />
              </div>
              <div class="my-3">
                <DinamicosInputText
                  v-model="answers.questionEighteen"
                  :label="'18. Describa las necesidades y expectativas del servicio.'"
                  :displayFlex="false"
                  :warning="errors.questionEighteen"
                />
              </div>
              <button type="button" class="w-full bg-verdeOscIENM font-manrope-b rounded-md text-white py-2 px-3">ENVIAR</button>
            </div>
            <p class="text-3xl text-center my-3">¡Gracias por tu tiempo y valiosa opinión!</p>
          </div>
        </div>
      </ScrollPanel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { Survey, AnswerSurvey } from "../interfaces/survey";
import { useToast } from "primevue/usetoast";
import { useSurveyApis } from "../composables/survey/surveyApis";
import type { OptionDropdown } from "../interfaces/componentesDinamicos";
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";

const charges = ref();
const clients = ref();
const dataProcessing = ref(true);
const optionsSatisfaction = ref<OptionDropdown[]>([
  { label: "1", value: "Insatisfecho" },
  { label: "2", value: "Medianamente Satisfecho" },
  { label: "3", value: "Satisfecho" },
]);
const optionsNeeds = ref<OptionDropdown[]>([
  { label: "Si", value: "true" },
  { label: "No", value: "false" }
]);

const survey = ref<Survey>({
  start_time: new Date(),
  end_time: new Date(),
  fullname: null,
  charge_id: null,
  clients_id: null,
  username: "JAVELASCO",
});

const answers = ref<AnswerSurvey[]>([
  {
    question_id: 1,
    type: "input_radio_answer",
    answer: null,
    observation: null,
    description_option: null
  },
  {
    question_id: 2,
    type: "input_radio_answer",
    answer: null,
    observation: null,
    description_option: null
  },
  {
    question_id: 3,
    type: "input_radio_answer",
    answer: null,
    observation: null,
    description_option: null
  },
  {
    question_id: 4,
    type: "input_radio_answer",
    answer: null,
    observation: null,
    description_option: null
  },
  {
    question_id: 5,
    type: "boolean_answer",
    answer: null,
    observation: null,
    description_option: null
  },
  {
    question_id: 6,
    type: "simple_answer",
    answer: null,
    observation: null,
    description_option: null
  },
  {
    question_id: 7,
    type: "simple_answer",
    answer: null,
    observation: null,
    description_option: null
  }
]);

const errors = ref({
  name: "",
  charges: "",
  company: "",
  cellphone: "",
  email: "",
  radioOne: "",
  observationsRadioOne: "",
  radioTwo: "",
  observationsRadioTwo: "",
  radioThree: "",
  observationsRadioThree: "",
  radioFour: "",
  observationsRadioFour: "",
  radioFive: "",
  observationsRadioFive: "",
  questionSeventeen: "",
  questionEighteen: "",
});

const toast = useToast();
const { getListCharges, getListClients } = useSurveyApis();

const loadLists = async () => {
  const responseCharges = await getListCharges();
  const responseClients = await getListClients();
  if (responseCharges.success) {
    charges.value = responseCharges.data;
    if (responseClients.success) {
      clients.value = responseClients.data;
    } else {
      toast.add({ severity: "error", summary: responseClients.title, detail: responseClients.message, life: 5000,});
    }
  } else {
    toast.add({ severity: "error", summary: responseCharges.title, detail: responseCharges.message, life: 5000,});
  }
};
loadLists();

definePageMeta({
  layout: false,
   requiresAuth: true
});
</script>