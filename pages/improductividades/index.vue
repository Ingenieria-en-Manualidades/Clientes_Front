<template>
  <title>Improductividades</title>
  <div class="w-[100%] md:w-[850px]">
    <TabPanelRemisiones :items="items" />
    <div v-if="data?.length !== 0">
      <div v-if="calendario" class="ml-[2.5%]">
        <!-- <Calendar
          v-model="dates"
          selectionMode="range"
          :manualInput="false"
          dateFormat="yy/mm/dd"
          class="mb-3 z-0"
          placeholder="Escoge una o dos fechas"
          showIcon
          fluid
          iconDisplay="input"
        />
        <button
          @click="consultarRemisiones"
          class="bg-azulClaroIENM ml-2 p-[11px] rounded"
        >
          <i class="pi pi-search text-white"></i>
        </button> -->
      </div>
      <button
        type="button"
        class="bg-azulClaroIENM px-3 py-1 rounded mb-2 ml-[2.5%]"
        @click="recargarTabla"
        v-else
      >
        <i class="pi pi-refresh text-white"
          ><span class="ml-2 font-manrope-r">Recargar tabla</span></i
        >
      </button>
      <Tabla :cabezas="cols" :arrayData="data">
        <template #nuevaColumna>
          <th class="bg-azulIENM text-white py-4 px-5">ACCIONES</th>
        </template>
        <template #botones>
          <td>
            <button
              type="button"
              class="border-[1px] border-green-400 py-1 px-4 rounded-lg bg-green-400"
            >
              Gestionar
            </button>
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
    <div class="p-10 rounded-t-lg text-center" v-else-if="estadoRemisiones">
      <i :class="avisoIcono"></i>
      <p class="font-manrope-b text-xl mt-3">
        {{ avisodetalles }}
      </p>
      <button
        v-if="botonRecargar"
        class="bg-azulClaroIENM px-3 py-1 rounded mt-3 font-manrope-b text-white"
        @click="recargarTabla"
      >
        Recargar tabla
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import Tabla from "../../components/dinamicos/Tabla.vue";
import ProgressSpinner from "primevue/progressspinner";
import type { Improductividad } from "../../interfaces/improductividades";
import {
  items,
  cols,
  useDatosImproductividades,
} from "../../composables/improductividades/datosImproductividades";
import TabPanelRemisiones from "../../components/remisiones/TabPanelRemisiones.vue";
import { useImproductividadesAPI } from "../../composables/improductividades/improductividadesAPI";

const dates = ref();
let avisoIcono = ref();
const toast = useToast();
let avisodetalles = ref();
const isLoading = ref(false);
const calendario = ref(true);
const botonRecargar = ref(false);
const estadoRemisiones = ref(false);
const data = ref<Improductividad[]>([]);
const { listarImproductividades } = useImproductividadesAPI();
const { setConsultar } = useDatosImproductividades();

const listar = async () => {
  isLoading.value = true;
  const idCliente = useCookie("idCliente");

  const response = await listarImproductividades(idCliente.value);

  if (response.success) {
    data.value = response.data?.filter((rem) => rem.estado === null);
    console.log("data filter: ", data.value);
  } else {
    toast.add({
      severity: "error",
      summary: "Error al listar improductividades.",
      detail: response.error,
      life: 3000,
    });
  }
  isLoading.value = false;
};

const consultarRemisiones = async () => {
  if (!dates.value) {
    toast.add({
      severity: "error",
      summary: "Fecha no asignada",
      detail: "Por favor elige una fecha o dos con el calendario.",
      life: 3000,
    });
  } else {
    data.value = await setConsultar(data.value, dates.value);
    if (data.value.length === 0) {
      estadoRemisiones.value = true;
      avisoIcono.value = "pi pi-exclamation-triangle text-5xl";
      avisodetalles.value = "No se encontro ninguna remisión entre esas fechas";
      botonRecargar.value = true;
    }
    calendario.value = false;
  }
};

const recargarTabla = () => {
  listar();
  calendario.value = true;
  dates.value = null;
};

listar();
</script>
