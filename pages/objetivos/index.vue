<template>
  <div class="w-full py-3 px-5">
    <FormObjetivosMen />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FormObjetivosMen from "~/components/objetivos/FormObjetivosMen.vue";
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";

definePageMeta({
    layout: 'default',
    middleware: "auth",
  })
</script>
