<template>
  <form @submit.prevent="handleSubmit">
    <div class="labelsLogin mt-[7%]">
      <label
        for="username"
        class="text-base md:text-lg lg:text-lg text-amarilloIENM font-manrope-r"
        >Usuario</label
      >
      <p class="text-sm text-white">
        {{ usernameError }}
      </p>
      <InputText
        id="username"
        v-model="usuario"
        class="w-[100%] text-sm p-0"
        aria-describedby="username-help"
        @input="validarUsuario"
      />
    </div>
    <div class="labelsLogin mt-[7%]">
      <label
        class="text-base md:text-lg lg:text-lg text-amarilloIENM font-manrope-r"
        >Contraseña</label
      >
      <Password
        v-model="contrasenia"
        toggleMask
        :feedback="false"
        placeholder=""
      />
    </div>
    <modalRecuperarPass />
    <Button
      label="Enviar"
      class="bg-verdeIENM text-black mt-[10%] mb-[2%] w-[75%] ml-[11.5%] font-manrope-r tracking-wide hover:text-white hover:bg-verdeOscIENM"
      type="submit"
      :disabled="usernameError"
    />
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "#app";
import { useToast } from "primevue/usetoast";
import { loginApi } from "~/composables/loginApi";

//Creo variables 'ref' para recibir la información del usuario
const usuario = ref("");
const contrasenia = ref("");
//Variable que utilizaremos para viajar entre rutas
const router = useRouter();
//Creo variable que establece un error en los inputs
const usernameError = ref<string | null>(null);
//Importamos el método del login
const { login } = loginApi();
//Importamos variable para utilizar los mensajes 'Toast' de primevue
const toast = useToast();

//Función que evalua el input 'usuario' cumpla las condiciones
const validarUsuario = () => {
  if (/[^a-zA-Z0-9 ]/.test(usuario.value)) {
    usernameError.value = "El usuario no puede tener caracteres especiales.";
  } else {
    usernameError.value = null;
  }
};

//Método que llama al endpoint que permite la verficación de usuarios y retorna el token.
const handleSubmit = async () => {
  //llamando al endpoint y guardando el token y el id del cliente de manera local dentro del método 'login'.
  const resultado = await login({
    username: usuario.value,
    password: contrasenia.value,
  });
  //Enviando al usuario al "dashboard" o "home" y guardando el usuario de forma local.
  if (resultado.success) {
    await router.push("/remisiones");
  } else {
    //mensaje de error dependiendo el resultado
    toast.add({
      severity: resultado.status,
      summary: resultado.tittle,
      detail: resultado.detail,
      life: 4000,
    });
  }
};
</script>
