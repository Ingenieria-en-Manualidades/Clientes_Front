<template>
  <div class="font-manrope-r px-1 py-3">
    <title>Unidades programadas</title>
    <RemisionesTabPanelRemisiones :items="items" />
    <form class="sm:flex gap-2">
      <ObjetivosFormUnitsMonthly v-show="forms[0].visible" />
      <ObjetivosFormUnitsDaily v-show="forms[1].visible" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useCookie } from "nuxt/app";
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";

const userPermissions = useCookie("permissions");

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

const checkPermissions = () => {
  forms.value.forEach((form) => {
    if (userPermissions.value?.includes(form.permission)) {
      form.visible = true;
    } else {
      form.visible = false;
    }
  });
};
checkPermissions();

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
