<template>
  <div>
    <TablaPaginacion :headers="headers" :data="data" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import TablaPaginacion from "~/components/dinamicos/TablaPaginacion.vue";

const headers = ref(["name", "age", "dni"]);

const data = ref([
  {
    name: "Jostin",
    age: 123,
    dni: 12345,
  },
  {
    name: "Jostin",
    age: 123,
    dni: 12345,
  },
  {
    name: "MADE",
    age: 123,
    dni: 12345,
  },
  {
    name: "MADE",
    age: 123,
    dni: 12345,
  },
]);
</script>
