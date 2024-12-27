<template>
  <title>Bienvenido a IENM</title>
  <div class="flex justify-center items-center mt-20">
    <div class="border-2 rounded-lg shadow w-[70%] md:w-[65%] lg:inline-flex">
      <div class="w-1/2 bg-cover pt-4 pb-4">
        <img
          src="/assets/img/im-policromia-vert.png"
          alt="IENM Logo"
          class="ml-[50%] hidden lg:m-0 lg:block"
        />
        <img
          src="/assets/img/ienmLogito.png"
          alt="Logito IENM"
          class="ml-[50%] md:ml-[60%] w-[100%] md:w-[65%] lg:hidden"
        />
      </div>
      <div
        class="bg-gradient-to-r from-azulIENM to-azulClaroIENM lg:w-1/2 p-[3%] rounded lg:rounded-r-lg"
      >
        <p
          class="w-full text-center font-manrope-r text-3xl mb-[7%] mt-[2%] lg:text-5xl md:text-4xl text-white"
        >
          Bienvenido
        </p>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";

//Método para que no tenga la plantilla HTML por defecto
definePageMeta({
  layout: false,
  middleware: "usuario-no-verificado",
});
</script>
