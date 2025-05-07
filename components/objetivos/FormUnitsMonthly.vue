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

const toast = useToast(); // Method for executing messages.
const { createMetaUnidades, getAreasImec } = useUnitsApi();

const areaChoose = ref();
const user = useCookie("usuario");
const options = ref<OptionDropdown[]>([]);
const clientID = useCookie("idCliente");
const dateMonthly = ref<Date | null>(null);
const unitsMonthly = ref<string | null>(null);

// Creating the month limits for the form.
const monthCurrent = ref<Date>(new Date());
const monthNext = ref<Date>(new Date());

// The maximum month can only be the month following today's, this method ensures this.
const fixMonth = () => {
  const day = monthNext.value.getDate();
  if (day === 29 || day === 30 || day === 31) {
    monthNext.value.setDate(monthNext.value.getDate() - 3);
  }
  monthNext.value.setMonth(monthNext.value.getMonth() + 1);
};
fixMonth();

// We declare variables to store the errors of each field.
const dateMonthlyFail = ref();
const unitsMonthlyFail = ref();
const areaMonthlyFail = ref();

// Method to save units.
const submitUnitsMonthly = async () => {
  // We reset the variables that save the errors.
  dateMonthlyFail.value = "";
  unitsMonthlyFail.value = "";
  areaMonthlyFail.value = "";

  // We verify that the fields are filled out.
  if (!dateMonthly.value) dateMonthlyFail.value = "* La fecha es obligatoria.";
  if (!unitsMonthly.value)
    unitsMonthlyFail.value = "* Este campo es obligatorio.";
  if (!areaChoose.value) areaMonthlyFail.value = "* Este campo es obligatorio";

  // We verify that there are no errors in the variables.
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

        // Clears fields on successful save.
        if (result.success) {
          unitsMonthly.value = null;
          areaChoose.value = null;
        }

        // Success or failure message depending on the 'success' variable of the 'createMetaUnidades' method.
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
listAreas(); // We run it as soon as it starts

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
</script>
