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
          v-if="nRemisiones !== 0"
          class="absolute bg-green-600 font-manrope-r px-[14%] py-[8%] md:px-[17%] md:py-[10%] rounded-[50%] border-2 border-white text-[10px] md:text-xs right-1 md:right-0 top-0 text-white"
          >{{ nRemisiones }}</span
        >
        <p class="tooltipBell">remisiones pendientes</p>
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
import { useRemisionesApi } from "~/composables/remisiones/remisionesApi";

const route = useRouter(); //Variable que se utiliza para cambiar la ruta.
const nRemisiones = ref();
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
  nRemisiones.value = await getNumRemisionesPen(idCliente.value);
};
valueRemisiones();
</script>
