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
      :disabled="boolError"
    />
  </form>
</template>

<script lang="ts" setup>
import { useRouter } from "#app";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import { loginApi } from "~/composables/loginApi";

//Variables 'ref' para recibir la información del usuario
const usuario = ref();
const toast = useToast(); //Importamos variable para utilizar los mensajes 'Toast' de primevue
const router = useRouter(); //Variable que utilizaremos para viajar entre rutas
const contrasenia = ref("");
const boolError = ref(false);
const { login } = loginApi(); //Importamos el método del login
const usernameError = ref<string | null>(null); //Variable que establece un error en los inputs

//Función que evalua el input 'usuario' cumpla las condiciones
const validarUsuario = () => {
  if (/[^a-zA-Z0-9 ]/.test(usuario.value)) {
    usernameError.value = "El usuario no puede tener caracteres especiales.";
    boolError.value = true;
  } else {
    usernameError.value = null;
    boolError.value = false;
  }
};

//Método que llama al endpoint que permite la verficación de usuarios y retorna el token.
const handleSubmit = async () => {
  if (!usuario.value || !contrasenia.value) {
    toast.add({
      severity: "error",
      summary: "Campos vacíos",
      detail: "Por favor llene el formulario.",
      life: 4000,
    });
  } else {
    //llamando al endpoint y guardando el token y la id del cliente como una cookie dentro del método 'login'.
    const resultado = await login({
      username: usuario.value,
      password: contrasenia.value,
    });

    //Enviando al usuario al "dashboard" de las remisiones en caso de que el usuario este registrado.
    if (resultado.success) {
      await router.push("/remisiones");
    } else {
      //mensaje de error dependiendo del resultado
      toast.add({
        severity: resultado.status,
        summary: resultado.tittle,
        detail: resultado.detail,
        life: 4000,
      });
    }
  }
};
</script>
