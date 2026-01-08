<template>
  <button
    type="button"
    class="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
    @click="openDialog"
  >
    <i class="pi pi-replay text-white"></i>
    <!-- <span class="text-white ml-2">Restablecer usuario</span> -->
  </button>
  <div class="w-4">
    <Dialog
      v-model:visible="visible"
      modal
      header="Restablecer usuario"
      class="dialog"
    >
      <div class="border border-red-500 rounded-lg p-5 text-center" v-if="!response.title">
        <i class="pi pi-exclamation-circle text-6xl text-red-500"></i>
        <p class="text-3xl ">¿Estás seguro?</p>
        <p>Al presionar el botón "Confirmar" la contraseña del usuario "{{ username }}" se restablecera.</p>
        <p class="text-red-500">¿Aun deseas restablecer al usuario?</p>
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
            @click="resetUser()"
          >
            Confirmar
          </button>
        </div>
      </div>
      <div class="border border-red-500 rounded-lg p-5 text-center" v-else>
        <i :class="['pi pi-exclamation-circle text-6xl', response.success ? 'text-blue-500' : 'text-red-500']"></i>
        <p class="text-2xl">{{ response.title }}</p>
        <p v-if="response.success"><strong>Usuario:</strong> {{ username }}</p>
        <p>{{ response.message }}</p>
        <button type="button" class="p-2 rounded-lg hover:bg-slate-100 mt-4" @click="copyCredentials">
          <i class="pi pi-copy"></i>
        </button>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import type { User } from "../../interfaces/users";
import ProgressSpinner from "primevue/progressspinner";
import { useDataUsers } from "../../composables/administration/dataUsers";
import { useUsersApi } from "../../composables/administration/usersApi";

// Variable to control the visibility of the modal dialog.
const visible = ref(false);
const toast = useToast();
const { setResetUser } = useUsersApi();
const response = ref({title: '', message: '', success: false});

const props = defineProps({
  id: {type: String, required: true},
  username: {type: String, required: true},
});

const resetUser = async () => {
  visible.value = false;
  response.value = await setResetUser(props.id);
  visible.value = true;
}

const copyCredentials = async () => {
  try {
    const text = `Usuario: ${props.username}\n${response.value.message}`;

    if (!navigator.clipboard) {
      toast.add({severity: "error",summary: "Botón inhabilitado.",detail: "Clipboard API no disponible.",life: 3000,});
      return
    }

    await navigator.clipboard.writeText(text);
    toast.add({severity: "success",summary: "Copiado.",detail: "Usuario y contraseña copiadas al portapapeles.",life: 3000,});
  } catch (error) {
    console.error("error dentro del catch al copiar: ", error.message);
    toast.add({severity: "error",summary: "Error inexperado.",detail: error.message,life: 3000,});
  }
};

const openDialog = () => {
  visible.value = !visible.value;
  response.value = {title: '', message: '', success: false};
};
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