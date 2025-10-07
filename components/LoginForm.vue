<!-- <template>
  <form @submit.prevent="handleSubmit">
    <div class="grid gap-2 w-3/4 ml-[12%] mt-[7%]">
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
    <div class="grid gap-2 w-3/4 ml-[12%] mt-[7%]">
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
    <button
      type="submit"
      :disabled="boolError"
      class="bg-verdeIENM mt-[10%] mb-[2%] w-[75%] ml-[11.5%] font-manrope-b tracking-wide text-white hover:bg-verdeOscIENM py-2 rounded items-center"
    >
      <span v-if="!isLoading">Enviar</span>
      <ProgressSpinner
        v-else
        style="width: 30px; height: 30px"
        strokeWidth="8"
        fill="transparent"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />
    </button>
  </form>
</template> -->
<template>
  <!-- Toda la pantalla sin scroll global -->
  <div class="w-full h-[100svh] lg:h-dvh lg:overflow-hidden bg-white">
    <!-- ===== Desktop / Large (≥lg) ===== -->
    <div class="hidden lg:flex w-full h-full">
      <!-- Izquierda: imagen a 60% -->
      <aside class="w-[60%] h-full">
        <img
          src="/personLogin3.jpg"
          alt="IM Ingeniería"
          class="w-full h-full object-cover"
        />
      </aside>

      <!-- Derecha: header + panel de login -->
      <section class="w-[40%] h-full flex flex-col">
        <!-- Header: logo sobre fondo blanco -->
        <div class="flex items-center justify-center p-10 bg-white shrink-0">
          <img
            src="/assets/img/svg/favicon3.png"
            alt="Logo IENM"
            class="max-h-24 w-auto object-contain"
          />
        </div>

        <!-- Panel azul con formulario centrado -->
        <div
          class="flex-1 min-h-0 bg-gradient-to-br from-azulClaroIENM  to-azulIENM"
        >
          <div class="h-full w-full flex items-center justify-center px-8">
            <div class="w-full max-w-xl">
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Usuario -->
                <div>
                  <label
                    for="username-lg"
                    class="block text-lg text-amarilloIENM font-semibold"
                  >
                    Usuario
                  </label>
                  <InputText
                    id="username-lg"
                    v-model="usuario"
                    class="w-full mt-1 text-sm rounded-3xl"
                    @input="validarUsuario"
                  />
                  <p v-if="usernameError" class="text-sm text-red-200 mt-1">
                    {{ usernameError }}
                  </p>
                </div>

                <!-- Contraseña -->
                <div>
                  <label
                    for="password-lg"
                    class="block text-lg text-amarilloIENM font-semibold"
                  >
                    Contraseña
                  </label>
                  <Password
                    id="password-lg"
                    v-model="contrasenia"
                    toggleMask
                    :feedback="false"
                    class="w-full mt-1 rounded-3xl"
                  />
                </div>

                <!-- Modal recuperación -->
                <modalRecuperarPass />

                <!-- Botón -->
                <div class="text-center mt-6">
                  <button
                    type="submit"
                    :disabled="boolError"
                    class="w-3/4 py-2 px-4 rounded-3xl bg-verdeIENM text-white font-bold hover:bg-verdeOscIENM transition-colors duration-300 disabled:opacity-50"
                  >
                    <span v-if="!isLoading">Enviar</span>
                    <ProgressSpinner
                      v-else
                      style="width: 25px; height: 25px"
                      strokeWidth="8"
                      fill="transparent"
                      animationDuration=".5s"
                      aria-label="Cargando"
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ===== Tablet/Mobile (<lg) ===== -->
      <div
  class="lg:hidden w-full h-[100svh] overflow-hidden
         grid place-items-center bg-cover
         bg-[url('/personLogin3.jpg')] bg-center bg-no-repeat"
>
  <div class="w-full max-w-md mx-4 shadow-2xl rounded-3xl overflow-hidden">
          <!-- Encabezado / Logo (tarjeta) -->
          <div
            class="bg-gradient-to-r from-white/80 to-white/50 backdrop-blur-md p-6"
          >
            <img
              src="/assets/img/svg/favicon3.png"
              alt="Logo IENM"
              class="w-full h-full"
            />
          </div>

          <!-- Formulario (tarjeta) -->
          <div
            class="bg-gradient-to-br from-azulIENM to-azulClaroIENM p-6 space-y-5"
          >
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Usuario -->
              <div>
                <label
                  for="username-md"
                  class="block text-lg text-amarilloIENM font-semibold"
                >
                  Usuario
                </label>
                <InputText
                  id="username-md"
                  v-model="usuario"
                  class="w-full mt-1 text-sm rounded-3xl"
                  @input="validarUsuario"
                />
                <p v-if="usernameError" class="text-sm text-red-200 mt-1">
                  {{ usernameError }}
                </p>
              </div>

              <!-- Contraseña -->
              <div>
                <label
                  for="password-md"
                  class="block text-lg text-amarilloIENM font-semibold"
                >
                  Contraseña
                </label>
                <Password
                  id="password-md"
                  v-model="contrasenia"
                  toggleMask
                  :feedback="false"
                  class="w-full mt-1 rounded-3xl"
                />
              </div>

              <!-- Modal recuperación -->
              <modalRecuperarPass />

              <!-- Botón -->
              <div class="text-center mt-6">
                <button
                  type="submit"
                  :disabled="boolError"
                  class="w-3/4 py-2 px-4 rounded-3xl bg-verdeIENM text-white font-bold hover:bg-verdeOscIENM transition-colors duration-300 disabled:opacity-50"
                >
                  <span v-if="!isLoading">Enviar</span>
                  <ProgressSpinner
                    v-else
                    style="width: 25px; height: 25px"
                    strokeWidth="8"
                    fill="transparent"
                    animationDuration=".5s"
                    aria-label="Cargando"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import { loginApi } from "../composables/loginApi";
import ProgressSpinner from "primevue/progressspinner";

//Variables 'ref' para recibir la información del usuario
const usuario = ref();
const toast = useToast(); //Importamos variable para utilizar los mensajes 'Toast' de primevue
const router = useRouter(); //Variable que utilizaremos para viajar entre rutas
const contrasenia = ref("");
const boolError = ref(false);
const { login, chooseClient, getClientsByIds } = loginApi(); //Importamos el método del login
const usernameError = ref<string | null>(null); //Variable que establece un error en los inputs
const isLoading = ref(false);

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
  isLoading.value = true;
  if (!usuario.value || !contrasenia.value) {
    isLoading.value = false;

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
      if (resultado.resetPassword) {
        await router.push("/resetPasswordExpiration");
      } else {
        if (resultado.skipChooseClient) {
          const success = await createCookieClient(resultado.clientID);
          if (success) {
            await router.push("/");
          }
        } else {
          await router.push("/chooseClients");
        }
        isLoading.value = false;
      }
    } else {
      isLoading.value = false;

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

const createCookieClient = async (clientID: any) => {
  const resultado = await getClientsByIds([clientID]);

  if (resultado.success) {
    const response = await chooseClient(
      resultado.data[0].cliente_endpoint_id,
      resultado.data[0].nombre
    );
    if (response.success) {
      return true;
    } else {
      toast.add({
        severity: "error",
        summary: response.title,
        detail: response.message,
        life: 5000,
      });
      return false;
    }
  } else {
    toast.add({
      severity: "error",
      summary: resultado.title,
      detail: resultado.message,
      life: 5000,
    });
    return false;
  }
};
</script>
