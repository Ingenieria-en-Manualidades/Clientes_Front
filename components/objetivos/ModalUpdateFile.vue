<template>
  <button
    type="button"
    @click="visible = true"
    class="bg-green-400 rounded m-1 py-1 px-3 text-white text-center font-manrope-r relative group"
  >
    <span>Actualizar</span>
  </button>
  <div class="font-manrope-r">
    <Dialog
      v-model:visible="visible"
      modal
      header="ACTUALIZAR EVIDENCIA"
      class="dialog"
      :style="{ width: '30rem' }"
    >
      <div class="border-[1px] border-black py-3 px-5 text-center rounded">
        <i class="pi pi-info-circle text-3xl text-red-500"></i>
        <p class="text-xl text-red-500 font-bold mb-1">
          Tenga en cuenta que a la hora de actualizar se borrara el siguente
          archivo:
        </p>
        <p>{{ nameFile }}</p>
        <div class="mt-5 mb-1">
          <input
            type="file"
            ref="fileInput"
            class="hidden"
            id="file"
            @change="subirArchivoCheck"
          />
          <label
            for="file"
            class="flex justify-center mt-3 py-2 bg-[#c86a2b] font-bold text-white cursor-pointer rounded-lg"
          >
            <i class="pi pi-upload pr-3 pt-1"></i>Cargar nueva evidencia</label
          >
        </div>
        <p class="text-left text-red-500 text-sm">{{ errorFile }}</p>
        <div v-if="file" class="flex justify-start mt-1 max-w-full">
          <p
            class="p-1 text-sm truncate border-[1px] border-gray-400"
            :title="file.name"
          >
            {{ file.name }}
          </p>
          <button
            type="button"
            @click="removeArchivo"
            class="px-2 font-bold bg-red-500 border-[1px] border-red-500"
          >
            <i class="pi pi-times text-sm text-white"></i>
          </button>
        </div>
        <div class="flex justify-center font-bold mt-5">
          <button
            type="button"
            @click="update"
            class="bg-[#4789c8] w-full py-2 rounded-lg text-white"
          >
            Actualizar
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
  } else {
    errorFile.value = "* No hay ningún archivo agregado.";
  }
};
</script>
