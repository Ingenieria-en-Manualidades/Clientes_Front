<template>
  <p
    class="ml-[12%] mt-1 text-xs cursor-pointer md:text-sm lg:text-sm text-white font-manrope-r hover:text-amarilloIENM"
    @click="visible = true"
  >
    ¿Olvidaste tu contraseña?
  </p>
  <Dialog
    v-model:visible="visible"
    modal
    header="Recuperar contraseña"
    :style="{ width: '23rem' }"
  >
    <div class="block justify-center items-center mb-5">
      <p class="font-manrope-r mb-3 ml-1">Correo electrónico</p>
      <IconField>
        <InputIcon class="pi pi-envelope" />
        <InputText v-model="correo" @input="validarEmail" />
      </IconField>
    </div>
    <div class="flex justify-end gap-2">
      <button
        class="bg-red-500 rounded-lg py-1 px-3 font-manrope-r text-white"
        @click="visible = false"
      >
        Regresar
      </button>
      <button
        class="bg-verdeOscIENM rounded-lg py-1 px-3 font-manrope-r text-white"
        @click="enviar"
      >
        Enviar
      </button>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
//Importamos variable para utilizar los mensajes 'Toast' de primevue.
import { useToast } from "primevue/usetoast";
//Importamos modelo de un mensaje Toast.
import type { mensajeSencillo } from "../interfaces/mensajes";
import { useValidaciones } from "../composables/login/validaciones";
import { useActualizarPasswordAPI } from "../composables/login/ActualizarPasswordAPI";

const correo = ref(); //Variable que contiene el valor del input correo.
const toast = useToast(); //Variable para los mensajes.
const visible = ref(false); //Variable para aparecer y desaparecer la modal.

const { validarEmail } = useValidaciones();
const { getTokenPassword, setEnviarEmail } = useActualizarPasswordAPI();

// Método que realiza todo el proceso de envío y toma las precauciones antes de hacerlo.
const enviar = async () => {
  let mensaje = ref<mensajeSencillo>({
    status: undefined,
    tittle: undefined,
    detail: undefined,
  });

  //Método que verifica si el correo esta bien diligenciado.
  const validar = validarEmail(correo.value);

  if (validar.success) {
    //Se verifica el correo y crea el token para la URL.
    const resultadoToken = await getTokenPassword(correo.value);

    if (resultadoToken?.success) {
      //Se envia el correo con el link donde estara escrito el token.
      const resultadoEmail = await setEnviarEmail(
        correo.value,
        resultadoToken.token
      );

      mensaje.value.status = resultadoEmail.status;
      mensaje.value.tittle = resultadoEmail.tittle;
      mensaje.value.detail = resultadoEmail.detail;

      visible.value = false; //Cierra la modal automaticamente.
    } else {
      mensaje.value.status = "error";
      mensaje.value.tittle = "Error " + resultadoToken.status;
      mensaje.value.detail = resultadoToken.motivo;
    }
  } else {
    mensaje.value.status = validar.status;
    mensaje.value.tittle = validar.tittle;
    mensaje.value.detail = validar.detail;
  }

  toast.add({
    severity: mensaje.value.status,
    summary: mensaje.value.tittle,
    detail: mensaje.value.detail,
    life: 4000,
  });
};
</script>
