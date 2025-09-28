<template>
<div class="relative h-full rounded-3xl flex flex-col lg:flex-row">
    <!-- Columna izquierda: 20% -->
    <aside
      class="w-full lg:w-[20%] flex flex-col items-center justify-center p-4"
    >
      <header class="text-center w-full">
        <img
          src="/assets/img/IM INGENIERIA CENTRADO-slogan.png"
          alt="IM Ingeniería"
          class="w-full h-auto mx-auto  mb-4 max-w-[120px] sm:max-w-[160px] md:max-w-[220px]"
        />
        <img
          src="/assets/img/LOGOS-IM.png"
          alt="Certificaciones"
          class="w-full h-auto mx-auto  mb-4 max-w-[120px] sm:max-w-[160px] md:max-w-[220px]"
        />
      </header>
    </aside>

    <section
      class="w-full h-full rounded-r-3xl overflow-auto lg:w-[80%] flex flex-col items-center bg-gradient-to-br from-azulIENM/10 via-white to-azulClaroIENM/20"
    >
      <h1
        class="mx-auto mt-4 p-4 text-center inline-block text-azulIENM text-xl md:text-2xl font-manrope-b border-b-4 border-amarilloIENM"
      >
        Encuesta de Satisfacción
      </h1>

      <section class="mt-4 text-center">
        <h2
          class="mx-auto inline-block text-azulIENM text-lg md:text-xl font-manrope-b border-b-[3px] border-amarilloIENM pb-1"
        >
          Tratamiento de datos
        </h2>

        <div class="mt-4 space-y-3">
          <p class="font-manrope-b">
            1. Acepta nuestra Política de Tratamiento de datos personales.
          </p>
          <p class="text-slate-700">
            Consúlta en
            <a
              class="text-azulIENM underline hover:text-azulClaroIENM"
              href="https://ienmlogistica.ienm.com.co/"
              target="_blank"
              rel="noopener"
              >https://ienmlogistica.ienm.com.co/</a
            >
          </p>

          <label
            class="mx-auto max-w-3xl flex items-start gap-2 text-slate-800 select-none"
          >
            <input
              id="dataProcessing"
              type="checkbox"
              v-model="dataProcessing"
              class="mt-1 size-5 rounded-md border-slate-300 text-verdeIENM focus:ring-verdeIENM accent-verdeIENM"
            />
            <span>Acepto la política del tratamiento de mis datos.</span>
          </label>
        </div>
      </section>

      <section class="h-full">
        <section v-if="dataProcessing" class="mt-10 text-center">
          <h2
            class="mx-auto inline-block text-azulIENM text-lg md:text-xl font-manrope-b border-b-[3px] border-amarilloIENM pb-1"
          >
            Información básica
          </h2>

          <div class="mt-4 grid gap-4 max-w-3xl mx-auto text-left">
            <DinamicosInputText
              v-model="answers.name"
              :label="'2. Ingrese su nombre completo'"
              :displayFlex="false"
              :warning="errors.name"
            />

            <DinamicosDropDownList
              :label="'3. Ingrese su cargo'"
              :displayFlex="false"
              :options="options"
              v-model="answers.charges"
              :warning="errors.charges"
            />

            <DinamicosDropDownList
              :label="'4. Ingrese el nombre de su empresa, CEDI y su ciudad'"
              :displayFlex="false"
              :options="options"
              v-model="answers.company"
              :warning="errors.company"
            />

            <DinamicosInputNumber
              v-model="answers.cellphone"
              :label="'5. Ingrese su número de contacto'"
              :displayFlex="false"
              :warning="errors.cellphone"
            />

            <DinamicosInputText
              v-model="answers.email"
              :label="'6. Ingrese su correo electrónico'"
              :displayFlex="false"
              :warning="errors.email"
            />
          </div>
        </section>

        <!-- Satisfacción -->
        <section v-if="dataProcessing" class="mt-10 text-center">
          <h2
            class="mx-auto inline-block text-azulIENM text-lg md:text-xl font-manrope-b border-b-[3px] border-amarilloIENM pb-1"
          >
            Satisfacción
          </h2>

          <!-- Instrucciones -->
          <div
            class="mt-4 max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-left"
          >
            <p class="text-lg font-manrope-b">Instrucciones</p>
            <p class="text-sm text-slate-700">
              Califica los enunciados según los siguientes criterios:
            </p>
            <ul class="mt-2 flex flex-wrap gap-3 text-sm">
              <li class="chip">3 = Satisfecho/a</li>
              <li class="chip">2 = Medianamente Satisfecho/a</li>
              <li class="chip">1 = Insatisfecho/a</li>
            </ul>
          </div>

          <div class="mt-4 space-y-4 max-w-3xl mx-auto text-left">
            <DinamicosInputRadio
              v-model="answers.radioOne"
              :label="'7. ¿Qué tan satisfecho/a está con el cumplimiento del servicio prestado en cuenta a: programa de producción o plan de armado, cargues y descargues de productos, envíos o despachos de mercancías?'"
              :displayFlex="true"
              :options="optionsSatisfaction"
              :info="'(según aplique en su sector).'"
              :warning="errors.radioOne"
            />

            <DinamicosInputTextArea
              v-model="answers.observationsRadioOne"
              :label="'8. Observación'"
              :displayFlex="false"
              :warning="errors.observationsRadioOne"
            />

            <DinamicosInputRadio
              v-model="answers.radioTwo"
              :label="'9. ¿Qué tan satisfecho/a se encuentra usted con el acompañamiento y gestión de solicitudes o sugerencias al servicio prestado?'"
              :displayFlex="true"
              :options="optionsSatisfaction"
              :warning="errors.radioTwo"
            />

            <DinamicosInputTextArea
              v-model="answers.observationsRadioTwo"
              :label="'10. Observación'"
              :displayFlex="false"
              :warning="errors.observationsRadioTwo"
            />

            <DinamicosInputRadio
              v-model="answers.radioThree"
              :label="'11. ¿Qué tan satisfecho/a está con el cumplimiento del requerimiento de personal en cuanto a: tiempo de respuesta de solicitudes e idoneidad del mismo?'"
              :displayFlex="true"
              :options="optionsSatisfaction"
              :warning="errors.radioThree"
            />

            <DinamicosInputTextArea
              v-model="answers.observationsRadioThree"
              :label="'12. Observación'"
              :displayFlex="false"
              :warning="errors.observationsRadioThree"
            />

            <DinamicosInputRadio
              v-model="answers.radioFour"
              :label="'13. ¿Qué tan satisfecho/a está en la respuesta oportuna a reclamos y novedades internas presentadas en el servicio?'"
              :displayFlex="true"
              :options="optionsSatisfaction"
              :warning="errors.radioFour"
            />

            <DinamicosInputTextArea
              v-model="answers.observationsRadioFour"
              :label="'14. Observación'"
              :displayFlex="false"
              :warning="errors.observationsRadioFour"
            />
          </div>
        </section>

        <!-- Necesidades -->
        <section v-if="dataProcessing" class="mt-10 text-center">
          <h2
            class="mx-auto inline-block text-azulIENM text-lg md:text-xl font-manrope-b border-b-[3px] border-amarilloIENM pb-1"
          >
            Necesidades
          </h2>

          <div
            class="mt-4 max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 text-left"
          >
            <p class="text-lg font-manrope-b">¡Gracias por tu participación!</p>
            <p class="text-sm text-slate-700">
              Tu feedback nos ayuda a mejorar. Por favor, continúa con la
              encuesta.
            </p>
          </div>

          <div class="mt-4 space-y-4 max-w-3xl mx-auto text-left">
            <DinamicosInputRadio
              v-model="answers.radioFive"
              :label="'15. ¿Usted tendría en cuenta a IM Ingeniería SAS, como su aliado estratégico en sus planes de expansión y crecimiento dentro de la compañía?'"
              :displayFlex="false"
              :options="optionsNeeds"
              :warning="errors.radioFive"
            />

            <DinamicosInputTextArea
              v-model="answers.observationsRadioFive"
              :label="'16. ¿Por qué?'"
              :displayFlex="false"
              :warning="errors.observationsRadioFive"
            />

            <DinamicosInputText
              v-model="answers.questionSeventeen"
              :label="'17. De acuerdo a los resultados mensuales de la operación, ¿Qué tipo de información está interesado en recibir?'"
              :displayFlex="false"
              :warning="errors.questionSeventeen"
            />

            <DinamicosInputText
              v-model="answers.questionEighteen"
              :label="'18. Describa las necesidades y expectativas del servicio.'"
              :displayFlex="false"
              :warning="errors.questionEighteen"
            />
          </div>

          <!-- CTA -->
          <div class="mt-6 max-w-3xl mx-auto">
            <button
              type="button"
              class="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-verdeIENM to-verdeOscIENM text-white font-manrope-b py-3 shadow-lg hover:opacity-95 active:scale-[0.99] transition"
            >
              ENVIAR
            </button>
          </div>

          <p class="mt-6 text-2xl text-azulIENM/90 font-manrope-b">
            ¡Gracias por tu tiempo y valiosa opinión!
          </p>
        </section>
      </section>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { OptionDropdown } from "../../interfaces/componentesDinamicos";

const options = ref<OptionDropdown[] | undefined>(undefined);
const dataProcessing = ref(true);

const optionsSatisfaction = ref<OptionDropdown[]>([
  { label: "1", value: "Insatisfecho" },
  { label: "2", value: "Medianamente Satisfecho" },
  { label: "3", value: "Satisfecho" },
]);

const optionsNeeds = ref<OptionDropdown[]>([
  { label: "Sí", value: "true" },
  { label: "No", value: "false" },
]);

const answers = ref({
  name: "",
  charges: null as any,
  company: null as any,
  cellphone: "",
  email: "",
  radioOne: null as any,
  observationsRadioOne: "",
  radioTwo: null as any,
  observationsRadioTwo: "",
  radioThree: null as any,
  observationsRadioThree: "",
  radioFour: null as any,
  observationsRadioFour: "",
  radioFive: null as any,
  observationsRadioFive: "",
  questionSeventeen: "",
  questionEighteen: "",
});

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
</script>

<style scoped>
/* chips de la leyenda */
.chip {
  @apply rounded-full bg-azulIENM/10 px-3 py-1 text-azulIENM border border-azulIENM/20;
}

/* barra del ScrollPanel */
:deep(.p-scrollpanel) {
  @apply rounded-2xl;
}
:deep(.p-scrollpanel-bar) {
  @apply bg-azulIENM/40 hover:bg-azulIENM transition-colors;
}
:deep(.p-scrollpanel-content) {
  @apply pr-2;
}
</style>
