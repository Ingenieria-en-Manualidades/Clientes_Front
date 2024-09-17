<template>
  <div>
    <form action="">
      <fieldset>
        <p class="font-manrope-b text-lg mb-1">Mes</p>
        <select
          class="bg-white text-lg border-[1px] border-black py-1 px-2 rounded-md font-manrope-r"
        >
          <option
            v-for="(mes, index) in meses"
            v-bind:key="index"
            :value="index"
          >
            {{ mes }}
          </option>
        </select>
      </fieldset>
    </form>
    <div>
      <p class="font-manrope-b text-lg mb-1">MES</p>
      <input
        type="number"
        class="border-[1px] border-black rounded-md w-[90%] font-manrope-r p-1 outline-none"
      />
      <p>inpeccion sol</p>
    </div>
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
