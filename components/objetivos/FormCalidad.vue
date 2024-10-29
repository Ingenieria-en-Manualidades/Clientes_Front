<template>
  <form class="flex w-full justify-center gap-1 text-xs sm:text-base sm:gap-5">
    <fieldset
      class="border-[1px] border-black rounded-lg p-2 sm:p-3 font-manrope-r w-[50%] max-w-[200px] sm:max-w-[250px]"
    >
      <legend class="px-1 font-manrope-l">CheckList</legend>
      <p class="font-bold mb-1">Mes</p>
      <p v-if="errorsCheck.dateCheck" class="text-red-500 text-sm pb-1">
        Este campo es obligatorio
      </p>
      <input
        type="month"
        class="w-full border-[1px] border-gray-500 font-manrope-r outline-none rounded p-2"
        v-model="dateCheck"
      />
      <p class="font-bold mt-4 mb-1">Calificación</p>
      <p v-if="errorsCheck.calificacionCheck" class="text-red-500 text-sm pb-1">
        Este campo es obligatorio
      </p>
      <input
        type="text"
        v-model="calCheck"
        class="border-[1px] border-gray-500 rounded-md p-2 outline-none w-full"
      />
      <div class="mt-5">
        <input
          type="file"
          class="hidden"
          id="fileCheck"
          @change="subirArchivo"
        />
        <label
          for="fileCheck"
          class="flex justify-center mt-3 py-2 bg-[#c86a2b] font-bold text-white cursor-pointer rounded-lg"
        >
          <i class="pi pi-upload pr-3 pt-1"></i> Agregar evidencia</label
        >
      </div>
      <p class="text-red-500 text-sm">
        {{ errorFile }}
      </p>
      <div class="flex justify-center font-bold mt-5">
        <button
          type="button"
          class="bg-[#4789c8] w-full py-2 rounded-lg text-white"
          @click="submitCheck()"
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
const fileCheck = ref<File | null>(null);
const errorFile = ref<string | null>(null);
const calCheck = ref();
const calInspSol = ref();
const { createCalidad } = useObjetivosApi();

let errorsCheck = ref({
  dateCheck: false,
  calificacionCheck: false,
  fileCheck: false,
});

let errorsInsp = ref({
  dateInspSol: false,
  calificacionInspSol: false,
});

// Método para validar y enviar el formulario
const submitCheck = () => {
  //Reiniciar los errores de checkList
  errorsCheck.value = {
    dateCheck: false,
    calificacionCheck: false,
    fileCheck: false,
  };

  if (!dateCheck.value) errorsCheck.value.dateCheck = true;
  if (!calCheck.value) errorsCheck.value.calificacionCheck = true;
  if (!fileCheck.value) {
    errorFile.value = "No hay ningún archivo agregado.";
    errorsCheck.value.fileCheck = true;
  }

  const noErrors = !Object.values(errorsCheck.value).includes(true);

  if (noErrors) {
    console.log("yes");
  } else {
    console.log("nop");
  }
};

const submitSol = async () => {
  errorsInsp.value = {
    dateInspSol: false,
    calificacionInspSol: false,
  };

  if (!dateInspSol.value) errorsInsp.value.dateInspSol = true;
  if (!calInspSol.value) errorsInsp.value.calificacionInspSol = true;

  const noErrors = !Object.values(errorsInsp.value).includes(true);

  // const objCalidad = {
  //   checklist: Number(calCheck.value),
  //   inspeccion: Number(calInspSol.value),
  //   meta_id: metaID,
  // };

  if (noErrors) {
    console.log("Sip");
  } else {
    console.log("nope");
  }

  // const resultado = await createCalidad(objCalidad);

  // if (resultado.success) {
  //   dateCheck.value = "";
  //   dateInspSol.value = "";
  //   calCheck.value = "";
  //   calInspSol.value = "";
  //   return true;
  // } else {
  //   console.error(resultado.error);
  //   return false;
  // }
};

const subirArchivo = (event: Event) => {
  const target = event.target as HTMLInputElement;

  // Obtenemos el archivo cargado
  const archivoCargado = target.files ? target.files[0] : null;

  // Verificamos que el archivo ha sido seleccionado
  if (archivoCargado) {
    // Validamos que el archivo sea tipo .pdf
    if (archivoCargado.type === "application/pdf") {
      // Guardamos el archivo en una variable ref
      fileCheck.value = archivoCargado;
      errorFile.value = null;
    } else {
      // En caso de haber seleccionado un anterior y no volver a elegir uno
      errorFile.value = "El archivo debe ser PDF.";
      fileCheck.value = null;
    }
  } else {
    errorFile.value = "No hay ningún archivo agregado.";
    fileCheck.value = null;
  }
};
</script>
