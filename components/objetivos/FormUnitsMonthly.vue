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

const toast = useToast();
const { createMetaUnidades, getAreasImec } = useUnitsApi();

const user = useCookie("usuario");
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

const emits = defineEmits(["list"]);

const submitUnitsMonthly = async () => {
  dateMonthlyFail.value = "";
  unitsMonthlyFail.value = "";

  if (!dateMonthly.value) dateMonthlyFail.value = "* La fecha es obligatoria.";
  if (!unitsMonthly.value)
    unitsMonthlyFail.value = "* Este campo es obligatorio.";

  if (!unitsMonthlyFail.value) {
    if (!dateMonthlyFail.value) {
      const objUnits: Units = {
        valor: Number(unitsMonthly.value?.replace(".", "")),
        fecha_meta: dateMonthly.value,
        cliente_endpoint_id: Number(clientID.value),
        usuario: user.value,
      };
      // const result = await getAreasImec(clientID.value);
      // console.log("result areas: ", result);

      const result = await createMetaUnidades(objUnits);

      if (result.success) {
        unitsMonthly.value = null;
        emits("list");
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
