<template>
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
const clientID = useCookie("idCliente");
const dateMonthly = ref<Date>(new Date());
const unitsMonthly = ref<string | null>(null);

const unitsMonthlyFail = ref();

const emits = defineEmits(["list"]);

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
};
</script>
