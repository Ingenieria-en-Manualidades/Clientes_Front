<template>
  <div class="w-full py-3 px-5">
    <PanelPaso
      :icono="'pi pi-bell'"
      :titulo="'Cabeza 1'"
      :visibilidad="visible"
    >
      <template #default="{ pasoActual }">
        <div v-if="pasoActual === 0">
          <FormObjetivosMen />
        </div>
        <div v-else-if="pasoActual === 1">
          <FormCalidad />
        </div>
        <div v-else-if="pasoActual === 2">
          <FormAccidentes />
        </div>
      </template>
    </PanelPaso>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import PanelPaso from "../../components/dinamicos/PanelPaso.vue";
import FormObjetivosMen from "../../components/objetivos/formObjetivosMen.vue";
import FormCalidad from "../../components/objetivos/FormCalidad.vue";
import FormAccidentes from "../../components/objetivos/FormAccidentes.vue";

const visible = ref(true);
</script>
