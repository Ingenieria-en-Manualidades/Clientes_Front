<template>
  <div class="w-full py-3 px-5">
    <title>Metas</title>
    <FormObjetivosMen />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted, watch } from "vue";
import { useDriver } from "../../composables/objetivos/driver";
import FormObjetivosMen from "~/components/objetivos/FormObjetivosMen.vue";
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";

const route = useRoute();

const runStepByStep = async () => {
  if (process.server) return;
  const h = route.hash || '';
  if (!/^#stepByStep(?:$|[=/?&])/i.test(h)) return;
  const { getDriverGoals } = await useDriver();
  const stepByStep = await getDriverGoals();
  if (stepByStep) stepByStep.drive();
};
onMounted(runStepByStep);

watch(() => route.hash,() => {runStepByStep();});

definePageMeta({
  layout: "default",
  middleware: "auth",
  requiresAuth: true,
});
</script>
