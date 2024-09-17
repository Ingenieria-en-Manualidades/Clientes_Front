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
          class="bg-azulIENM text-white py-4 px-5"
          v-for="(cabeza, index) in cabezas"
          v-bind:key="index"
        >
          {{ cabeza.toUpperCase() }}
        </th>
        <slot name="nuevaColumna"></slot>
      </tr>
    </thead>
    <tbody>
      <tr
        class="border-x-[1px] border-b-[1px] border-gray-400 text-center"
        v-for="(data, index) in arrayData"
        v-bind:key="index"
      >
        <td class="p-3" v-for="(cabeza, index) in cabezas" v-bind:key="index">
          {{ data[cabeza] }}
        </td>
        <slot name="botones"></slot>
      </tr>
    </tbody>
    <tfoot>
      <slot name="tfoot"></slot>
    </tfoot>
  </table>
</template>

<script lang="ts" setup>
import { defineProps, ref } from "vue";

const props = defineProps({
  titulo: String,
  cabezas: {
    type: Object as () => String[],
    required: true,
  },
  arrayData: Array,
});
</script>
