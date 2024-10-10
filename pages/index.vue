<template>
   <div class="w-[100%] md:w-[850px]">
    <title>Inicio</title>
    </div>
</template>

<script lang="ts" setup>
import logueado from "../middleware/logueado";
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime";
//Método para que no tenga la plantilla HTML por defecto
definePageMeta({
  layout: "default",
  middleware: 'logueado',
});
</script>