<template>
  <div class="w-full py-3 px-5">
    <PanelPaso
      :pasos="['pi pi-user', 'pi pi-star', 'pi pi-id-card']"
      @paso-siguiente="handleSiguiente"
      @paso-anterior="handleAnterior"
    >
      <template #default="{ pasoActual }">
        <div v-if="pasoActual === 0">
          <FormObjetivosMen ref="formObjetivos" />
        </div>
        <div v-else-if="pasoActual === 1">
          <FormCalidad ref="formCalidad" />
        </div>
      </template>
    </PanelPaso>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PanelPaso from "../../components/dinamicos/PanelPaso.vue";
import FormObjetivosMen from "../../components/objetivos/formObjetivosMen.vue";
import FormCalidad from "../../components/objetivos/FormCalidad.vue";

const pasoActual = ref(0);

// Función para manejar el evento al presionar "Siguiente"
const handleSiguiente = async (paso: number) => {
  if (paso === 0) {
    const isFormValid = await (refs.formObjetivos as any)?.submitForm();
    if (!isFormValid) return; // No avanzar si no es válido
  } else if (paso === 1) {
    const isFormValid = await (refs.formCalidad as any)?.submitForm();
    if (!isFormValid) return;
  }

  pasoActual.value = paso + 1;
};

const handleAnterior = (paso: number) => {
  pasoActual.value = paso;
};

// import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime";
// //Método para que no tenga la plantilla HTML por defecto
// definePageMeta({
//   layout: "login",
//   middleware: "logueado",
//   skipGlobalMiddleware: true,
// });
</script>
