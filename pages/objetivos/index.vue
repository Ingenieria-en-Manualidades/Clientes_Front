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
          <h2>Contenido del Paso 3</h2>
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

const visible = ref(true);
</script>
