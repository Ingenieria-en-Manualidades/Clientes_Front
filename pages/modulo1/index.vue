<template>
  <title>Modulo 1</title>
  <DinamicosTableFilters
    :headers="headersImproductividades"
    :atributes="atributesImproductividades"
    :data="dataImproductividades"
    :loading="isLoading"
    :errorData="errorData"
    :height="'413px'"
    :positionFilters="'onTable'"
  />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useCookie } from "nuxt/app";
import type { HeaderWithFilters } from "../../interfaces/filters";
import type { Improductividad } from "../../interfaces/improductividades.ts";
import { dataForTablesFilters } from "../../composables/dataFilters.ts";
import { useImproductividadesAPI } from "../../composables/improductividades/improductividadesAPI";

const idCliente = useCookie("idCliente");
const { headers, atributes, data } = dataForTablesFilters();
const { listarImproductividades } = useImproductividadesAPI();

const lineas = ref<string[]>([]);
const turnos = ref<string[]>([]);
const isLoading = ref<boolean>();
const errorData = ref<boolean>(false);
const dataImproductividades = ref<Improductividad[]>([]);

const getLineas = (data: Improductividad[]): string[] => {
  const opciones = data.reduce((acc, imp) => {
    if (!acc.includes(imp.dispositivo)) {
      acc.push(imp.dispositivo);
    }
    return acc;
  }, []);
  return opciones.sort();
};

const getTurnos = (data: Improductividad[]): string[] => {
  const opciones = data.reduce((acc, imp) => {
    if (!acc.includes(imp.turno)) {
      acc.push(imp.turno);
    }
    return acc;
  }, []);
  return opciones.sort();
};

const setVariablesTable = async () => {
  isLoading.value = true;
  const response = await listarImproductividades(idCliente.value);

  if (response.success && response.data) {
    const dataFilter = response.data.filter((imp) => imp.estado === null);

    if (dataFilter.length === 0) {
      console.log("NO HAY DATAFILTER");
    } else {
      dataImproductividades.value = dataFilter;
      lineas.value = lineas.value.concat(getLineas(dataFilter));
      turnos.value = turnos.value.concat(getTurnos(dataFilter));
      console.log("lineas: ", lineas.value);
    }
  } else {
    errorData.value = true;
    console.log("FALLA AL LISTAR.");
  }
  isLoading.value = false;
};

setVariablesTable();

const headersImproductividades = computed<HeaderWithFilters[]>(() => [
  {
    label: "op",
    options: null,
  },
  {
    label: "referencia",
    options: null,
  },
  {
    label: "actividad",
    options: null,
  },
  {
    label: "descripcion",
    options: null,
  },
  {
    label: "fecha de ingreso",
    options: null,
  },
  {
    label: "horas",
    options: null,
  },
  {
    label: "minutos",
    options: null,
  },
  {
    label: "cantidad de personas",
    options: null,
  },
  {
    label: "improductividades hora hombre",
    options: null,
  },
  {
    label: "lineas",
    options: {
      atribute: "dispositivo",
      labels: lineas.value,
    },
  },
  {
    label: "turnos",
    options: {
      atribute: "turno",
      labels: turnos.value,
    },
  },
]);

const atributesImproductividades = ref([
  "programacion_id",
  "codigo_cobro",
  "actividad",
  "descripcion",
  "fecha_ingreso",
  "horas",
  "minutos",
  "cant_personas",
  "horasxpersonas",
  "dispositivo",
  "turno",
]);
</script>
