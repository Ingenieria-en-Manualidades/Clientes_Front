<template>
  <button
    type="button"
    class="bg-azulClaroIENM px-3 py-[3px] rounded hover:bg-azulIENM my-1"
    @click="list"
  >
    <i class="pi pi-box text-white"></i>
  </button>
  <div class="font-manrope-r">
    <Dialog
      v-model:visible="visible"
      modal
      :header="''"
      :style="{ width: '80%' }"
    >
      <div class="border border-black rounded px-5 py-3 mt-2">
        <DinamicosTableFilters
          :headers="headersUnitsDaily"
          :atributes="attributesUnitsDaily"
          :data="data"
          :loading="isLoading"
          :warningData="warningData"
          :errorData="errorData"
          :height="'200px'"
          :positionFilters="'onTable'"
        >
          <template #newColumn>
            <th class="bg-azulIENM text-white py-3 px-5">ACCIONES</th>
          </template>
          <template #newCell="{ object }">
            <td>
              <ObjetivosModalUpdateUnitsDaily
                :fecha="object.fecha_programacion"
                :valor="object.valor"
                :unidadesDiariasID="object.unidades_diarias_id"
                @listTable="list"
              />
            </td>
          </template>
        </DinamicosTableFilters>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import type { WarningTable } from "../../interfaces/filters";
import { useUnitsDailyApi } from "../../composables/objetivos/UnitsDailyApi";
import {
  headersUnitsDaily,
  attributesUnitsDaily,
} from "../../composables/objetivos/UnitsData";

const toast = useToast();
const data = ref<any[]>([]);
const visible = ref<boolean>(false);
const props = defineProps({
  metaUnidadesID: {
    type: String,
    required: true,
  },
});

const isLoading = ref<boolean>();
const errorData = ref<boolean>(false);
const warningData = ref<WarningTable>({
  success: false,
  label: "",
});

const { listUnidadesDiarias } = useUnitsDailyApi();

const list = async () => {
  visible.value = true;
  isLoading.value = true;
  const resp = await listUnidadesDiarias(props.metaUnidadesID);

  if (resp.success) {
    data.value = resp.data;

    if (data.value.length === 0) {
      warningData.value.success = true;
      warningData.value.label =
        "Esta meta no tiene unidades diarias registradas.";
    } else {
      for (const unit of data.value) {
        const date = new Date(unit.updated_at);
        if (date.getMonth() > -1 && date.getMonth() < 9) {
          if (date.getDate() < 10) {
            unit.updated_at = `${date.getFullYear()}-0${
              date.getMonth() + 1
            }-0${date.getDate()}`;
          } else {
            unit.updated_at = `${date.getFullYear()}-0${
              date.getMonth() + 1
            }-${date.getDate()}`;
          }
        } else {
          if (date.getDate() < 10) {
            unit.updated_at = `${date.getFullYear()}-${
              date.getMonth() + 1
            }-0${date.getDate()}`;
          } else {
            unit.updated_at = `${date.getFullYear()}-0${
              date.getMonth() + 1
            }-${date.getDate()}`;
          }
        }
        unit.valor = formatoNumero(unit.valor);
      }
    }
  } else {
    errorData.value = true;
    toast.add({
      severity: "error",
      summary: resp.title,
      detail: resp.message,
      life: 5000,
    });
  }
  isLoading.value = false;
};

const formatoNumero = (numero: number): string => {
  return new Intl.NumberFormat("es-ES").format(numero);
};
</script>
