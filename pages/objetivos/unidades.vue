<template>
  <div class="font-manrope-r px-1 py-3">
    <title>Unidades programadas</title>
    <form class="flex gap-2">
      <fieldset class="w-full border border-black py-3 px-5 rounded">
        <legend class="px-1">Mensuales</legend>
        <DinamicosInputCalendar
          v-model="dateMonthly"
          :label="'Elegir fecha'"
          :displayFlex="false"
          :dateFormat="'yy/mm'"
          :view="'month'"
          :disabled="true"
        />
        <DinamicosInputText
          v-model="unitsMonthly"
          :label="'Unidades'"
          :displayFlex="false"
          :warning="unitsMonthlyFail"
        />
        <button
          type="button"
          class="w-full font-manrope-b text-center bg-[#c86a2b] text-white py-2 px-3 rounded mt-3"
          @click="submitUnitsMonthly"
        >
          Guardar
        </button>
      </fieldset>
      <fieldset class="w-full border border-black py-3 px-5 rounded">
        <legend class="px-1">Diarias</legend>
        <DinamicosInputCalendar
          v-model="date"
          :label="'Fecha de programación'"
          :displayFlex="false"
          :dateFormat="'yy/mm/dd'"
          :disabled="false"
        />
        <DinamicosInputText
          v-model="units"
          :label="'Unidades'"
          :displayFlex="false"
        />
        <button
          type="button"
          class="w-full font-manrope-b text-center bg-[#4789c8] text-white py-2 px-3 rounded mt-3"
          @click="submitUnits"
        >
          Guardar
        </button>
      </fieldset>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import type { Units } from "../../interfaces/objetives";
import { useUnitsApi } from "../../composables/objetivos/UnitsApi";

const toast = useToast();
const { createMetaUnidades } = useUnitsApi();

const user = useCookie("usuario");
const date = ref<Date | null>(null);
const units = ref<string | null>(null);
const clientID = useCookie("idCliente");
const dateMonthly = ref<Date>(new Date());
const unitsMonthly = ref<string | null>(null);

const unitsMonthlyFail = ref();
const failedFields = ref({
  dateFail: "",
  unitsFail: "",
});

const submitUnitsMonthly = async () => {
  unitsMonthlyFail.value = "";

  if (unitsMonthly.value) {
    if (!/[0-9]/.test(unitsMonthly.value))
      unitsMonthlyFail.value = "* Solo se puede ingresar números.";
    if (Number(unitsMonthly.value) < 1)
      unitsMonthlyFail.value = "* No se permiten números menores a 1.";
  } else {
    unitsMonthlyFail.value = "* Este campo es obligatorio.";
  }

  if (!unitsMonthlyFail.value) {
    const objUnits: Units = {
      valor: Number(unitsMonthly.value),
      fecha_meta: dateMonthly.value,
      cliente_endpoint_id: Number(clientID.value),
      usuario: user.value,
    };

    const resultado = await createMetaUnidades(objUnits);

    toast.add({
      severity: resultado.success ? "contrast" : "error",
      summary: resultado.title,
      detail: resultado.message,
      life: 5000,
    });
  }
};

const submitUnits = async () => {
  failedFields.value.dateFail = "";
  failedFields.value.unitsFail = "";

  if (date.value) failedFields.value.dateFail = "La fecha es obligatoria.";
  if (units.value) failedFields.value.unitsFail = "Este campo es obligatorio.";

  const errors = verifyFields(failedFields.value);
  console.log("errors: ", errors);
};

const verifyFields = (obj: any) => {
  const errors = Object.values(obj).reduce((acc, el) => {
    el ? acc.push(false) : acc.push(true);
    return acc;
  }, []);
  return errors;
};
</script>
