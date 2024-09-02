<template>
  <!DOCTYPE html>
      <div class="border-2 justify-center rounded-lg shadow w-full mt-[10%] lg:inline-flex">
        <div class="w-1/2 bg-cover pt-4 pb-4">
          <img
            src="/assets/img/ienmLogo600.jpg"
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
          <p class="pBienvenidos">Bienvenido</p>
          <LoginForm />
        </div>
      </div>

</template>

<script lang="ts" setup>
//Método para que no tenga la plantilla HTML por defecto
definePageMeta({
  layout: "login",
  middleware: "logueado",
});
</script>

<style></style>
