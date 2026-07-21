<template>
  <button
    type="button"
    class="bg-red-500 px-3 py-1 m-1 rounded hover:bg-red-600"
    @click="visible = true"
  >
    <i class="pi pi-plus text-white"></i>
    <span class="text-white ml-2">Agregar rol</span>
  </button>

  <Dialog v-model:visible="visible" modal header="Crear nuevo rol" class="dialog">
    <form>
      <DinamicosInputText
        v-model="role.name"
        :label="'Nombre del rol'"
        :displayFlex="false"
        :warning="errors[0] ? 'Este campo es obligatorio.' : ''"
      />
      <DinamicosInputSearchList
        :options="optionsLists.permissions"
        v-model="role.permissions"
        :multiple="true"
        label="Permisos"
        placeholder="Selecciona los permisos del rol..."
        searchPlaceholder="Escribe para buscar permisos..."
        :warning="errors[1] ? 'Selecciona al menos un permiso.' : ''"
      />
      <button
        type="button"
        @click="submit"
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
import { ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import ProgressSpinner from "primevue/progressspinner";
import type { RoleForm, RoleOptionsLists } from "../../interfaces/roles";
import { useDataRoles } from "../../composables/administration/dataRoles";
import { useRolesApi } from "../../composables/administration/rolesApi";

const visible = ref(false);
const isLoading = ref(false);
const errors = ref<boolean[]>([]);
const optionsLists = ref<RoleOptionsLists>({ permissions: [] });
const role = ref<RoleForm>({ name: "", permissions: [] });

const toast = useToast();
const emits = defineEmits(["list"]);
const { loadList, setReviewFields } = useDataRoles();
const { setCreateRole } = useRolesApi();

watch([visible], async () => {
  optionsLists.value = await loadList(visible.value);

  if (!visible.value) {
    role.value = { name: "", permissions: [] };
    errors.value = [];
  }
});

const submit = async () => {
  if (isLoading.value) return;

  role.value.name = role.value.name.trim();
  errors.value = setReviewFields(role.value);
  if (errors.value.includes(true)) return;

  isLoading.value = true;

  try {
    const result = await setCreateRole(role.value);

    toast.add({
      severity: result.success ? "success" : "error",
      summary: result.title,
      detail: result.message,
      life: 5000,
    });

    if (result.success) {
      visible.value = false;
      emits("list");
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
