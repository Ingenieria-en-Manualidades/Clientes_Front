<template>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <body class="justify-center flex">
      <div class="border-2 rounded-lg shadow w-80 lg:w-[430px] mt-[5%]">
        <div class="p-5 justify-center flex">
          <img
            src="/assets/img/ienmLogito.png"
            alt="Logo IENM"
            width="210px"
            class="min-w-[100px]"
          />
        </div>
        <div
          class="bg-gradient-to-r from-azulIENM to-azulClaroIENM px-[15%] py-[5%] place-items-center rounded-b-lg"
        >
          <p class="font-manrope-extrab text-white text-[26px]">
            Actualizar contraseña
          </p>
          <div class="mt-5">
            <p class="font-manrope-r text-amarilloIENM mb-2 text-lg">
              Contraseña nueva
            </p>
            <Password
              v-model="contraseña"
              toggleMask
              :feedback="false"
              class="w-full text-base"
            />
          </div>
          <div class="mt-5 mb-7">
            <p class="font-manrope-r text-amarilloIENM mb-2 text-lg">
              Vuelve a escribir la contraseña
            </p>
            <Password
              v-model="confirmacion"
              toggleMask
              :feedback="false"
              class="w-full text-base"
            />
          </div>
          <button
            class="bg-verdeIENM text-black w-full font-manrope-r hover:text-white hover:bg-verdeOscIENM rounded-md p-2 tracking-widest mb-5"
          >
            Actualizar
          </button>
        </div>
      </div>
    </body>
  </html>
</template>

<script lang="ts" setup>
const contraseña = ref();
const confirmacion = ref();

definePageMeta({
  layout: "login",
});
</script>
