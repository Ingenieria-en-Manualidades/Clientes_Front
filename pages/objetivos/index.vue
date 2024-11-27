<template>
  <div class="w-full py-3 px-5">
    <FormObjetivosMen />
    <ListaFiltro :opciones="opciones" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FormObjetivosMen from "~/components/objetivos/FormObjetivosMen.vue";
import ListaFiltro from "../../components/dinamicos/ListaFiltro.vue";

const opciones = ref(["Hetero", "Gay", "Panadero", "Helicoptero"]);
</script>
