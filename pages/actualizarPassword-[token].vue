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
        <button
          :class="[
            'w-full py-2 mt-4 rounded font-manrope-r',
            bloqueo ? 'bg-gray-400' : 'bg-verdeIENM',
          ]"
          :disabled="bloqueo"
          @click="actualizar"
        >
          Actualizar
        </button>
      </div>
    </div>
    <Toast position="top-center" group="message" style="width: auto">
      <template #message="slotProps">
        <div class="flex flex-col items-center flex-auto font-manrope-r">
          <div>
            <i class="pi pi-times-circle text-5xl"></i>
          </div>
          <div class="font-bold text-xl my-1">
            {{ String(slotProps.message.summary).toLocaleUpperCase() }}
          </div>
          <div class="text-lg">
            {{ slotProps.message.detail }}
          </div>
          <div>
            <button
              type="button"
              @click="setVolver"
              class="bg-green-500 text-white rounded px-5 py-1 my-2 font-bold"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </template>
    </Toast>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { navigateTo } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import { useRoute, useRouter } from "vue-router";
import { useValidaciones } from "../composables/login/validaciones";
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";
import { useActualizarPasswordAPI } from "../composables/login/ActualizarPasswordAPI";

const bloqueo = ref(true);
const contraseña = ref();
const confirmacion = ref();
const { verificarToken } = useValidaciones();
const tokenPassword = useRoute().params.token;
const password = ref<string | null>(null); // Variable que establece un error en los inputs

const toast = useToast();
const router = useRouter();
const { setUpdatePassword, setDeleteToken } = useActualizarPasswordAPI();

let id_username: string;
const getIDUsername = async () => {
  const resultado = await verificarToken(tokenPassword);

  if (resultado?.status) {
    id_username = resultado?.id_username;
    bloqueo.value = false;
  } else {
    toast.add({
      severity: "error",
      summary: resultado.title,
      detail: resultado.detail,
      group: "message",
    });
  }
};
getIDUsername();

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
          return navigateTo("/login");
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

const setVolver = async () => {
  await setDeleteToken(String(tokenPassword));
  await router.push("/login");
};

definePageMeta({
  layout: false,
});
</script>
