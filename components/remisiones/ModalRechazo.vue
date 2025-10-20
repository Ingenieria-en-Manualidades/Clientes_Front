<template>
  <button
    type="button"
    class="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
    @click="visible = !visible"
  >
    <i class="pi pi-eye text-white"></i>
    <span class="text-white  ml-2 hidden sm:inline-flex"
      >Revisar motivo</span
    >
  </button>
  <div>
    <Dialog
      v-model:visible="visible"
      modal
      header="MOTIVO DE RECHAZO"
      class="dialog"
    >
      <p class=" mb-2">REMISIÓN N° {{ props.numRemision }}</p>
      <p class="border-[1px] border-red-500 rounded-lg p-2" id="motiveRejectedReferrals">
        {{ props.motivo }}
      </p>
    </Dialog>
  </div>
</template>

<script setup>
// Variable que oculta el dialog
const visible = ref(false);
// Varriables 'número de remision' y el motivo de rechazo
const props = defineProps({
  numRemision: String,
  motivo: String,
});
</script>

<style>
@import url("/assets/css/stylesRemisiones/stylesModalRechazo.css");
</style>
