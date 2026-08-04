<template>
  <div class="w-full px-5 py-3">
    <title>Programación Detallada</title>
    <RemisionesTabPanelRemisiones :items="scheduledDetailTabs" />

    <h1 class="mb-6 text-2xl font-semibold text-gray-800">
      Programación Detallada
    </h1>

    <form class="grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      <DinamicosInputCalendar
        v-model="year"
        :label="'Año'"
        :displayFlex="false"
        :dateFormat="'yy'"
        :view="'year'"
      />

      <DinamicosDropDownList
        v-model="week"
        :label="'Semana del año'"
        :displayFlex="false"
        :options="weekOptions"
        :placeholder="year ? 'Seleccione una semana' : 'Seleccione primero el año'"
        :disabled="!year"
      />

      <div class="flex flex-col gap-2 text-sm font-medium text-gray-700">
        <label for="detailed-schedule-file">Archivo Excel</label>
        <div class="flex flex-col gap-2 sm:flex-row">
          <input
            id="detailed-schedule-file"
            ref="fileInput"
            type="file"
            accept=".xlsx,.xls"
            class="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-blue-700"
            @change="handleFileChange"
          >
          <button
            type="button"
            class="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isLoading"
            @click="handlePreview"
          >
            {{ isLoading ? "Leyendo..." : "Previsualizar" }}
          </button>
        </div>
        <p v-if="fileError" class="text-sm text-red-600">{{ fileError }}</p>
      </div>
    </form>

    <div
      v-if="responseMessage"
      class="mt-5 max-w-4xl rounded-md border px-4 py-3 text-sm"
      :class="previewSuccess
        ? 'border-green-300 bg-green-50 text-green-800'
        : 'border-red-300 bg-red-50 text-red-800'"
    >
      <p class="font-semibold">{{ responseTitle }}</p>
      <p>{{ responseMessage }}</p>
    </div>

    <div
      v-if="validationErrorDetails.length"
      class="mt-4 max-w-4xl rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      <p class="font-semibold">Detalle de errores</p>
      <ul class="mt-2 list-disc space-y-1 pl-5">
        <li v-for="detail in validationErrorDetails" :key="detail.key">
          <span class="font-medium">
            {{ /^\d+$/.test(detail.key) ? `Fila ${detail.key}` : detail.key }}:
          </span>
          {{ detail.messages.join(" ") }}
        </li>
      </ul>
    </div>

    <div v-if="previewRows.length" class="mt-6 max-w-4xl">
      <DinamicosTableFilters
        :headers="previewHeaders"
        :atributes="previewAttributes"
        :data="searchedPreviewRows"
        :loading="false"
        :warningData="previewWarningData"
        :errorData="false"
        :caption="'Previsualización del archivo'"
        :height="'420px'"
        :positionFilters="'onTable'"
        @setCleanExternalFilters="clearPreviewSearch"
      >
        <template #newFilter>
          <label class="flex w-full max-w-sm flex-col gap-1 text-sm font-medium text-gray-700">
            Buscar por SKU, producto o total semana
            <input
              v-model="previewSearch"
              type="search"
              placeholder="Escriba un valor para buscar"
              class="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
          </label>
        </template>
      </DinamicosTableFilters>
    </div>

    <button
      v-if="previewRows.length"
      type="button"
      class="mt-4 rounded-md bg-green-600 px-5 py-2 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      :disabled="isSaving"
      @click="handleSave"
    >
      {{ isSaving ? "Guardando..." : "Guardar programación" }}
    </button>

    <Dialog
      v-model:visible="showReplaceDialog"
      modal
      :header="'Programación existente'"
      :style="{ width: '32rem' }"
    >
      <div class="space-y-4">
        <p>
          Ya existe una programación para la semana
          <strong>{{ pendingSaveRequest?.week }}</strong> del año
          <strong>{{ pendingSaveRequest?.year }}</strong> para este usuario.
        </p>
        <p class="text-sm text-gray-700">
          Si continúas, los detalles anteriores se reemplazarán por los valores
          del archivo que acabas de previsualizar.
        </p>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="rounded border border-gray-400 px-4 py-2 text-gray-700"
            :disabled="isSaving"
            @click="cancelReplace"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="rounded bg-[#4789c8] px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="isSaving"
            @click="confirmReplace"
          >
            {{ isSaving ? "Actualizando..." : "Actualizar programación" }}
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useCookie } from "nuxt/app";
import { computed, ref, watch } from "vue";
import type { OptionDropdown } from "~/interfaces/componentesDinamicos";
import type { HeaderWithFilters, WarningTable } from "~/interfaces/filters";
import {
  useScheduledDetailApi,
  type ScheduledDetailPreviewData,
  type ScheduledDetailPreviewRow,
  type ScheduledDetailSaveRequest,
  type ScheduledDetailValidationErrors,
} from "~/composables/objetivos/useScheduledDetailApi";
import { scheduledDetailTabs } from "~/composables/objetivos/ScheduledDetailData";

const year = ref<Date | null>(null);
const week = ref<number | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const fileError = ref("");
const isLoading = ref(false);
const isSaving = ref(false);
const previewSuccess = ref(false);
const responseTitle = ref("");
const responseMessage = ref("");
const previewRows = ref<ScheduledDetailPreviewRow[]>([]);
const previewContext = ref<Pick<
  ScheduledDetailPreviewData,
  "year" | "week" | "username"
> | null>(null);
const validationErrors = ref<ScheduledDetailValidationErrors>({});
const previewSearch = ref("");
const showReplaceDialog = ref(false);
const pendingSaveRequest = ref<ScheduledDetailSaveRequest | null>(null);
const username = useCookie<string | null>("usuario");
const { previewExcel, saveScheduledDetails } = useScheduledDetailApi();

const previewAttributes = [
  "start_date",
  "end_date",
  "nombre_cliente",
  "sku",
  "producto",
  "value",
];

const previewWarningData: WarningTable = {
  success: false,
  label: "",
};

const weekDateFormatter = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

const getIsoWeekNumber = (date: Date) => {
  const targetDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const dayOfWeek = targetDate.getUTCDay() || 7;

  targetDate.setUTCDate(targetDate.getUTCDate() + 4 - dayOfWeek);

  const firstDayOfYear = new Date(Date.UTC(targetDate.getUTCFullYear(), 0, 1));
  const elapsedDays = Math.floor(
    (targetDate.getTime() - firstDayOfYear.getTime()) / 86_400_000,
  ) + 1;

  return Math.ceil(elapsedDays / 7);
};

const getIsoWeekStart = (selectedYear: number, weekNumber: number) => {
  const fourthOfJanuary = new Date(Date.UTC(selectedYear, 0, 4));
  const dayOfWeek = fourthOfJanuary.getUTCDay() || 7;

  fourthOfJanuary.setUTCDate(
    fourthOfJanuary.getUTCDate() - dayOfWeek + 1 + (weekNumber - 1) * 7,
  );

  return fourthOfJanuary;
};

const formatWeekDate = (date: Date) => weekDateFormatter.format(date).replace(",", "");

const weekOptions = computed<OptionDropdown[]>(() => {
  const selectedYear = year.value?.getFullYear();

  if (!selectedYear) {
    return [];
  }

  const totalWeeks = getIsoWeekNumber(new Date(Date.UTC(selectedYear, 11, 28)));

  return Array.from({ length: totalWeeks }, (_, index) => {
    const weekNumber = index + 1;
    const weekStart = getIsoWeekStart(selectedYear, weekNumber);
    const weekEnd = new Date(weekStart);

    weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);

    return {
      value: weekNumber,
      label: `Semana ${weekNumber} — ${formatWeekDate(weekStart)} al ${formatWeekDate(weekEnd)}`,
    };
  });
});

const previewTableRows = computed(() =>
  previewRows.value.map((row) => ({
    ...row,
    nombre_cliente: row.nombre_cliente.trim(),
  })),
);

const previewHeaders = computed<HeaderWithFilters[]>(() => {
  const clientNames = Array.from(
    new Set(previewTableRows.value.map((row) => row.nombre_cliente)),
  ).sort((firstClient, secondClient) => firstClient.localeCompare(secondClient));

  return [
    { label: "fecha inicio", options: null },
    { label: "fecha fin", options: null },
    {
      label: "nombre cliente",
      options: {
        atribute: "nombre_cliente",
        labels: clientNames,
      },
    },
    { label: "SKU", options: null },
    { label: "producto", options: null },
    { label: "total semana", options: null },
  ];
});

const searchedPreviewRows = computed(() => {
  const searchTerm = previewSearch.value.trim().toLocaleLowerCase();

  if (searchTerm === "") {
    return previewTableRows.value;
  }

  return previewTableRows.value.filter((row) =>
    [row.sku, row.producto, row.value].some((value) =>
      String(value).toLocaleLowerCase().includes(searchTerm),
    ),
  );
});

const validationErrorDetails = computed(() =>
  Object.entries(validationErrors.value).map(([key, errors]) => ({
    key,
    messages: Array.isArray(errors)
      ? errors
      : Object.values(errors).flat(),
  })),
);

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  selectedFile.value = input.files?.[0] ?? null;
  fileError.value = "";
  responseTitle.value = "";
  responseMessage.value = "";
  previewRows.value = [];
  previewContext.value = null;
  validationErrors.value = {};
  previewSearch.value = "";
  showReplaceDialog.value = false;
  pendingSaveRequest.value = null;
};

const handlePreview = async () => {
  if (!year.value) {
    fileError.value = "Seleccione el año.";
    return;
  }

  if (!week.value || week.value < 1 || week.value > 53) {
    fileError.value = "Seleccione una semana válida entre 1 y 53.";
    return;
  }

  if (!selectedFile.value) {
    fileError.value = "Seleccione un archivo Excel.";
    fileInput.value?.focus();
    return;
  }

  if (!username.value) {
    fileError.value = "No fue posible identificar el usuario autenticado.";
    return;
  }

  fileError.value = "";
  isLoading.value = true;
  previewRows.value = [];
  previewContext.value = null;
  validationErrors.value = {};
  previewSearch.value = "";
  showReplaceDialog.value = false;
  pendingSaveRequest.value = null;

  const response = await previewExcel({
    file: selectedFile.value,
    year: year.value.getFullYear(),
    week: week.value,
    username: username.value,
  });

  previewSuccess.value = response.success;
  responseTitle.value = response.title;
  responseMessage.value = response.message;
  previewRows.value = response.data?.values ?? [];
  previewContext.value = response.data
    ? {
      year: response.data.year,
      week: response.data.week,
      username: response.data.username,
    }
    : null;
  validationErrors.value = response.errors ?? {};
  isLoading.value = false;
};

const getSaveRequest = (): ScheduledDetailSaveRequest | null => {
  if (!previewContext.value) {
    return null;
  }

  return {
    ...previewContext.value,
    values: previewRows.value,
  };
};

const submitSaveRequest = async (saveRequest: ScheduledDetailSaveRequest) => {
  isSaving.value = true;

  try {
    const response = await saveScheduledDetails(saveRequest);

    previewSuccess.value = response.success;
    responseTitle.value = response.title;
    responseMessage.value = response.message;
    validationErrors.value = response.errors ?? {};

    if (response.requiresConfirmation) {
      pendingSaveRequest.value = saveRequest;
      showReplaceDialog.value = true;
      return;
    }

    if (response.success) {
      previewRows.value = [];
      previewContext.value = null;
      validationErrors.value = {};
      pendingSaveRequest.value = null;
      showReplaceDialog.value = false;
    }
  } finally {
    isSaving.value = false;
  }
};

const handleSave = async () => {
  const saveRequest = getSaveRequest();

  if (saveRequest !== null) {
    await submitSaveRequest(saveRequest);
  }
};

const cancelReplace = () => {
  showReplaceDialog.value = false;
  pendingSaveRequest.value = null;
};

const confirmReplace = async () => {
  if (isSaving.value || pendingSaveRequest.value === null) {
    return;
  }

  await submitSaveRequest({
    ...pendingSaveRequest.value,
    replace_existing: true,
  });
};

const clearPreviewSearch = () => {
  previewSearch.value = "";
};

watch(year, () => {
  week.value = null;
});

definePageMeta({
  layout: "default",
  middleware: "auth",
  requiresAuth: true,
});
</script>
