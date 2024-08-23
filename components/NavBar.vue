<template>
  <nav class="w-full inline-flex border-gray-300 border-b-[1px]">
    <div class="w-[23%] p-[2%] md:py-[1.5%] lg:py-[1%] flex">
      <MenuLateral @extenderMain="extenderMain" />
      <img
        src="/assets/img/ienmLogito.png"
        alt="Logo IENM"
        width="160px"
        class="min-w-[120px]"
      />
    </div>
    <div class="w-[75%] inline-flex justify-end">
      <button
        type="button"
        class="relative mt-[16px] mb-5 pt-2 pr-[6px] cursor-pointer"
        @click="viajarRemisiones"
      >
        <!-- <img
          src="/assets/img/remision.png"
          alt="Icono remisión"
          class="h-11 hover:bg-gray-200 rounded p-1"
        /> -->
        <i
          class="pi pi-bell hover:bg-gray-200 rounded-lg p-2"
          style="font-size: 1.5rem"
        ></i>
        <span
          class="absolute bg-green-600 font-manrope-r px-[17%] py-[10%] rounded-[50%] border-2 border-white text-xs right-0 top-0 text-white"
          >{{ nRemisiones }}</span
        >
      </button>
      <MenuItems :usuario="props.usuario" />
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { useRouter } from "#app";
import { defineProps, defineEmits } from "vue";
import { useRemisionesApi } from "~/composables/remisiones/remisionesApi";

const route = useRouter();
const nRemisiones = ref();
const idCliente = useCookie("idCliente");
const emit = defineEmits(["extenderMain"]);
const { getNumRemisionesPen } = useRemisionesApi();

const props = defineProps({
  usuario: String || null,
});

const extenderMain = () => {
  emit("extenderMain");
};

const viajarRemisiones = async () => {
  await route.push("/remisiones");
};

const valueRemisiones = async () => {
  nRemisiones.value = await getNumRemisionesPen(idCliente.value);
};
valueRemisiones();
</script>
