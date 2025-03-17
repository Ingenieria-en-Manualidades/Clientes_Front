<template>
  <div class="w-[100%] text-center">
    <ul class="inline-flex mb-[2%]">
      <li v-for="(tab, tabIndex) in items" v-bind:key="tabIndex">
        <router-link
          v-if="tab.route"
          v-slot="{ href, navigate }"
          :to="tab.route"
          custom
        >
          <a
            v-ripple
            :href="href"
            @click="navigate"
            :class="[
              'flex items-center gap-2 text-inherit p-2 border-b-2',
              isActive(tab.route) ? 'border-b-azulIENM' : '',
            ]"
          >
            <i
              :class="[tab.icon, isActive(tab.route) ? 'text-azulIENM' : '']"
            />
            <span
              :class="[
                'font-manrope-r text-[13px] sm:text-[16px]',
                isActive(tab.route) ? 'text-azulIENM font-manrope-extrab' : '',
              ]"
              >{{ tab.label }}</span
            >
          </a>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "nuxt/app";
import type { ItemTabPanel } from "../../interfaces/componentesDinamicos";

const route = useRoute(); // Variable para el método para cambiar las rutas

const props = defineProps({
  items: {
    type: Array as () => ItemTabPanel[],
    required: true,
  },
});

//Metodo para navegar entre las rutas de remisiones al dar click en las pestañas
const isActive = (routePath: string) => {
  return route.path === routePath; //Lo que haya en el parametro sirve para cambiar la ruta de la página.
};
</script>
