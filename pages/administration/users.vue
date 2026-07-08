<template>
  <div class="p-3">
    <title>Usuarios</title>
    <UsersModalFormCreateUser @list="list" />
    <DinamicosTableFilters
      :headers="headers"
      :atributes="attributes"
      :data="users"
      :loading="isLoading"
      :warningData="warningData"
      :errorData="errorData"
      :height="'250px'"
      :positionFilters="'inTable'"
    >
      <template #newFilter>
        <div>
          <DinamicosInputText
            v-model="usernameFilter"
            :label="'Buscar'"
            :displayFlex="false"
            :height="'1000px'"
          />
        </div>
      </template>
      <template #newColumn>
        <th class="bg-azulIENM text-white py-3 px-5">ACCIONES</th>
      </template>
      <template #newCell="{ object }">
        <td class="flex p-1">
          <UsersModalResetUser :id="object.id" :username="object.username" />
          <UsersModalFormUpdateUser :userID="object.id" @list="list" />
          <UsersModalDisableEnableUser 
            :id="object.id" 
            :username="object.username" 
            :status="object.status" 
            @list="list"
          />
        </td>
      </template>
    </DinamicosTableFilters>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import type { UserTable } from "../../interfaces/users";
import type { WarningTable } from "../../interfaces/filters";
import { useUsersApi } from "../../composables/administration/usersApi";
import { useDataUsers } from "../../composables/administration/dataUsers";

const toast = useToast();
const usernameFilter = ref<string>("");
const isLoading = ref<boolean>();
const users = ref<UserTable[]>([]);
const cacheUsers = ref<UserTable[]>([]);
const errorData = ref<boolean>(false);
const warningData = ref<WarningTable>({
  success: false,
  label: "",
});

const { getListUsers } = useUsersApi();
const { headers, attributes, setFixDataUsers } = useDataUsers();

const list = async () => {
  isLoading.value = true;
  const result = await getListUsers();

  if (result.success) {
    const data: any[] = result.data;

    if (data.length === 0) {
      warningData.value.success = true;
      warningData.value.label = "Sin ninguna meta registrada.";
    } else {
      users.value = setFixDataUsers(data);
      cacheUsers.value = users.value;
    }
  } else {
    errorData.value = true;
    toast.add({
      severity: "error",
      summary: result.title,
      detail: result.message,
      life: 5000,
    });
  }
  isLoading.value = false;
};
list();

watch(usernameFilter, async (newVal, oldVal) => {
  if (newVal === oldVal) return;
  const term = (newVal ?? "").toString().trim().toLowerCase();

  // If the input is empty, we return to the original list.
  if (!term) {
    users.value = cacheUsers.value;
    return;
  }

  // Fields you want to search.
  const searchableFields: (keyof UserTable)[] = ["id","num_document","fullname","username","email"];

  users.value = cacheUsers.value.filter((user) => {
    return searchableFields.some((field) => {
      const value = user[field];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(term);
    });
  });
});

definePageMeta({
  layout: "default",
  middleware: "auth",
  requiresAuth: true,
});
</script>
