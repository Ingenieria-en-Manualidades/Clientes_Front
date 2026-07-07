<template>
  <div class=" px-1 py-3">
    <title>Unidades programadas</title>
    <RemisionesTabPanelRemisiones :items="items" />
    <form class="sm:flex items-start gap-2">
      <ObjetivosFormUnitsMonthly v-show="forms[0].visible" />
      <ObjetivosFormUnitsDaily v-show="forms[1].visible" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useCookie } from "nuxt/app";
import { useRoute } from "vue-router";
import { ref, watch } from "vue";
import { items } from "../../composables/objetivos/UnitsData";
import { useDriver } from "../../composables/objetivos/driver";
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";

const route = useRoute();
const userPermissions = useCookie("permissions");

const hasPermission = (permission: string) => userPermissions.value?.includes(permission) ?? false;

const forms = ref([
  {
    permission: "form_unidades_mensuales",
    visible: false,
  },
  {
    permission: "form_unidades_diarios",
    visible: false,
  },
]);

// Run step-by-step tour if URL hash matches
const runStepByStep = async () => {
  if (process.server) return;
  const h = route.hash || ''; // Default to empty string
  if (!/^#stepByStep(?:$|[=/?&])/i.test(h)) return; // Only proceed if hash matches

  // Get and run the driver for unidades table
  const { getDriverUnidadesIndex } = await useDriver();
  const stepByStep = await getDriverUnidadesIndex({
    showFormMonthly: forms.value[0].visible,
    showFormDaily: forms.value[1].visible,
    showBulkMonthly: hasPermission("form_masive_unidades"),
  });
  if (stepByStep) stepByStep.drive();
};

const checkPermissions = async () => {
  forms.value.forEach((form) => {
    if (hasPermission(form.permission)) {
      form.visible = true;
    } else {
      form.visible = false;
    }
  });
  await runStepByStep();
};
checkPermissions();

watch(() => route.hash,() => {runStepByStep();}); // Watch for changes in the route hash

definePageMeta({
  layout: "default",
  middleware: "auth",
  requiresAuth: true,
});
</script>
