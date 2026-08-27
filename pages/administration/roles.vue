<template>
  <div class="space-y-8 p-3">
    <title>Roles</title>
    <h1 class="text-center text-2xl font-bold text-gray-900">
      CREA UN ROL NUEVO Y<br />ASIGNARLE PERMISOS
    </h1>

    <div class="grid gap-8 lg:grid-cols-2">
      <section class="rounded-2xl border border-gray-300 bg-white p-5 shadow-md">
        <DinamicosInputText
          v-model="role.name"
          :label="'Rol'"
          :displayFlex="false"
          :warning="errors[0] ? 'Este campo es obligatorio.' : ''"
        />
        <button
          type="button"
          @click="submit"
          :disabled="isSaving"
          class="mt-4 flex items-center justify-center gap-2 rounded border border-gray-400 bg-gray-100 px-8 py-2 text-sm text-gray-900 transition hover:bg-gray-200 disabled:cursor-not-allowed"
        >
          <span v-if="!isSaving">Crear Rol</span>
          <ProgressSpinner
            v-else
            style="width: 18px; height: 18px"
            strokeWidth="8"
            fill="transparent"
            animationDuration=".5s"
            aria-label="Cargando"
          />
        </button>

        <div class="mt-6">
          <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p class="text-xs font-bold uppercase text-gray-900">{{ showDisabledRoles ? 'Roles inhabilitados' : 'Roles existentes' }}</p>
            <button
              type="button"
              @click="toggleDisabledRoles"
              class="rounded-lg bg-azulClaroIENM px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
            >
              {{ showDisabledRoles ? 'Roles activos' : 'Roles inhabilitados' }}
            </button>
          </div>
          <div class="h-52 overflow-auto border border-gray-400 bg-white p-2">
            <div v-if="isListLoading" class="flex h-full items-center justify-center">
              <ProgressSpinner
                style="width: 35px; height: 35px"
                strokeWidth="8"
                fill="transparent"
                animationDuration=".5s"
                aria-label="Cargando"
              />
            </div>
            <p v-else-if="visibleRoles.length === 0" class="py-4 text-center text-sm text-gray-500">
              {{ showDisabledRoles ? 'Sin roles inhabilitados.' : 'Sin roles registrados.' }}
            </p>
            <ul v-else class="space-y-1">
              <li
                v-for="item in visibleRoles"
                :key="item.id"
                class="flex items-center justify-between gap-3 rounded border border-gray-200 px-3 py-2 text-sm"
              >
                <span>{{ item.name }}</span>
                <button
                  type="button"
                  @click="showDisabledRoles ? restoreRole(item) : disableRole(item)"
                  :disabled="roleStatusId === item.id"
                  :class="[
                    'rounded-lg px-3 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
                    showDisabledRoles
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'bg-red-50 text-red-700 hover:bg-red-100',
                  ]"
                >
                  {{ showDisabledRoles ? 'Habilitar' : 'Inhabilitar' }}
                </button>
              </li>
            </ul>
          </div>
        </div>

      </section>

      <section class="rounded-2xl border border-gray-300 bg-white p-5 shadow-md">
        <DinamicosInputSearchList
          :options="roleOptions"
          v-model="selectedRoleId"
          :multiple="false"
          label="Buscar Rol"
          placeholder="Selecciona un rol..."
          searchPlaceholder="Escribe para buscar roles..."
          :warning="assignErrors[0] ? 'Selecciona un rol.' : ''"
        />

        <p class="mt-4 text-base text-gray-900">Asignar permisos al Rol:</p>
        <DinamicosInputSearchList
          :options="permissionOptions"
          v-model="selectedPermissionIds"
          :multiple="true"
          :showSelectAll="true"
          label="Buscar Permisos"
          placeholder="Selecciona los permisos..."
          searchPlaceholder="Buscar permisos..."
          :warning="assignErrors[1] ? 'Selecciona al menos un permiso.' : ''"
        />

        <div class="mt-6 flex justify-center">
          <button
            type="button"
            @click="savePermissions"
            :disabled="isAssigning || !selectedRoleId"
            class="flex min-w-44 items-center justify-center gap-2 rounded-xl bg-azulClaroIENM px-8 py-3 font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
          >
            <span v-if="!isAssigning">GUARDAR</span>
            <ProgressSpinner
              v-else
              style="width: 24px; height: 24px"
              strokeWidth="8"
              fill="transparent"
              animationDuration=".5s"
              aria-label="Cargando"
            />
          </button>
        </div>

        <div class="mt-6 rounded-2xl border border-dashed border-azulClaroIENM/40 bg-sky-50/60 p-4">
          <p class="text-xs font-bold uppercase text-azulIENM">Crear permiso</p>
          <p class="mt-1 text-xs text-gray-500">Agrega permisos nuevos para asignarlos luego a los roles.</p>

          <div class="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <DinamicosInputText
              v-model="permissionName"
              :label="'Permiso'"
              :displayFlex="false"
              :warning="permissionErrors[0] ? 'Este campo es obligatorio.' : ''"
            />
            <button
              type="button"
              @click="createPermission"
              :disabled="isCreatingPermission"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-azulClaroIENM px-6 py-3 text-sm font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none md:w-auto"
            >
              <span v-if="!isCreatingPermission">Crear permiso</span>
              <ProgressSpinner
                v-else
                style="width: 20px; height: 20px"
                strokeWidth="8"
                fill="transparent"
                animationDuration=".5s"
                aria-label="Cargando"
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import ProgressSpinner from "primevue/progressspinner";
import type { RoleForm, RoleTable } from "../../interfaces/roles";
import { useRolesApi } from "../../composables/administration/rolesApi";
import { useDataRoles } from "../../composables/administration/dataRoles";
import { useUsersApi } from "../../composables/administration/usersApi";

const toast = useToast();
const role = ref<RoleForm>({ name: "", permissions: [] });
const isLoading = ref<boolean>(false);
const isLoadingDisabled = ref<boolean>(false);
const isSaving = ref(false);
const isAssigning = ref(false);
const isCreatingPermission = ref(false);
const roles = ref<RoleTable[]>([]);
const disabledRoles = ref<RoleTable[]>([]);
const permissionOptions = ref([]);
const permissionName = ref("");
const selectedRoleId = ref("");
const selectedPermissionIds = ref<string[]>([]);
const showDisabledRoles = ref(false);
const roleStatusId = ref<number | null>(null);
const errors = ref<boolean[]>([]);
const assignErrors = ref<boolean[]>([]);
const permissionErrors = ref<boolean[]>([]);

const { getListRoles, getDisabledRoles, setCreateRole, setCreatePermission, setUpdateRole, setDisableRole, setRestoreRole } = useRolesApi();
const { getListPermissions } = useUsersApi();
const { setFixDataRoles, setReviewFields } = useDataRoles();

const roleOptions = computed(() =>
  roles.value.map((item) => ({ label: item.name, value: String(item.id) }))
);

const visibleRoles = computed(() => (showDisabledRoles.value ? disabledRoles.value : roles.value));
const isListLoading = computed(() => (showDisabledRoles.value ? isLoadingDisabled.value : isLoading.value));

const selectedRole = computed(() =>
  roles.value.find((item) => String(item.id) === String(selectedRoleId.value))
);

const list = async () => {
  isLoading.value = true;

  const result = await getListRoles();

  if (result.success) {
    const data = setFixDataRoles(result.data ?? []);
    roles.value = data;
  } else {
    toast.add({ severity: "error", summary: result.title, detail: result.message, life: 5000 });
  }

  isLoading.value = false;
};
list();

const listDisabledRoles = async () => {
  isLoadingDisabled.value = true;

  const result = await getDisabledRoles();

  if (result.success) {
    disabledRoles.value = setFixDataRoles(result.data ?? []);
  } else {
    toast.add({ severity: "error", summary: result.title, detail: result.message, life: 5000 });
  }

  isLoadingDisabled.value = false;
};

const loadPermissions = async () => {
  const result = await getListPermissions();

  if (result.success) {
    permissionOptions.value = result.data;
  } else {
    toast.add({ severity: "error", summary: result.title, detail: result.message, life: 5000 });
  }
};
loadPermissions();

const submit = async () => {
  if (isSaving.value) return;

  role.value.name = role.value.name.trim();
  errors.value = setReviewFields(role.value);
  if (errors.value.includes(true)) return;

  isSaving.value = true;

  try {
    const result = await setCreateRole(role.value);

    toast.add({
      severity: result.success ? "success" : "error",
      summary: result.title,
      detail: result.message,
      life: 5000,
    });

    if (result.success) {
      role.value = { name: "", permissions: [] };
      errors.value = [];
      await list();
    }
  } finally {
    isSaving.value = false;
  }
};

const createPermission = async () => {
  if (isCreatingPermission.value) return;

  permissionName.value = permissionName.value.trim();
  permissionErrors.value = [permissionName.value.length === 0];
  if (permissionErrors.value.includes(true)) return;

  isCreatingPermission.value = true;

  try {
    const result = await setCreatePermission(permissionName.value);

    toast.add({
      severity: result.success ? "success" : "error",
      summary: result.title,
      detail: result.message,
      life: 5000,
    });

    if (result.success) {
      permissionName.value = "";
      permissionErrors.value = [];
      await loadPermissions();
    }
  } finally {
    isCreatingPermission.value = false;
  }
};

const savePermissions = async () => {
  if (isAssigning.value || !selectedRoleId.value) return;

  assignErrors.value = [!selectedRoleId.value, selectedPermissionIds.value.length === 0];
  if (assignErrors.value.includes(true) || !selectedRole.value) return;

  isAssigning.value = true;

  try {
    const result = await setUpdateRole(selectedRole.value.id, {
      name: selectedRole.value.name,
      permissions: selectedPermissionIds.value,
    });

    toast.add({
      severity: result.success ? "success" : "error",
      summary: result.title,
      detail: result.message,
      life: 5000,
    });

    if (result.success) {
      selectedPermissionIds.value = [];
      await list();
    }
  } finally {
    isAssigning.value = false;
  }
};

const toggleDisabledRoles = async () => {
  showDisabledRoles.value = !showDisabledRoles.value;
  if (showDisabledRoles.value) await listDisabledRoles();
};

const disableRole = async (item: RoleTable) => {
  if (!window.confirm(`¿Inhabilitar el rol ${item.name}?`)) return;

  roleStatusId.value = item.id;

  try {
    const result = await setDisableRole(item.id);

    toast.add({
      severity: result.success ? "success" : "error",
      summary: result.title,
      detail: result.message,
      life: 5000,
    });

    if (result.success) {
      if (String(selectedRoleId.value) === String(item.id)) selectedRoleId.value = "";
      await list();
      if (showDisabledRoles.value) await listDisabledRoles();
    }
  } finally {
    roleStatusId.value = null;
  }
};

const restoreRole = async (item: RoleTable) => {
  roleStatusId.value = item.id;

  try {
    const result = await setRestoreRole(item.id);

    toast.add({
      severity: result.success ? "success" : "error",
      summary: result.title,
      detail: result.message,
      life: 5000,
    });

    if (result.success) {
      await list();
      await listDisabledRoles();
    }
  } finally {
    roleStatusId.value = null;
  }
};

watch(selectedRoleId, () => {
  selectedPermissionIds.value = selectedRole.value?.permissions.map((permission) => String(permission.id)) ?? [];
  assignErrors.value = [];
});

definePageMeta({
  layout: "default",
  middleware: "auth",
  requiresAuth: true,
});
</script>
