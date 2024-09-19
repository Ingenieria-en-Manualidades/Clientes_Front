<template>
  <table class="text-xs sm:text-sm w-[95%] mx-[2.5%] lg:w-full font-manrope-r">
    <caption v-if="titulo">
      {{
        titulo
      }}
    </caption>
    <thead>
      <tr class="sm:text-base">
        <th
          class="bg-azulIENM text-white py-2 px-3"
          v-for="(cabeza, index) in cabezas"
          v-bind:key="index"
        >
          {{ cabeza === "dispositivo" ? "LINEA" : cabeza.toUpperCase() }}
        </th>
        <slot name="nuevaColumna"></slot>
      </tr>
    </thead>
    <tbody>
      <tr
        class="border-x-[1px] border-b-[1px] border-gray-400 text-center"
        v-for="(data, index) in remisionesData"
        v-bind:key="index"
      >
        <td class="p-3" v-for="(cabeza, index) in cabezas" v-bind:key="index">
          {{ data[cabeza] }}
        </td>
        <slot name="botones" :data="data"></slot>
      </tr>
    </tbody>
    <tfoot>
      <slot name="tfoot"></slot>
    </tfoot>
  </table>
  <div class="w-full mx-[2.5%] py-4 flex justify-center my-[7px]">
    <button
      type="button"
      :disabled="paginaActual === 1"
      @click="paginaActual = 1"
      :class="[
        'py-2 px-3 rounded-[50%]',
        paginaActual === 1 ? 'text-gray-400' : 'hover:bg-gray-200',
      ]"
    >
      <i class="pi pi-angle-double-left"></i>
    </button>
    <button
      type="button"
      :disabled="paginaActual === 1"
      @click="paginaActual -= 1"
      :class="[
        'py-2 px-3 rounded-[50%]',
        paginaActual === 1 ? 'text-gray-400' : 'hover:bg-gray-200',
      ]"
    >
      <i class="pi pi-angle-left"></i>
    </button>
    <span class="font-manrope-b mt-[6px]"
      >Página {{ paginaActual }} de {{ totalPaginas }}</span
    >
    <button
      type="button"
      :disabled="paginaActual === totalPaginas"
      @click="paginaActual += 1"
      :class="[
        'py-2 px-3 rounded-[50%]',
        paginaActual === totalPaginas ? 'text-gray-400' : 'hover:bg-gray-200',
      ]"
    >
      <i class="pi pi-angle-right"></i>
    </button>
    <button
      type="button"
      :disabled="paginaActual === totalPaginas"
      @click="paginaActual = totalPaginas"
      :class="[
        'py-2 px-3 rounded-[50%]',
        paginaActual === totalPaginas ? 'text-gray-400' : 'hover:bg-gray-200',
      ]"
    >
      <i class="pi pi-angle-double-right"></i>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, computed } from "vue";

const props = defineProps({
  titulo: String,
  cabezas: {
    type: Object as () => String[],
    required: true,
  },
  arrayData: Array,
});

const paginaActual = ref(1);
const itemsPorPagina = ref(5);
const totalItems = computed(() => props.arrayData.length);
const totalPaginas = computed(() =>
  Math.ceil(totalItems.value / itemsPorPagina.value)
);

const remisionesData = computed(() => {
  const start = (paginaActual.value - 1) * itemsPorPagina.value;
  const end = start + itemsPorPagina.value;
  return props.arrayData.slice(start, end);
});
</script>
