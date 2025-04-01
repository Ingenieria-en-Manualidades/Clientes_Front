<template>
  <div class="font-manrope-r px-1 py-3">
    <title>Unidades programadas</title>
    <form class="sm:flex gap-2">
      <ObjetivosFormUnitsMonthly v-show="forms[0].visible" />
      <ObjetivosFormUnitsDaily v-show="forms[1].visible" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useCookie } from "nuxt/app";

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
</script>
