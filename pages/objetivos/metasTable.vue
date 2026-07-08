<template>
  <div class="w-full p-3">
    <title>Consultar metas</title>
    <RemisionesTabPanelRemisiones :items="itemsMetas" />
    <DinamicosTableFilters
      :headers="headersMetas"
      :atributes="attributesMetas"
      :data="data"
      :loading="isLoading"
      :warningData="warningData"
      :errorData="errorData"
      :height="'330px'"
      :positionFilters="'inTable'"
      @setCleanExternalFilters="resetExternalFilters"
    >
      <template #newFilter>
        <div class="flex w-full flex-col gap-2 md:flex-row md:items-end">
          <div class="w-full md:w-1/4">
            <DinamicosInputCalendar
              v-model="dateStart"
              :label="'Fecha inicio'"
              :displayFlex="false"
              :dateFormat="'dd/mm/yy'"
            />
          </div>
          <div class="w-full md:w-1/4">
            <DinamicosInputCalendar
              v-model="dateEnd"
              :label="'Fecha fin'"
              :displayFlex="false"
              :dateFormat="'dd/mm/yy'"
            />
          </div>
          <button
            type="button"
            class="mb-1 rounded border border-azulClaroIENM bg-white px-4 py-2 text-azulClaroIENM disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="isLoading"
            @click="searchByDates"
          >
            Buscar por fechas
          </button>
          <button
            type="button"
            class="mb-1 rounded border border-gray-500 bg-white px-4 py-2 text-gray-700 disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="isLoading"
            @click="clearDates"
          >
            Limpiar fechas
          </button>
        </div>
      </template>
    </DinamicosTableFilters>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import type { WarningTable } from "../../interfaces/filters";
import { useObjetivosApi } from "../../composables/objetivos/useObjetivosApi";
import { attributesMetas, headersMetas, itemsMetas } from "../../composables/objetivos/datosObjetivos";

const toast = useToast();
const clientID = useCookie("idCliente");
const { listMetas } = useObjetivosApi();

const isLoading = ref(false);
const errorData = ref(false);
const data = ref<any[]>([]);
const dateStart = ref<Date | null>(null);
const dateEnd = ref<Date | null>(null);
const warningData = ref<WarningTable>({
  success: false,
  label: "",
});

const formatDate = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

const formatDisplayDate = (value: string) => value?.slice(0, 10)?.replace(/-/g, "/") ?? "";

const getDefaultDateRange = () => {
  const today = new Date();
  const yearAgo = new Date(today);
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);
  return { yearAgo, today };
};

const setDefaultDates = () => {
  const { yearAgo, today } = getDefaultDateRange();
  dateStart.value = yearAgo;
  dateEnd.value = today;
};

setDefaultDates();

const fixData = (metas: any[]) => metas.map((meta) => ({
  ...meta,
  fecha: formatDisplayDate(meta.fecha),
  cumplimiento: `${meta.cumplimiento}%`,
  eficiencia_productiva: `${meta.eficiencia_productiva}%`,
  calidad: `${meta.calidad}%`,
  desperdicio_me: `${meta.desperdicio_me}%`,
  desperdicio_pp: `${meta.desperdicio_pp}%`,
}));

const list = async (startDate?: Date | null, endDate?: Date | null) => {
  isLoading.value = true;
  errorData.value = false;
  warningData.value = { success: false, label: "" };

  const response = await listMetas(
    Number(clientID.value),
    startDate ? formatDate(startDate) : undefined,
    endDate ? formatDate(endDate) : undefined,
  );

  if (response.success) {
    data.value = fixData(response.data ?? []);

    if (data.value.length === 0) {
      warningData.value.success = true;
      warningData.value.label = "Sin metas registradas en el rango seleccionado.";
    }
  } else {
    errorData.value = true;
    toast.add({
      severity: "error",
      summary: "Error al cargar metas.",
      detail: response.error,
      life: 5000,
    });
  }

  isLoading.value = false;
};

const resetExternalFilters = () => {
  clearDates();
};

const searchByDates = () => {
  if (!dateStart.value || !dateEnd.value) {
    toast.add({
      severity: "warn",
      summary: "Fechas incompletas.",
      detail: "Selecciona fecha inicio y fecha fin para buscar por fechas.",
      life: 4000,
    });
    return;
  }

  list(dateStart.value, dateEnd.value);
};

const clearDates = () => {
  setDefaultDates();
  list(dateStart.value, dateEnd.value);
};

list(dateStart.value, dateEnd.value);

definePageMeta({
  layout: "default",
  middleware: "auth",
  requiresAuth: true,
});
</script>
