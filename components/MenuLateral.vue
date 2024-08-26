<template>
  <button
    class="rounded-[50%] mr-6 mt-3 px-[5%] pt-1 hover:bg-gray-200"
    @click="toggleNavbar"
  >
    <i
      :class="[
        'text-xl min-[1300px]:text-2xl',
        isOpen ? 'pi pi-times' : 'pi pi-bars',
      ]"
    ></i>
  </button>
  <div :class="['sideBar', isOpen ? 'translate-x-0' : '-translate-x-[105%]']">
    <div class="flex justify-end pt-1 min-[1300px]:hidden">
      <button
        type="button"
        class="py-2 px-3 hover:bg-gray-200 rounded-[50%] text-white hover:text-black"
        @click="toggleNavbar"
      >
        <i class="pi pi-times mt-1 text-base"></i>
      </button>
    </div>
    <div
      class="overflow-y-scroll h-full min-[1300px]:h-[90%] min-[1300px]:mt-10"
    >
      <Tabs>
        <TabList>
          <Tab
            v-for="modulo in modulos"
            :key="modulo.nombre"
            @click="toggleNavBarMovil"
          >
            <router-link v-slot="{ href, navigate }" :to="modulo.ruta" custom>
              <a
                v-ripple
                :href="href"
                @click="navigate"
                class="flex justify-start max-[760px]:justify-center py-3 pl-6 mb-2 hover:bg-white rounded-lg text-white hover:text-black"
              >
                <i v-if="modulo.icono" :class="modulo.icono"
                  ><span class="ml-6 font-manrope-l text-base">{{
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
  </div>
</template>

<script lang="ts" setup>
import { defineEmits } from "vue";

const isOpen = ref(true);

const emit = defineEmits(["extenderMain"]);

const toggleNavbar = () => {
  isOpen.value = !isOpen.value;
  emit("extenderMain");
};

const toggleNavBarMovil = () => {
  const pantAncho = window.innerWidth;

  if (pantAncho < 1300) {
    isOpen.value = false;
    emit("extenderMain");
  }
};

const modulos = ref([
  {
    icono: "pi pi-home",
    nombre: "Modulo 1",
    ruta: "/modulo1",
  },
  {
    // img: "remision.png",
    icono: "pi pi-bell",
    nombre: "Remisiones",
    ruta: "/remisiones",
  },
  {
    icono: "pi pi-user",
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
]);
</script>
