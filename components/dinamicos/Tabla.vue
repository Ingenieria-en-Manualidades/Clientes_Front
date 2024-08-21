<template>
  <table :class="tableInterface.styleTable">
    <caption :class="tableInterface.caption?.style">
      {{
        tableInterface.caption?.label
      }}
    </caption>
    <thead>
      <tr>
        <th
          v-for="header in headers"
          v-bind:key="header.length"
          :class="tableInterface.headers.style"
        >
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody :class="tableInterface.tbodyStyle">
      <tr v-for="data in arrayData" v-bind:key="data">
        <td
          v-for="element in data"
          v-bind:key="element"
          :class="tableInterface.rowStyle"
        >
          {{ element }}
        </td>
      </tr>
    </tbody>
    <tfoot :class="tableInterface.tfootStyle" v-if="tableInterface.tfootStyle">
      <tr>
        <td></td>
      </tr>
    </tfoot>
  </table>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import type { tablaDinamica } from "~/interfaces/componentesDinamicos";

const props = defineProps({
  tableInterface: {
    type: Object as () => tablaDinamica,
    required: true,
  },
  data: Array,
});

const headers = ref(props.tableInterface.headers.labels);
const arrayData = ref([]);

for (const e of props.data) {
  let arrayElement = [];
  for (const i in e) {
    arrayElement.push(e[i]);
  }
  arrayData.value.push(arrayElement);
}
</script>
