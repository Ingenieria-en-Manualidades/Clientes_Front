<template>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Actualizar constraseña - IENM</title>
    </head>
    <body class="justify-center flex">
      <div class="border-2 rounded-lg shadow w-80 md:w-[430px] mt-[16%]">
        <div class="p-5 justify-center flex">
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
            <p
              class="font-manrope-r text-amarilloIENM mb-2 text-base md:text-lg"
            >
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
            <p
              class="font-manrope-r text-amarilloIENM mb-2 text-base md:text-lg"
            >
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
          <button class="botonUpdate" @click="actualizar">Actualizar</button>
        </div>
      </div>
    </body>
  </html>
</template>

<script lang="ts" setup>
import { useToast } from "primevue/usetoast";
const toast = useToast();

const contraseña = ref();
const confirmacion = ref();

const actualizar = () => {
  if (!contraseña.value || !confirmacion.value) {
    toast.add({
      severity: "error",
      summary: "Contraseñas vacías.",
      detail: "Por favor escribir llenar todos los valores.",
      life: 4000,
    });
  } else {
    if (contraseña.value === confirmacion.value) {
      console.log("Fresh");
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

definePageMeta({
  layout: "login",
});
</script>
