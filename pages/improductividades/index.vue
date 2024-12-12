<template>
  <div class="w-full md:w-[97%]">
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
        <button
          type="button"
          v-if="recargar"
          class="bg-azulClaroIENM px-3 py-1 rounded mb-2 float-right mt-2"
          @click="recargarTabla"
        >
          <i class="pi pi-refresh text-white"
            ><span class="ml-2 font-manrope-r">Recargar tabla</span></i
          >
        </button>
      </div>
      <div class="overflow-x-auto">
        <Tabla
          ref="compTabla"
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
                  v-model="lineasElegidas"
                  @metodo="getFiltrarLinea"
                />
              </div>
            </th>
            <th class="bg-azulIENM text-white">
              <div class="flex gap-2">
                <p>TURNO</p>
                <ListaFiltro
                  :opciones="turnos"
                  v-model="turnosElegidos"
                  @metodo="getFiltrarTurno"
                />
              </div>
            </th>
            <th class="bg-azulIENM text-white py-3 px-5">ACCIONES</th>
          </template>
          <template #botones="{ data }">
            <td>{{ data.dispositivo }}</td>
            <td>{{ data.turno }}</td>
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
import ListaFiltro from "../../components/dinamicos/ListaFiltro.vue";
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
  turnos,
} from "../../composables/improductividades/datosImproductividades";

const dates = ref();
let avisoIcono = ref();
const toast = useToast();
let avisodetalles = ref();
const recargar = ref(false);
const isLoading = ref(false);
const botonRecargar = ref(false);
const idCliente = useCookie("idCliente");
const lineasElegidas = ref<String[]>([]); // Variable to save the chosen lines.
const turnosElegidos = ref<String[]>([]); // Variable to save the chosen turns.
const estadoImproductividades = ref(false);
const data = ref<Improductividad[] | undefined>([]);
const { listarImproductividades } = useImproductividadesAPI();
const { setConsultar, filtrarPorLinea, filtrarPorTurno } =
  useDatosImproductividades();

// We save the component as a variable so we can manage it.
const compTabla = ref<InstanceType<typeof Tabla> | null>(null);

const listar = async () => {
  isLoading.value = true;

  const response = await listarImproductividades(idCliente.value);

  if (response.success && response.data) {
    data.value = response.data.filter((rem) => rem.estado === null);
    console.log("data imp: ", data.value);

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

// Method to consult by dates.
const consultarImproductividades = async () => {
  // Check that there are dates entered.
  if (!dates.value) {
    toast.add({
      severity: "error",
      summary: "Fecha no asignada",
      detail: "Por favor elige una fecha o dos con el calendario.",
      life: 3000,
    });
  } else {
    // We execute the method of listing the unproductives.
    const response = await listarImproductividades(idCliente.value);

    // We verify that the method has worked.
    if (response.success && response.data) {
      // We fill the table data again.
      data.value = response.data.filter((rem) => rem.estado === null);

      // We verify that there are no previous filters of lines or shifts, if there are, perform the filters.
      if (lineasElegidas.value.length !== 0) {
        data.value = await filtrarPorLinea(lineasElegidas.value, data.value);
      }

      if (turnosElegidos.value.length !== 0) {
        data.value = await filtrarPorTurno(turnosElegidos.value, data.value);
      }

      // We perform the filter to consult by dates.
      data.value = await setConsultar(data.value, dates.value);

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
      recargar.value = true;
    }
  }
};

// Method to consult by lines.
const getFiltrarLinea = async () => {
  // We execute the method of listing the unproductives.
  const response = await listarImproductividades(idCliente.value);

  // We verify that the method has worked.
  if (response.success && response.data) {
    // We fill the table data again.
    data.value = response.data.filter((rem) => rem.estado === null);

    // We verify that there are no previous filters for dates or shifts, if there are, perform the filters.
    if (dates.value) {
      data.value = await setConsultar(data.value, dates.value);
    }

    if (turnosElegidos.value.length !== 0) {
      data.value = await filtrarPorTurno(turnosElegidos.value, data.value);
    }

    // We verify that if you execute this "getFiltrarLinea" method and there is no line chosen, take into account what to do.
    if (lineasElegidas.value.length === 0) {
      // We verify that there are no date filters, if there are any, the query is made.
      if (dates.value) {
        data.value = await setConsultar(data.value, dates.value);
      } else {
        // We verify that there are no shift filters, if there are, the query is made.
        if (turnosElegidos.value.length !== 0) {
          data.value = await filtrarPorTurno(turnosElegidos.value, data.value);
        } else {
          // If there are no filters, we list the table again as before.
          listar();
          recargar.value = false;
          dates.value = null;
        }
      }
    } else {
      // We use this method that will return the filtered shifts.
      data.value = await filtrarPorLinea(lineasElegidas.value, data.value);

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
      recargar.value = true;
    }
  }
};

// Method that queries in turns.
const getFiltrarTurno = async () => {
  // We execute the method of listing the unproductives.
  const response = await listarImproductividades(idCliente.value);

  // We verify that the method has worked.
  if (response.success && response.data) {
    // We fill the table data again.
    data.value = response.data.filter((rem) => rem.estado === null);

    // We verify that there are no previous filters by dates or lines, if the filters have been made.
    if (dates.value) {
      data.value = await setConsultar(data.value, dates.value);
    }

    if (lineasElegidas.value.length !== 0) {
      data.value = await filtrarPorLinea(lineasElegidas.value, data.value);
    }

    // We verify that if you execute this "getFiltrarTurno" method and there is no line chosen, take into account what to do.
    if (turnosElegidos.value.length === 0) {
      // We verify that there are no date filters, if there are any, the query is made.
      if (dates.value) {
        data.value = await setConsultar(data.value, dates.value);
      } else {
        // We verify that there are no shift filters, if there are, the query is made.
        if (lineasElegidas.value.length !== 0) {
          data.value = await filtrarPorLinea(lineasElegidas.value, data.value);
        } else {
          // If there are no filters, we list the table again as before.
          listar();
          recargar.value = false;
        }
      }
    } else {
      // We use this method that will return the filtered shifts.
      data.value = await filtrarPorTurno(turnosElegidos.value, data.value);

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
      recargar.value = true;
    }
  }
};

// Method that helps to relist the table and clean the filters made previously.
const recargarTabla = () => {
  listar();
  recargar.value = false;
  dates.value = null;
  // Delete arrangements of chosen shifts and lines.
  lineasElegidas.value.splice(0, lineasElegidas.value.length);
  turnosElegidos.value.splice(0, turnosElegidos.value.length);
};

listar();
</script>
