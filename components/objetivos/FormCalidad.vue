<template>
  <div>
    <form class="flex gap-16">
      <fieldset class="border-[1px] border-black rounded-lg p-3">
        <legend class="px-1 font-manrope-l">CheckList</legend>
        <p class="font-manrope-b text-lg mb-1">Mes</p>
        <select
          class="bg-white text-lg border-[1px] border-black py-1 px-2 rounded-md font-manrope-r mb-5"
        >
          <option
            v-for="(mes, index) in meses"
            v-bind:key="index"
            :value="index"
          >
            {{ mes }}
          </option>
        </select>
        <p class="font-manrope-b text-lg mb-1">Calificación</p>
        <input
          type="text"
          class="border-[1px] border-black rounded-md w-[90%] font-manrope-r p-1 outline-none"
        />
      </fieldset>
      <fieldset class="border-[1px] border-black rounded-lg p-3">
        <legend class="px-1 font-manrope-l">Inspección sol</legend>
        <p class="font-manrope-b text-lg mb-1">Mes</p>
        <select
          class="bg-white text-lg border-[1px] border-black py-1 px-2 rounded-md font-manrope-r mb-5"
        >
          <option
            v-for="(mes, index) in meses"
            v-bind:key="index"
            :value="index"
          >
            {{ mes }}
          </option>
        </select>
        <p class="font-manrope-b text-lg mb-1">Calificación</p>
        <input
          type="text"
          class="border-[1px] border-black rounded-md w-[90%] font-manrope-r p-1 outline-none"
        />
      </fieldset>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const meses = ref([
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]);
</script>
