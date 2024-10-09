<template>
  <nav class="w-full inline-flex border-gray-300 border-b-[1px]">
    <div class="w-[23%] p-[2%] md:py-[1.5%] lg:py-[1%] flex">
      <MenuLateral @extenderMain="extenderMain" />
      <img
        src="/assets/img/ienmLogito.png"
        alt="Logo IENM"
        class="min-w-[115px] w-[160px]"
      />
    </div>
    <div class="w-[75%] inline-flex justify-end">
      <button
        type="button"
        class="relative h-11 mt-[13px] md:mt-[16px] pr-[6px] cursor-pointer group"
        @click="viajarRemisiones"
      >
        <i
          class="pi pi-bell hover:bg-gray-200 rounded-lg mt-1 md:mt-2 p-2 text-lg md:text-2xl"
        ></i>
        <span
          v-if="nRemisiones"
          class="absolute bg-red-500 font-manrope-r px-[14%] py-[8%] md:px-[17%] md:py-[10%] rounded-[50%] border-2 border-white text-[10px] md:text-xs right-1 md:right-0 top-0 text-white"
          >{{ nRemisiones }}</span
        >
        <p
          class="fixed font-manrope-r text-sm px-3 pb-1 rounded-lg top-7 right-[70px] bg-[#28b67a] transform translate-y-0 hidden duration-300 group-hover:translate-y-9 group-hover:block after:block after:border-b-[7px] after:border-b-[#28b67a] after:border-l-[7px] after:border-l-transparent after:border-r-[7px] after:border-r-transparent after:absolute after:top-[-7px] after:left-[77px]"
        >
          remisiones pendientes
        </p>
      </button>
      <MenuItems :usuario="props.usuario" />
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { useCookie } from "nuxt/app";
//Importamos el método para utilizar la ruta.
import { useRouter } from "vue-router";
//Importamos métodos para crear props y emits.
import { defineProps, defineEmits, ref } from "vue";
import { useRemisionesApi } from "../composables/remisiones/remisionesApi";

const route = useRouter(); //Variable que se utiliza para cambiar la ruta.
const nRemisiones = useCookie("numRem", {
  sameSite: "none",
  secure: true,
});
const idCliente = useCookie("idCliente");
//Metodo emit importado desde el componente
const emit = defineEmits(["extenderMain"]);
const { getNumRemisionesPen } = useRemisionesApi();

const props = defineProps({
  usuario: String || null,
});
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
