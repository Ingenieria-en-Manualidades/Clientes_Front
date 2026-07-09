<template>
  <fieldset id="formUnitsDaily" class="w-full border border-black py-3 px-5 rounded">
    <legend class="px-1">Diarias</legend>
    <DinamicosInputCalendar
      v-model="date"
      :label="'Fecha de programación'"
      :displayFlex="false"
      :dateFormat="'yy/mm/dd'"
      :disabled="false"
      :info="warnDate"
      :warning="failedFields.dateFail"
      :minDate="daysBefore"
      :maxDate="tomorrow"
    />
    <div id="groupUnitsDaily">
      <DinamicosDropDownList
        :label="'Areas'"
        :displayFlex="false"
        :options="options"
        v-model="areaChoose"
        :warning="failedFields.areasFail"
      />
      <DinamicosInputNumber
        v-model="units"
        :label="'Unidades'"
        :displayFlex="false"
        :warning="failedFields.unitsFail"
      />
      <button
        type="button"
        class="w-full font-manrope-b text-center bg-[#4789c8] text-white py-2 px-3 rounded-3xl mt-3 disabled:cursor-not-allowed disabled:opacity-70"
        @click="submitUnits"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? "Guardando..." : "Guardar" }}
      </button>
    </div>
  </fieldset>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import type { UnitsDaily } from "../../interfaces/objetives";
import { useUnitsApi } from "../../composables/objetivos/UnitsApi";
import type { OptionDropdown } from "../../interfaces/componentesDinamicos";
import { useUnitsDailyApi } from "../../composables/objetivos/UnitsDailyApi";

const toast = useToast(); // Method for executing messages.
const { createUnidadesDiarias } = useUnitsDailyApi();

const areaChoose = ref();
const user = useCookie("usuario");
const date = ref<Date | null>(null);
const units = ref<string | null>(null);
const clienteID = useCookie("idCliente");
const options = ref<OptionDropdown[]>([]);
const { getAreasImec } = useUnitsApi();
const userPermissions = useCookie("permissions");
const isSubmitting = ref(false);

// Minimum date to enter the form.
const daysBefore = ref<Date | undefined>(new Date());
// Maximum date to enter the form.
const tomorrow = ref<Date | undefined>(new Date());
const warnDate = ref<string>('');

const checkPermission = () => {
  const isDevUser = user.value === "DEVUSER";
  const hasInsertAllPermission = userPermissions.value?.includes("insert_all_daily units");
  if (isDevUser || hasInsertAllPermission) {
    daysBefore.value = undefined;
    tomorrow.value = undefined;
  } else {
    if (daysBefore.value !== undefined && tomorrow.value !== undefined) {
      daysBefore.value.setDate(daysBefore.value.getDate() - 3);
      tomorrow.value.setDate(tomorrow.value.getDate() + 1);
      warnDate.value = '* Solo 3 días anteriores hasta mañana.';
    }
  }
};
checkPermission();

// We declare variables to store the errors of each field.
const failedFields = ref({
  dateFail: "",
  unitsFail: "",
  areasFail: "",
});

// Method to save units.
const submitUnits = async () => {
  if (isSubmitting.value) return;

  // We reset the variables that save the errors.
  failedFields.value.dateFail = "";
  failedFields.value.unitsFail = "";
  failedFields.value.areasFail = "";

  // We verify that the fields are filled out.
  if (!date.value) failedFields.value.dateFail = "* La fecha es obligatoria.";
  if (!units.value)
    failedFields.value.unitsFail = "* Este campo es obligatorio.";
  if (units.value) {
    const parsedUnits = parseUnitsValue(units.value);
    if (parsedUnits < 0 || parsedUnits > 100000000) {
      failedFields.value.unitsFail = "* Las unidades deben estar entre 0 y 100.000.000.";
    }
  }
  if (!areaChoose.value)
    failedFields.value.areasFail = "* Este campo es obligatorio.";

  const errors = verifyFields(failedFields.value);

  if (!errors.includes(true)) {
    if (!failedFields.value.unitsFail) {
      const objUnitsD: UnitsDaily = {
        valor: parseUnitsValue(units.value),
        fecha_programacion: date.value,
        cliente_endpoint_id: Number(clienteID.value),
        area_id: areaChoose.value,
        usuario: user.value,
      };

      isSubmitting.value = true;

      try {
        const result = await createUnidadesDiarias(objUnitsD);

        // Clears fields on successful save.
        if (result.success) {
          units.value = null;
          date.value = null;
          areaChoose.value = null;
        }

        // Success or failure message depending on the 'success' variable of the 'createUnidadesDiarias' method.
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
};

// Method that brings the areas of the client entered for the list.
const listAreas = async () => {
  const result = await getAreasImec(clienteID.value);

  if (result.success && result.data) {
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
listAreas();

const verifyFields = (obj: any): Boolean[] => {
  const values: String[] = Object.values(obj);
  const errors = values.reduce((acc, el) => {
    el ? acc.push(true) : acc.push(false);
    return acc;
  }, []);
  return errors;
};

function formatWithThousandSeparator(value: string | null): string {
  if (value) {
    const rawValue = value.replace(/\./g, "");
    const isNegative = rawValue.trim().startsWith("-");
    const numeric = rawValue.replace(/\D/g, "");
    const formatted = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return isNegative && numeric ? `-${formatted}` : formatted;
  }
  return "";
}

function parseUnitsValue(value: string | null): number {
  return Number(value?.replace(/\./g, "") ?? 0);
}

watch(units, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    units.value = formatWithThousandSeparator(units.value);
    if (!units.value) {
      failedFields.value.unitsFail = "";
      return;
    }
    const parsedUnits = parseUnitsValue(units.value);
    failedFields.value.unitsFail =
      parsedUnits < 0 || parsedUnits > 100000000 ? "* Las unidades deben estar entre 0 y 100.000.000." : "";
  }
});
</script>
