<template>
  <header class="fixed inset-x-0 top-0 z-50 flex items-center justify-between
           bg-white backdrop-blur border-b border-ink-200 shadow-sm
           px-2 md:px-3 py-1">
    <div class="flex items-center gap-2">
      <NavBarButton
        @click="$emit('toggleMenu')"
        :isOpen="isOpen"
        class="lg:hidden grid h-11 w-11 place-items-center rounded-xl
               text-brand-500 hover:text-brand-600
               hover:bg-brand-500/10 focus:outline-none
               focus-visible:ring-2 focus-visible:ring-brand-500/60
               transition z-50"
        :aria-expanded="String(isOpen)"
        aria-controls="app-sidebar"
        aria-label="Abrir menú"
      />
      <img
        src="/assets/img/svg/favicon2.png" 
        alt="Logo IENM"
        class="min-w-[115px] w-[160px]"
      />
    </div>
    <div class="w-[75%] inline-flex items-center justify-end md:gap-1">
      <ModalStepByStepGuide />
      <button
        type="button"
        class="relative cursor-pointer group"
        @click="viajarRemisiones"
      >
        <i
          class="pi pi-bell hover:bg-gray-200 rounded-lg p-2 text-lg md:text-2xl"
        ></i>
        <span
          v-if="nRemisiones"
          class="absolute bg-red-500 font-manrope-r px-[14%] py-[8%] md:px-[17%] md:py-[10%] rounded-[50%] border-2 border-white text-[10px] md:text-xs right-1 md:right-0 top-0 text-white"
          >{{ nRemisiones }}</span
        >
        <!-- Intento de tooltip -->
        <!-- <p
          class="fixed font-manrope-r text-sm px-3 pb-1 rounded-lg top-7 right-[70px] bg-[#28b67a] transform translate-y-0 hidden duration-300 group-hover:translate-y-9 group-hover:block after:block after:border-b-[7px] after:border-b-[#28b67a] after:border-l-[7px] after:border-l-transparent after:border-r-[7px] after:border-r-transparent after:absolute after:top-[-7px] after:left-[77px]"
        >
          remisiones pendientes
        </p> -->
      </button>
      <MenuItems id="menuItems" :usuario="props.usuario" :client="client" />
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useCookie } from "nuxt/app";
//Importamos el método para utilizar la ruta.
import { useRouter } from "vue-router";
//Importamos métodos para crear props y emits.
import { defineProps, defineEmits, ref } from "vue";
import { useRemisionesApi } from "../composables/remisiones/remisionesApi";

const props = defineProps<{
  usuario: string | null;
  isOpen: boolean;
}>();


// Definición del evento emitido
const emit = defineEmits<{
  (e: "toggleMenu"): void;
  (e: "extenderMain"): void;
}>();

const route = useRouter(); //Variable que se utiliza para cambiar la ruta.
const nRemisiones = useCookie("numRem", {
  sameSite: "none",
  secure: true,
});
const idCliente = useCookie("idCliente");
const client = useCookie("nameClient");
const { getNumRemisionesPen } = useRemisionesApi();


//Método importado para cambiar el tamaño del main al mismo tiempo que el menú desplegable
const extenderMain = () => {
  emit("extenderMain");
};

//Método que se ejecuta al presionar la campana.
const viajarRemisiones = async () => {
  await route.push("/remisiones");
};

//Método que realiza una consulta por la API y llena la variable con la cantidad de remisiones pendientes.
const valueRemisiones = async () => {
  nRemisiones.value = await getNumRemisionesPen(Number(idCliente.value));
};
valueRemisiones();
</script>
