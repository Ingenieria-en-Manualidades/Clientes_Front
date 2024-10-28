<template>
  <form class="flex gap-5">
    <fieldset class="border-[1px] border-black rounded-lg p-3 font-manrope-r">
      <legend class="px-1 font-manrope-l">CheckList</legend>
      <p class="font-bold text-lg mb-1">Mes</p>
      <p v-if="errors.dateCheck" class="text-red-500 text-sm pb-1">
        Este campo es obligatorio
      </p>
      <input
        type="month"
        class="w-full border-[1px] border-gray-500 font-manrope-r outline-none rounded p-2"
      />
      <p class="font-bold text-lg mt-4 mb-1">Calificación</p>
      <p v-if="errors.calificacionCheck" class="text-red-500 text-sm pb-1">
        Este campo es obligatorio
      </p>
      <input
        type="text"
        v-model="calCheck"
        class="border-[1px] border-gray-500 rounded-md p-2 outline-none w-full"
      />
      <div class="my-5">
        <input type="file" class="hidden" id="fileCheck" />
        <label
          for="fileCheck"
          class="flex justify-center mt-3 py-2 bg-[#c86a2b] font-bold text-white cursor-pointer rounded-lg"
        >
          <i class="pi pi-upload pr-3 pt-1"></i> Agregar evidencia</label
        >
      </div>
      <div class="flex justify-center font-bold">
        <button
          type="button"
          class="bg-[#4789c8] w-full py-2 rounded-lg text-white"
        >
          Guardar
        </button>
      </div>
    </fieldset>
    <fieldset class="border-[1px] border-black font-manrope-r rounded-lg p-3">
      <legend class="px-1 font-manrope-l">Inspección sol</legend>
      <p class="font-bold text-lg mb-1">Mes</p>
      <p v-if="errors.dateInspSol" class="text-red-500 text-sm pb-1">
        Este campo es obligatorio
      </p>
      <input
        type="month"
        class="w-full border-[1px] border-gray-500 font-manrope-r outline-none rounded p-2"
      />
      <p class="font-bold text-lg mt-4 mb-1">Calificación</p>
      <p v-if="errors.calificacionInspSol" class="text-red-500 text-sm pb-1">
        Este campo es obligatorio
      </p>
      <input
        type="text"
        v-model="calInspSol"
        class="border-[1px] border-gray-500 rounded-md p-2 outline-none w-full"
      />
      <div class="my-5">
        <input type="file" class="hidden" id="fileSol" />
        <label
          for="fileSol"
          class="flex justify-center mt-3 py-2 bg-[#c86a2b] font-bold text-white cursor-pointer rounded-lg"
        >
          <i class="pi pi-upload pr-3 pt-1"></i> Agregar evidencia</label
        >
      </div>
      <div class="flex justify-center font-bold">
        <button
          type="button"
          class="bg-[#4789c8] w-full py-2 rounded-lg text-white"
        >
          Guardar
        </button>
      </div>
    </fieldset>
  </form>
</template>

<script lang="ts" setup>
import { defineExpose, ref } from "vue";
import { useObjetivosApi } from "../../composables/objetivos/useObjetivosApi";

const dateCheck = ref();
const dateInspSol = ref();
const archivo = ref<File | undefined>();
const calCheck = ref();
const calInspSol = ref();
const { createCalidad } = useObjetivosApi();

let errors = ref({
  dateCheck: false,
  calificacionCheck: false,
  dateInspSol: false,
  calificacionInspSol: false,
});

// Método para validar y enviar el formulario
const submitForm = async (metaID: number) => {
  //Reiniciar los errores
  errors.value = {
    dateCheck: false,
    calificacionCheck: false,
    dateInspSol: false,
    calificacionInspSol: false,
  };

  console.log("metaID calidad: ", metaID);

  if (!dateCheck.value) errors.value.dateCheck = true;
  if (!dateInspSol.value) errors.value.dateInspSol = true;
  if (!calCheck.value) errors.value.calificacionCheck = true;
  if (!calInspSol.value) errors.value.calificacionInspSol = true;

  const objCalidad = {
    checklist: Number(calCheck.value),
    inspeccion: Number(calInspSol.value),
    meta_id: metaID,
  };

  const resultado = await createCalidad(objCalidad);

  if (resultado.success) {
    dateCheck.value = "";
    dateInspSol.value = "";
    calCheck.value = "";
    calInspSol.value = "";
    return true;
  } else {
    console.error(resultado.error);
    return false;
  }
};

// Exponer el método `submitForm` para que el componente padre pueda acceder a él
defineExpose({
  submitForm,
});
</script>
