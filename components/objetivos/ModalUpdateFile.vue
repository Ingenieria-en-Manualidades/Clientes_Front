<template>
  <button id="btnModalUpdateFile"
    type="button"
    @click="visible = !visible"
    class="inline-flex min-h-10 min-w-28 items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
  >
    <span>Actualizar</span>
  </button>
  <div class="">
    <Dialog
      v-model:visible="visible"
      modal
      header="ACTUALIZAR EVIDENCIA"
      class="dialog"
      :style="{ width: '30rem' }"
      id="dialogUpdateFile"
    >
      <div class="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center shadow-sm">
        <i class="pi pi-info-circle text-3xl text-red-500"></i>
        <p class="mb-1 mt-2 text-lg font-bold text-red-500">
          Al actualizar se reemplazará este archivo:
        </p>
        <p class="truncate rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600" :title="nameFile">{{ nameFile }}</p>
        <div id="divUpdateFile" class="mt-5 mb-1">
          <input
            type="file"
            ref="fileInput"
            class="hidden"
            id="file"
            @change="subirArchivoCheck"
          />
          <label
            for="file"
            class="mt-3 flex min-h-10 cursor-pointer items-center justify-center rounded-lg bg-[#c86a2b] px-4 py-2 font-bold text-white transition hover:bg-[#b85f25]"
          >
            <i class="pi pi-upload pr-2"></i>Cargar nueva evidencia</label
          >
        </div>
        <p class="text-left text-sm font-semibold text-red-500">{{ errorFile }}</p>
        <div v-if="file" class="mt-2 flex min-w-0 max-w-full overflow-hidden rounded-lg border border-slate-200">
          <p
            class="min-w-0 flex-1 truncate bg-white p-2 text-sm text-slate-600"
            :title="file.name"
          >
            {{ file.name }}
          </p>
          <button
            type="button"
            @click="removeArchivo"
            class="shrink-0 bg-red-500 px-3 font-bold text-white"
          >
            <i class="pi pi-times text-sm text-white"></i>
          </button>
        </div>
        <div class="mt-5 flex justify-center font-bold">
          <button 
            id="btnUpdateFileModal"
            type="button"
            @click="update"
            class="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#4789c8] px-5 py-2 text-center text-white transition hover:bg-[#3c78b2] disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Actualizando..." : "Actualizar" }}
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import { useFilesApi } from "../../composables/objetivos/useFilesApi";
import type { UpdateArchivo } from "../../interfaces/objetives";

const props = defineProps({
  nameFile: {
    type: String,
    required: true,
  },
  idFile: {
    type: Number,
    required: true,
  },
  tipoFormulario: {
    type: String,
    required: true,
  },
  yearFile: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  tableroSaeID: {
    type: Number,
    required: true,
  },
});
const emits = defineEmits(["listar"]);

const visible = ref(false);
const toast = useToast();
const file = ref<File | null>(null);
const idCliente = useCookie("idCliente");
const errorFile = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const isSubmitting = ref(false);

const { updateFile } = useFilesApi();

const subirArchivoCheck = (event: Event) => {
  const target = event.target as HTMLInputElement;

  // Obtenemos el archivo cargado
  const archivoCargado = target.files ? target.files[0] : null;

  // Verificamos que el archivo ha sido seleccionado
  if (archivoCargado) {
    // Validamos que el archivo sea tipo .pdf
    if (archivoCargado.type === "application/pdf") {
      // Guardamos el archivo en una variable ref
      file.value = archivoCargado;
      errorFile.value = null;
    } else {
      // En caso de haber seleccionado un anterior y no volver a elegir uno
      errorFile.value = "* El archivo debe ser PDF.";
      file.value = null;
    }
  } else {
    errorFile.value = "* No hay ningún archivo agregado.";
    file.value = null;
  }
};

const removeArchivo = () => {
  file.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const update = async () => {
  if (isSubmitting.value) return;

  if (file.value) {
    const year = new Date(props.yearFile);
    const objeto = ref<UpdateArchivo>({
      archivo: file.value,
      cliente_endpoint_id: Number(idCliente.value),
      tipo_formulario: props.tipoFormulario
        .replace(" ", "_")
        .replace("ó", "o")
        .toLowerCase(),
      tablero_sae_id: props.tableroSaeID,
      year_file: String(year.getFullYear()),
      url: props.url,
      id: props.idFile,
    });

    isSubmitting.value = true;

    try {
      const response = await updateFile(objeto.value);

      if (response.success) {
        removeArchivo();
        emits("listar");
        visible.value = false;
        toast.add({
          severity: "success",
          summary: "Actualización exitosa.",
          detail: "Se han guardado de la calidad.",
          life: 4000,
        });
      } else {
        toast.add({
          severity: "error",
          summary: "Error al actualizar.",
          detail: response.error,
          life: 4000,
        });
      }

      console.log("SUCCESS RESPONSE: ", response.success);
    } finally {
      isSubmitting.value = false;
    }
  } else {
    errorFile.value = "* No hay ningún archivo agregado.";
  }
};
</script>
