<template>
  <div>
    <Dialog
      v-model:visible="visible"
      modal
      class="dialog"
      :style="{ width: '30rem', margin: '5px' }"
    >
      <div class="text-center font-manrope-r rounded">
        <i class="pi pi-exclamation-circle text-6xl text-red-500"></i>
        <p class="text-3xl font-manrope-b">¡Su contraseña ha caducado!</p>
        <p class="mt-3">Por favor cambiar la contraseña en el siguiente módulo.</p>
        <p class="mt-3">Este cambio es requerido.</p>
        <button
          type="button"
          @click="visible = false"
          class="bg-[#4789c8] font-manrope-b text-center text-white py-3 px-6 rounded mt-5 items-center"
        >
          <span>Aceptar</span>
        </button>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const visible = ref<boolean>(true);
</script>