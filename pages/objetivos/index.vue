<template>
  <div class="w-full py-3 px-5">
    <title>Metas</title>
    <RemisionesTabPanelRemisiones :items="itemsMetas" />
    <FormObjetivosMen />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted, watch } from "vue";
import { useDriver } from "../../composables/objetivos/driver";
import FormObjetivosMen from "~/components/objetivos/FormObjetivosMen.vue";
import { itemsMetas } from "../../composables/objetivos/datosObjetivos";
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";

const route = useRoute();

// Run step-by-step tour if URL hash matches
const runStepByStep = async () => {
  if (process.server) return;
  const h = route.hash || ''; // Default to empty string
  if (!/^#stepByStep(?:$|[=/?&])/i.test(h)) return; // Only proceed if hash matches

  // Get and run the driver for goals
  const { getDriverGoals } = await useDriver();
  const stepByStep = await getDriverGoals();
  if (stepByStep) stepByStep.drive();
};
onMounted(runStepByStep);

watch(() => route.hash,() => {runStepByStep();}); // Watch for changes in the route hash

definePageMeta({
  layout: "default",
  middleware: "auth",
  requiresAuth: true,
});
</script>
