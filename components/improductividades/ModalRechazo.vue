<template>
  <button
    type="button"
    @click="visible = !visible"
    class="bg-red-400 rounded m-1 py-1 px-4 text-white font-manrope-r"
  >
    <i class="pi pi-eye mr-1"></i>
    <span>Ver</span>
  </button>
  <div>
    <Dialog
      v-model:visible="visible"
      modal
      header="MOTIVO DE RECHAZO"
      class="dialog"
    >
      <p class="border-[1px] border-red-500 p-2 rounded-md font-manrope-r">
        {{ motivo }}
      </p>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const visible = ref(false);

const props = defineProps({
  motivo: String,
});
</script>
