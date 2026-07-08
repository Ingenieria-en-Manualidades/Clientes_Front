<template>
  <div id="moduleCalidad" class="w-full p-2 md:p-5">
    <title>Calidad</title>
    <RemisionesTabPanelRemisiones :items="itemsCumplimientoMensual" />
    <div class="mx-auto mt-4 flex w-full max-w-7xl flex-col gap-5">
      <section id="monthlyComplianceForms" class="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <div class="flex flex-col gap-3 border-b border-slate-100 bg-gradient-to-r from-[#eef7ff] via-white to-[#f8fafc] px-5 py-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-azulClaroIENM">
              Tablero SAE
            </p>
            <h2 class="mt-1 text-2xl font-bold text-slate-900">
              Cumplimiento mensual
            </h2>
          </div>
          <p class="max-w-2xl text-sm text-slate-500 md:text-right">
            Carga checklist e inspección en una sola línea de trabajo, con evidencia PDF y acciones claras.
          </p>
        </div>
        <div class="grid min-w-0 gap-4 p-4 lg:grid-cols-2 lg:items-stretch md:p-5">
          <FormChecklist @listar="listar" />
          <FormCalidad @listar="listar" />
        </div>
      </section>
      <section id="monthlyComplianceEvidence" class="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] md:p-5">
        <div class="mb-4 flex flex-col gap-2 border-b border-slate-100 pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-azulClaroIENM">
              Archivos cargados
            </p>
            <h3 class="text-xl font-bold text-slate-900">Evidencias</h3>
          </div>
          <p class="text-sm text-slate-500">
            Consulta, descarga o actualiza las evidencias mensuales registradas.
          </p>
        </div>
        <div class="w-full" v-if="dataArchivos.length !== 0">
          <Tabla
            :titulo="''"
            :cabezas="colsCalidad"
            :arrayData="dataArchivos"
            :atributosDatos="atributosCalidad"
            :pag="true"
            :nativeScroll="true"
          >
            <template #nuevaColumna>
              <th colspan="2" class="bg-azulIENM text-white py-3 px-5">
                ACCIONES
              </th>
            </template>
            <template #botones="{ data }">
              <td class="px-2 py-2">
                <button
                  type="button"
                  @click="descargarPDF(data.url, data.nombre)"
                  class="inline-flex min-h-10 min-w-28 items-center justify-center rounded-lg bg-[#c86a2b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b85f25]"
                >
                  <span>Exportar</span>
                </button>
              </td>
              <td class="px-2 py-2">
                <ObjetivosModalUpdateFile
                  :nameFile="data.nombre"
                  :idFile="data.id"
                  :tipoFormulario="data.tipo_calidad"
                  :yearFile="data.meta"
                  :url="data.url"
                  :tableroSaeID="data.tablero_sae_id"
                  @listar="listar"
                />
              </td>
            </template>
          </Tabla>
        </div>
        <div class="p-5 text-center" v-else-if="isLoading">
          <ProgressSpinner
            style="width: 50px; height: 50px"
            strokeWidth="8"
            fill="transparent"
            animationDuration=".5s"
            aria-label="Custom ProgressSpinner"
          />
        </div>
        <div
          class="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600"
          v-else-if="estadoArchivos"
        >
          <i :class="avisoIcono"></i>
          <p class=" text-xl mt-3">
            {{ avisodetalles }}
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCookie } from "nuxt/app";
import { useRoute } from "vue-router";
import { ref, onMounted, watch } from "vue";
import { useToast } from "primevue/usetoast";
import Tabla from "~/components/dinamicos/Tabla.vue";
import { useDriver } from "../../composables/objetivos/driver";
import FormCalidad from "../../components/objetivos/FormCalidad.vue";
import FormChecklist from "../../components/objetivos/FormChecklist.vue";
import { itemsCumplimientoMensual } from "../../composables/objetivos/datosObjetivos";
import { useObjetivosApi } from "../../composables/objetivos/useObjetivosApi";
import type { DataArchivos } from "../../interfaces/objetives";

let avisoIcono = ref();
const toast = useToast();
const route = useRoute();
let avisodetalles = ref();
const isLoading = ref(false);
const estadoArchivos = ref(false);

const dataArchivos = ref<DataArchivos[]>([]);
const dataArchivosInex = ref<DataArchivos[]>([]);
const clienteID = useCookie("idCliente");
const colsCalidad = ref(["nombre", "tipo", "meta"]);
const { listarFiles, descargarArchivo } = useObjetivosApi();
const atributosCalidad = ref(["nombre", "tipo_calidad", "meta"]);

const listar = async () => {
  isLoading.value = true;
  const resultado = await listarFiles(Number(clienteID.value));

  if (resultado.success) {
    dataArchivos.value = resultado.data.archivos;
    dataArchivosInex.value = resultado.data.archivosIne;

    // if (dataArchivosInex.value.length != 0) {
    //   for (const archivo of dataArchivosInex.value) {
    //     toast.add({
    //       severity: "info",
    //       summary: `Archivo de ${archivo.tipo_calidad} borrado.`,
    //       detail: `${archivo.nombre} de la meta ${archivo.meta}`,
    //     });
    //   }
    // }

    if (dataArchivos.value.length === 0) {
      estadoArchivos.value = true;
      avisoIcono.value = "pi pi-check-circle text-5xl";
      avisodetalles.value = "Sin archivos o calificaciones subidas.";
    }
  } else {
    estadoArchivos.value = true;
    avisoIcono.value = "pi pi-times-circle text-5xl";
    avisodetalles.value = resultado.error;
    console.error("Fallo a la hora de cargar: ", resultado.error);
  }
  isLoading.value = false;
};

const descargarPDF = async (urlArchivo: string, nombreArchivo: string) => {
  const resultado = await descargarArchivo(urlArchivo, nombreArchivo);

  if (!resultado.success) {
    toast.add({
      severity: "error",
      summary: "Error al descargar.",
      detail: "Por favor recargar navegador.",
    });
    console.error("Error al descargar: ", resultado.error);
  }
};

listar();

// Run step-by-step tour if URL hash matches
const runStepByStep = async () => {
  if (process.server) return;
  const h = route.hash || '';
  if (!/^#stepByStep(?:$|[=/?&])/i.test(h)) return;

  // Get and run the driver for monthly compliance
  const { getDriverMonthlyCompliance } = await useDriver();
  const stepByStep = await getDriverMonthlyCompliance(dataArchivos.value);
  if (stepByStep) stepByStep.drive();
};
runStepByStep();

watch(() => route.hash,async () => { await runStepByStep();}); // Watch for changes in the route hash

definePageMeta({
  layout: "default",
  middleware: "auth",
  requiresAuth: true,
});
</script>
