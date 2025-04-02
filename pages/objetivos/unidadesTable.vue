<template>
  <div>
    <RemisionesTabPanelRemisiones :items="items" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";

const items = ref([
  {
    route: "/objetivos/unidades",
    label: "Ingresar",
    icon: "pi pi-plus text-[13px] sm:text-[16px]",
  },
  {
    route: "/objetivos/unidadesTable",
    label: "Consultar",
    icon: "pi pi-search text-[13px] sm:text-[16px]",
  },
]);

definePageMeta({
  layout: "default",
  middleware: "auth",
});
</script>
