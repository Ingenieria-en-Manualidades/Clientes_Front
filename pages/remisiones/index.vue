<template>
  <div class="card w-[100%] md:w-[810px] lg:w-[70%]">
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
        :value="remisionesPendientes"
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
          :style="col.style"
        ></Column>
        <Column header="Acción">
          <template #body="keyRem">
            <div class="inline-flex">
              <!-- LLamando a la modal la cual le asignamos un evento o "emit" para que vuelva a listar después de guardar una remisión -->
              <ModalRemisiones
                :numRemision="keyRem.data.no_remision"
                :idRemision="keyRem.data.remision_id"
                @postGuardarRemision="setRemisionesFiltradas"
              />
            </div>
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
import ModalRemisiones from "~/components/ModalRemisiones.vue";
import TabPanelRemisiones from "~/components/remisiones/TabPanelRemisiones.vue";
import {
  useDatosRemisiones,
  columnas, //Declaración de las columnas de la tabla de remisiones
} from "~/composables/remisiones/datosRemisiones";

const dates = ref();
const toast = useToast();
const calendario = ref(true);
const { setConsultar, remisionesPendientes, setRemisionesFiltradas } =
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
    setConsultar(remisionesPendientes, dates.value);
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
