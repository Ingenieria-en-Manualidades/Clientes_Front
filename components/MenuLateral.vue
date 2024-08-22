<template>
  <button
    class="rounded-[50%] mr-6 mt-3 px-3 pt-1 hover:bg-gray-200"
    @click="toggleNavbar"
  >
    <i :class="['text-2xl', isOpen ? 'pi pi-times' : 'pi pi-bars']"></i>
  </button>
  <div
    :class="[
      'fixed h-full min-[1300px]:h-[81.7%] w-[270px] top-0 left-0 min-[1300px]:top-[102px] min-[1300px]:left-3 bg-amarilloIENM rounded-lg px-3 overflow-y-scroll duration-200 z-10',
      isOpen ? 'translate-x-0' : '-translate-x-[105%]',
    ]"
  >
    <div class="flex justify-end pt-1 min-[1300px]:hidden">
      <button class="py-2 px-3 hover:bg-gray-200 rounded-[50%]">
        <i class="pi pi-times mt-1 text-base"></i>
      </button>
    </div>
    <Tabs>
      <TabList>
        <Tab v-for="modulo in modulos" :key="modulo.nombre">
          <router-link v-slot="{ href, navigate }" :to="modulo.ruta" custom>
            <a
              v-ripple
              :href="href"
              @click="navigate"
              class="flex justify-start py-2 pl-4 hover:bg-verdeIENM rounded-lg w-[98%]"
            >
              <i v-if="modulo.icono" :class="modulo.icono"
                ><span class="ml-2 font-manrope-r text-base">{{
                  modulo.nombre
                }}</span></i
              >
              <!-- <img
                v-else
                src="../assets/img/remision.png"
                :alt="`icono del modulo ${modulo.nombre}`"
                width="20px"
              />
              <span v-if="modulo.img">{{ modulo.nombre }}</span> -->
            </a>
          </router-link>
        </Tab>
      </TabList>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits } from "vue";

const isOpen = ref(false);

const emit = defineEmits(["extenderMain"]);

const toggleNavbar = () => {
  isOpen.value = !isOpen.value;
  emit("extenderMain");
};

const modulos = ref([
  {
    icono: "pi pi-home",
    nombre: "Modulo 1",
    ruta: "/modulo1",
  },
  {
    // img: "remision.png",
    icono: "pi pi-home",
    nombre: "Remisiones",
    ruta: "/remisiones",
  },
  {
    icono: "pi pi-home",
    nombre: "Modulo 3",
  },
  {
    icono: "pi pi-home",
    nombre: "Modulo 1",
    ruta: "/modulo1",
  },
  {
    // img: "remision.png",
    icono: "pi pi-home",
    nombre: "Remisiones",
    ruta: "/remisiones",
  },
  {
    icono: "pi pi-home",
    nombre: "Modulo 3",
  },
  {
    icono: "pi pi-home",
    nombre: "Modulo 1",
    ruta: "/modulo1",
  },
  {
    // img: "remision.png",
    icono: "pi pi-home",
    nombre: "Remisiones",
    ruta: "/remisiones",
  },
  {
    icono: "pi pi-home",
    nombre: "Modulo 3",
  },
  {
    icono: "pi pi-home",
    nombre: "Modulo 1",
    ruta: "/modulo1",
  },
  {
    // img: "remision.png",
    icono: "pi pi-home",
    nombre: "Remisiones",
    ruta: "/remisiones",
  },
  {
    icono: "pi pi-home",
    nombre: "Modulo 3",
  },
  {
    icono: "pi pi-home",
    nombre: "Modulo 1",
    ruta: "/modulo1",
  },
  {
    // img: "remision.png",
    icono: "pi pi-home",
    nombre: "Remisiones",
    ruta: "/remisiones",
  },
  {
    icono: "pi pi-home",
    nombre: "Modulo 3",
  },
]);
</script>
