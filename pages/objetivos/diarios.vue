<template>
  <div id="pageDiarios" class="w-full p-2 md:p-5">
    <title>Producción diaria</title>
    <RemisionesTabPanelRemisiones :items="itemsCumplimientoDiario" />
    <section class="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <div class="border-b border-slate-100 bg-gradient-to-r from-[#eef7ff] via-white to-[#f8fafc] px-5 py-5 md:px-8">
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-azulClaroIENM">
          Tablero SAE
        </p>
        <h2 class="mt-1 text-2xl font-bold text-slate-900">
          Cumplimiento diario
        </h2>
        <p class="mt-1 max-w-2xl text-sm text-slate-500">
          Registra la producción diaria y los indicadores operativos que alimentan el seguimiento del día.
        </p>
      </div>
      <div class="grid w-full gap-4 p-4 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] md:p-5 xl:p-6">
        <FormProduccion />
        <FormIndicadores />
      </div>
    </section>
      <!-- <fieldset class="border-[1px] border-black rounded p-2 ">
        <legend class="">Meses Anteriores</legend>
        <Calendar
          v-model="dates"
          selectionMode="range"
          :manualInput="false"
          view="month"
          dateFormat="yy/mm"
          placeholder="Elegir mes o meses"
          showIcon
          fluid
          iconDisplay="input"
        />
        <button
          @click="show"
          class="bg-azulClaroIENM ml-2 p-[11px] rounded mb-2"
        >
          <i class="pi pi-search text-white"></i>
        </button>
        <Tabla
          :cabezas="cabezasInd"
          :arrayData="dataInd"
          :atributosDatos="atribInd"
          :pag="false"
        />
      </fieldset> -->
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { ref, onMounted, watch } from "vue";
import { useToast } from "primevue/usetoast";
import Tabla from "../../components/dinamicos/Tabla.vue";
import { useDriver } from "../../composables/objetivos/driver";
import FormProduccion from "../../components/objetivos/FormProduccion.vue";
import FormIndicadores from "../../components/objetivos/FormIndicadores.vue";
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";
import {
  datosTablaProd,
  datosObjetivos,
  itemsCumplimientoDiario,
} from "../../composables/objetivos/datosObjetivos";

const dates = ref();
const toast = useToast();
const route = useRoute();
const { meses } = datosObjetivos();
const { cabezasProd, atribProd, dataProd } = datosTablaProd();

const visible = ref(false);

let cabezasInd = ref<String[]>(["Indicador", "Abril", "Junio"]);

const atribInd = ["indicador", "mesUno", "mesDos"];

const dataInd = [
  {
    indicador: "Cumplimiento Productivo",
    mesUno: "90%",
    mesDos: "90%",
  },
  {
    indicador: "Cumplimiento Plan Armado",
    mesUno: "90%",
    mesDos: "90%",
  },
  {
    indicador: "Calidad",
    mesUno: "90%",
    mesDos: "90%",
  },
  {
    indicador: "Desperfecto M.E",
    mesUno: "90%",
    mesDos: "90%",
  },
  {
    indicador: "Desperfecto P.P",
    mesUno: "90%",
    mesDos: "90%",
  },
];

const show = () => {
  if (dates.value) {
    cabezasInd.value.splice(0, cabezasInd.value.length, "Indicador");
    cabezasInd.value = cabezasInd.value.concat(getMeses(dates.value));
  } else {
    toast.add({
      severity: "error",
      summary: "Falta llenar el campo.",
      detail: "Por favor elegir un mes o dos.",
      life: 3000,
    });
  }
};

const getMeses = (fechas: Date[]): String[] => {
  const arrayMeses: String[] = [];
  if (!fechas[1]) {
    arrayMeses.push(meses[fechas[0].getMonth()]);
  } else {
    for (let i = fechas[0].getMonth(); i <= fechas[1].getMonth(); i++) {
      arrayMeses.push(meses[i]);
    }
  }
  return arrayMeses;
};

// Run step-by-step tour if URL hash matches
const runStepByStep = async () => {
  if (process.server) return;
  const h = route.hash || ''; // Default to empty string
  if (!/^#stepByStep(?:$|[=/?&])/i.test(h)) return; // Only proceed if hash matches

  // Get and run the driver for diarios page
  const { getDriverDiarios } = await useDriver();
  const stepByStep = await getDriverDiarios();
  if (stepByStep) stepByStep.drive();
};
onMounted(runStepByStep);

watch(() => route.hash,() => {runStepByStep();}); // Watch for changes in the route hash

definePageMeta({
  layout: "default",
  middleware: "auth",
  requiresAuth: true,
});
</script>
