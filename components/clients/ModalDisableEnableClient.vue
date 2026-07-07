<template>
  <button
    type="button"
    :class="['px-3 py-1 rounded', status ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600']"
    @click="visible = true"
  >
    <i :class="['text-white', status ? 'pi pi-times-circle' : 'pi pi-check-circle']"></i>
  </button>

  <Dialog
    v-model:visible="visible"
    modal
    :header="status ? 'Deshabilitar cliente' : 'Habilitar cliente'"
    class="dialog"
  >
    <div class="border border-red-500 rounded-lg p-5 text-center">
      <i class="pi pi-exclamation-circle text-6xl text-red-500"></i>
      <p class="text-3xl">¿Estás seguro?</p>
      <p>Al confirmar, el cliente "{{ clientName }}" se {{ status ? 'deshabilitará' : 'habilitará' }}.</p>
      <p class="text-red-500">¿Aún deseas {{ status ? 'deshabilitar' : 'habilitar' }} al cliente?</p>
      <div class="flex justify-center mt-4 gap-2">
        <button
          type="button"
          class="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          @click="visible = false"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 text-white disabled:opacity-60"
          :disabled="isLoading"
          @click="setStatus"
        >
          Confirmar
        </button>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useClientsApi } from "../../composables/administration/clientsApi";

const props = defineProps({
  id: { type: [Number, String], required: true },
  clientName: { type: String, required: true },
  status: { type: Boolean, required: true },
});

const emits = defineEmits(["list"]);
const toast = useToast();
const { setStatusClient } = useClientsApi();
const visible = ref(false);
const isLoading = ref(false);

const setStatus = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  const response = await setStatusClient(props.id);

  if (response.success) {
    emits("list");
    visible.value = false;
  }

  toast.add({
    severity: response.success ? "success" : "error",
    summary: response.title,
    detail: response.message,
    life: 3000,
  });

  isLoading.value = false;
};
</script>

<style>
.dialog {
  width: 30rem;
  max-width: 95vw;
}
</style>
