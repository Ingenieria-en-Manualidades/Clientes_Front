<template>
  <button
    type="button"
    :class="['px-3 py-1 rounded', status ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600']"
    @click="visible = !visible"
  >
    <i :class="['text-white', status ? 'pi pi-user-minus' : 'pi pi-user-plus']"></i>
    <!-- <span class="text-white ml-2">Restablecer usuario</span> -->
  </button>
  <div class="w-4">
    <Dialog
      v-model:visible="visible"
      modal
      :header="`${ status ? 'Deshabilitar Usuario' : 'Habilitar usuario'}`"
      class="dialog"
    >
      <div class="border border-red-500 rounded-lg p-5 text-center">
        <i class="pi pi-exclamation-circle text-6xl text-red-500"></i>
        <p class="text-3xl ">¿Estás seguro?</p>
        <p>Al presionar el botón "Confirmar" el usuario "{{ username }}" se {{ status ? 'deshabilitará' : 'habilitará' }}.</p>
        <p class="text-red-500">¿Aun deseas {{ status ? 'deshabilitar' : 'habilitar' }} al usuario?</p>
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
            class="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 text-white"
            @click="setStatus()"
          >
            Confirmar
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useUsersApi } from "../../composables/administration/usersApi";

// Variable to control the visibility of the modal dialog.
const visible = ref(false);
const toast = useToast();
const { setEnableDisabledUser } = useUsersApi();

const props = defineProps({
  id: {type: String, required: true},
  username: {type: String, required: true},
  status: {type: Boolean, required: true},
});

const emits = defineEmits(["list"]);

const setStatus = async () => {
  const response = await setEnableDisabledUser(props.id);

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
}
</script>

<style>
.dialog {
  width: 30rem;
  max-width: 95vw;
  @media (width >= 40rem) {
    width: 40rem;
  }
}
</style>