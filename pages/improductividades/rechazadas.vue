<template>
  <title>Improductividades</title>
  <div class="w-full md:w-[90%]">
    <TabPanelRemisiones :items="items" />
    <div v-if="data?.length !== 0" class="px-3">
      <div v-if="calendario">
        <Calendar
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
        </button>
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
      <div class="w-[100%] overflow-x-auto">
        <Tabla
          :cabezas="cols"
          :arrayData="data"
          :atributosDatos="atributos"
          :pag="true"
        >
          <template #nuevaColumna>
            <th class="bg-azulIENM text-white py-3 px-2">ACCIONES</th>
          </template>
          <template #botones="{ data }">
            <td>
              <ModalRechazo :motivo="data.motivo" />
            </td>
          </template>
        </Tabla>
      </div>
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
import ProgressSpinner from "primevue/progressspinner";
import Tabla from "../../components/dinamicos/Tabla.vue";
import type { Improductividad } from "../../interfaces/improductividades";
import ModalRechazo from "../../components/improductividades/ModalRechazo.vue";
import TabPanelRemisiones from "../../components/remisiones/TabPanelRemisiones.vue";
import { useImproductividadesAPI } from "../../composables/improductividades/improductividadesAPI";
import {
  items,
  cols,
  atributos,
  useDatosImproductividades,
} from "../../composables/improductividades/datosImproductividades";

const dates = ref();
let avisoIcono = ref();
const toast = useToast();
let avisodetalles = ref();
const isLoading = ref(false);
const calendario = ref(true);
const botonRecargar = ref(false);
const estadoRemisiones = ref(false);
const data = ref<Improductividad[]>([]);
const { setConsultar } = useDatosImproductividades();
const { listarImproductividades } = useImproductividadesAPI();

const listar = async () => {
  isLoading.value = true;
  const idCliente = useCookie("idCliente");

  const response = await listarImproductividades(idCliente.value);

  if (response.success) {
    data.value = response.data?.filter((rem) => rem.estado === "Rechazado");

    if (data.value.length === 0) {
      estadoRemisiones.value = true;
      avisoIcono.value = "pi pi-check-circle text-5xl";
      avisodetalles.value = "Sin remisiones pendientes";
    }
  } else {
    estadoRemisiones.value = true;
    avisoIcono.value = "pi pi-times-circle text-5xl";
    avisodetalles.value = "Fallo a la hora de cargar";
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
