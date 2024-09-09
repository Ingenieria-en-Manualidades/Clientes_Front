<template>
  <button
    type="button"
    class="bg-amarilloIENM px-3 py-[6px] rounded hover:bg-[#e1c600]"
    @click="visible = true"
  >
    <i class="pi pi-clipboard text-black"></i>
    <span class="text-black font-manrope-r ml-2 hidden sm:inline-flex"
      >Gestionar remisión</span
    >
  </button>
  <div>
    <Dialog
      v-model:visible="visible"
      modal
      :header="'Aceptar o Rechazar.'"
      :style="{ width: '25rem' }"
    >
      <p class="font-manrope-r">N° Remision: {{ props.numRemision }}.</p>
      <small class="text-red-500 font-manrope-r"
        >Por favor llenar el campo 'motivo' en caso de rechazar.</small
      >
      <div class="border-2 px-[9%] py-[3%] rounded-md">
        <p class="font-manrope-b pb-1">Acción:</p>
        <select
          v-model="opcion"
          required
          class="bg-white rounded border-[1px] w-[70%] p-2"
        >
          <option value="" disabled>Selecciona una Opción</option>
          <option value="Aprobado" @click="estadoTextArea(true)">
            Aceptar Remisión
          </option>
          <option value="Rechazado" @click="estadoTextArea(false)">
            Rechazar Remisión
          </option>
        </select>
        <p class="font-manrope-b pb-1 py-2">
          Motivo<i
            :class="
              disable ? 'pi pi-lock float-right' : 'pi pi-lock-open float-right'
            "
          ></i>
        </p>
        <Textarea
          v-model="motivo"
          autoResize
          rows="5"
          cols="29"
          :disabled="disable"
        />
      </div>
      <div class="flex justify-end gap-2 mt-2">
        <button
          type="button"
          class="botones bg-red-500 hover:bg-red-600"
          @click="visible = false"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="botones bg-verdeOscIENM hover:bg-[#c37428]"
          @click="saveRemision()"
        >
          Guardar
        </button>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { useCookie } from "nuxt/app";
//Importamos variable para utilizar los mensajes 'Toast' de primevue.
import { useToast } from "primevue/usetoast";
//Importamos métodos para crear props y emits.
import { defineProps, defineEmits, ref } from "vue";
//Importamos modelos para los Toast y guardar remisiones.
import type { RemisionPost } from "~/interfaces/remisiones";
import type { mensajeSencillo } from "~/interfaces/mensajes";
import { useRemisionesApi } from "~/composables/remisiones/remisionesApi";

const opcion = ref(); //Variable que guarda la opción de como guardar la remisión.
const motivo = ref(); //Varable para guardar el motivo del rechazo.
let disable = ref(true); //Variable que define es estado del textArea.
const toast = useToast();
const visible = ref(false); //Variable que define la aparición de la modal.
const usuario = useCookie("usuario");
const idCliente = useCookie("idCliente");
let mensaje: mensajeSencillo = {
  status: undefined,
  tittle: "",
  detail: "",
};

const { agregarRemision } = useRemisionesApi();
const props = defineProps({
  numRemision: String,
  idRemision: Number,
});
const emit = defineEmits(["postGuardarRemision", "actualizarCampana"]); //Método importado desde el componente.

//Método que bloquea el TextArea del motivo si la opción escogida es "Rechazar".
const estadoTextArea = (estado: boolean) => {
  disable.value = estado;
  if (disable) {
    motivo.value = "";
  }
};

//Método para hacer una inserción en la tabla 'remision_conciliacionxcliente' con la remisión , el estado y el posible motivo de rechazo escogida por el usuario.
const saveRemision = async () => {
  if (!opcion.value) {
    mensaje.status = "error";
    mensaje.tittle = "Hace falta una opción.";
    mensaje.detail = "Por favor elegir una opción antes de guardar.";
  } else {
    if (opcion.value === "Rechazado" && !motivo.value) {
      mensaje.status = "error";
      mensaje.tittle = "Falta del motivo.";
      mensaje.detail = "Por favor escribir el motivo del rechazo.";
    } else {
      //Si la opción es 'Aprobado' el motivo sera 'aprobado' por defecto.
      if (opcion.value === "Aprobado") {
        motivo.value = "aprobado";
      }

      //Se crea el objeto 'RemisionPost' el cual se usara para hacer la inserción con todos los datos necesarios.
      const remision = ref<RemisionPost>({
        accion: opcion.value,
        motivo: motivo.value,
        cliente_id: idCliente.value,
        usuario: usuario.value,
        remision_id: props.idRemision,
      });

      //Se realiza la inserción llamando a este método.
      mensaje = await agregarRemision(remision.value, props.numRemision);
      emit("postGuardarRemision");
      emit("actualizarCampana");
      visible.value = false;
      motivo.value = "";
    }
  }
  showMensaje(mensaje);
};

//Método que realiza el mensaje.
const showMensaje = (mensaje: mensajeSencillo) => {
  toast.add({
    severity: mensaje.status,
    summary: mensaje.tittle,
    detail: mensaje.detail,
    life: 3000,
  });
};
</script>
