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
      :header="'Aceptar o Rechazar.'"
      :style="{ width: '25rem' }"
    >
      <p class="font-manrope-b">Actividad y Descripción:</p>
      <p class="font-manrope-r">{{ actividad }}</p>
      <Textarea v-model="descripcion" autoResize rows="1" cols="29" disabled />
      <div class="border-2 px-[9%] py-[3%] rounded-md mt-2">
        <p class="font-manrope-b pb-1">Acción:</p>
        <select
          v-model="opcion"
          required
          class="bg-white rounded border-[1px] w-[70%] p-2"
        >
          <option value="" disabled>Selecciona una Opción</option>
          <option value="Aprobado" @click="estadoTextArea(true)">
            Aceptar Improductividad
          </option>
          <option value="Rechazado" @click="estadoTextArea(false)">
            Rechazar Improductividad
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
          @click="agregar()"
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

const opcion = ref(); //Variable que guarda la opción de como guardar la remisión.
const motivo = ref(); //Varable para guardar el motivo del rechazo.
let disable = ref(true); //Variable que define es estado del textArea.
const toast = useToast();
const visible = ref(false);
const usuario = useCookie("usuario");
const idCliente = useCookie("idCliente");
const descripcion = ref(props.descripcion);
const { agregarImproductividad } = useImproductividadesAPI();
let mensaje: mensajeSencillo = {
  status: undefined,
  tittle: "",
  detail: "",
};

//Método que bloquea el TextArea del motivo si la opción escogida es "Rechazar".
const estadoTextArea = (estado: boolean) => {
  disable.value = estado;
  if (disable) {
    motivo.value = "";
  }
};

const agregar = async () => {
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
      const improductividad = ref<postImproductividad>({
        improductividad_id: props.idImproductividad,
        estado: opcion.value,
        motivo: motivo.value,
        usuario_gestiona: usuario.value,
        usuario: "systemCLIENT",
        cliente_id: idCliente.value,
      });

      //Se realiza la inserción llamando a este método.
      mensaje = await agregarImproductividad(improductividad.value);
      emit("postGuardar");
      visible.value = false;
      motivo.value = "";
    }
  }
  toast.add({
    severity: mensaje.status,
    summary: mensaje.tittle,
    detail: mensaje.detail,
    life: 3000,
  });
};
</script>
