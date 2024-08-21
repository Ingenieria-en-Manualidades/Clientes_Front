<template>
  <div class="w-[100%] md:w-[850px]">
    <TabPanelRemisiones />
    <div class="mt-3" v-if="remisionesPendientes.length !== 0">
      <div v-if="calendario">
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
        class="bg-azulClaroIENM px-3 py-1 rounded mb-2"
        @click="recargarTabla"
        v-else
      >
        <i class="pi pi-refresh text-white"
          ><span class="ml-2 font-manrope-r">Recargar tabla</span></i
        >
      </button>
      <table class="text-xs sm:text-base w-full font-manrope-r">
        <thead>
          <tr>
            <th class="bg-azulIENM text-white p-4 rounded-tl-md">N°</th>
            <th class="bg-azulIENM text-white p-4">VALOR</th>
            <th class="bg-azulIENM text-white p-4">FECHA</th>
            <th class="bg-azulIENM text-white p-4 rounded-tr-md">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="remision in remisionesPendientes"
            v-bind:key="remision.no_remision"
          >
            <td class="border-b-[1px] border-gray-400 text-center">
              {{ remision.no_remision }}
            </td>
            <td class="border-b-[1px] border-gray-400 text-center">
              {{ remision.valor }}
            </td>
            <td class="border-b-[1px] border-gray-400 text-center">
              {{ remision.fecha }}
            </td>
            <td class="border-b-[1px] border-gray-400 text-center">
              <ModalRemisiones
                :numRemision="remision.no_remision"
                :idRemision="remision.remision_id"
                @postGuardarRemision="listar"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <DataTable
        :value="remisionesPendientes"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        scrollable
        scrollHeight="368px"
        class="tabla"
      >
        <Column field="no_remision" header="N°" header-class=""></Column>
        <Column header="VALOR">
          <template #body="slotProps">
            <span><b>$</b> {{ formatoNumero(slotProps.data.valor) }}</span>
          </template>
        </Column>
        <Column field="fecha" header="FECHA"></Column>
        <Column header="Acción">
          <template #body="keyRem">
            <div class="block sm:inline-flex sm:gap-1">
              <ModalPreviewRemision
                :numRemision="keyRem.data.no_remision"
                :fecha="keyRem.data.fecha"
                :cliente="keyRem.data.nombre_cliente"
                :ordenCompra="keyRem.data.orden_compra"
                :hojaEntrada="keyRem.data.numero_pedido"
                :contacto="keyRem.data.nombre + ' ' + keyRem.data.apellido"
                :estado="'Pendiente'"
              />
              <!-- LLamando a la modal la cual le asignamos un evento o "emit" para que vuelva a listar después de guardar una remisión -->
              <ModalRemisiones
                :numRemision="keyRem.data.no_remision"
                :idRemision="keyRem.data.remision_id"
                @postGuardarRemision="listar"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
    <!-- Carga de progeso mientras terminan de llegar las remisiones -->
    <div
      class="border-[1px] p-5 rounded-t-lg border-gray-300 text-center"
      v-else-if="isLoading"
    >
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="transparent"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />
    </div>
    <!-- Información que sale en caso de no aparecer ninguna información -->
    <div
      class="border-[1px] p-10 rounded-t-lg border-gray-300 text-center"
      v-else-if="estadoRemisiones"
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

<script setup lang="ts">
import Calendar from "primevue/calendar";
import { useToast } from "primevue/usetoast";
import { useRemisionesApi } from "~/composables/remisiones/remisionesApi";
import TabPanelRemisiones from "~/components/remisiones/TabPanelRemisiones.vue";
import ModalPreviewRemision from "~/components/remisiones/ModalPreviewRemision.vue";
import { useDatosRemisiones } from "~/composables/remisiones/datosRemisiones";

const dates = ref();
let avisoIcono = ref();
const toast = useToast();
const idCliente = useCookie("idCliente");
let avisodetalles = ref();
const isLoading = ref(false);
const calendario = ref(true);
const estadoRemisiones = ref(false);
const botonRecargar = ref(false);
const { listarRemisionesPorId } = useRemisionesApi();
const { setConsultar, remisionesPendientes } = useDatosRemisiones();

const listar = async () => {
  isLoading.value = true;

  const resultado = await listarRemisionesPorId(idCliente.value);

  if (resultado.success) {
    remisionesPendientes.value = resultado.remisiones.filter(
      (rem) => rem.estado === null
    );

    if (remisionesPendientes.value.length === 0) {
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

const consultarRemisiones = () => {
  if (!dates.value) {
    toast.add({
      severity: "error",
      summary: "Fecha no asignada",
      detail: "Por favor elige una fecha o dos con el calendario.",
      life: 3000,
    });
  } else {
    setConsultar(remisionesPendientes, dates.value);
    if (remisionesPendientes.value.length === 0) {
      estadoRemisiones.value = true;
      avisoIcono.value = "pi pi-exclamation-triangle text-5xl";
      avisodetalles.value = "No se encontro ninguna remisión entre esas fechas";
      botonRecargar.value = true;
    }
    calendario.value = false;
  }
};

const recargarTabla = () => {
  calendario.value = true;
  dates.value = null;
  listar();
};

const formatoNumero = (numero: number): string => {
  return new Intl.NumberFormat("es-ES").format(numero);
};

definePageMeta({
  layout: "default",
  middleware: "login",
});

listar();
</script>

<style>
@import url("/assets/css/estilosTablaRemisiones.css");
</style>
