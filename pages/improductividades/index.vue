<template>
  <div class="w-full md:w-[95%]">
    <title>Improductividades</title>
    <TabPanelRemisiones :items="items" />
    <div v-if="data?.length !== 0">
      <div>
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
          @click="consultarImproductividades"
          class="bg-azulClaroIENM ml-2 p-[11px] rounded"
        >
          <i class="pi pi-search text-white"></i>
        </button>
      </div>
      <button
        type="button"
        v-if="recargar"
        class="bg-azulClaroIENM px-3 py-1 rounded mb-2"
        @click="recargarTabla"
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
            <th class="bg-azulIENM text-white">
              <div class="flex gap-2">
                <p>LINEA</p>
                <ListaFiltro
                  :opciones="lineas"
                  v-model="turnosElegidos"
                  @metodo="getFiltrarTurno"
                />
              </div>
            </th>
            <th class="bg-azulIENM text-white py-3 px-5">ACCIONES</th>
          </template>
          <template #botones="{ data }">
            <td>{{ data.dispositivo }}</td>
            <td>
              <ModalGestionar
                :idImproductividad="data.improductividad_id"
                :actividad="data.actividad"
                :descripcion="data.descripcion"
                @postGuardar="listar"
              />
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
    <div
      class="p-10 rounded-t-lg text-center"
      v-else-if="estadoImproductividades"
    >
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
import ListaFiltro from "~/components/dinamicos/ListaFiltro.vue";
import type { Improductividad } from "../../interfaces/improductividades";
import ModalGestionar from "../../components/improductividades/ModalGestionar.vue";
import TabPanelRemisiones from "../../components/remisiones/TabPanelRemisiones.vue";
import { useImproductividadesAPI } from "../../composables/improductividades/improductividadesAPI";
import {
  items,
  cols,
  useDatosImproductividades,
  atributos,
  lineas,
} from "../../composables/improductividades/datosImproductividades";

const dates = ref();
let avisoIcono = ref();
const toast = useToast();
let avisodetalles = ref();
const recargar = ref(true);
const idCliente = useCookie("idCliente");
const turnosElegidos = ref<String[]>([]);
const isLoading = ref(false);
const botonRecargar = ref(false);
const estadoImproductividades = ref(false);
const data = ref<Improductividad[] | undefined>([]);
const { setConsultar, filtrarPorTurno } = useDatosImproductividades();
const { listarImproductividades } = useImproductividadesAPI();

const alerta = () => {
  alert("Géneros: " + turnosElegidos.value);
};

const listar = async () => {
  isLoading.value = true;

  const response = await listarImproductividades(idCliente.value);

  if (response.success && response.data) {
    data.value = response.data.filter((rem) => rem.estado === null);

    if (data.value.length === 0) {
      estadoImproductividades.value = true;
      avisoIcono.value = "pi pi-check-circle text-5xl";
      avisodetalles.value = "Sin improductividades pendientes";
    }
  } else {
    estadoImproductividades.value = true;
    avisoIcono.value = "pi pi-times-circle text-5xl";
    avisodetalles.value = "Fallo a la hora de cargar";
  }
  isLoading.value = false;
};

const consultarImproductividades = async () => {
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
      estadoImproductividades.value = true;
      avisoIcono.value = "pi pi-exclamation-triangle text-5xl";
      avisodetalles.value =
        "No se encontro ninguna improductividad entre esas fechas";
      botonRecargar.value = true;
    }
    recargar.value = true;
  }
};

const getFiltrarTurno = async () => {
  const response = await listarImproductividades(idCliente.value);

  if (response.success && response.data) {
    data.value = response.data.filter((rem) => rem.estado === null);
  }

  if (turnosElegidos.value?.length === 0) {
    listar();
  } else {
    data.value = await filtrarPorTurno(turnosElegidos.value, data.value);
  }
};

const recargarTabla = () => {
  listar();
  recargar.value = false;
  dates.value = null;
};

listar();
</script>
