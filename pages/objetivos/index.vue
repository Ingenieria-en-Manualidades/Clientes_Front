<template>
  <div class="w-full py-3 px-5">
    <PanelPaso
      :icono="'pi pi-bell'"
      :titulo="'Cabeza 1'"
      :visibilidad="visible"
    >
      <template #default="{ pasoActual }">
        <div v-if="pasoActual === 0">
          <h2>Contenido del Paso 1</h2>
          <!-- Aquí podrías agregar el contenido específico de este paso -->
        </div>
        <div v-else-if="pasoActual === 1">
          <h2>Contenido del Paso 2</h2>
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

const visible = ref(true);
</script>
