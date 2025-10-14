<template> 
  <nav
    :class="[
      'fixed rounded-2xl bg-azulIENM border backdrop-blur shadow-xl ring-1 ring-black/5 transition-transform duration-500 ease-in-out',
      sizeClass,
      translateClass,
      zClass
    ]"
    :aria-hidden="ariaHidden"
  >
    <!-- <div class="flex justify-end pt-1 min-[1300px]:hidden">
      <button
        type="button"
        class="py-2 px-3 hover:bg-gray-200 rounded-[50%] text-white hover:text-black"
        @click="toggleNavbar"
      >
        <i class="pi pi-times mt-1 "></i>
      </button>
    </div> -->
    <!-- <div
      class="flex justify-start max-[760px]:justify-center overflow-hidden h-full min-[1300px]:h-[90%] min-[1300px]:mt-10 scroll-container"
    > -->
    <ul class="mt-3 px-2 space-y-1 overflow-y-auto text-sm" style="height: calc(100% - 0.75rem)">
        <li
          v-for="(modulo, indexModulo) in modulos"
          class="max-[760px]:flex max-[760px]:justify-center"
          v-bind:key="indexModulo"
        >
          <div v-if="modulo.submodulos && modulo.visible" class="list-none">
            <div
              class="py-3 pl-4 hover:bg-white rounded-lg text-white hover:text-black cursor-pointer"
              @click="visible = !visible"
            >
              <i :class="modulo.icono"></i>
              <span class="ml-3">{{ modulo.nombre }}</span>
              <i
                :class="[
                  'pi pi-angle-right pl-2 transition origin-center duration-300 float-right pt-1 mr-2',
                  visible ? 'rotate-90' : 'rotate-0',
                ]"
              ></i>
            </div>
            <ul :class="['ml-3 pl-3 text-white', visible ? 'block' : 'hidden']">
              <li @click="toggleNavBarMovil">
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
                    class="flex py-3 px-3 mb-2 hover:bg-white rounded-lg text-white hover:text-black w-full"
                  >
                    <i :class="submodulo.icono"
                      ><span class="ml-3 ">{{
                        submodulo.nombre
                      }}</span></i
                    >
                  </a>
                </router-link>
              </li>
            </ul>
          </div>
          <div v-else-if="modulo.visible" @click="toggleNavBarMovil">
            <router-link v-slot="{ href, navigate }" :to="modulo.ruta" custom>
              <a
                v-ripple
                :href="href"
                @click="navigate"
                class="flex py-3 px-4 mb-2 hover:bg-white rounded-lg text-white hover:text-black w-full"
              >
                <i v-if="modulo.icono" :class="modulo.icono"
                  ><span class="ml-3 ">{{
                    modulo.nombre
                  }}</span></i
                >
              </a>
            </router-link>
          </div>
        </li>
      </ul>
    <!-- </div> -->
  </nav>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, defineProps, defineEmits } from "vue";
import { useModulos } from "../composables/menuItems";
const { modulos } = useModulos();
const isOpen = ref(true); //Variable que define el estado del menú desplegable.
const emit = defineEmits(["extenderMain", "closeSidebar"]); 
const visible = ref(false);

const props = defineProps<{ isOpen: boolean }>();


const isSmall  = ref(false);
const isMedium = ref(false);
const checkScreen = () => {
  const w = window.innerWidth;
  isSmall.value  = w <= 640;
  isMedium.value = w > 640 && w <= 1150;
};
onMounted(() => { checkScreen(); window.addEventListener("resize", checkScreen); });
onUnmounted(() => { window.removeEventListener("resize", checkScreen); });

const translateClass = computed(() => {
  if (!isSmall.value && !isMedium.value) return "translate-x-0"; 
  return props.isOpen ? "-translate-x-full" : "translate-x-0";
});

// Z-index y aria
const zClass = computed(() => (isSmall.value ? "z-30" : "z-10"));
const ariaHidden = computed(() => (!isSmall.value && !isMedium.value) ? false : props.isOpen);

const sizeClass = computed(() => {
  if (isSmall.value)  return "w-full left-0 top-[70px] bottom-0";
  if (isMedium.value) return "w-[40%] left-0 top-[75px] bottom-0 z-30";
  return "w-[15%] top-[95px] bottom-1 left-2 z-10";
});

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
