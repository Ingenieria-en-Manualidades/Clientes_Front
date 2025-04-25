<template>
  <fieldset class="w-full border border-black py-3 px-5 rounded">
    <legend class="px-1">Diarias</legend>
    <DinamicosInputCalendar
      v-model="date"
      :label="'Fecha de programación'"
      :displayFlex="false"
      :dateFormat="'yy/mm/dd'"
      :disabled="false"
      :info="'* Solo día actual y mañana.'"
      :warning="failedFields.dateFail"
      :minDate="today"
      :maxDate="tomorrow"
    />
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
      class="w-full font-manrope-b text-center bg-[#4789c8] text-white py-2 px-3 rounded mt-3"
      @click="submitUnits"
    >
      Guardar
    </button>
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

const toast = useToast(); // Method for executing messages
const { createUnidadesDiarias } = useUnitsDailyApi();

const areaChoose = ref();
const user = useCookie("usuario");
const date = ref<Date | null>(null);
const units = ref<string | null>(null);
const clienteID = useCookie("idCliente");
const options = ref<OptionDropdown[]>([]);
const { getAreasImec } = useUnitsApi();

const today = ref<Date>(new Date());
const tomorrow = ref<Date>(new Date());
tomorrow.value.setDate(tomorrow.value.getDate() + 1);

const failedFields = ref({
  dateFail: "",
  unitsFail: "",
  areasFail: "",
});

const submitUnits = async () => {
  failedFields.value.dateFail = "";
  failedFields.value.unitsFail = "";
  failedFields.value.areasFail = "";

  if (!date.value) failedFields.value.dateFail = "* La fecha es obligatoria.";
  if (!units.value)
    failedFields.value.unitsFail = "* Este campo es obligatorio.";
  if (!areaChoose.value)
    failedFields.value.areasFail = "* Este campo es obligatorio.";

  const errors = verifyFields(failedFields.value);

  if (!errors.includes(true)) {
    if (!failedFields.value.unitsFail) {
      const objUnitsD: UnitsDaily = {
        valor: Number(units.value?.replace(".", "")),
        fecha_programacion: date.value,
        cliente_endpoint_id: Number(clienteID.value),
        area_id: areaChoose.value,
        usuario: user.value,
      };

      const result = await createUnidadesDiarias(objUnitsD);

      if (result.success) {
        units.value = null;
        date.value = null;
        areaChoose.value = null;
      }

      toast.add({
        severity: result.success ? "success" : "error",
        summary: result.title,
        detail: result.message,
        life: 5000,
      });
    }
  }
};

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
    const numeric = value.replace(/\./g, "").replace(/\D/g, "");
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return "";
}

watch(units, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    units.value = formatWithThousandSeparator(units.value);
  }
});
</script>
