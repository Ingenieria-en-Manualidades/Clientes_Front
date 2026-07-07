<template>
  <form id="formInspectionSol" class="min-w-0 w-full text-sm">
    <fieldset class="h-full min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-5">
      <legend class="px-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
        Inspección sol
      </legend>
      <div class="mb-4 flex items-center gap-3">
        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-azulClaroIENM/10 text-azulClaroIENM">
          <i class="pi pi-search"></i>
        </span>
        <div class="min-w-0">
          <h3 class="font-semibold text-slate-900">Inspección de calidad</h3>
          <p class="text-sm text-slate-500">Registra el resultado mensual de inspección y su evidencia.</p>
        </div>
      </div>

      <div class="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,170px)_minmax(0,150px)_minmax(0,1fr)]">
        <div class="min-w-0">
          <label class="mb-1 block text-sm font-semibold text-slate-700">Mes</label>
          <Calendar
            id="calendarInspectionSol"
            v-model="dateInspSol"
            :manualInput="false"
            view="month"
            dateFormat="yy/mm"
            showIcon
            fluid
            inputClass="w-full rounded-lg border border-slate-200 px-3 py-2 shadow-sm"
            iconDisplay="input"
          />
          <p v-if="errorsInsp.dateInspSol" class="mt-1 text-sm font-semibold text-red-500">
            Este campo es obligatorio
          </p>
        </div>

        <div class="min-w-0">
          <label class="mb-1 block text-sm font-semibold text-slate-700">Calificación (%)</label>
          <input
            id="inputInspectionSolScore"
            type="text"
            v-model="calInspSol"
            maxlength="3"
            class="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-900 outline-none transition focus:border-azulClaroIENM focus:bg-white"
            placeholder="Ej: 98"
          />
          <p
            v-if="errorsInsp.calificacionInspSol"
            class="mt-1 text-sm font-semibold text-red-500"
          >
            Este campo es obligatorio
          </p>
        </div>

        <div class="min-w-0 md:col-span-2 xl:col-span-1">
          <label class="mb-1 block text-sm font-semibold text-slate-700">Evidencia</label>
          <div id="divFileSol" class="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-2">
            <input
              type="file"
              ref="fileInput"
              class="hidden"
              id="fileSol"
              @change="subirArchivoSol"
            />
            <label
              for="fileSol"
              class="flex min-h-10 cursor-pointer items-center justify-center rounded-lg bg-[#c86a2b] px-4 text-center font-semibold text-white transition hover:bg-[#b85f25]"
            >
              <i class="pi pi-upload pr-2"></i>Cargar PDF</label
            >
          </div>
          <p class="mt-1 text-sm font-semibold text-red-500">
            {{ errorFileSol }}
          </p>
        </div>
      </div>

      <div class="mt-5 flex min-w-0 flex-col gap-3 font-bold sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0 flex-1">
          <div v-if="fileSol" class="flex min-w-0 max-w-full overflow-hidden rounded-lg border border-slate-200 sm:max-w-sm">
            <p
              class="min-w-0 flex-1 truncate bg-white p-2 text-sm font-normal text-slate-600"
              :title="fileSol.name"
            >
              {{ fileSol.name }}
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
          id="btnSaveInspectionSol"
          type="button"
          class="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#0063a6] px-5 py-2 text-center font-semibold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#00558f] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-44"
          @click="submitSol()"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? "Guardando..." : "Guardar inspección" }}
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
const isSubmitting = ref(false);

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
  if (isSubmitting.value) return;

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
      if (calInspSol.value >= 0 && calInspSol.value < 101) {
        isSubmitting.value = true;

        try {
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
        } finally {
          isSubmitting.value = false;
        }
      } else {
        toast.add({
          severity: "warn",
          summary: "Mala digitación.",
          detail: "Por favor no digitar un número negativo o mayor a 100.",
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
