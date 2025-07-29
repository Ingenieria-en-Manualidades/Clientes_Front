<template>
  <div class="flex justify-center py-12 min-h-screen bg-gradient-to-t from-blue-100 to-blue-400">
    <title>Restablecer contraseña</title>
    <div class="w-[30%] h-full shadow-2xl rounded-lg py-5 min-w-[300px] max-w-[350px] bg-white">
      <div class="flex justify-center pb-5">
        <img
          src="/assets/img/ienmLogito.png"
          alt="Logito IENM"
          class="w-[55%]"
        />
      </div>
      <div class="px-10">
        <p v-show="!testCheck" class="font-manrope-b text-sm">La contraseña debe contener:</p>
        <ul v-show="!testCheck" class="list-disc ml-5 font-manrope-r text-sm">
          <li>Ser diferente a la anterior contraseña.</li>
          <li v-show="!listRegex[0].check">Al menos 2 letras mayúsculas.</li>
          <li v-show="!listRegex[1].check">Al menos 2 letras minusculas.</li>
          <li v-show="!listRegex[2].check">Al menos 2 números.</li>
          <li v-show="!listRegex[3].check">Al menos un carácter especial (!,#,$,%,&,*,/,?,\,~).</li>
          <li v-show="!listRegex[4].check">Al menos 8 caracteres.</li>
        </ul>
        <DinamicosInputPassword
          v-model:model="password"
          label="Nueva contraseña"
          :displayFlex="false"
          :showIcon="true"
          v-model:showPassword="showPassword"
        />
        <DinamicosInputPassword
        v-show="testCheck"
          v-model:model="repeatPassword"
          label="Confirmar contraseña"
          :displayFlex="false"
          :showIcon="true"
          v-model:showPassword="showPasswordDos"
        />
        <p class="text-red-500 font-manrope-b text-sm">{{ warning }}</p>
        <button
          type="button"
          @click="setResetPassword"
          :disabled="warning !== null"
          :class="[
            'w-full font-manrope-b text-center text-white p-3 rounded mt-5 items-center',
            warning ? 'bg-slate-300' : 'bg-[#4789c8]',
          ]"
        >
          <span v-if="!isLoading">Continuar</span>
          <ProgressSpinner
            v-else
            style="width: 30px; height: 30px"
            strokeWidth="8"
            fill="transparent"
            animationDuration=".5s"
            aria-label="Custom ProgressSpinner"
          />
        </button>
      </div>
    </div>
    <ModalNoticeResetPassword />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useCookie } from "nuxt/app";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { loginApi } from "../composables/loginApi";
import type { Regex } from "../interfaces/componentesDinamicos";
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";

const password = ref('');
const repeatPassword = ref('');

// Variables for showing/hiding password.
const showPassword = ref(false);
const showPasswordDos = ref(false);

// Variables for password validation.
const listRegex = ref<Regex[]>([
  {regex: "^(?=(?:[^A-Z]*[A-Z]){2,})", check: false}, // At least 2 capital letters.
  {regex: "(?=(?:[^a-z]*[a-z]){2,})", check: false,}, // At least 2 lowercase letters.
  {regex: "(?=(?:[^0-9]*[0-9]){2,})", check: false}, // At least 2 numbers.
  {regex: "(?=(?:[^!#$%&*\\/\\?~]*[!#$%&*\\/\\?~]){1,})", check: false}, // At least one special character.
  {regex: "[A-Za-z0-9!#$%&*\\/\\?~]{8,}$", check: false} // Minimum 8 characters.
]);

const isLoading = ref(false);
const clients = useCookie("clients");
const testCheck = ref<Boolean>(false); // Variable to check if the password meets the requirements.
const warning = ref<String | null>("Por favor, completar el campo.");

const toast = useToast();
const router = useRouter(); // Variable to check if the password meets the requirements.
const { setUpdatePassword , getClientsByIds, chooseClient } = loginApi();

// checks each password change and password confirmation if the password conditions are met.
watch([password, repeatPassword], async (newVal: string[], oldVal: string[]) => {
  if (newVal !== oldVal) {
    listRegex.value.map((item: Regex) => {
      item.check = new RegExp(item.regex).test(password.value);
    });

    testCheck.value = listRegex.value.every(item => item.check);
    if (testCheck.value) {
      password.value !== repeatPassword.value ? warning.value = "Las contraseñas no coinciden" : warning.value = null;
    } else {
      warning.value = "La contraseña no cumple con los requisitos.";
    }
  }
});

const setResetPassword = async () => {
  isLoading.value = true;
  const result = await setUpdatePassword(password.value);
  
  toast.add({
    severity: result.success ? "success" : "error",
    summary: result.title,
    detail: result.message,
    life: 5000,
  });

  // Check if the update worked and the 'clients' cookie exists.
  if (result.success) {
    if (clients.value) {
      // Convert the string of customer IDs to an array of numbers.
      const arrayClients = String(clients.value).split(",").map((client: string) => parseInt(client, 10));
      // Si hay más de un cliente, redirigir a la página de selección de clientes.
      if (arrayClients.length > 1) {
        await router.push("/chooseClients");
      } else {
        // If there is only one client, get their data, create the client cookies and redirect them to the main client.
        const dataClient = await getClientsByIds(arrayClients);
        if (dataClient.success) {
          const response = await chooseClient(dataClient.data[0].cliente_endpoint_id,dataClient.data[0].nombre);
          if (response.success) {
            await router.push("/");
          } else {
            toast.add({severity: "error",summary: response.title,detail: response.message,life: 5000,});
          }
        } else {
          toast.add({severity: "error",summary: dataClient.title,detail: dataClient.message,life: 5000,});
        }
      }
    } else {
      console.error("Error: No se pudo encontrar la cookie de clientes.");
    }
  }
  isLoading.value = false;
}

definePageMeta({
  layout: false,
  middleware: "auth",
  requiresAuth: true,
});
</script>