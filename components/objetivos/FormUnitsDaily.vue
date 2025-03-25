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
    <DinamicosInputText
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
import { ref } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import type { UnitsDaily } from "../../interfaces/objetives";
import { useUnitsApi } from "../../composables/objetivos/UnitsApi";

const toast = useToast(); // Method for executing messages
const { createUnidadesDiarias } = useUnitsApi();

const user = useCookie("usuario");
const date = ref<Date | null>(null);
const units = ref<string | null>(null);
const clienteID = useCookie("idCliente");

const today = ref<Date>(new Date());
const tomorrow = ref<Date>(new Date());
tomorrow.value.setDate(tomorrow.value.getDate() + 1);

const failedFields = ref({
  dateFail: "",
  unitsFail: "",
});

const submitUnits = async () => {
  failedFields.value.dateFail = "";
  failedFields.value.unitsFail = "";

  if (!date.value) failedFields.value.dateFail = "* La fecha es obligatoria.";
  if (!units.value)
    failedFields.value.unitsFail = "* Este campo es obligatorio.";

  const errors = verifyFields(failedFields.value);

  if (!errors.includes(true)) {
    if (!/[0-9]/.test(units.value))
      failedFields.value.unitsFail = "* Solo se puede ingresar números.";
    if (units.value < 1)
      failedFields.value.unitsFail = "* No se permiten números menores a 1.";

    if (!failedFields.value.unitsFail) {
      const objUnitsD: UnitsDaily = {
        valor: Number(units.value),
        fecha_programacion: date.value,
        cliente_endpoint_id: Number(clienteID.value),
        usuario: user.value,
      };

      const result = await createUnidadesDiarias(objUnitsD);

      if (result.success) {
        units.value = null;
        date.value = null;
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

const verifyFields = (obj: any): Boolean[] => {
  const values: String[] = Object.values(obj);
  const errors = values.reduce((acc, el) => {
    el ? acc.push(true) : acc.push(false);
    return acc;
  }, []);
  return errors;
};
</script>
