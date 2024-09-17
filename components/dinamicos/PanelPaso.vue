<template>
  <div>
    <div class="flex items-center mb-8 w-[95%] ml-4">
      <div v-for="(paso, index) in pasos" :key="index" class="flex w-full">
        <Divider v-if="index !== 0" />
        <i
          :class="[
            `${paso} rounded-[50%] text-xl px-3 py-3 mx-2`,
            pasoActual > index
              ? 'bg-blue-500 text-white'
              : pasoActual === index
              ? 'bg-blue-500 text-white'
              : 'bg-white border-2 border-gray-400',
          ]"
        ></i>
        <Divider v-if="index !== pasos.length - 1" />
      </div>
    </div>

    <div class="flex justify-center">
      <slot :pasoActual="pasoActual" />
    </div>

    <div class="flex justify-between w-[95%] ml-5 mt-6">
      <button
        @click="pasoAnt"
        :disabled="pasoActual === 0"
        class="px-4 py-2 bg-gray-300 rounded-lg"
      >
        Anterior
      </button>

      <button
        @click="pasoSig"
        :disabled="pasoActual === pasos.length - 1"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const pasos = ref(["pi pi-user", "pi pi-star", "pi pi-id-card"]);

const pasoActual = ref(0);

const pasoSig = () => {
  if (pasoActual.value < pasos.value.length - 1) {
    pasoActual.value++;
  }
};

const pasoAnt = () => {
  if (pasoActual.value > 0) {
    pasoActual.value--;
  }
};
</script>
