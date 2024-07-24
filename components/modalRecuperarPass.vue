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
import { useToast } from "primevue/usetoast";
import { useValidarEmail } from "~/composables/login/validaciones";

const toast = useToast();
const visible = ref(false);
const correo = ref();
const { validarEmail } = useValidarEmail();

const enviar = async () => {
  const respuesta = validarEmail(correo.value);

  if (respuesta.status === "success") {
    try {
      const response = await fetch("/api/enviarEmailPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: correo.value,
        }),
      });
      console.log("ok", response.ok);
      console.log("correo", correo.value);

      if (response.ok) {
        respuesta.tittle = "Correo enviado";
        respuesta.detail =
          "Por favor revise su correo para continuar con el proceso de recuperar contraseña.";
      } else {
        console.error("Error con el response");
        respuesta.status = "error";
        respuesta.tittle = "Correo no enviado";
        respuesta.detail = "ERROR EN EL RESPONSE";
      }
    } catch (error) {
      console.error("Error en el catch", error.message);
      respuesta.status = "error";
      respuesta.tittle = "Correo no enviado";
      respuesta.detail = "ERROR EN EL CATCH";
    }
  }

  toast.add({
    severity: respuesta.status,
    summary: respuesta.tittle,
    detail: respuesta.detail,
    life: 3000,
  });
};
</script>
