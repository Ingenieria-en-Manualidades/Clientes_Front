<template>
  <div class="w-full p-3">
    <title>Consultar armado detallado</title>
    <RemisionesTabPanelRemisiones :items="detailedAssemblyTabs" />

    <DinamicosTableFilters
      :headers="detailedAssemblyHeaders"
      :atributes="detailedAssemblyAttributes"
      :data="records"
      :loading="isLoading"
      :warningData="warningData"
      :errorData="errorData"
      :height="'420px'"
      :positionFilters="'inTable'"
      @setCleanExternalFilters="loadRecords"
    >
      <template #newColumn>
        <th class="bg-azulIENM px-3 py-2 text-white">DETALLE</th>
      </template>

      <template #newCell="{ object }">
        <td class="px-3 py-1">
          <button
            type="button"
            class="rounded bg-verdeIENM px-3 py-1 hover:bg-verdeOscIENM"
            title="Ver detalle del armado"
            @click="openDetailModal(object)"
          >
            <i class="pi pi-eye text-white"></i>
          </button>
        </td>
      </template>
    </DinamicosTableFilters>

    <Dialog
      v-model:visible="detailModalVisible"
      modal
      header="Detalle de armado detallado"
      class="dialog-detailed-assembly"
      @hide="clearDetailModal"
    >
      <div v-if="selectedDetailedAssembly" class="space-y-6">
        <section>
          <h2 class="mb-2 text-base font-bold">Armado</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-xs sm:text-sm">
              <thead>
                <tr>
                  <th class="bg-azulIENM px-3 py-2 text-white">ID</th>
                  <th class="bg-azulIENM px-3 py-2 text-white">AÑO</th>
                  <th class="bg-azulIENM px-3 py-2 text-white">SEMANA</th>
                  <th class="bg-azulIENM px-3 py-2 text-white">FECHA INICIO</th>
                  <th class="bg-azulIENM px-3 py-2 text-white">FECHA FIN</th>
                  <th class="bg-azulIENM px-3 py-2 text-white">USUARIO</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-x-[1px] border-b-[1px] border-gray-300 text-center">
                  <td class="px-3 py-2">
                    {{ selectedDetailedAssembly.detailed_assembly_id }}
                  </td>
                  <td class="px-3 py-2">{{ selectedDetailedAssembly.year }}</td>
                  <td class="px-3 py-2">{{ selectedDetailedAssembly.week_number }}</td>
                  <td class="px-3 py-2">{{ selectedDetailedAssembly.week_start_date }}</td>
                  <td class="px-3 py-2">{{ selectedDetailedAssembly.week_end_date }}</td>
                  <td class="px-3 py-2">{{ selectedDetailedAssembly.username }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <DinamicosTableFilters
            :key="selectedDetailedAssembly.detailed_assembly_id"
            :headers="weeklyDetailHeaders"
            :atributes="weeklyDetailAttributes"
            :data="searchedWeeklyDetails"
            :loading="false"
            :warningData="weeklyDetailWarningData"
            :errorData="false"
            :caption="'Detalle semanal'"
            :height="'360px'"
            :positionFilters="'onTable'"
            @setCleanExternalFilters="clearWeeklyDetailFilters"
          >
            <template #newFilter>
              <label class="flex w-full max-w-sm flex-col gap-1 text-sm font-medium text-gray-700">
                Buscar por SKU, producto o usuario
                <input
                  v-model="weeklyDetailSearch"
                  type="search"
                  placeholder="Escriba un valor para buscar"
                  class="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
              </label>
            </template>
          </DinamicosTableFilters>
        </section>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { HeaderWithFilters, WarningTable } from "~/interfaces/filters";
import {
  detailedAssemblyAttributes,
  detailedAssemblyHeaders,
  detailedAssemblyTabs,
} from "~/composables/objetivos/DetailedAssemblyData";
import {
  useDetailedAssemblyApi,
  type DetailedAssemblyListRow,
} from "~/composables/objetivos/useDetailedAssemblyApi";

const records = ref<DetailedAssemblyListRow[]>([]);
const isLoading = ref(false);
const errorData = ref(false);
const detailModalVisible = ref(false);
const selectedDetailedAssembly = ref<DetailedAssemblyListRow | null>(null);
const weeklyDetailSearch = ref("");
const warningData = ref<WarningTable>({
  success: false,
  label: "",
});
const { listDetailedAssemblies } = useDetailedAssemblyApi();

const formatDate = (value: string | null | undefined) => value?.slice(0, 10) ?? "";

const weeklyDetailAttributes = [
  "client_name",
  "sku",
  "product",
  "weekly_total",
  "username",
];

const weeklyDetailTableRows = computed(() =>
  (selectedDetailedAssembly.value?.weekly_detailed_assembly ?? []).map((detail) => ({
    ...detail,
    client_name: detail.client_name?.trim() || "Sin cliente",
  })),
);

const weeklyDetailHeaders = computed<HeaderWithFilters[]>(() => {
  const clientNames = Array.from(
    new Set(weeklyDetailTableRows.value.map((detail) => detail.client_name)),
  ).sort((firstClient, secondClient) => firstClient.localeCompare(secondClient));

  return [
    {
      label: "nombre cliente",
      options: {
        atribute: "client_name",
        labels: clientNames,
      },
    },
    { label: "SKU", options: null },
    { label: "producto", options: null },
    { label: "total semana", options: null },
    { label: "usuario", options: null },
  ];
});

const searchedWeeklyDetails = computed(() => {
  const searchTerm = weeklyDetailSearch.value.trim().toLocaleLowerCase();

  if (searchTerm === "") {
    return weeklyDetailTableRows.value;
  }

  return weeklyDetailTableRows.value.filter((detail) =>
    [detail.sku, detail.product, detail.username].some((value) =>
      String(value ?? "").toLocaleLowerCase().includes(searchTerm),
    ),
  );
});

const weeklyDetailWarningData = computed<WarningTable>(() => ({
  success: weeklyDetailTableRows.value.length === 0,
  label: "Este armado no tiene detalles habilitados.",
}));

const openDetailModal = (detailedAssembly: DetailedAssemblyListRow) => {
  selectedDetailedAssembly.value = detailedAssembly;
  weeklyDetailSearch.value = "";
  detailModalVisible.value = true;
};

const clearWeeklyDetailFilters = () => {
  weeklyDetailSearch.value = "";
};

const clearDetailModal = () => {
  weeklyDetailSearch.value = "";
  selectedDetailedAssembly.value = null;
};

const loadRecords = async () => {
  isLoading.value = true;
  errorData.value = false;
  records.value = [];
  warningData.value = { success: false, label: "" };

  const response = await listDetailedAssemblies();

  if (response.success) {
    records.value = (response.data ?? []).map((row) => ({
      ...row,
      week_start_date: formatDate(row.week_start_date),
      week_end_date: formatDate(row.week_end_date),
    }));

    if (records.value.length === 0) {
      warningData.value = {
        success: true,
        label: "No hay registros de armado detallado.",
      };
    }
  } else {
    errorData.value = true;
    warningData.value = {
      success: true,
      label: response.message,
    };
  }

  isLoading.value = false;
};

onMounted(loadRecords);

definePageMeta({
  layout: "default",
  middleware: "auth",
  requiresAuth: true,
});
</script>

<style>
.dialog-detailed-assembly {
  width: 72rem;
  max-width: 95vw;
}
</style>
