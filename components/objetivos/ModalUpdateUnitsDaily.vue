<template>
  <button
    type="button"
    class="bg-rojoIENM px-3 py-[3px] rounded hover:bg-verdeIENM my-1"
    @click="list"
    v-show="visibleButton"
  >
    <i class="pi pi-pencil text-white"></i>
  </button>
  <div class="font-manrope-r">
    <Dialog
      v-model:visible="visible"
      modal
      :header="'Actualizar unidades'"
      :style="{ width: '25%' }"
    >
      <div class="border border-black rounded px-5 py-3">
        <form class="w-full">
          <DinamicosInputText
            v-model="date"
            :label="'Fecha'"
            :displayFlex="false"
            :disabled="true"
          />
          <DinamicosInputNumber
            v-model="units"
            :label="'Unidades'"
            :displayFlex="false"
            :warning="unitsFail"
          />
          <button
            type="button"
            class="w-full font-manrope-b text-center bg-[#c86a2b] text-white py-2 px-3 rounded mt-3"
            @click="update"
          >
            Actualizar
          </button>
        </form>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import type { UnitsDaily } from "../../interfaces/objetives";
import { useUnitsDailyApi } from "../../composables/objetivos/UnitsDailyApi";

const toast = useToast();
const user = useCookie("usuario");
const visible = ref<boolean>(false);
const { getUnidadesDiariasID, updateUnidadesDiarias } = useUnitsDailyApi();

const emits = defineEmits(["listTable"]);
const props = defineProps({
  unidadesDiariasID: {
    type: String,
    required: true,
  },
  visibleButton: {
    type: Boolean,
    required: true,
  },
});

const date = ref<String | null>(null);
const units = ref<string | null>(null);
const unitsFail = ref<String | null>(null);

const list = async () => {
  visible.value = true;
  const resp = await getUnidadesDiariasID(props.unidadesDiariasID);

  if (resp.success) {
    date.value = resp.data.fecha_programacion;
    units.value = formatoNumero(resp.data.valor);
  } else {
    toast.add({
      severity: "error",
      summary: resp.title,
      detail: resp.message,
      life: 5000,
    });
  }
};

const update = async () => {
  unitsFail.value = "";
  if (!units.value) unitsFail.value = "* Este campo es obligatorio.";

  if (!unitsFail.value) {
    const objUnits: UnitsDaily = {
      valor: Number(units.value?.replace(".", "")),
      fecha_programacion: null,
      cliente_endpoint_id: null,
      usuario: user.value,
    };
    const resp = await updateUnidadesDiarias(
      objUnits,
      String(props.unidadesDiariasID)
    );

    if (resp.success) {
      units.value = "";
      toast.add({
        severity: "success",
        summary: resp.title,
        detail: resp.message,
        life: 5000,
      });
      visible.value = false;
      emits("listTable");
    } else {
      toast.add({
        severity: "error",
        summary: resp.title,
        detail: resp.message,
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

const formatoNumero = (numero: number): string => {
  return new Intl.NumberFormat("es-ES").format(numero);
};

watch(units, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    units.value = formatWithThousandSeparator(units.value);
  }
});
</script>
