<template>
  <div class="card w-[55%] ml-[21%]">
    <TabPanelRemisiones />
    <div class="border-[1px] p-5 rounded-t-lg border-gray-300">
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
        :value="remisionesRechazadas"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        scrollable
        scrollHeight="358px"
        tableStyle="min-width: 42rem"
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
            <ModalRechazo
              :numRemision="keyRem.data.no_remision"
              :motivo="keyRem.data.motivo"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Calendar from "primevue/calendar";
import { useToast } from "primevue/usetoast";
import ModalRechazo from "~/components/remisiones/ModalRechazo.vue";
import TabPanelRemisiones from "~/components/remisiones/TabPanelRemisiones.vue";
import {
  useDatosRemisiones,
  columnas, //Declaración de las columnas de la tabla de remisiones
} from "~/composables/remisiones/datosRemisiones";

const dates = ref();
const toast = useToast();
const calendario = ref(true);
const { setConsultar, remisionesRechazadas, setRemisionesFiltradas } =
  useDatosRemisiones();

const consultarRemisiones = () => {
  if (!dates.value) {
    toast.add({
      severity: "error",
      summary: "Fecha no asignada",
      detail: "Por favor elige una fecha o dos con el calendario.",
      life: 3000,
    });
  } else {
    setConsultar(remisionesRechazadas, dates.value);
    calendario.value = false;
  }
};

const recargarTabla = () => {
  calendario.value = true;
  dates.value = null;
  setRemisionesFiltradas();
};

definePageMeta({
  middleware: "login",
});
</script>

<style>
@import url("/assets/css/estilosTablaRemisiones.css");
</style>
