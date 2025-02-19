<template>
  <form class="w-[50%] max-w-[200px] sm:max-w-[230px] text-xs sm:text-base">
    <fieldset
      class="border-[1px] border-black rounded-lg p-2 sm:p-3 font-manrope-r"
    >
      <legend class="px-1 font-manrope-l">CheckList</legend>
      <p class="font-bold mb-1">Mes</p>
      <p v-if="errorsCheck.dateCheck" class="text-red-500 text-sm pb-1">
        Este campo es obligatorio
      </p>
      <Calendar
        v-model="dateCheck"
        :manualInput="false"
        view="month"
        dateFormat="yy/mm"
        showIcon
        fluid
        inputClass="w-full"
        iconDisplay="input"
      />
      <p class="font-bold mt-4 mb-1">Calificación (%)</p>
      <p v-if="errorsCheck.calificacionCheck" class="text-red-500 text-sm pb-1">
        Este campo es obligatorio
      </p>
      <input
        type="text"
        v-model="calCheck"
        maxlength="3"
        class="border-[1px] border-gray-500 rounded-md p-2 outline-none w-full"
      />
      <div class="mt-5">
        <input
          type="file"
          ref="fileInput"
          class="hidden"
          id="fileCheck"
          @change="subirArchivoCheck"
        />
        <label
          for="fileCheck"
          class="flex justify-center mt-3 py-2 bg-[#c86a2b] font-bold text-white cursor-pointer rounded-lg"
        >
          <i class="pi pi-upload pr-3 pt-1"></i>Cargar evidencia</label
        >
      </div>
      <div v-if="fileCheck" class="flex mt-1 max-w-[203px]">
        <p
          class="p-1 text-sm truncate w-[85%] border-[1px] border-gray-400"
          :title="fileCheck.name"
        >
          {{ fileCheck.name }}
        </p>
        <button
          type="button"
          @click="removeArchivo"
          class="px-2 font-bold bg-red-500 border-[1px] border-red-500"
        >
          <i class="pi pi-times text-sm text-white"></i>
        </button>
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
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import { useObjetivosApi } from "../../composables/objetivos/useObjetivosApi";

const regex = /[0-9]/;
const calCheck = ref();
const date = new Date();
const dateCheck = ref();
const fileCheck = ref<File | null>(null);
let errorsCheck = ref({
  dateCheck: false,
  calificacionCheck: false,
  fileCheck: false,
});
const errorFileCheck = ref<string | null>(null);
const idCliente = useCookie("idCliente");
const toast = useToast();
const fileInput = ref<HTMLInputElement | null>(null);
const { createCalidad, verificarValoresCalidad } = useObjetivosApi();

const emits = defineEmits(["listar"]);

const removeArchivo = () => {
  fileCheck.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// Método para validar y enviar el formulario
const submitCheck = async () => {
  if (!dateCheck.value) errorsCheck.value.dateCheck = true;
  if (!calCheck.value) errorsCheck.value.calificacionCheck = true;
  if (!fileCheck.value) {
    errorFileCheck.value = "No hay ningún archivo agregado.";
    errorsCheck.value.fileCheck = true;
  }

  const noErrors = !Object.values(errorsCheck.value).includes(true);

  const objCalidad = {
    fecha: dateCheck.value,
    cliente_endpoint_id: Number(idCliente.value),
    checklist: Number(calCheck.value),
    inspeccion: null,
    archivo: fileCheck.value,
    tipo_formulario: "checklist",
    yearFile: String(date.getFullYear()),
  };

  if (noErrors) {
    if (regex.test(calCheck.value)) {
      const resultado = await createCalidad(objCalidad);

      if (resultado.success) {
        dateCheck.value = "";
        calCheck.value = "";
        removeArchivo();
        emits("listar");
        showAlert("success", "Guardado correctamente.", resultado.data.message);
      } else {
        showAlert("error", "Error al guardar.", resultado.error);
      }
    } else {
      showAlert(
        "error",
        "Error de valores.",
        "Por favor solo ingresar números en los campos."
      );
    }
  }
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

const showAlert = (sev: string, sum: string, det: string | undefined) => {
  toast.add({
    severity: sev,
    summary: sum,
    detail: det,
    life: 5000,
  });
};
</script>
