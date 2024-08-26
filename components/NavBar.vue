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
        class="relative h-11 mt-[16px] pr-[6px] cursor-pointer group"
        @click="viajarRemisiones"
      >
        <!-- <img
          src="/assets/img/remision.png"
          alt="Icono remisión"
          class="h-11 hover:bg-gray-200 rounded p-1"
        /> -->
        <i
          class="pi pi-bell hover:bg-gray-200 rounded-lg mt-2 p-2"
          style="font-size: 1.5rem"
        ></i>
        <span
          v-if="nRemisiones !== 0"
          class="absolute bg-green-600 font-manrope-r px-[17%] py-[10%] rounded-[50%] border-2 border-white text-xs right-0 top-0 text-white"
          >{{ nRemisiones }}</span
        >
        <p
          class="fixed font-manrope-r text-sm px-3 pb-1 rounded-lg top-7 right-[70px] bg-[#28b67a] transform translate-y-0 hidden duration-300 group-hover:translate-y-10 group-hover:block"
        >
          remisiones pendientes
        </p>
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
