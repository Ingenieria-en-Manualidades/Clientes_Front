<template>
  <form class="w-[50%] max-w-[200px] sm:max-w-[230px] text-xs sm:text-base">
    <fieldset
      class="border-[1px] border-black font-manrope-r rounded-lg p-2 sm:p-3"
    >
      <legend class="px-1 font-manrope-l">Inspección sol</legend>
      <p class="font-bold mb-1">Mes</p>
      <p v-if="errorsInsp.dateInspSol" class="text-red-500 text-sm pb-1">
        Este campo es obligatorio
      </p>
      <Calendar
        v-model="dateInspSol"
        :manualInput="false"
        view="month"
        dateFormat="yy/mm"
        showIcon
        fluid
        inputClass="w-full"
        iconDisplay="input"
      />
      <p class="font-bold mt-4 mb-1">Calificación (%)</p>
      <p
        v-if="errorsInsp.calificacionInspSol"
        class="text-red-500 text-sm pb-1"
      >
        Este campo es obligatorio
      </p>
      <input
        type="text"
        v-model="calInspSol"
        maxlength="3"
        class="border-[1px] border-gray-500 rounded-md p-2 outline-none w-full"
      />
      <div class="mt-5">
        <input
          type="file"
          ref="fileInput"
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
      <div v-if="fileSol" class="flex mt-1 max-w-[203px]">
        <p
          class="p-1 text-sm truncate w-[85%] border-[1px] border-gray-400"
          :title="fileSol.name"
        >
          {{ fileSol.name }}
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
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import { useObjetivosApi } from "../../composables/objetivos/useObjetivosApi";

const date = new Date();
const toast = useToast();
const idCliente = useCookie("idCliente");

const fileInput = ref<HTMLInputElement | null>(null);
const { createCalidad } = useObjetivosApi();

const regex = /[0-9]/;
const calInspSol = ref();
const dateInspSol = ref();
const fileSol = ref<File | null>(null);
const errorFileSol = ref<string | null>(null);

const emits = defineEmits(["listar"]);

const removeArchivo = () => {
  fileSol.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

let errorsInsp = ref({
  dateInspSol: false,
  calificacionInspSol: false,
  fileSol: false,
});

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

  const objCalidad = {
    fecha: dateInspSol.value,
    cliente_endpoint_id: Number(idCliente.value),
    checklist: null,
    inspeccion: Number(calInspSol.value),
    archivo: fileSol.value,
    tipo_formulario: "inspeccion_sol",
    yearFile: String(date.getFullYear()),
  };

  if (noErrors) {
    if (regex.test(calInspSol.value)) {
      const resultado = await createCalidad(objCalidad);

      if (resultado.success) {
        dateInspSol.value = "";
        calInspSol.value = "";
        removeArchivo();
        emits("listar");
        toast.add({
          severity: "success",
          summary: "Guardado correctamente.",
          detail: resultado.data.message,
          life: 3000,
        });
      } else {
        toast.add({
          severity: "error",
          summary: "Error al guardar.",
          detail: resultado.error,
          life: 3000,
        });
      }
    } else {
      toast.add({
        severity: "error",
        summary: "Error de valores.",
        detail: "Por favor solo ingresar números en los campos.",
        life: 3000,
      });
    }
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
