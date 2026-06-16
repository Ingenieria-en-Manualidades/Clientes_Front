<template>
  <button
    type="button"
    class="bg-verdeIENM px-3 py-1 rounded hover:bg-verdeOscIENM"
    @click="openModal"
    title="Ver usuarios asociados"
  >
    <i class="pi pi-users text-white"></i>
  </button>

  <Dialog
    v-model:visible="visible"
    modal
    :header="`Usuarios asociados - ${clientName}`"
    class="dialog-client-users"
  >
    <div v-if="isLoading" class="flex justify-center p-5">
      <ProgressSpinner
        style="width: 40px; height: 40px"
        strokeWidth="8"
        fill="transparent"
        animationDuration=".5s"
        aria-label="Cargando"
      />
    </div>

    <div v-else-if="users.length" class="overflow-x-auto">
      <table class="w-full text-xs sm:text-sm">
        <thead>
          <tr>
            <th class="bg-azulIENM text-white py-2 px-3">ID</th>
            <th class="bg-azulIENM text-white py-2 px-3">Usuario</th>
            <th class="bg-azulIENM text-white py-2 px-3">Nombre</th>
            <th class="bg-azulIENM text-white py-2 px-3">Correo</th>
            <th class="bg-azulIENM text-white py-2 px-3">Celular</th>
            <th class="bg-azulIENM text-white py-2 px-3">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id ?? user.username ?? ''"
            class="border-x-[1px] border-b-[1px] border-gray-300 text-center"
          >
            <td class="py-2 px-3">{{ user.id }}</td>
            <td class="py-2 px-3">{{ user.username }}</td>
            <td class="py-2 px-3">{{ user.fullname || '-' }}</td>
            <td class="py-2 px-3">{{ user.email || '-' }}</td>
            <td class="py-2 px-3">{{ user.cellphone || '-' }}</td>
            <td class="py-2 px-3">{{ user.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="py-6 text-center font-semibold text-gray-700">
      <i class="pi pi-exclamation-triangle text-3xl"></i>
      <p class="mt-2">{{ emptyMessage }}</p>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import ProgressSpinner from "primevue/progressspinner";
import type { ClientUserTable } from "../../interfaces/clients";
import { useClientsApi } from "../../composables/administration/clientsApi";

const props = defineProps({
  clientId: { type: [Number, String], required: true },
  clientName: { type: String, required: true },
  source: { type: String, default: "clients" },
});

const toast = useToast();
const { getUsersByClient, getUsersBySurveyClient } = useClientsApi();
const visible = ref(false);
const isLoading = ref(false);
const users = ref<ClientUserTable[]>([]);
const emptyMessage = ref("Este cliente no tiene usuarios asociados.");

const normalizeUser = (user: any): ClientUserTable => ({
  id: user.id ?? null,
  username: user.username ?? null,
  fullname: user.fullname || user.contact_fullname || null,
  email: user.email ?? null,
  cellphone: user.cellphone ?? null,
  status: user.deleted_at ? "Eliminado" : user.activo === "n" ? "Inactivo" : "Activo",
});

const openModal = async () => {
  visible.value = true;
  isLoading.value = true;
  users.value = [];
  emptyMessage.value = "Este cliente no tiene usuarios asociados.";

  const response = props.source === "surveys"
    ? await getUsersBySurveyClient(props.clientId)
    : await getUsersByClient(props.clientId);

  if (response.success) {
    users.value = (response.data ?? []).map(normalizeUser);
  } else if (response.title === "Usuarios no encontrados.") {
    emptyMessage.value = response.message;
  } else {
    toast.add({severity: "error", summary: response.title, detail: response.message, life: 5000});
    emptyMessage.value = "No fue posible cargar los usuarios asociados.";
  }

  isLoading.value = false;
};
</script>

<style>
.dialog-client-users {
  width: 58rem;
  max-width: 95vw;
}
</style>
