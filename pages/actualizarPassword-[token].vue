<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <title>Actualizar constraseña</title>
    <div class="border-2 rounded-lg shadow w-80 md:w-[430px] bg-white">
      <div class="p-5 flex justify-center">
        <img
          src="/assets/img/ienmLogito.png"
          alt="Logo IENM"
          class="min-w-[100px] w-[175px] md:w-[210px]"
        />
      </div>
      <div
        class="bg-gradient-to-r from-azulIENM to-azulClaroIENM px-[15%] py-[5%] place-items-center rounded-b-lg"
      >
        <p class="font-manrope-extrab text-white text-[20px] md:text-[26px]">
          Actualizar contraseña
        </p>
        <div class="mt-5">
          <span class="text-white font-manrope-l">{{ password }}</span>
          <p class="font-manrope-r text-amarilloIENM mb-2 text-base md:text-lg">
            Contraseña nueva
          </p>
          <Password
            v-model="contraseña"
            toggleMask
            :feedback="false"
            class="w-full text-sm md:text-base"
          />
        </div>
        <div class="mt-5 mb-7">
          <p class="font-manrope-r text-amarilloIENM mb-2 text-base md:text-lg">
            Vuelve a escribir la contraseña
          </p>
          <Password
            v-model="confirmacion"
            toggleMask
            :feedback="false"
            class="w-full text-sm md:text-base"
          />
        </div>
        <!-- Componente 'botonUpdate' de tailwind ubicada en 'assets/css' -->
        <button class="botonUpdate w-full py-2 mt-4" @click="actualizar">
          Actualizar
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { navigateTo } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import { useValidaciones } from "../composables/login/validaciones";
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";
import { useActualizarPasswordAPI } from "../composables/login/ActualizarPasswordAPI";

const contraseña = ref();
const confirmacion = ref();
const password = ref<string | null>(null); // Variable que establece un error en los inputs

const toast = useToast();
const { verificarToken } = useValidaciones();
const { setUpdatePassword } = useActualizarPasswordAPI();
const tokenPassword = useRoute().params.token;

let id_username: string;

const verificacion = async () => {
  console.log("tokenPassword: ", tokenPassword);

  const resultado = await verificarToken(tokenPassword);
  console.log("resultado actualizarPassword: ", resultado);

  if (resultado?.status) {
    id_username = resultado.id_username;
  } else {
    toast.add({
      severity: "error",
      summary: resultado?.tittle,
      detail: resultado?.detail,
      life: 4000,
    });
    return navigateTo("/");
  }
};

const actualizar = async () => {
  if (!contraseña.value || !confirmacion.value) {
    toast.add({
      severity: "error",
      summary: "Contraseñas vacías.",
      detail: "Por favor llenar todos los valores.",
      life: 4000,
    });
  } else {
    if (contraseña.value === confirmacion.value) {
      if (/.{8,}/.test(contraseña.value)) {
        const resultado = await setUpdatePassword(
          id_username,
          confirmacion.value
        );

        toast.add({
          severity: resultado.status,
          summary: resultado.tittle,
          detail: resultado.detail,
          life: 4000,
        });

        if (resultado.status !== "error") {
          return navigateTo("/");
        }
        password.value = null;
      } else {
        password.value = "El campo debe tener al menos 8 caracteres.";
      }
    } else {
      toast.add({
        severity: "error",
        summary: "Las contraseñas no son iguales",
        detail: "Por favor revisar las contraseñas.",
        life: 4000,
      });
    }
  }
};

verificacion();

definePageMeta({
  layout: "login",
  skipGlobalMiddleware: true,
});
</script>
