<template>
  <div class="font-manrope-r px-1 py-3">
    <title>Unidades programadas</title>
    <form class="sm:flex gap-2">
      <div class="p-5 text-center" v-show="isLoading">
        <ProgressSpinner
          style="width: 50px; height: 50px"
          strokeWidth="8"
          fill="transparent"
          animationDuration=".5s"
          aria-label="Custom ProgressSpinner"
        />
      </div>
      <ObjetivosFormUnitsMonthly v-show="visible" @list="list" />
      <ObjetivosFormUnitsDaily />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import { useUnitsApi } from "../../composables/objetivos/UnitsApi";

const toast = useToast(); // Method for executing messages
const { getMetaUnidades } = useUnitsApi();

const today = ref<Date>(new Date());
const visible = ref<Boolean>(false);
const isLoading = ref<Boolean>(true);
const clientID = useCookie("idCliente");

const list = async () => {
  const result = await getMetaUnidades(today.value, Number(clientID.value));

  if (result.success) {
    isLoading.value = false;
    if (result.data) {
      visible.value = false;
      toast.add({
        severity: "info",
        summary: result.title,
        detail: result.message,
      });
    } else {
      visible.value = true;
    }
  } else {
    isLoading.value = false;
    toast.add({
      severity: "error",
      summary: result.title,
      detail: result.message,
      life: 5000,
    });
  }
};
list();
</script>
