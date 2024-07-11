<template>
  <button
    type="button"
    class="bg-amarilloIENM px-3 py-1 rounded hover:bg-[#e1c600]"
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
        >Por favor llenar los dos campos.</small
      >
      <div class="border-2 px-[9%] py-[3%] rounded-md">
        <p class="font-manrope-b pb-1">Acción:</p>
        <select
          v-model="opcion"
          required
          class="bg-white rounded border-[1px] w-[70%] p-2"
        >
          <option value="" disabled>Selecciona una Opcion</option>
          <option value="Aprobado">Aceptar Remision</option>
          <option value="Rechazado">Rechazar Remision</option>
        </select>
        <p class="font-manrope-b pb-1 py-2">Motivo</p>
        <Textarea v-model="motivo" autoResize rows="5" cols="30" />
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
import { ref, defineEmits } from "vue";
import { useToast } from "primevue/usetoast";
import { usarCookies } from "~/composables/cookies";
import type { RemisionPost } from "~/interfaces/remisiones";
import type { mensajeSencillo } from "~/interfaces/mensajes";
import { useRemisionesApi } from "~/composables/remisiones/remisionesApi";

const opcion = ref("");
const motivo = ref("");
const toast = useToast();
const visible = ref(false);
const { idCliente, usuario } = usarCookies();
let mensaje = ref<mensajeSencillo>({ status: "", tittle: "", detail: "" });

const emit = defineEmits(["postGuardarRemision"]);
const { agregarRemision } = useRemisionesApi();

const props = defineProps({
  numRemision: String,
  idRemision: Number,
});

const saveRemision = async () => {
  if (opcion.value === "" || motivo.value === "") {
    mensaje.value.status = "error";
    mensaje.value.tittle = "Hacen falta campos por llenar.";
    mensaje.value.detail = "Por favor llenar los dos campos ¡Es obligatorio!";
  } else {
    const remision = ref<RemisionPost>({
      accion: opcion.value,
      motivo: motivo.value,
      cliente_id: idCliente.value,
      usuario: usuario.value,
      remision_id: props.idRemision,
    });
    mensaje = await agregarRemision(remision.value, props.numRemision);
    emit("postGuardarRemision");
    visible.value = false;
  }
  showMensaje(mensaje.value);
};

const showMensaje = (mensaje: mensajeSencillo) => {
  toast.add({
    severity: mensaje.status,
    summary: mensaje.tittle,
    detail: mensaje.detail,
    life: 3000,
  });
};
</script>

<style></style>
