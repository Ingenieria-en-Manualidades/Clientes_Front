<template>
  <div class="card w-[100%] md:w-[850px]">
    <TabPanelRemisiones />
    <div
      class="border-[1px] p-5 rounded-t-lg border-gray-300"
      v-if="remisionesPendientes.length !== 0"
    >
      <div v-if="calendario">
        <Calendar
          v-model="dates"
          selectionMode="range"
          :manualInput="false"
          dateFormat="yy/mm/dd"
          class="mb-3"
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
      <DataTable
        :value="remisionesPendientes"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        scrollable
        scrollHeight="368px"
        class="tabla"
      >
        <Column
          v-for="col of columnas"
          :key="col.field"
          :field="col.field"
          :header="col.header"
        ></Column>
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
import {
  useDatosRemisiones,
  columnas, //Declaración de las columnas de la tabla de remisiones
} from "~/composables/remisiones/datosRemisiones";

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

definePageMeta({
  layout: "default",
  middleware: "login",
});

listar();
</script>

<style>
@import url("/assets/css/estilosTablaRemisiones.css");
</style>
