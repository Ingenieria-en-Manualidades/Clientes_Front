<template>
  <button
    type="button"
    class="bg-verdeIENM text-white px-3 py-2 text-sm disabled:opacity-60"
    @click="openModal"
  >
    <i class="pi pi-plus mr-1"></i>
    Crear cliente
  </button>

  <Dialog
    v-model:visible="visible"
    modal
    header="Crear cliente"
    class="dialog"
  >
    <form>
      <fieldset class="sm:flex gap-3">
        <DinamicosInputText
          v-model="client.nombre"
          :label="'Nombre'"
          :displayFlex="false"
          :warning="errors.nombre ? 'Este campo es obligatorio.' : ''"
        />
        <DinamicosInputNumber
          v-model="client.cliente_endpoint_id"
          :label="'ID Endpoint'"
          :displayFlex="false"
          :warning="errors.cliente_endpoint_id ? 'Este campo es obligatorio.' : ''"
        />
      </fieldset>

      <button
        type="button"
        @click="create"
        :disabled="isLoading"
        class="w-full flex items-center justify-center gap-2 rounded-2xl text-white py-3 shadow-lg active:scale-[0.99] transition disabled:cursor-not-allowed bg-gradient-to-r from-verdeIENM to-verdeOscIENM hover:opacity-95 mt-3"
      >
        <span v-if="!isLoading">Enviar</span>
        <ProgressSpinner
          v-else
          style="width: 25px; height: 25px"
          strokeWidth="8"
          fill="transparent"
          animationDuration=".5s"
          aria-label="Cargando"
        />
      </button>
    </form>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import ProgressSpinner from "primevue/progressspinner";
import type { ClientSchemaForm } from "../../interfaces/clients";
import { useClientsApi } from "../../composables/administration/clientsApi";

const emits = defineEmits(["list"]);
const toast = useToast();
const { setCreateClient } = useClientsApi();
const visible = ref(false);
const isLoading = ref(false);
const client = ref<ClientSchemaForm>({
  nombre: null,
  cliente_endpoint_id: null,
});
const errors = ref({
  nombre: false,
  cliente_endpoint_id: false,
});

const openModal = () => {
  client.value = {
    nombre: null,
    cliente_endpoint_id: null,
  };
  errors.value = {
    nombre: false,
    cliente_endpoint_id: false,
  };
  visible.value = true;
};

const reviewFields = () => {
  errors.value.nombre = !client.value.nombre;
  errors.value.cliente_endpoint_id = client.value.cliente_endpoint_id === null || client.value.cliente_endpoint_id === "";

  if (errors.value.nombre || errors.value.cliente_endpoint_id) {
    toast.add({severity: "warn", summary: "Campos faltantes.", detail: "Revisa los campos que faltan.", life: 5000});
    return false;
  }

  return true;
};

const create = async () => {
  if (isLoading.value || !reviewFields()) return;

  isLoading.value = true;
  const response = await setCreateClient(client.value);
  toast.add({severity: response.success ? "success" : "error", summary: response.title, detail: response.message, life: 5000});

  if (response.success) {
    visible.value = false;
    emits("list");
  }

  isLoading.value = false;
};
</script>

<style>
.dialog {
  width: 30rem;
  max-width: 95vw;
}
</style>
