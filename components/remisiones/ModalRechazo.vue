<template>
  <button
    type="button"
    class="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
    @click="visible = true"
  >
    <i class="pi pi-eye text-white"></i>
    <span class="text-white font-manrope-r ml-2">Revisar motivo</span>
  </button>
  <div>
    <Dialog
      v-model:visible="visible"
      modal
      header="MOTIVO DE RECHAZO"
      :style="{ width: '50vw' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      class="modal"
    >
      <p class="font-manrope-r mb-2">REMISIÓN N° {{ props.numRemision }}</p>
      <p class="border-[1px] border-red-500 rounded-lg p-2">
        {{ props.motivo }}
      </p>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";

const visible = ref(false);

const props = defineProps({
  numRemision: String,
  motivo: String,
});
</script>
