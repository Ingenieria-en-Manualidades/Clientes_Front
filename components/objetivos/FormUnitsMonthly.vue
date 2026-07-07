<template>
  <fieldset id="formUnitsMonthly" class="w-full border border-black py-3 px-5 rounded">
    <legend class="px-1">Mensuales</legend>
    <DinamicosInputCalendar
      v-model="dateMonthly"
      :label="'Elegir fecha'"
      :displayFlex="false"
      :dateFormat="'yy/mm'"
      :view="'month'"
      :info="dateInfo"
      :minDate="monthCurrent"
      :maxDate="monthNext"
      :warning="dateMonthlyFail"
    />
    <DinamicosDropDownList
      :label="'Areas'"
      :displayFlex="false"
      :options="options"
      v-model="areaChoose"
      :warning="areaMonthlyFail"
    />
    <div id="entryModeUnitsMonthly" class="mt-3">
      <p class="mb-2 font-semibold">Tipo de ingreso</p>
      <div
        class="grid grid-cols-1 gap-2"
        :class="hasBulkUnitsPermission ? 'md:grid-cols-2' : 'md:grid-cols-1'"
      >
        <button
          v-if="hasBulkUnitsPermission"
          id="btnEntryModeMass"
          type="button"
          class="rounded-3xl border py-2 px-3 transition-colors"
          :class="entryMode === 'mass' ? 'bg-[#4789c8] text-white border-[#4789c8]' : 'bg-white text-[#4789c8] border-[#4789c8]'"
          @click="setEntryMode('mass')"
        >
          Ingreso masivo
        </button>
        <button
          id="btnEntryModeManual"
          type="button"
          class="rounded-3xl border py-2 px-3 transition-colors"
          :class="entryMode === 'manual' ? 'bg-[#4789c8] text-white border-[#4789c8]' : 'bg-white text-[#4789c8] border-[#4789c8]'"
          @click="setEntryMode('manual')"
        >
          Manual
        </button>
      </div>
      <p v-if="entryModeFail" class="mt-1 text-sm text-red-600">{{ entryModeFail }}</p>
    </div>
    <div id="groupInputNumber">
      <DinamicosInputNumber
        v-if="entryMode === 'manual'"
        id="manualUnitsMonthly"
        v-model="unitsMonthly"
        :label="'Unidades'"
        :displayFlex="false"
        :warning="unitsMonthlyFail"
      />

      <div v-if="entryMode === 'mass'" id="bulkUnitsUpload" class="mt-3 rounded border border-gray-300 p-3">
        <label class="mb-2 block font-semibold" for="bulkUnitsFile">Archivo Excel</label>
        <input
          id="bulkUnitsFile"
          ref="fileInput"
          type="file"
          accept=".xlsx,.xls"
          class="block w-full rounded border border-gray-300 p-2"
          @change="handleBulkFileChange"
        />
        <p class="mt-1 text-sm text-gray-600">
          El archivo debe tener las columnas: Unidades, aaaa/mm/dd y area.
        </p>
        <p v-if="bulkFileFail" class="mt-2 text-sm text-red-600">{{ bulkFileFail }}</p>

        <div v-if="bulkRows.length" id="bulkUnitsPreview" class="mt-3">
          <div class="mb-2 rounded bg-blue-50 p-2 text-sm text-blue-900">
            Total unidades del mes: <strong>{{ formatWithThousandSeparator(String(bulkTotal)) }}</strong>
          </div>
          <p class="mb-1 text-xs text-gray-600">Mostrando {{ bulkRows.length }} registros.</p>
          <div class="h-48 max-h-[40vh] overflow-y-scroll overflow-x-auto overscroll-contain rounded border border-gray-300">
            <table class="w-full min-w-[460px] text-sm">
              <thead class="sticky top-0 z-10 bg-[#0b6fa9] text-white">
                <tr>
                  <th class="p-2 text-left">Fila</th>
                  <th class="p-2 text-left">Unidades</th>
                  <th class="p-2 text-left">Fecha</th>
                  <th class="p-2 text-left">Area</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in bulkRows" :key="row.rowNumber" class="border-t border-gray-300">
                  <td class="p-2">{{ row.rowNumber }}</td>
                  <td class="p-2">{{ formatWithThousandSeparator(String(row.unidades)) }}</td>
                  <td class="p-2">{{ row.date.replace(/-/g, "/") }}</td>
                  <td class="p-2">{{ row.area }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <button
        id="btnSaveUnitsMonthly"
        type="button"
        class="w-full rounded-3xl  font-manrope-b text-center bg-[#4789c8] text-white py-2 px-3  mt-3 disabled:cursor-not-allowed disabled:opacity-70"
        @click="submitUnitsMonthly"
        :disabled="isSaveDisabled"
      >
        {{ isSubmitting ? "Guardando..." : "Guardar" }}
      </button>
    </div>
  </fieldset>
  <Dialog
    v-model:visible="showReplaceDialog"
    modal
    :header="'Registro existente'"
    :style="{ width: '32rem' }"
  >
    <div class="space-y-4">
      <p>
        Ya existe un registro sobre esta fecha y area con
        <strong>{{ formatWithThousandSeparator(String(existingUnitsValue ?? 0)) }}</strong>
        unidades.
      </p>
      <p class="text-sm text-gray-700">
        Si editas el registro, se eliminará el ingreso mensual anterior y se guardará el ingreso masivo que acabas de cargar.
      </p>
      <div class="flex justify-end gap-2">
        <button
          type="button"
          class="rounded border border-gray-400 px-4 py-2 text-gray-700"
          @click="cancelReplace"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="rounded bg-[#4789c8] px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="isSubmitting"
          @click="confirmReplace"
        >
          {{ isSubmitting ? "Editando..." : "Editar Registro" }}
        </button>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import * as XLSX from "xlsx";
import type { Units } from "../../interfaces/objetives";
import { useUnitsApi } from "../../composables/objetivos/UnitsApi";
import type { OptionDropdown } from "../../interfaces/componentesDinamicos";

type EntryMode = "manual" | "mass" | null;

interface BulkUnitsRow {
  rowNumber: number;
  unidades: number;
  date: string;
  month: string;
  area: string;
}

interface BulkDailyUnitPayload {
  valor: number;
  fecha_programacion: string;
}

interface BulkUnitsPayload extends Units {
  unidades_diarias: BulkDailyUnitPayload[];
}

interface ExistingUnitsRecord {
  meta_unidades_id: number;
  valor: number;
}

const toast = useToast(); // Method for executing messages.
const { createMetaUnidades, createMetaUnidadesMasivo, replaceMetaUnidadesMasivo, getAreasImec } = useUnitsApi();

const areaChoose = ref();
const user = useCookie("usuario");
const userPermissions = useCookie("permissions");
const options = ref<OptionDropdown[]>([]);
const clientID = useCookie("idCliente");
const dateMonthly = ref<Date | null>(null);
const unitsMonthly = ref<string | null>(null);
const isSubmitting = ref(false);
const entryMode = ref<EntryMode>(null);
const entryModeFail = ref("");
const bulkFileFail = ref("");
const bulkRows = ref<BulkUnitsRow[]>([]);
const bulkTotal = ref(0);
const fileInput = ref<HTMLInputElement | null>(null);
const showReplaceDialog = ref(false);
const pendingBulkPayload = ref<BulkUnitsPayload | null>(null);
const existingUnitsRecord = ref<ExistingUnitsRecord | null>(null);

// Creating the month limits for the form. undefined = no restriction (e.g. DEVUSER)
const monthCurrent = ref<Date | undefined>(new Date());
const monthNext = ref<Date | undefined>(new Date());
const dateInfo = ref<string>("* Solo mes actual y el siguiente.");

// DEVUSER has no date restrictions; others are limited to current and next month.
const initMonthLimits = () => {
  if (user.value === "DEVUSER") {
    monthCurrent.value = undefined;
    monthNext.value = undefined;
    dateInfo.value = "";
  } else {
    const day = monthNext.value!.getDate();
    if (day === 29 || day === 30 || day === 31) {
      monthNext.value!.setDate(monthNext.value!.getDate() - 3);
    }
    monthNext.value!.setMonth(monthNext.value!.getMonth() + 1);
  }
};
initMonthLimits();

// We declare variables to store the errors of each field.
const dateMonthlyFail = ref();
const unitsMonthlyFail = ref();
const areaMonthlyFail = ref();

const selectedAreaName = computed(() => {
  const area = options.value.find((option) => option.value === areaChoose.value);
  return area?.label ?? "";
});

const isBulkValid = computed(() => entryMode.value === "mass" && bulkRows.value.length > 0 && !bulkFileFail.value);

const existingUnitsValue = computed(() => existingUnitsRecord.value?.valor ?? null);

const hasBulkUnitsPermission = computed(() => userPermissions.value?.includes("form_masive_unidades") ?? false);

const isSaveDisabled = computed(() => {
  if (isSubmitting.value || !entryMode.value || !dateMonthly.value || !areaChoose.value) return true;
  if (entryMode.value === "manual") return !unitsMonthly.value;
  return !isBulkValid.value;
});

const setEntryMode = (mode: EntryMode) => {
  if (mode === "mass" && !hasBulkUnitsPermission.value) {
    entryModeFail.value = "* No tiene permiso para ingreso masivo.";
    return;
  }

  entryMode.value = mode;
  entryModeFail.value = "";
  unitsMonthlyFail.value = "";
  unitsMonthly.value = null;
  clearBulkFile();
};

const buildBulkPayload = (objUnits: Units): BulkUnitsPayload => ({
  ...objUnits,
  unidades_diarias: bulkRows.value.map((row) => ({
    valor: row.unidades,
    fecha_programacion: row.date,
  })),
});

const resetForm = () => {
  unitsMonthly.value = null;
  areaChoose.value = null;
  entryMode.value = null;
  pendingBulkPayload.value = null;
  existingUnitsRecord.value = null;
  showReplaceDialog.value = false;
  clearBulkFile();
};

const getExistingUnitsRecord = (data: unknown): ExistingUnitsRecord | null => {
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  const metaUnidadesID = Number(record.meta_unidades_id ?? record.id);
  const valor = Number(record.valor ?? 0);

  if (!Number.isFinite(metaUnidadesID) || metaUnidadesID <= 0) return null;

  return {
    meta_unidades_id: metaUnidadesID,
    valor: Number.isFinite(valor) ? valor : 0,
  };
};

// Method to save units.
const submitUnitsMonthly = async () => {
  if (isSubmitting.value) return;

  // We reset the variables that save the errors.
  dateMonthlyFail.value = "";
  unitsMonthlyFail.value = "";
  areaMonthlyFail.value = "";
  entryModeFail.value = "";
  bulkFileFail.value = "";

  // We verify that the fields are filled out.
  if (!dateMonthly.value) dateMonthlyFail.value = "* La fecha es obligatoria.";
  if (!entryMode.value) entryModeFail.value = "* Seleccione un tipo de ingreso.";
  if (entryMode.value === "mass" && !hasBulkUnitsPermission.value)
    entryModeFail.value = "* No tiene permiso para ingreso masivo.";
  if (entryMode.value === "manual" && !unitsMonthly.value)
    unitsMonthlyFail.value = "* Este campo es obligatorio.";
  if (entryMode.value === "mass" && !isBulkValid.value)
    bulkFileFail.value = "* Debe cargar un archivo valido.";
  if (!areaChoose.value) areaMonthlyFail.value = "* Este campo es obligatorio";

  // We verify that there are no errors in the variables.
  if (!unitsMonthlyFail.value && !entryModeFail.value && !bulkFileFail.value) {
    if (!dateMonthlyFail.value) {
      if (!areaMonthlyFail.value) {
        const unitsValue = entryMode.value === "mass"
          ? bulkTotal.value
          : Number(unitsMonthly.value?.replace(/\./g, ""));

        const objUnits: Units = {
          valor: unitsValue,
          fecha_meta: dateMonthly.value,
          cliente_endpoint_id: Number(clientID.value),
          area_id: areaChoose.value,
          usuario: user.value,
          motivo_actualizacion: null,
        };

        isSubmitting.value = true;

        try {
          const bulkPayload = entryMode.value === "mass" ? buildBulkPayload(objUnits) : null;
          const result = bulkPayload
            ? await createMetaUnidadesMasivo(bulkPayload)
            : await createMetaUnidades(objUnits);

          const existingRecord = getExistingUnitsRecord(result.data);
          const isDuplicateBulkRecord = bulkPayload && !result.success && (result.status === 409 || result.title === "Unidades existentes.");

          if (isDuplicateBulkRecord && existingRecord) {
            pendingBulkPayload.value = bulkPayload;
            existingUnitsRecord.value = existingRecord;
            showReplaceDialog.value = true;
            return;
          }

          // Clears fields on successful save.
          if (result.success) resetForm();

          // Success or failure message depending on the 'success' variable of the 'createMetaUnidades' method.
          toast.add({
            severity: result.success ? "success" : "error",
            summary: result.title,
            detail: result.message,
            life: 5000,
          });
        } finally {
          isSubmitting.value = false;
        }
      }
    }
  }
};

// Method that brings the areas of the client entered for the list.
const listAreas = async () => {
  const result = await getAreasImec(clientID.value);

  if (result.success && result.data) {
    // The for loop works to create the 'OptionDropdown' array that the DropDownList component requires.
    for (const area of result.data) {
      const obj: OptionDropdown = {
        label: area.nombre_area,
        value: area.area_id,
      };
      options.value.push(obj);
    }
  } else {
    toast.add({
      severity: "error",
      summary: result.title,
      detail: result.message,
      life: 5000,
    });
  }
};

const cancelReplace = () => {
  showReplaceDialog.value = false;
  pendingBulkPayload.value = null;
  existingUnitsRecord.value = null;
};

const confirmReplace = async () => {
  if (isSubmitting.value || !pendingBulkPayload.value || !existingUnitsRecord.value) return;

  isSubmitting.value = true;

  try {
    const result = await replaceMetaUnidadesMasivo({
      ...pendingBulkPayload.value,
      meta_unidades_id: existingUnitsRecord.value.meta_unidades_id,
    });

    if (result.success) resetForm();

    toast.add({
      severity: result.success ? "success" : "error",
      summary: result.title,
      detail: result.message,
      life: 5000,
    });
  } finally {
    isSubmitting.value = false;
  }
};
listAreas(); // We run it as soon as it starts

const clearBulkFile = () => {
  bulkRows.value = [];
  bulkTotal.value = 0;
  bulkFileFail.value = "";
  pendingBulkPayload.value = null;
  existingUnitsRecord.value = null;
  showReplaceDialog.value = false;
  if (fileInput.value) fileInput.value.value = "";
};

const normalizeText = (value: unknown) => String(value ?? "").trim().replace(/\s+/g, " ").toUpperCase();

const getSelectedMonth = () => {
  if (!dateMonthly.value) return "";
  const month = String(dateMonthly.value.getMonth() + 1).padStart(2, "0");
  return `${dateMonthly.value.getFullYear()}-${month}`;
};

const getRowMonth = (value: unknown) => {
  return getRowDate(value).slice(0, 7);
};

const getRowDate = (value: unknown) => {
  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
  };

  const buildValidDate = (year: number, month: number, day: number) => {
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return "";
    return formatDate(date);
  };

  if (value instanceof Date && !Number.isNaN(value.getTime())) return formatDate(value);

  if (typeof value === "number") {
    const parsedDate = XLSX.SSF.parse_date_code(value);
    if (parsedDate) {
      const month = String(parsedDate.m).padStart(2, "0");
      const day = String(parsedDate.d).padStart(2, "0");
      return `${parsedDate.y}-${month}-${day}`;
    }
  }

  const text = String(value ?? "").trim();
  const match = text.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (!match) return "";

  return buildValidDate(Number(match[1]), Number(match[2]), Number(match[3]));
};

const handleBulkFileChange = async (event: Event) => {
  bulkRows.value = [];
  bulkTotal.value = 0;
  bulkFileFail.value = "";

  const input = event.target as HTMLInputElement;

  if (!hasBulkUnitsPermission.value) {
    bulkFileFail.value = "* No tiene permiso para cargar archivos masivos.";
    input.value = "";
    return;
  }

  const file = input.files?.[0];
  if (!file) return;

  if (!dateMonthly.value) {
    bulkFileFail.value = "* Seleccione la fecha antes de cargar el archivo.";
    input.value = "";
    return;
  }

  if (!areaChoose.value) {
    bulkFileFail.value = "* Seleccione el area antes de cargar el archivo.";
    input.value = "";
    return;
  }

  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array", cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

    if (!rows.length) {
      bulkFileFail.value = "* El archivo no tiene registros.";
      input.value = "";
      return;
    }

    const requiredHeaders = ["Unidades", "aaaa/mm/dd", "area"];
    const headers = Object.keys(rows[0]);
    const missingHeader = requiredHeaders.find((header) => !headers.includes(header));
    if (missingHeader) {
      bulkFileFail.value = `* Falta la columna ${missingHeader}.`;
      input.value = "";
      return;
    }

    const selectedMonth = getSelectedMonth();
    const areaName = normalizeText(selectedAreaName.value);
    const parsedRows: BulkUnitsRow[] = [];
    let total = 0;

    for (const [index, row] of rows.entries()) {
      const rowNumber = index + 2;
      const rawUnits = String(row.Unidades ?? "").trim();
      const units = Number(rawUnits.replace(/\./g, "").replace(/,/g, "."));
      const rowDate = getRowDate(row["aaaa/mm/dd"]);
      const rowMonth = rowDate.slice(0, 7);
      const rowArea = normalizeText(row.area);

      if (!rowDate) {
        bulkFileFail.value = `* La fila ${rowNumber} tiene una fecha invalida.`;
        input.value = "";
        return;
      }

      if (!rawUnits || !Number.isFinite(units) || units < 0) {
        bulkFileFail.value = `* La fila ${rowNumber} tiene unidades invalidas.`;
        input.value = "";
        return;
      }

      if (rowMonth !== selectedMonth) {
        bulkFileFail.value = `* La fila ${rowNumber} no pertenece al mes seleccionado.`;
        input.value = "";
        return;
      }

      if (rowArea !== areaName) {
        bulkFileFail.value = `* La fila ${rowNumber} tiene un area distinta a la seleccionada.`;
        input.value = "";
        return;
      }

      parsedRows.push({
        rowNumber,
        unidades: units,
        date: rowDate,
        month: rowMonth,
        area: String(row.area ?? "").trim(),
      });
      total += units;
    }

    bulkRows.value = parsedRows;
    bulkTotal.value = total;
  } catch (error) {
    console.error("Error al leer el archivo de unidades masivas: ", error);
    bulkFileFail.value = "* No fue posible leer el archivo. Verifique que sea un Excel valido.";
    input.value = "";
  }
};

// Method that adds the thousand format to a string of numbers.
function formatWithThousandSeparator(value: string | null): string {
  if (value) {
    const numeric = value.replace(/\./g, "").replace(/\D/g, "");
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return "";
}

// The watch method ensures that when writing the number it will be in the thousand format.
watch(unitsMonthly, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    unitsMonthly.value = formatWithThousandSeparator(unitsMonthly.value);
  }
});

watch([dateMonthly, areaChoose], () => {
  if (entryMode.value === "mass") clearBulkFile();
});
</script>
