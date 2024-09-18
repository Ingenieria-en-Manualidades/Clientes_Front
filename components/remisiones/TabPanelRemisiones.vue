<template>
  <div class="w-[100%] text-center">
    <Tabs>
      <TabList class="inline-flex mb-[2%]">
        <Tab v-for="tab in items" :key="tab.label" :value="tab.route">
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
                  isActive(tab.route)
                    ? 'text-azulIENM font-manrope-extrab'
                    : '',
                ]"
                >{{ tab.label }}</span
              >
            </a>
          </router-link>
        </Tab>
      </TabList>
    </Tabs>
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
