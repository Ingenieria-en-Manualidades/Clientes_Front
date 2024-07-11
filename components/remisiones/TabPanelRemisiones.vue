<template>
  <div class="w-[100%] text-center">
    <Tabs value="/remisiones">
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
                  'font-manrope-r text-[100%]',
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
const items = ref([
  {
    route: "/remisiones",
    label: "Pendientes",
    icon: "pi pi-clipboard text-[12px] md:text-[14px]",
  },
  {
    route: "/remisiones/Aprobadas",
    label: "Aprobadas",
    icon: "pi pi-check text-[12px] md:text-[14px]",
  },
  {
    route: "/remisiones/rechazadas",
    label: "Rechazadas",
    icon: "pi pi-times text-[12px] md:text-[14px]",
  },
]);

const route = useRoute();
const isActive = (routePath: string) => {
  return route.path === routePath;
};
</script>
