<template>
  <button
    type="button"
    class="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
    @click="visible = true"
  >
    <i class="pi pi-user-edit text-white"></i>
  </button>
  <div class="w-4">
    <Dialog
      v-model:visible="visible"
      modal
      header="Actualizar usuario"
      class="dialog"
    >
      <section v-if="userType === 'employee'">
        <DinamicosDropDownList
          :label="'Planta'"
          :displayFlex="false"
          :options="optionsLists.clients"
          v-model="plant"
        />
        <DinamicosInputSearchList
          :options="optionsListsEmployees"
          v-model="user.employee_id"
          :multiple="false"
          label="Empleado"
          placeholder="Selecciona al empleado..."
          searchPlaceholder="Buscar por nombre o documento..."
          :warning="errors[8] ? 'Este campo es obligatorio.' : ''"
        />
      </section>
      <form>
        <fieldset class="flex gap-3">
          <DinamicosInputText
            v-model="user.fullname"
            :label="'Nombre completo'"
            :displayFlex="false"
            :warning="errors[0] ? 'Este campo es obligatorio.' : ''"
            :disabled="disableInputs.fullname"
          />
          <DinamicosInputText
            v-model="user.username"
            :label="'Nombre de usuario'"
            :warning="errors[1] ? 'Este campo es obligatorio.' : ''"
            :displayFlex="false"
          />
        </fieldset>
        <fieldset class="flex gap-3">
          <DinamicosInputText
            v-model="user.email"
            :label="'Correo electrónico'"
            :displayFlex="false"
            :warning="errors[3] ? 'Este campo es obligatorio.' : ''"
            :disabled="disableInputs.email"
          />
          <DinamicosInputNumber
            v-model="user.cellphone"
            :label="'Número de celular'"
            :displayFlex="false"
            :warning="errors[2] ? 'Este campo es obligatorio.' : ''"
            :disabled="disableInputs.cellphone"
          />
        </fieldset>
        <fieldset class="flex gap-3">
          <DinamicosInputPassword
            v-model:model="user.password"
            label="Contraseña"
            :displayFlex="false"
            :showIcon="false"
            v-model:showPassword="showPassword"
            :warning="errors[4] ? reasonErrorPassword : ''"
          />
          <DinamicosInputPassword
            v-model:model="user.password_confirmation"
            label="Confirmar contraseña"
            :displayFlex="false"
            :showIcon="false"
            v-model:showPassword="showPassword"
            :warning="errors[5] ? reasonErrorPassword : ''"
          />
        </fieldset>
        <input type="checkbox" id="showPassword" v-model="showPassword" class="mx-1" />
        <label for="showPassword">Mostrar contraseña.</label>
        <DinamicosDropDownList
          v-model="user.rol"
          :label="'Rol del usuario'"
          :displayFlex="false"
          :options="optionsLists.roles"
          :warning="errors[7] ? 'Este campo es obligatorio.' : ''"
        />
        <fieldset class="flex gap-3">
          <DinamicosInputSearchList
            :options="optionsLists.permissions"
            v-model="user.permissions"
            :multiple="true"
            label="Permisos"
            placeholder="Permisos asignados..."
            searchPlaceholder="Escribe para buscar permisos..."
          />
          <DinamicosInputSearchList
            :options="optionsLists.clients"
            v-model="user.clients"
            :multiple="true"
            label="Clientes"
            placeholder="Clientes asignados..."
            searchPlaceholder="Escribe para buscar los clientes..."
            :warning="errors[6] ? 'Este campo es obligatorio.' : ''"
          />
        </fieldset>
        <button
          type="button"
          @click="submit"
          :disabled="isLoading"
          class="w-full flex items-center justify-center gap-2 rounded-2xl text-white  py-3 shadow-lg active:scale-[0.99] transition disabled:cursor-not-allowed bg-gradient-to-r from-verdeIENM to-verdeOscIENM hover:opacity-95 mt-3"
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
const showPassword = ref(false);
const isLoading = ref<boolean>(false);
const creatorUser = useCookie("usuario");
const disableInputs = ref({fullname: false, email: false, cellphone: false});

// Variables for the user creation form.
const plant = ref(0);
const userType = ref('client');
const user = ref<User>({
  userType: null,
  employee_id: null,
  fullname: null,
  username: null,
  cellphone: "",
  email: "",
  password: null,
  password_confirmation: null,
  clients: null,
  rol: null,
  permissions: null,
  creator_user: null,
});

const props = defineProps({userID: { type: String, required: true}});
const errors = ref<boolean[]>([]);
const reasonErrorPassword = ref("Este campo es obligatorio.");

// Options for the drop-down lists and search lists.
const optionsListsEmployees = ref<OptionDropdown[]>([]);
const optionsLists = ref<optionsDropDownLists>({clients: [], permissions: [], roles: []});
const optionsListsUserType = ref<optionsDropDownListsUserType>({charges: [], employees: []});

const toast = useToast();
const { setCreateUser, getDataUserId } = useUsersApi();
const { loadList, loadListByType, setReviewFields } = useDataUsers();

// It loads the lists when the modal opens and empties them when it closes.
watch([visible], async () => {
  optionsLists.value = await loadList(visible.value);
  const response = await getDataUserId(props.userID);
  if (response.success) {
    user.value = response.data;
    userType.value = user.value.userType || 'client';
    user.value.rol = response.data.roles[0];
  }
  else toast.add({ severity: "error", summary: response.title, detail: response.message, life: 5000 })
});

// It reacts to opening/closing the dialog and to changing the user type.
watch([visible, userType], async () => {
  optionsListsUserType.value = await loadListByType(visible.value, userType.value, plant.value); // Load the lists that matter when changing the user type.
  setFillOptionsListsEmployees(optionsListsUserType.value.employees || []);
  userType.value === 'employee' ? setAllDisableInputs(true) : setAllDisableInputs(false);
});

// When changing plants, it burdens the employees of that plant.
watch([plant], async (newVal: number[], oldVal: number[]) => {
  if (newVal !== oldVal) {
    optionsListsUserType.value = await loadListByType(visible.value, userType.value, plant.value);
    setFillOptionsListsEmployees(optionsListsUserType.value.employees || []);
  }
});

// When changing the user information, complete the inputs.
watch([user.value], async () => {
  if (userType.value === 'employee' && user.value.employee_id) {
    const employeeSelected = optionsListsUserType.value.employees?.find(element => element.empleado_id === Number(user.value.employee_id));
    if (employeeSelected) {
      user.value.fullname = employeeSelected.nombre;
      user.value.email = employeeSelected.email;
      user.value.cellphone = employeeSelected.celular;
    } else {
      user.value.fullname = "";
      user.value.email = "";
      user.value.cellphone = "";
    }
  }
});

const emits = defineEmits(["list"]);

// Arrange the employee data to create the list.
const setFillOptionsListsEmployees = (data: any[]) => {
  optionsListsEmployees.value = [];
  data.forEach((element: { empleado_id: number; nombre_completo: string; }) => {
    optionsListsEmployees.value.push({label: element.nombre_completo, value: element.empleado_id});
  });
};

// Blocks inputs when choosing the user type as employee.
const setAllDisableInputs = (value: Boolean) => {
  Object.keys(disableInputs.value).forEach(key => {
    disableInputs.value[key] = value;
  });
}

const submit = async () => {
  console.log("user: ", user);
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