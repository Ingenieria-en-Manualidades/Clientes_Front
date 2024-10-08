<template>
  <form class="w-[70%] max-w-[220px] md:max-w-full text-sm sm:text-base">
    <fieldset
      class="w-full border-[1px] border-black p-2 font-manrope-r rounded"
    >
      <legend class="font-manrope-b">Indicadores</legend>
      <div class="md:flex gap-2">
        <div class="md:w-1/3 mb-2">
          <p>Cumplimiento plan armado:</p>
          <input
            type="text"
            v-model="planArmado"
            class="w-full border-[1px] border-black rounded-md outline-none py-1 pl-2"
          />
        </div>
        <div class="md:w-[70px] lg:w-1/4 mb-2">
          <p>Calidad:</p>
          <input
            type="text"
            v-model="calidad"
            class="w-full border-[1px] border-black rounded-md outline-none py-1 pl-2"
          />
        </div>
        <div class="md:w-1/4 mb-2">
          <p>Desperfecto M.E:</p>
          <input
            type="text"
            v-model="desperfectosME"
            class="w-full border-[1px] border-black rounded-md outline-none py-1 pl-2"
          />
        </div>
        <div class="md:w-1/4 mb-2">
          <p>Desperfecto P.P:</p>
          <input
            type="text"
            v-model="desperfectosPP"
            class="w-full border-[1px] border-black rounded-md outline-none py-1 pl-2"
          />
        </div>
      </div>
      <div class="flex justify-center">
        <button
          class="bg-azulClaroIENM py-1 rounded-md border-[1px] border-azulClaroIENM text-white font-manrope-b w-[50%] lg:w-[30%] text-sm sm:text-base"
          type="submit"
        >
          INGRESAR
        </button>
      </div>
    </fieldset>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const planArmado = ref();
const calidad = ref();
const desperfectosME = ref();
const desperfectosPP = ref();
</script>
