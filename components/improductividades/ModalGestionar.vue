<template>
  <button
    type="button"
    class="border-[1px] border-amarilloIENM m-1 py-1 px-1 rounded bg-amarilloIENM text-black"
    @click="visible = !visible"
  >
    <i class="pi pi-clipboard sm:pr-1"></i>
    <span>Gestionar</span>
  </button>
  <div>
    <Dialog
      v-model:visible="visible"
      modal
      :header="'Aceptar o Rechazar'"
      :style="{ width: '25rem' }"
    >
      <p class="font-manrope-b">Actividad y Descripción:</p>
      <p class="font-manrope-r">{{ actividad }}</p>
      <Textarea
        v-model="descripcion"
        autoResize
        rows="1"
        cols="29"
        disabled
        class="mt-2"
      />
      <div class="border-2 px-[9%] py-[3%] rounded-md mt-4">
        <p class="font-manrope-b pb-1">Acción:</p>
        <select
          v-model="opcion"
          required
          class="bg-white rounded border-[1px] w-[70%] p-2"
          @change="onActionChange"
        >
          <option value="" disabled>Selecciona una Opción</option>
          <option value="Aprobado">Aceptar Improductividad</option>
          <option value="Rechazado">Rechazar Improductividad</option>
        </select>
        <p class="font-manrope-b pb-1 py-2">
          Motivo
          <i
            :class="disable ? 'pi pi-lock float-right' : 'pi pi-lock-open float-right'"
          ></i>
        </p>
        <textarea
          v-model="motivo"
          :disabled="disable"
          class="w-full p-1 border-[1px] border-black rounded outline-none"
          placeholder="Escribe el motivo aquí"
        ></textarea>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <button
          type="button"
          class="py-1 px-4 font-manrope-b text-white rounded-lg bg-red-500 hover:bg-red-600"
          @click="cancelar"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="py-1 px-4 font-manrope-b text-white rounded-lg bg-verdeOscIENM hover:bg-[#c37428]"
          @click="guardar"
        >
          Guardar
        </button>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import type { mensajeSencillo } from "../../interfaces/mensajes";
import type { postImproductividad } from "../../interfaces/improductividades";
import { useImproductividadesAPI } from "../../composables/improductividades/improductividadesAPI";

const props = defineProps({
  idImproductividad: Number,
  actividad: String,
  descripcion: String,
});

const emit = defineEmits(["postGuardar"]);

const opcion = ref(""); // Opción seleccionada (Aprobado o Rechazado).
const motivo = ref(""); // Motivo del rechazo o aprobación.
const disable = ref(true); // Estado del textarea.
const visible = ref(false); // Estado del diálogo.
const descripcion = ref(props.descripcion || ""); // Descripción inicial.
const toast = useToast();
const usuario = useCookie("usuario");
const idCliente = useCookie("idCliente");
const { agregarImproductividad } = useImproductividadesAPI();

let mensaje: mensajeSencillo = {
  status: undefined,
  tittle: "",
  detail: "",
};

// Actualiza el estado del textarea basado en la opción seleccionada.
const onActionChange = () => {
  disable.value = opcion.value !== "Rechazado";
  if (disable.value) {
    motivo.value = ""; // Limpia el motivo si se bloquea.
  }
};

// Cancela la acción y cierra el diálogo.
const cancelar = () => {
  visible.value = false;
  opcion.value = "";
  motivo.value = "";
};

// Guarda la improductividad.
const guardar = async () => {
  if (!opcion.value) {
    toast.add({
      severity: "error",
      summary: "Hace falta una opción",
      detail: "Por favor elige una opción antes de guardar.",
      life: 3000,
    });
    return;
  }

  if (opcion.value === "Rechazado" && !motivo.value) {
    toast.add({
      severity: "error",
      summary: "Falta el motivo",
      detail: "Por favor escribe el motivo del rechazo.",
      life: 3000,
    });
    return;
  }

  // Si la opción es Aprobado, el motivo será por defecto "aprobado".
  if (opcion.value === "Aprobado") {
    motivo.value = "aprobado";
  }

  // Construir el objeto de improductividad para enviar.
  const improductividad: postImproductividad = {
    improductividad_id: props.idImproductividad,
    estado: opcion.value,
    motivo: motivo.value,
    usuario_gestiona: usuario.value,
    usuario: "systemCLIENT",
    cliente_id: idCliente.value,
  };

  // Intentar agregar la improductividad.
  try {
    mensaje = await agregarImproductividad(improductividad);
    toast.add({
      severity: mensaje.status,
      summary: mensaje.tittle,
      detail: mensaje.detail,
      life: 3000,
    });
    emit("postGuardar"); // Emitir evento al componente padre.
    cancelar(); // Resetear y cerrar el diálogo.
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error al guardar",
      detail: "Ocurrió un problema al guardar los datos.",
      life: 3000,
    });
  }
};
</script>
