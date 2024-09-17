<template>
  <div>
    <div class="flex items-center mb-8 w-[95%] ml-4">
      <div v-for="(paso, index) in pasos" :key="index" class="flex w-full">
        <Divider v-if="index !== 0" />
        <i
          :class="[`${paso} rounded-[50%] text-xl px-3 py-3 mx-2`,
            pasoActual > index
              ? 'bg-blue-500 text-white'
              : pasoActual === index
              ? 'bg-blue-500 text-white'
              : 'bg-white border-2 border-gray-400'
          ]"
        ></i>
        <Divider v-if="index !== pasos.length - 1" />
      </div>
    </div>

    <div class="flex justify-center">
      <!-- Incluyendo el componente hijo y pasando la referencia -->
      <FormObjetivosMen ref="formObjetivos" />
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
        @click="submitAndProceed"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FormObjetivosMen from '../objetivos/FormObjetivosMen.vue';

// Definir los pasos del proceso y el paso actual
const pasos = ref(["pi pi-user", "pi pi-star", "pi pi-id-card"]);
const pasoActual = ref(0);

// Referencia al formulario hijo
const formObjetivos = ref(null);  // Aquí asignamos la referencia al componente hijo

// Función para avanzar de paso
const pasoSig = () => {
  if (pasoActual.value < pasos.value.length - 1) {
    pasoActual.value++;
  }
};

// Función para retroceder de paso
const pasoAnt = () => {
  if (pasoActual.value > 0) {
    pasoActual.value--;
  }
};

// Función para validar el formulario y avanzar
const submitAndProceed = async () => {
  // Verificamos si la referencia existe y tiene el método submitForm
  if (formObjetivos.value && typeof formObjetivos.value.submitForm === 'function') {
    const isFormValid = await formObjetivos.value.submitForm();

    if (isFormValid) {
      console.log("Formulario válido, procede al siguiente paso");
      pasoSig();  // Si es válido, procede al siguiente paso
    } else {
      console.log("Errores en el formulario, no puedes avanzar");
    }
  } else {
    console.error("No se pudo acceder al método submitForm");
  }
};
</script>
