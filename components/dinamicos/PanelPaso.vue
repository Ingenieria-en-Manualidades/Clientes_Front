<template>
  <div>
    <!-- Barra de progreso de pasos -->
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

    <!-- Render del formulario de objetivos (primer paso) -->
    <div class="flex justify-center" v-if="pasoActual === 0">
      <FormObjetivosMen ref="formObjetivos" />
    </div>

    <!-- Render del contenido de otros pasos (ejemplo del segundo paso) -->
    <div class="flex justify-center" v-else-if="pasoActual === 1">
      <FormCalidad ref="formCalidad" />
    </div>

    <div class="flex justify-center" v-else-if="pasoActual === 2">
      <FormAccidentes />
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
        {{ pasoActual === 1 ? "Finalizar" : "Siguiente" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FormObjetivosMen from "../objetivos/FormObjetivosMen.vue";
import FormCalidad from "../objetivos/FormCalidad.vue";
import { useToast } from "primevue/usetoast";

// Definir los pasos del proceso y el paso actual
const pasos = ref(["pi pi-user", "pi pi-star"]);
const pasoActual = ref(0);
const toast = useToast();
let metaID: number;

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

// Definir el tipo para la referencia del formulario
type FormObjetivosMenInstance = {
  submitForm: () => Promise<boolean>;
};

// Crear la referencia con el tipo del componente hijo
const formObjetivos = ref<FormObjetivosMenInstance | null>(null);
const formCalidad = ref<FormObjetivosMenInstance | null>(null);

// Función para validar el formulario y avanzar
const submitAndProceed = async () => {
  if (pasoActual.value === 0 && formObjetivos.value) {
    // Validar el formulario del paso 1
    const isFormValid = await formObjetivos.value.submitForm();
    metaID = isFormValid.metaID;
    console.log("METAID ISFORMVALID: ", isFormValid.metaID);

    if (isFormValid.success) {
      console.log("Formulario válido, procede al siguiente paso");
      pasoSig(); // Avanzar al siguiente paso si es válido
    } else {
      console.log("Errores en el formulario, no puedes avanzar");
    }
  } else if (pasoActual.value === 1 && formCalidad.value) {
    const isFormCalValid = await formCalidad.value.submitForm(metaID);

    if (isFormCalValid) {
      toast.add({
        severity: "success",
        summary: "Guardado correctamente.",
        detail: "Objetivos y calidad del mes guardado correctamente.",
        life: 3000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: "Error a la hora de guardar calidad.",
        detail: "Por favor revisar el error a resolver.",
        life: 3000,
      });
    }
  } else {
    // Lógica para avanzar en otros pasos sin validación (ejemplo para el segundo paso)
    pasoSig();
  }
};
</script>
