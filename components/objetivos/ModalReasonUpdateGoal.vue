<template>
  <button
    type="button"
    class="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
    @click="visible = true"
  >
    <i class="pi pi-book text-white"></i>
  </button>
  <div>
    <Dialog
      v-model:visible="visible"
      modal
      header="MOTIVO DE ACTUALIZACIÓN"
      class="dialog"
    >
      <p class="border-[1px] border-red-500 rounded-lg p-2">
        {{ props.reason }}
      </p>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

// Variable que oculta el dialog
const visible = ref(false);
// Varriables 'número de remision' y el motivo de rechazo
const props = defineProps({
  reason: {
    type: String,
    required: false,
  },
});
</script>
