<template>
  <div class="w-full flex justify-center p-2 gap-1 sm:gap-3 md:p-5">
    <title>Calidad</title>
    <FormChecklist @listar="listar" />
    <FormCalidad @listar="listar" />
    <div class="ml-[3%] mt-[1%]" v-if="dataArchivos.length !== 0">
      <Tabla
        :titulo="'EVIDENCIAS'"
        :cabezas="colsCalidad"
        :arrayData="dataArchivos"
        :atributosDatos="atributosCalidad"
        :pag="true"
      >
        <template #nuevaColumna>
          <th colspan="2" class="bg-azulIENM text-white py-3 px-5">ACCIONES</th>
        </template>
        <template #botones="{ data }">
          <td>
            <button
              type="button"
              @click="descargarPDF(data.url, data.nombre)"
              class="bg-[#c86a2b] rounded py-1 px-2 my-1 text-white"
            >
              Descargar
            </button>
          </td>
          <td>
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
    <div class="p-5 rounded-t-lg text-center" v-else-if="isLoading">
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="transparent"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />
    </div>
    <div
      class="p-10 pt-24 rounded-lg text-center border-[1px] border-gray-300"
      v-else-if="estadoArchivos"
    >
      <i :class="avisoIcono"></i>
      <p class="font-manrope-b text-xl mt-3">
        {{ avisodetalles }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import Tabla from "~/components/dinamicos/Tabla.vue";
import FormCalidad from "../../components/objetivos/FormCalidad.vue";
import FormChecklist from "../../components/objetivos/FormChecklist.vue";
import { useObjetivosApi } from "../../composables/objetivos/useObjetivosApi";
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";
import type { DataArchivos } from "../../interfaces/objetives";

let avisoIcono = ref();
const toast = useToast();
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

definePageMeta({
  layout: "default",
  middleware: "auth",
});
</script>
