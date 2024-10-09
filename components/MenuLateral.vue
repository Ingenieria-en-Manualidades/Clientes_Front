<template>
  <button
    class="rounded-[50%] mr-24 min-[450px]:mr-6 mt-3 px-[5%] pt-1 hover:bg-gray-200"
    @click="toggleNavbar"
  >
    <i
      :class="[
        'text-xl min-[1300px]:text-2xl',
        isOpen ? 'pi pi-times' : 'pi pi-bars',
      ]"
    ></i>
  </button>
  <!-- La clase "sideBar" se encuentra en el archivo "/assets/css/main.css" -->
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
  class="flex justify-start max-[760px]:justify-center overflow-hidden overflow-y-scroll h-full min-[1300px]:h-[90%] min-[1300px]:mt-10 scroll-container"
>
  <Tabs>
        <TabList>
          <Tab
            v-for="modulo in modulos"
            :key="modulo.nombre"
            @click="toggleNavBarMovil"
          >
            <li v-if="modulo.submodulos && modulo.visible">
              <div
                class="py-3 pl-6 hover:bg-white rounded-lg text-white hover:text-black w-[120%] cursor-pointer"
                @click="visible = !visible"
              >
                <i :class="modulo.icono"></i>
                <span class="ml-6">{{ modulo.nombre }}</span>
                <i
                  :class="[
                    'pi pi-angle-right pl-2 transition origin-center duration-300 float-right pt-1 mr-2',
                    visible ? 'rotate-90' : 'rotate-0',
                  ]"
                ></i>
              </div>
              <ul
                :class="['ml-6 pl-5 text-white', visible ? 'block' : 'hidden']"
              >
                <router-link
                  v-for="(submodulo, index) in modulo.submodulos"
                  v-bind:key="index"
                  :to="submodulo.ruta"
                  v-slot="{ href, navigate }"
                  custom
                >
                  <a
                    v-ripple
                    v-if="submodulo.visible"
                    :href="href"
                    @click="navigate"
                    class="flex py-3 pl-6 mb-2 hover:bg-white rounded-lg text-white hover:text-black w-[124%]"
                  >
                    <i :class="submodulo.icono"
                      ><span class="ml-6 font-manrope-l text-base">{{
                        submodulo.nombre
                      }}</span></i
                    >
                  </a>
                </router-link>
              </ul>
            </li>
            <router-link
              v-else-if="modulo.visible"
              v-slot="{ href, navigate }"
              :to="modulo.ruta"
              custom
            >
              <a
                v-ripple
                :href="href"
                @click="navigate"
                class="flex py-3 pl-6 mb-2 hover:bg-white rounded-lg text-white hover:text-black w-[124%]"
              >
                <i v-if="modulo.icono" :class="modulo.icono"
                  ><span class="ml-6 font-manrope-l text-base">{{
                    modulo.nombre
                  }}</span></i
                >
              </a>
            </router-link>
          </Tab>
        </TabList>
      </Tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, ref } from "vue";
import { useModulos } from "../composables/menuItems";
const { modulos } = useModulos();
const isOpen = ref(true); //Variable que define el estado del menú desplegable.
const emit = defineEmits(["extenderMain"]); //Importa el método que recibe desde su componente.
const visible = ref(false);

//Método que cambia estado del menú desplegable, ayudando a cuando ocultar y no al menú
const toggleNavbar = () => {
  isOpen.value = !isOpen.value;
  //Este método definido desde el componente ayuda a cambiar el tamaño del contenido de las páginas.
  emit("extenderMain");
};

//Método que solo cambia el estado del menú a 'false' osease a ocultarlo, se creo para que la página pueda cerrar el menú a la hora de presionar un módulo (solo funciona el moviles y pantallas que pequeñas).
const toggleNavBarMovil = () => {
  const pantAncho = window.innerWidth; //Tamaño de la pantalla actual.

  //verifica que el usuario se encuentra en un movil o pantalla pequeña y el menú pasa a funcionar de esta forma.
  if (pantAncho < 1300) {
    isOpen.value = false;
    emit("extenderMain");
  }
};
</script>
