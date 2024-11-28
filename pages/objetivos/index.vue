<template>
  <div class="w-full py-3 px-5">
    <FormObjetivosMen />
    <ListaFiltro :opciones="opciones" v-model="genero" @metodo="alerta" />
    <p>{{ genero }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FormObjetivosMen from "~/components/objetivos/FormObjetivosMen.vue";
import ListaFiltro from "~/components/dinamicos/ListaFiltro.vue";

const genero = ref();
const opciones = ref(["Hetero", "Gay", "Panadero", "Helicoptero"]);

const alerta = () => {
  alert("Géneros: " + genero.value);
};
</script>
