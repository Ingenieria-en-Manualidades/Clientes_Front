<template>
  <div class="w-[100%] md:w-[850px]">
    <title>Remisiones pendientes</title>
    <TabPanelRemisiones />
    <div class="mt-3" v-if="remisiones.length !== 0">
      <div v-if="calendario" class="ml-[2.5%]">
        <Calendar
          v-model="dates"
          selectionMode="range"
          :manualInput="false"
          dateFormat="yy/mm/dd"
          class="mb-3 absolute"
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
      <TablaRemisiones
        :remisiones="remisiones"
        :modales="'Pendientes'"
        @listar="listar"
      />
    </div>
    <!-- Carga de progeso mientras terminan de llegar las remisiones -->
    <div class="p-5 text-center" v-else-if="isLoading">
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="transparent"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />
    </div>
    <!-- Información que sale en caso de no aparecer ninguna información -->
    <div class="p-10 text-center" v-else-if="estadoRemisiones">
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

<script setup lang="ts">
import { ref } from "vue";
import Calendar from "primevue/calendar";
import { useToast } from "primevue/usetoast";
import { useCookie } from "nuxt/app";
import type { Remision } from "../../interfaces/remisiones";
import TablaRemisiones from "../../components/remisiones/TablaRemisiones.vue";
import { useRemisionesApi } from "../../composables/remisiones/remisionesApi";
import { useDatosRemisiones } from "../../composables/remisiones/datosRemisiones";
import TabPanelRemisiones from "../../components/remisiones/TabPanelRemisiones.vue";

const dates = ref();
let avisoIcono = ref();
const toast = useToast();
let avisodetalles = ref();
const isLoading = ref(false);
const calendario = ref(true);
const botonRecargar = ref(false);
const estadoRemisiones = ref(false);
let remisiones = ref<Remision[]>([]);
const { setConsultar } = useDatosRemisiones();
const { listarRemisionesPorId } = useRemisionesApi();

const listar = async () => {
  isLoading.value = true;
  const idCliente = useCookie("idCliente");

  const resultado = await listarRemisionesPorId(idCliente.value);

  if (resultado.success) {
    remisiones.value = resultado.remisiones.filter(
      (rem) => rem.estado === null
    );

    if (remisiones.value.length === 0) {
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
    remisiones.value = await setConsultar(remisiones.value, dates.value);

    if (remisiones.value.length === 0) {
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

<style>
@import url("/assets/css/estilosTablaRemisiones.css");
</style>
