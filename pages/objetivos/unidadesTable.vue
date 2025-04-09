<template>
  <div class="w-full md:w-[70%] p-1">
    <title>Ver unidades</title>
    <RemisionesTabPanelRemisiones :items="items" />
    <DinamicosTableFilters
      :headers="headers"
      :atributes="attributes"
      :data="data"
      :loading="isLoading"
      :warningData="warningData"
      :errorData="errorData"
      :height="'250px'"
      :positionFilters="'onTable'"
    >
      <template #newColumn>
        <th class="bg-azulIENM text-white py-3 px-5" colspan="2">ACCIONES</th>
      </template>
      <template #newCell="{ object }">
        <td>
          <ObjetivosModalUnitsDaily :metaUnidadesID="object.meta_unidades_id" />
        </td>
        <td>
          <ObjetivosModalUpdateUnits
            :metaUnidadesID="object.meta_unidades_id"
            @listTable="list"
          />
        </td>
      </template>
    </DinamicosTableFilters>
  </div>
</template>

<script lang="ts" setup>
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import {
  items,
  headers,
  attributes,
} from "../../composables/objetivos/UnitsData";
import { useUnitsApi } from "../../composables/objetivos/UnitsApi";
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";
import { ref } from "vue";
import type { WarningTable } from "../../interfaces/filters";

const isLoading = ref<boolean>();
const errorData = ref<boolean>(false);
const clientID = useCookie("idCliente");
const data = ref<any[]>([]);
const warningData = ref<WarningTable>({
  success: false,
  label: "",
});

const toast = useToast();
const { listMetaUnidades } = useUnitsApi();

const list = async () => {
  isLoading.value = true;
  const resp = await listMetaUnidades(clientID.value);

  if (resp.success) {
    data.value = resp.data;
    console.log("data: ", data.value);

    if (data.value.length === 0) {
      warningData.value.success = true;
      warningData.value.label = "Sin ninguna meta registrada.";
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
list();

const formatoNumero = (numero: number): string => {
  return new Intl.NumberFormat("es-ES").format(numero);
};

definePageMeta({
  layout: "default",
  middleware: "auth",
});
</script>
