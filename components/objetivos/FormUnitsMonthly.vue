<template>
  <fieldset class="w-full border border-black py-3 px-5 rounded">
    <legend class="px-1">Mensuales</legend>
    <DinamicosInputCalendar
      v-model="dateMonthly"
      :label="'Elegir fecha'"
      :displayFlex="false"
      :dateFormat="'yy/mm'"
      :view="'month'"
      :info="'* Solo mes actual y el siguiente.'"
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
    <DinamicosInputNumber
      v-model="unitsMonthly"
      :label="'Unidades'"
      :displayFlex="false"
      :warning="unitsMonthlyFail"
    />
    <button
      type="button"
      class="w-full font-manrope-b text-center bg-[#4789c8] text-white py-2 px-3 rounded mt-3"
      @click="submitUnitsMonthly"
    >
      Guardar
    </button>
  </fieldset>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import type { Units } from "../../interfaces/objetives";
import { useUnitsApi } from "../../composables/objetivos/UnitsApi";
import type { OptionDropdown } from "../../interfaces/componentesDinamicos";

const toast = useToast();
const { createMetaUnidades, getAreasImec } = useUnitsApi();

const areaChoose = ref();
const user = useCookie("usuario");
const options = ref<OptionDropdown[]>([]);
const clientID = useCookie("idCliente");
const dateMonthly = ref<Date | null>(null);
const unitsMonthly = ref<string | null>(null);
const monthCurrent = ref<Date>(new Date());
const monthNext = ref<Date>(new Date());

const fixMonth = () => {
  const day = monthNext.value.getDate();
  if (day === 29 || day === 30 || day === 31) {
    monthNext.value.setDate(monthNext.value.getDate() - 3);
  }
  monthNext.value.setMonth(monthNext.value.getMonth() + 1);
};
fixMonth();

const dateMonthlyFail = ref();
const unitsMonthlyFail = ref();
const areaMonthlyFail = ref();

const submitUnitsMonthly = async () => {
  dateMonthlyFail.value = "";
  unitsMonthlyFail.value = "";
  areaMonthlyFail.value = "";

  if (!dateMonthly.value) dateMonthlyFail.value = "* La fecha es obligatoria.";
  if (!unitsMonthly.value)
    unitsMonthlyFail.value = "* Este campo es obligatorio.";
  if (!areaChoose.value) areaMonthlyFail.value = "* Este campo es obligatorio";

  if (!unitsMonthlyFail.value) {
    if (!dateMonthlyFail.value) {
      if (!areaMonthlyFail.value) {
        const objUnits: Units = {
          valor: Number(unitsMonthly.value?.replace(".", "")),
          fecha_meta: dateMonthly.value,
          cliente_endpoint_id: Number(clientID.value),
          area_id: areaChoose.value,
          usuario: user.value,
        };

        const result = await createMetaUnidades(objUnits);

        if (result.success) {
          unitsMonthly.value = null;
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
  }
};

const listAreas = async () => {
  const result = await getAreasImec(clientID.value);

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

function formatWithThousandSeparator(value: string | null): string {
  if (value) {
    const numeric = value.replace(/\./g, "").replace(/\D/g, "");
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return "";
}

watch(unitsMonthly, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    unitsMonthly.value = formatWithThousandSeparator(unitsMonthly.value);
  }
});
</script>
