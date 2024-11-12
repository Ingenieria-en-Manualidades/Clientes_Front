<template>
  <div class="w-full flex justify-center p-2 gap-2 sm:gap-5 md:p-5">
    <title>Calidad</title>
    <FormChecklist />
    <FormCalidad />
  </div>
</template>

<script lang="ts" setup>
import FormCalidad from "../../components/objetivos/FormCalidad.vue";
import FormChecklist from "../../components/objetivos/FormChecklist.vue";
</script>
