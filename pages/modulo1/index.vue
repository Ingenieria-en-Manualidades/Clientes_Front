<template>
  <div class="">
    <p>MODULO 1 BROOOOOOOO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</p>
    <Tabla :tableInterface="interfaceTable" :data="arrayUser" />
  </div>
</template>

<script lang="ts" setup>
import Tabla from "~/components/dinamicos/Tabla.vue";
import type { tablaDinamica, User } from "~/interfaces/componentesDinamicos";

const interfaceTable = ref<tablaDinamica>({
  styleTable: "border-[1px] border-black font-manrope-r",
  caption: {
    label: "Tabla normal",
    style: "bg-blue-400 text-xl border-[1px] border-black",
  },
  headers: {
    labels: ["header1", "header2", "header3"],
    style:
      "text-white px-5 py-2 border-[1px] bg-red-400 border-black font-manrope-r",
  },
  tbodyStyle: null,
  rowStyle: "border-[1px] border-black text-center bg-green-400",
  tfootStyle: null,
});

const arrayUser = ref<User[]>([
  { id: "1", name: "jos", apellido: "velasco" },
  { id: "2", name: "Karol", apellido: "Villaquiran" },
  { id: "3", name: "jos", apellido: "velasco" },
  { id: "4", name: "Kevin", apellido: "Cadena" },
]);
</script>

<style></style>
