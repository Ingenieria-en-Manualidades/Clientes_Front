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
      :positionFilters="'inTable'"
    >
      <template #newFilter>
        <DinamicosInputCalendar
          v-model="dateSearch"
          :label="'Buscar por fecha'"
          :displayFlex="false"
          :dateFormat="'yy/mm'"
          :view="'month'"
          :range="true"
        />
      </template>
      <template #newColumn>
        <th class="bg-azulIENM text-white py-3 px-5" colspan="3">ACCIONES</th>
      </template>
      <template #newCell="{ object }">
        <td>
          <ObjetivosModalUnitsDaily :metaUnidadesID="object.meta_unidades_id" />
        </td>
        <td v-if="object.motivo_actualizacion">
          <ObjetivosModalReasonUpdateGoal
            :reason="object.motivo_actualizacion"
          />
        </td>
        <td v-else>
          <ObjetivosModalUpdateUnits
            :metaUnidadesID="object.meta_unidades_id"
            :visibleButton="forms[0].visible"
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
import { ref, watch } from "vue";
import type { WarningTable } from "../../interfaces/filters";

const isLoading = ref<boolean>();
const errorData = ref<boolean>(false);
const clientID = useCookie("idCliente");
const data = ref<any[]>([]);
const cacheData = ref<any[]>([]);
const dateSearch = ref<Date | null>(null);
const warningData = ref<WarningTable>({
  success: false,
  label: "",
});

const toast = useToast();
const { listMetaUnidades, getAreasImec, getFechas } = useUnitsApi();

const list = async () => {
  isLoading.value = true;
  const result = await getAreasImec(clientID.value);

  if (result.success) {
    const resp = await listMetaUnidades(Number(clientID.value), result.data);

    if (resp.success) {
      data.value = resp.data;
      cacheData.value = data.value;
      // Delete the filter list, as the areas accumulate when changing clients.
      headers.value[3].options?.labels.splice(
        0,
        headers.value[3].options?.labels.length
      );

      if (data.value.length === 0) {
        warningData.value.success = true;
        warningData.value.label = "Sin ninguna meta registrada.";
      } else {
        for (const unit of data.value) {
          // Change to thousand format for each goal value.
          unit.valor = formatoNumero(unit.valor);

          // Check that if there is no area in the filter list, it adds it.
          if (!headers.value[3].options?.labels.includes(unit.area_id_groot)) {
            headers.value[3].options?.labels.push(unit.area_id_groot);
          }
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
  } else {
    errorData.value = true;
    toast.add({
      severity: "error",
      summary: result.title,
      detail: result.message,
      life: 5000,
    });
  }
  isLoading.value = false;
};
list();

const formatoNumero = (numero: number): string => {
  return new Intl.NumberFormat("es-ES").format(numero);
};

const userPermissions = useCookie("permissions");

const forms = ref([
  {
    permission: "update_unidades_mensuales",
    visible: false,
  },
]);

const checkPermissions = () => {
  forms.value.forEach((form) => {
    if (userPermissions.value?.includes(form.permission)) {
      form.visible = true;
    } else {
      form.visible = false;
    }
  });
};
checkPermissions();

watch(dateSearch, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    if (dateSearch.value) {
      const fechas = getFechas(dateSearch.value[0], dateSearch.value[1]);
      if (!fechas[1]) {
        data.value = cacheData.value.filter(
          (goal) => goal.fecha_meta === fechas[0]
        );
      } else {
        data.value = cacheData.value.filter(
          (goal) => goal.fecha_meta >= fechas[0] && goal.fecha_meta <= fechas[1]
        );
      }
    }

    if (newVal === null) {
      data.value = cacheData.value;
    }
  }
});

definePageMeta({
  layout: "default",
  middleware: "auth",
  requiresAuth: true,
});
</script>
