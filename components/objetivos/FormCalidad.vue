<template>
  <form class="w-[50%] max-w-[200px] sm:max-w-[250px] text-xs sm:text-base">
    <fieldset
      class="border-[1px] border-black rounded-lg p-2 sm:p-3 font-manrope-r"
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
          @change="subirArchivoCheck"
        />
        <label
          for="fileCheck"
          class="flex justify-center mt-3 py-2 bg-[#c86a2b] font-bold text-white cursor-pointer rounded-lg"
        >
          <i class="pi pi-upload pr-3 pt-1"></i> Cargar evidencia</label
        >
      </div>
      <p class="text-red-500 text-sm">
        {{ errorFileCheck }}
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
  <form class="w-[50%] max-w-[200px] sm:max-w-[250px] text-xs sm:text-base">
    <fieldset
      class="border-[1px] border-black font-manrope-r rounded-lg p-2 sm:p-3"
    >
      <legend class="px-1 font-manrope-l">Inspección sol</legend>
      <p class="font-bold mb-1">Mes</p>
      <p v-if="errorsInsp.dateInspSol" class="text-red-500 text-sm pb-1">
        Este campo es obligatorio
      </p>
      <input
        type="month"
        class="w-full border-[1px] border-gray-500 font-manrope-r outline-none rounded p-2"
        v-model="dateInspSol"
      />
      <p class="font-bold mt-4 mb-1">Calificación</p>
      <p
        v-if="errorsInsp.calificacionInspSol"
        class="text-red-500 text-sm pb-1"
      >
        Este campo es obligatorio
      </p>
      <input
        type="text"
        v-model="calInspSol"
        class="border-[1px] border-gray-500 rounded-md p-2 outline-none w-full"
      />
      <div class="mt-5">
        <input
          type="file"
          class="hidden"
          id="fileSol"
          @change="subirArchivoSol"
        />
        <label
          for="fileSol"
          class="flex justify-center mt-3 py-2 bg-[#c86a2b] font-bold text-white cursor-pointer rounded-lg"
        >
          <i class="pi pi-upload pr-3 pt-1"></i> Cargar evidencia</label
        >
      </div>
      <p class="text-red-500 text-sm">
        {{ errorFileSol }}
      </p>
      <div class="flex justify-center font-bold mt-5">
        <button
          type="button"
          class="bg-[#4789c8] w-full py-2 rounded-lg text-white"
          @click="submitSol()"
        >
          Guardar
        </button>
      </div>
    </fieldset>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useObjetivosApi } from "../../composables/objetivos/useObjetivosApi";

const calCheck = ref();
const dateCheck = ref();
const calInspSol = ref();
const dateInspSol = ref();
const fileSol = ref<File | null>(null);
const fileCheck = ref<File | null>(null);
const errorFileSol = ref<string | null>(null);
const errorFileCheck = ref<string | null>(null);
const { createCalidad } = useObjetivosApi();

let errorsCheck = ref({
  dateCheck: false,
  calificacionCheck: false,
  fileCheck: false,
});

let errorsInsp = ref({
  dateInspSol: false,
  calificacionInspSol: false,
  fileSol: false,
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
    errorFileCheck.value = "No hay ningún archivo agregado.";
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
    fileSol: false,
  };

  if (!dateInspSol.value) errorsInsp.value.dateInspSol = true;
  if (!calInspSol.value) errorsInsp.value.calificacionInspSol = true;
  if (!fileSol.value) {
    errorFileSol.value = "No hay ningún archivo agregado.";
    errorsInsp.value.fileSol = true;
  }

  const noErrors = !Object.values(errorsInsp.value).includes(true);

  // const objCalidad = {
  //   checklist: Number(calCheck.value),
  //   inspeccion: Number(calInspSol.value),
  //   meta_id: metaID,
  // };

  if (noErrors) {
    console.log("Sip SOL");
  } else {
    console.log("nope SOL");
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

const subirArchivoCheck = (event: Event) => {
  const target = event.target as HTMLInputElement;

  // Obtenemos el archivo cargado
  const archivoCargado = target.files ? target.files[0] : null;

  // Verificamos que el archivo ha sido seleccionado
  if (archivoCargado) {
    // Validamos que el archivo sea tipo .pdf
    if (archivoCargado.type === "application/pdf") {
      // Guardamos el archivo en una variable ref
      fileCheck.value = archivoCargado;
      errorFileCheck.value = null;
    } else {
      // En caso de haber seleccionado un anterior y no volver a elegir uno
      errorFileCheck.value = "El archivo debe ser PDF.";
      fileCheck.value = null;
    }
  } else {
    errorFileCheck.value = "No hay ningún archivo agregado.";
    fileCheck.value = null;
  }
};

const subirArchivoSol = (event: Event) => {
  const target = event.target as HTMLInputElement;

  // Obtenemos el archivo cargado
  const archivoCargado = target.files ? target.files[0] : null;

  // Verificamos que el archivo ha sido seleccionado
  if (archivoCargado) {
    // Validamos que el archivo sea tipo .pdf
    if (archivoCargado.type === "application/pdf") {
      // Guardamos el archivo en una variable ref
      fileSol.value = archivoCargado;
      errorFileSol.value = null;
    } else {
      // En caso de haber seleccionado un anterior y no volver a elegir uno
      errorFileSol.value = "El archivo debe ser PDF.";
      fileSol.value = null;
    }
  } else {
    errorFileSol.value = "No hay ningún archivo agregado.";
    fileSol.value = null;
  }
};
</script>
