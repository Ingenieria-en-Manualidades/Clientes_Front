<template>
  <form class="w-[22%] max-w-[220px] md:max-w-full text-sm sm:text-base">
    <fieldset
      class="w-full border-[1px] border-black p-2 font-manrope-r rounded"
    >
      <legend class="font-manrope-b">Indicadores</legend>
      <div class="gap-2">
        <input
          type="date"
          :readonly="visible"
          class="w-full border-[1px] border-black outline-none rounded mb-1"
        />
        <div class="mb-2">
          <p>Cumplimiento plan armado:</p>
          <input
            type="text"
            :readonly="visible"
            v-model="planArmado"
            :class="[
              'w-full border-[1px] rounded-md outline-none py-1 pl-2',
              visible ? 'bg-gray-300 border-gray-500' : 'border-black',
            ]"
          />
        </div>
        <div class="mb-2">
          <p>Calidad:</p>
          <input
            type="text"
            :readonly="visible"
            v-model="calidad"
            :class="[
              'w-full border-[1px] rounded-md outline-none py-1 pl-2',
              visible ? 'bg-gray-300 border-gray-500' : 'border-black',
            ]"
          />
        </div>
        <div class="mb-2">
          <p>Desperfecto M.E:</p>
          <input
            type="text"
            :readonly="visible"
            v-model="desperfectosME"
            :class="[
              'w-full border-[1px] rounded-md outline-none py-1 pl-2',
              visible ? 'bg-gray-300 border-gray-500' : 'border-black',
            ]"
          />
        </div>
        <div class="mb-2">
          <p>Desperfecto P.P:</p>
          <input
            type="text"
            :readonly="visible"
            v-model="desperfectosPP"
            :class="[
              'w-full border-[1px] rounded-md outline-none py-1 pl-2',
              visible ? 'bg-gray-300 border-gray-500' : 'border-black',
            ]"
          />
        </div>
      </div>
      <div class="flex justify-center">
        <button
          :disabled="visible"
          :class="[
            'py-1 rounded-md border-[1px] text-white font-manrope-b text-sm sm:text-base w-full',
            visible
              ? 'bg-blue-400 border-blue-400'
              : 'bg-azulClaroIENM border-azulClaroIENM',
          ]"
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

const props = defineProps({
  visible: Boolean,
});
const emit = defineEmits(["setVisible"]);
</script>
