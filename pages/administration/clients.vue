<template>
  <div class="p-3">
    <title>Clientes</title>

    <div class="flex flex-col gap-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex gap-1">
          <button
            type="button"
            class="px-3 py-2 border border-gray-300 text-sm"
            :class="activeView === 'clients' ? 'bg-azulIENM text-white' : 'bg-white text-gray-700'"
            @click="activeView = 'clients'"
          >
            Clientes
          </button>
          <button
            type="button"
            class="px-3 py-2 border border-gray-300 text-sm"
            :class="activeView === 'surveys' ? 'bg-azulIENM text-white' : 'bg-white text-gray-700'"
            @click="activeView = 'surveys'"
          >
            Surveys
          </button>
        </div>

        <button
          type="button"
          class="bg-azulIENM text-white px-3 py-2 text-sm disabled:opacity-60"
          :disabled="isLoadingClients || isLoadingSurveyClients || isSyncing"
          @click="syncClients"
        >
          <i class="pi pi-refresh mr-1" :class="{ 'pi-spin': isSyncing }"></i>
          Sincronizar
        </button>

        <ClientsModalFormCreateClient
          v-if="activeView === 'clients'"
          @list="listClientsSchema"
        />
      </div>

      <DinamicosTableFilters
        v-if="activeView === 'clients'"
        :headers="clientsSchemaHeaders"
        :atributes="clientsSchemaAttributes"
        :data="clientsSchema"
        :loading="isLoadingClients"
        :warningData="clientsWarningData"
        :errorData="clientsErrorData"
        :height="'300px'"
        :positionFilters="'inTable'"
        :caption="'Clientes'"
      >
        <template #newFilter>
          <div>
            <DinamicosInputText
              v-model="clientsFilter"
              :label="'Buscar'"
              :displayFlex="false"
              :height="'1000px'"
            />
          </div>
        </template>
        <template #newColumn>
          <th class="bg-azulIENM text-white py-3 px-5">ACCIONES</th>
        </template>
        <template #newCell="{ object }">
          <td class="flex justify-center gap-2 p-1">
            <ClientsModalClientUsers
              v-if="object.id"
              :clientId="object.id"
              :clientName="object.nombre ?? ''"
            />
            <ClientsModalFormUpdateClient
              v-if="object.id"
              :id="object.id"
              :nombre="object.nombre ?? ''"
              :endpointId="object.endpoint_id ?? ''"
              @list="listClientsSchema"
            />
            <ClientsModalDisableEnableClient
              v-if="object.id"
              :id="object.id"
              :clientName="object.nombre ?? ''"
              :status="!object.deleted_at"
              @list="loadData"
            />
          </td>
        </template>
      </DinamicosTableFilters>

      <DinamicosTableFilters
        v-if="activeView === 'surveys'"
        :headers="surveyClientsHeaders"
        :atributes="surveyClientsAttributes"
        :data="surveyClients"
        :loading="isLoadingSurveyClients"
        :warningData="surveyClientsWarningData"
        :errorData="surveyClientsErrorData"
        :height="'300px'"
        :positionFilters="'inTable'"
        :caption="'Clientes'"
      >
        <template #newFilter>
          <div>
            <DinamicosInputText
              v-model="surveyClientsFilter"
              :label="'Buscar'"
              :displayFlex="false"
              :height="'1000px'"
            />
          </div>
        </template>
        <template #newColumn>
          <th class="bg-azulIENM text-white py-3 px-5">ACCIONES</th>
        </template>
        <template #newCell="{ object }">
          <td class="flex justify-center gap-2 p-1">
            <ClientsModalClientUsers
              v-if="object.cliente_id"
              :clientId="object.cliente_id"
              :clientName="object.name ?? ''"
              source="surveys"
            />
            <ClientsModalFormUpdateSurveyClient
              v-if="object.cliente_id"
              :id="object.cliente_id"
              :name="object.name ?? ''"
              :feedValue="object.feed_value"
              :costCenter="object.cost_center"
              :overtime="object.overtime"
              :cityId="object.city_id"
              @list="listSurveyClients"
            />
          </td>
        </template>
      </DinamicosTableFilters>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import type { ClientSchemaTable, SurveyClientTable } from "../../interfaces/clients";
import type { WarningTable } from "../../interfaces/filters";
import { useClientsApi } from "../../composables/administration/clientsApi";
import { useDataClients } from "../../composables/administration/dataClients";

type ClientView = "clients" | "surveys";

const toast = useToast();
const activeView = ref<ClientView>("clients");
const clientsFilter = ref<string>("");
const surveyClientsFilter = ref<string>("");
const isLoadingClients = ref<boolean>(false);
const isLoadingSurveyClients = ref<boolean>(false);
const isSyncing = ref<boolean>(false);
const clientsSchema = ref<ClientSchemaTable[]>([]);
const cacheClientsSchema = ref<ClientSchemaTable[]>([]);
const surveyClients = ref<SurveyClientTable[]>([]);
const cacheSurveyClients = ref<SurveyClientTable[]>([]);
const clientsErrorData = ref<boolean>(false);
const surveyClientsErrorData = ref<boolean>(false);
const clientsWarningData = ref<WarningTable>({
  success: false,
  label: "",
});
const surveyClientsWarningData = ref<WarningTable>({
  success: false,
  label: "",
});

const { getClientsSchema, getSurveyClients, setSyncClients } = useClientsApi();
const {
  clientsSchemaHeaders,
  clientsSchemaAttributes,
  surveyClientsHeaders,
  surveyClientsAttributes,
  setFixClientsSchema,
  setFixSurveyClients,
} = useDataClients();

const resetWarning = (warning: WarningTable) => {
  warning.success = false;
  warning.label = "";
};

const listClientsSchema = async () => {
  isLoadingClients.value = true;
  clientsErrorData.value = false;
  resetWarning(clientsWarningData.value);

  const result = await getClientsSchema();

  if (result.success) {
    const data: any[] = result.data ?? [];

    if (data.length === 0) {
      clientsSchema.value = [];
      cacheClientsSchema.value = [];
      clientsWarningData.value.success = true;
      clientsWarningData.value.label = "Sin clientes registrados en el esquema Clients.";
    } else {
      clientsSchema.value = setFixClientsSchema(data);
      cacheClientsSchema.value = clientsSchema.value;
    }
  } else {
    clientsSchema.value = [];
    cacheClientsSchema.value = [];
    clientsErrorData.value = true;
    toast.add({
      severity: "error",
      summary: result.title,
      detail: result.message,
      life: 5000,
    });
  }
  isLoadingClients.value = false;
};

const listSurveyClients = async () => {
  isLoadingSurveyClients.value = true;
  surveyClientsErrorData.value = false;
  resetWarning(surveyClientsWarningData.value);

  const result = await getSurveyClients();

  if (result.success) {
    const data: any[] = result.data ?? [];

    if (data.length === 0) {
      surveyClients.value = [];
      cacheSurveyClients.value = [];
      surveyClientsWarningData.value.success = true;
      surveyClientsWarningData.value.label = result.message || "Sin clientes registrados en el esquema surveys.";
    } else {
      surveyClients.value = setFixSurveyClients(data);
      cacheSurveyClients.value = surveyClients.value;
    }
  } else {
    surveyClients.value = [];
    cacheSurveyClients.value = [];
    surveyClientsErrorData.value = true;
    toast.add({
      severity: "error",
      summary: result.title,
      detail: result.message,
      life: 5000,
    });
  }
  isLoadingSurveyClients.value = false;
};

const loadData = async () => {
  await Promise.all([listClientsSchema(), listSurveyClients()]);
};
loadData();

const syncClients = async () => {
  if (isSyncing.value) return;

  isSyncing.value = true;
  const response = await setSyncClients();

  toast.add({
    severity: response.success ? "success" : "error",
    summary: response.title,
    detail: response.message,
    life: 5000,
  });

  if (response.success) {
    await loadData();
  }

  isSyncing.value = false;
};

watch(clientsFilter, async (newVal, oldVal) => {
  if (newVal === oldVal) return;
  const term = (newVal ?? "").toString().trim().toLowerCase();

  if (!term) {
    clientsSchema.value = cacheClientsSchema.value;
    return;
  }

  const searchableFields: (keyof ClientSchemaTable)[] = ["id","nombre","endpoint_id"];

  clientsSchema.value = cacheClientsSchema.value.filter((client) => {
    return searchableFields.some((field) => {
      const value = client[field];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(term);
    });
  });
});

watch(surveyClientsFilter, async (newVal, oldVal) => {
  if (newVal === oldVal) return;
  const term = (newVal ?? "").toString().trim().toLowerCase();

  if (!term) {
    surveyClients.value = cacheSurveyClients.value;
    return;
  }

  const searchableFields: (keyof SurveyClientTable)[] = ["cliente_id","name","feed_value","cost_center","overtime","city_id"];

  surveyClients.value = cacheSurveyClients.value.filter((client) => {
    return searchableFields.some((field) => {
      const value = client[field];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(term);
    });
  });
});

definePageMeta({
  layout: "default",
  middleware: "auth",
  requiresAuth: true,
});
</script>
