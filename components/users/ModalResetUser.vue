<template>
  <button
    type="button"
    class="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
    @click="visible = true"
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
      <div class="border border-red-500 rounded-lg p-5 text-center">
        <i class="pi pi-exclamation-circle text-6xl text-red-500"></i>
        <p class="text-3xl ">¿Estás seguro?</p>
        <p>Al presionar el botón "Confirmar" </p>
        <div class="flex justify-end mt-4 gap-2">
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
            @click="visible = false"
          >
            Confirmar
          </button>
        </div>
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
import type { OptionDropdown } from "../../interfaces/componentesDinamicos";
import type { optionsDropDownLists, optionsDropDownListsUserType } from "../../interfaces/users";

// Variable to control the visibility of the modal dialog.
const visible = ref(false);

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