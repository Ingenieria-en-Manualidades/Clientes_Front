<template>
  <button class="mt-3 mr-5" @click="toggleNavbar">
    <i class="pi pi-bars text-2xl"></i>
  </button>
  <div
    :class="[
      'fixed h-[81.7%] w-[270px] top-[102px] left-3 bg-amarilloIENM rounded-lg px-4 pt-10 overflow-y-scroll duration-200',
      isOpen ? 'translate-x-0' : '-translate-x-[105%]',
    ]"
  >
    <Tabs>
      <TabList>
        <Tab v-for="modulo in modulos" :key="modulo.nombre">
          <router-link v-slot="{ href, navigate }" :to="modulo.ruta" custom>
            <a
              v-ripple
              :href="href"
              @click="navigate"
              class="flex justify-start py-2 pl-4 hover:bg-verdeIENM rounded-lg"
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
