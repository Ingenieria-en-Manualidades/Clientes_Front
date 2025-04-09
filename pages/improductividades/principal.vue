<template>
  <div class="w-full md:w-[97%]">
    <title>Improductividades</title>
    <RemisionesTabPanelRemisiones :items="items" />
    <DinamicosTableFilters
      :headers="headers"
      :atributes="atributos"
      :data="data"
      :loading="isLoading"
      :warningData="warningData"
      :errorData="errorData"
      :height="'350px'"
      :positionFilters="'onTable'"
      @setCleanExternalFilters="dates = null"
    >
      <template #newFilter>
        <div class="inline-flex w-full items-baseline">
          <div class="w-1/3">
            <div>
              <label for="op">Filtrar por operación</label>
            </div>
            <div>
              <input
                type="text"
                id="op"
                v-model="op"
                class="border-[1px] border-black outline-none p-1 text-sm rounded lg:w-[75%]"
              />
            </div>
          </div>
          <div class="w-1/3">
            <div>
              <label for="ref">Filtrar por referencía</label>
            </div>
            <div>
              <input
                type="text"
                id="ref"
                v-model="reference"
                class="border-[1px] border-black outline-none p-1 text-sm rounded lg:w-[75%]"
              />
            </div>
          </div>
          <div class="w-1/3">
            <p class="text-xs text-red-500">
              * Elige entre una fecha o un rango de fechas
            </p>
            <Calendar
              v-model="dates"
              selectionMode="range"
              :manualInput="false"
              dateFormat="yy/mm/dd"
              showIcon
              fluid
              class="h-8"
              inputClass="w-full"
              iconDisplay="input"
            />
          </div>
        </div>
      </template>
      <template #newColumn>
        <th class="bg-azulIENM text-white py-3 px-5">ACCIONES</th>
      </template>
      <template #newCell="{ object }">
        <td>
          <ImproductividadesModalGestionar
            :idImproductividad="object.improductividad_id"
            :actividad="object.actividad"
            :descripcion="object.descripcion"
            @postGuardar="listar"
          />
        </td>
      </template>
    </DinamicosTableFilters>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import type { WarningTable } from "../../interfaces/filters";
import type { Improductividad } from "../../interfaces/improductividades";
import { useImproductividadesAPI } from "../../composables/improductividades/improductividadesAPI";
import {
  items,
  headers,
  atributos,
  useDatosImproductividades,
} from "../../composables/improductividades/datosImproductividades";

const dates = ref();
const op = ref();
const reference = ref();
const toast = useToast();
const isLoading = ref<boolean>();
const errorData = ref<boolean>(false);
const warningData = ref<WarningTable>({
  success: false,
  label: "",
});
const idCliente = useCookie("idCliente");
const data = ref<Improductividad[]>([]);
const dataReemplace = ref<Improductividad[]>([]);
const { getLineas, getTurnos, setConsultar } = useDatosImproductividades();
const { listarImproductividades } = useImproductividadesAPI();

const listar = async () => {
  isLoading.value = true;
  const response = await listarImproductividades(idCliente.value);

  if (response.success && response.data) {
    const dataFilter = response.data.filter((imp) => imp.estado === null);

    if (dataFilter.length === 0) {
      warningData.value.success = true;
      warningData.value.label = "Sin improductividades pendientes";
    } else {
      data.value = dataFilter;
      dataReemplace.value = dataFilter;
      headers.value[9].options = {
        atribute: "dispositivo",
        labels: getLineas(dataFilter),
      };
      headers.value[10].options = {
        atribute: "turno",
        labels: getTurnos(dataFilter),
      };
    }
  } else {
    errorData.value = true;
    toast.add({
      severity: "error",
      summary: "Por favor verificar error.",
      detail: response.error,
      life: 3000,
    });
  }
  isLoading.value = false;
};

listar();

watch(dates, async (newVal: Date[]) => {
  data.value = dataReemplace.value;
  if (dates.value) {
    data.value = await setConsultar(data.value, newVal);
  }
});
</script>
