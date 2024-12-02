<template>
  <title>Improductividades</title>
  <div class="w-full md:w-full">
    <TabPanelRemisiones :items="items" />
    <div v-if="data?.length !== 0" class="px-3">
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
import Tabla from "../../components/dinamicos/Tabla.vue";
import ListaFiltro from "../../components/dinamicos/ListaFiltro.vue";
import ProgressSpinner from "primevue/progressspinner";
import ModalRechazo from "../../components/improductividades/ModalRechazo.vue";
import type { Improductividad } from "../../interfaces/improductividades";
import {
  items,
  cols,
  useDatosImproductividades,
  atributos,
  lineas,
  turnos,
} from "../../composables/improductividades/datosImproductividades";
import TabPanelRemisiones from "../../components/remisiones/TabPanelRemisiones.vue";
import { useImproductividadesAPI } from "../../composables/improductividades/improductividadesAPI";

const dates = ref();
let avisoIcono = ref();
const toast = useToast();
let avisodetalles = ref();
const recargar = ref(false);
const idCliente = useCookie("idCliente");
const isLoading = ref(false);
const calendario = ref(true);
const lineasElegidas = ref<String[]>([]);
const turnosElegidos = ref<String[]>([]);
const botonRecargar = ref(false);
const estadoImproductividades = ref(false);
const data = ref<Improductividad[]>([]);
const { listarImproductividades } = useImproductividadesAPI();
const { setConsultar, filtrarPorLinea, filtrarPorTurno } =
  useDatosImproductividades();

const listar = async () => {
  isLoading.value = true;
  const idCliente = useCookie("idCliente");

  const response = await listarImproductividades(idCliente.value);

  if (response.success && response.data) {
    data.value = response.data.filter((rem) => rem.estado === "Rechazado");

    if (data.value.length === 0) {
      estadoImproductividades.value = true;
      avisoIcono.value = "pi pi-check-circle text-5xl";
      avisodetalles.value = "Sin improductividades aprobadas";
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
    const response = await listarImproductividades(idCliente.value);

    if (response.success && response.data) {
      data.value = response.data.filter((rem) => rem.estado === "Rechazado");

      if (lineasElegidas.value.length !== 0) {
        data.value = await filtrarPorLinea(lineasElegidas.value, data.value);
      }

      if (turnosElegidos.value.length !== 0) {
        data.value = await filtrarPorTurno(turnosElegidos.value, data.value);
      }

      data.value = await setConsultar(data.value, dates.value);

      if (data.value.length === 0) {
        estadoImproductividades.value = true;
        avisoIcono.value = "pi pi-exclamation-triangle text-5xl";
        avisodetalles.value = "No se encontro ninguna improductividad";
        botonRecargar.value = true;
      }
      recargar.value = true;
    }
  }
};

const getFiltrarLinea = async () => {
  const response = await listarImproductividades(idCliente.value);

  if (response.success && response.data) {
    data.value = response.data.filter((rem) => rem.estado === "Rechazado");

    if (dates.value) {
      data.value = await setConsultar(data.value, dates.value);
    }

    if (turnosElegidos.value.length !== 0) {
      data.value = await filtrarPorTurno(turnosElegidos.value, data.value);
    }

    if (lineasElegidas.value.length === 0) {
      if (dates.value) {
        data.value = await setConsultar(data.value, dates.value);
      } else {
        if (turnosElegidos.value.length !== 0) {
          data.value = await filtrarPorTurno(turnosElegidos.value, data.value);
        } else {
          listar();
          recargar.value = false;
          dates.value = null;
        }
      }
    } else {
      data.value = await filtrarPorLinea(lineasElegidas.value, data.value);

      if (data.value.length === 0) {
        estadoImproductividades.value = true;
        avisoIcono.value = "pi pi-exclamation-triangle text-5xl";
        avisodetalles.value = "No se encontro ninguna improductividad";
        botonRecargar.value = true;
      }
      recargar.value = true;
    }
  }
};

const getFiltrarTurno = async () => {
  const response = await listarImproductividades(idCliente.value);

  if (response.success && response.data) {
    data.value = response.data.filter((rem) => rem.estado === "Rechazado");

    if (dates.value) {
      data.value = await setConsultar(data.value, dates.value);
    }

    if (lineasElegidas.value.length !== 0) {
      data.value = await filtrarPorLinea(lineasElegidas.value, data.value);
    }

    if (turnosElegidos.value.length === 0) {
      if (dates.value) {
        data.value = await setConsultar(data.value, dates.value);
      } else {
        if (lineasElegidas.value.length !== 0) {
          data.value = await filtrarPorLinea(lineasElegidas.value, data.value);
        } else {
          listar();
          recargar.value = false;
          dates.value = null;
        }
      }
    } else {
      data.value = await filtrarPorTurno(turnosElegidos.value, data.value);

      if (data.value.length === 0) {
        estadoImproductividades.value = true;
        avisoIcono.value = "pi pi-exclamation-triangle text-5xl";
        avisodetalles.value = "No se encontro ninguna improductividad";
        botonRecargar.value = true;
      }
      recargar.value = true;
    }
  }
};

const recargarTabla = () => {
  listar();
  recargar.value = false;
  dates.value = null;
  lineasElegidas.value.splice(0, lineasElegidas.value.length);
  turnosElegidos.value.splice(0, turnosElegidos.value.length);
};

listar();
</script>
