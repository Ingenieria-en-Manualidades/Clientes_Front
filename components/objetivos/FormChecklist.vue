<template>
  <form id="formChecklist" class="min-w-0 w-full text-sm">
    <fieldset class="h-full min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-5">
      <legend class="px-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
        CheckList
      </legend>
      <div class="mb-4 flex items-center gap-3">
        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-azulClaroIENM/10 text-azulClaroIENM">
          <i class="pi pi-check-square"></i>
        </span>
        <div class="min-w-0">
          <h3 class="font-semibold text-slate-900">Calidad de checklist</h3>
          <p class="text-sm text-slate-500">Registra el porcentaje mensual y adjunta la evidencia en PDF.</p>
        </div>
      </div>

      <div class="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,170px)_minmax(0,150px)_minmax(0,1fr)]">
        <div class="min-w-0">
          <label class="mb-1 block text-sm font-semibold text-slate-700">Mes</label>
          <Calendar
            id="calendarChecklist"
            v-model="dateCheck"
            :manualInput="false"
            view="month"
            dateFormat="yy/mm"
            showIcon
            fluid
            inputClass="w-full rounded-lg border border-slate-200 px-3 py-2 shadow-sm"
            iconDisplay="input"
          />
          <p v-if="errorsCheck.dateCheck" class="mt-1 text-sm font-semibold text-red-500">
            Este campo es obligatorio
          </p>
        </div>

        <div class="min-w-0">
          <label class="mb-1 block text-sm font-semibold text-slate-700">Calificación (%)</label>
          <input
            id="inputChecklistScore"
            type="text"
            v-model="calCheck"
            maxlength="3"
            class="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-900 outline-none transition focus:border-azulClaroIENM focus:bg-white"
            placeholder="Ej: 95"
          />
          <p v-if="errorsCheck.calificacionCheck" class="mt-1 text-sm font-semibold text-red-500">
            Este campo es obligatorio
          </p>
        </div>

        <div class="min-w-0 md:col-span-2 xl:col-span-1">
          <label class="mb-1 block text-sm font-semibold text-slate-700">Evidencia</label>
          <div id="divFileCheck" class="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-2">
            <input
              type="file"
              ref="fileInput"
              class="hidden"
              id="fileCheck"
              @change="subirArchivoCheck"
            />
            <label
              for="fileCheck"
              class="flex min-h-10 cursor-pointer items-center justify-center rounded-lg bg-[#c86a2b] px-4 text-center font-semibold text-white transition hover:bg-[#b85f25]"
            >
              <i class="pi pi-upload pr-2"></i>Cargar PDF</label
            >
          </div>
          <p class="mt-1 text-sm font-semibold text-red-500">
            {{ errorFileCheck }}
          </p>
        </div>
      </div>

      <div class="mt-5 flex min-w-0 flex-col gap-3 font-bold sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0 flex-1">
          <div v-if="fileCheck" class="flex min-w-0 max-w-full overflow-hidden rounded-lg border border-slate-200 sm:max-w-sm">
            <p
              class="min-w-0 flex-1 truncate bg-white p-2 text-sm font-normal text-slate-600"
              :title="fileCheck.name"
            >
              {{ fileCheck.name }}
            </p>
            <button
              type="button"
              @click="removeArchivo"
              class="shrink-0 bg-red-500 px-3 font-bold text-white"
            >
              <i class="pi pi-times text-sm text-white"></i>
            </button>
          </div>
        </div>
        <button
          id="btnSaveChecklist"
          type="button"
          class="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#0063a6] px-5 py-2 text-center font-semibold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#00558f] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-44"
          @click="submitCheck()"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? "Guardando..." : "Guardar checklist" }}
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
const isSubmitting = ref(false);

const emits = defineEmits(["listar"]);

const removeArchivo = () => {
  fileCheck.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// Método para validar y enviar el formulario
const submitCheck = async () => {
  if (isSubmitting.value) return;

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
      if (calCheck.value >= 0 && calCheck.value < 101) {
        isSubmitting.value = true;

        try {
          const resultado = await createCalidad(objCalidad);

          if (resultado.success) {
            dateCheck.value = "";
            calCheck.value = "";
            removeArchivo();
            emits("listar");
            showAlert(
              "success",
              "Guardado correctamente.",
              resultado.data.message
            );
          } else {
            showAlert("error", "Error al guardar.", resultado.error);
          }
        } finally {
          isSubmitting.value = false;
        }
      } else {
        showAlert(
          "warn",
          "Mala digitación.",
          "Por favor no digitar un número negativo o mayor a 100."
        );
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
