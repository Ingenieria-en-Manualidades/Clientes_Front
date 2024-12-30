<template>
  <div class="w-full md:w-[97%]">
    <title>Improductividades</title>
    <TabPanelRemisiones :items="items" />
    <div v-if="data?.length !== 0">
      <Filtros
        ref="compFiltros"
        :lineas="lineas"
        :turnos="turnos"
        @consultarLineas="consultarLinea"
        @consultarTurnos="consultarTurno"
        @listar="listar"
      >
        <template #botonOP>
          <button
            class="bg-azulClaroIENM py-1 px-2 rounded-r"
            @click="consultarOP"
          >
            <i class="pi pi-search text-white"></i>
          </button>
        </template>
        <template #botonRef>
          <button
            class="bg-azulClaroIENM py-1 px-2 rounded-r"
            @click="consultarRef"
          >
            <i class="pi pi-search text-white"></i>
          </button>
        </template>
        <template #botonFecha>
          <button
            @click="consultarFechas"
            class="bg-azulClaroIENM py-1 px-2 rounded"
          >
            <i class="pi pi-search text-white"></i>
          </button>
        </template>
      </Filtros>
      <Tabla
        ref="compTabla"
        :cabezas="cols"
        :arrayData="data"
        :atributosDatos="atributos"
        :pag="true"
      >
        <template #nuevaColumna>
          <th class="bg-azulIENM text-white py-3 px-5">ACCIONES</th>
        </template>
        <template #botones="{ data }">
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
import ProgressSpinner from "primevue/progressspinner";
import Tabla from "../../components/dinamicos/Tabla.vue";
import type { Improductividad } from "../../interfaces/improductividades";
import ModalGestionar from "../../components/improductividades/ModalGestionar.vue";
import Filtros from "../../components/improductividades/Filtros.vue";
import TabPanelRemisiones from "../../components/remisiones/TabPanelRemisiones.vue";
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";
import { useImproductividadesAPI } from "../../composables/improductividades/improductividadesAPI";
import {
  items,
  cols,
  useDatosImproductividades,
  atributos,
} from "../../composables/improductividades/datosImproductividades";

const lineas = ref();
const turnos = ref();
let avisoIcono = ref();
let avisodetalles = ref();
const isLoading = ref(false);
const botonRecargar = ref(false);
const idCliente = useCookie("idCliente");
const estadoImproductividades = ref(false);
const data = ref<Improductividad[] | undefined>([]);
const { listarImproductividades } = useImproductividadesAPI();
const { getFiltros } = useDatosImproductividades();

// We save the component as a variable so we can manage it.
const compTabla = ref<InstanceType<typeof Tabla> | null>(null);
const compFiltros = ref<InstanceType<typeof Filtros> | null>(null);

const listar = async () => {
  isLoading.value = true;

  const response = await listarImproductividades(idCliente.value);

  if (response.success && response.data) {
    data.value = response.data.filter((rem) => rem.estado === null);
    console.log("NULOS: ", data.value);

    lineas.value = await getFiltros(data.value, "lineas");
    turnos.value = await getFiltros(data.value, "turnos");

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

const consultarOP = async () => {
  // We execute the method of listing the unproductives.
  const response = await listarImproductividades(idCliente.value);

  // We verify that the method has worked.
  if (response.success && response.data) {
    // We fill the table data again.
    data.value = response.data.filter((rem) => rem.estado === null);

    const resultado = await compFiltros.value?.getDataOP(data.value);
    data.value = resultado;

    // We check if the query returns results.
    if (data.value.length === 0) {
      // If we do not bring anything we activate the warnings.
      estadoImproductividades.value = true;
      avisoIcono.value = "pi pi-exclamation-triangle text-5xl";
      avisodetalles.value = "No se encontro ninguna improductividad";
      botonRecargar.value = true;
    } else {
      // If something is returned, we call the "Table" component method, which, if the pagination is greater than the total number of pages, places the current page as the last one.
      compTabla.value?.reestablecerPaginas();
    }
  }
};

const consultarRef = async () => {
  // We execute the method of listing the unproductives.
  const response = await listarImproductividades(idCliente.value);

  // We verify that the method has worked.
  if (response.success && response.data) {
    // We fill the table data again.
    data.value = response.data.filter((rem) => rem.estado === null);

    const resultado = await compFiltros.value?.getDataRef(data.value);
    data.value = resultado;

    // We check if the query returns results.
    if (data.value.length === 0) {
      // If we do not bring anything we activate the warnings.
      estadoImproductividades.value = true;
      avisoIcono.value = "pi pi-exclamation-triangle text-5xl";
      avisodetalles.value = "No se encontro ninguna improductividad";
      botonRecargar.value = true;
    } else {
      // If something is returned, we call the "Table" component method, which, if the pagination is greater than the total number of pages, places the current page as the last one.
      compTabla.value?.reestablecerPaginas();
    }
  }
};

const consultarFechas = async () => {
  // We execute the method of listing the unproductives.
  const response = await listarImproductividades(idCliente.value);

  // We verify that the method has worked.
  if (response.success && response.data) {
    // We fill the table data again.
    data.value = response.data.filter((rem) => rem.estado === null);

    const resultado = await compFiltros.value?.getDataFecha(data.value);
    data.value = resultado;

    // We check if the query returns results.
    if (data.value.length === 0) {
      // If we do not bring anything we activate the warnings.
      estadoImproductividades.value = true;
      avisoIcono.value = "pi pi-exclamation-triangle text-5xl";
      avisodetalles.value = "No se encontro ninguna improductividad";
      botonRecargar.value = true;
    } else {
      // If something is returned, we call the "Table" component method, which, if the pagination is greater than the total number of pages, places the current page as the last one.
      compTabla.value?.reestablecerPaginas();
    }
  }
};

const consultarLinea = async () => {
  // We execute the method of listing the unproductives.
  const response = await listarImproductividades(idCliente.value);

  // We verify that the method has worked.
  if (response.success && response.data) {
    // We fill the table data again.
    data.value = response.data.filter((rem) => rem.estado === null);

    const resultado = await compFiltros.value?.getDataLineas(data.value);
    data.value = resultado;

    // We check if the query returns results.
    if (data.value.length === 0) {
      // If we do not bring anything we activate the warnings.
      estadoImproductividades.value = true;
      avisoIcono.value = "pi pi-exclamation-triangle text-5xl";
      avisodetalles.value = "No se encontro ninguna improductividad";
      botonRecargar.value = true;
    } else {
      // If something is returned, we call the "Table" component method, which, if the pagination is greater than the total number of pages, places the current page as the last one.
      compTabla.value?.reestablecerPaginas();
    }
  }
};

const consultarTurno = async () => {
  // We execute the method of listing the unproductives.
  const response = await listarImproductividades(idCliente.value);

  // We verify that the method has worked.
  if (response.success && response.data) {
    // We fill the table data again.
    data.value = response.data.filter((rem) => rem.estado === null);

    const resultado = await compFiltros.value?.getDataTurnos(data.value);
    data.value = resultado;

    // We verify that the method has returned something.
    if (data.value.length === 0) {
      estadoImproductividades.value = true;
      avisoIcono.value = "pi pi-exclamation-triangle text-5xl";
      avisodetalles.value = "No se encontro ninguna improductividad";
      botonRecargar.value = true;
    } else {
      // If something is returned, we call the "Table" component method, which, if the pagination is greater than the total number of pages, places the current page as the last one.
      compTabla.value?.reestablecerPaginas();
    }
  }
};

// Method that helps to relist the table and clean the filters made previously.
const recargarTabla = () => {
  listar();
  compFiltros.value?.recargarTabla();
};

listar();

definePageMeta({
    layout: 'default',
    middleware: "auth",
  })
</script>
