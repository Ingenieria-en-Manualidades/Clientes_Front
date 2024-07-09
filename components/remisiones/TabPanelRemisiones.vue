<template>
  <div class="ml-28">
    <Tabs value="/remisiones">
      <TabList class="inline-flex gap-14 mb-[2%]">
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
                  'font-manrope-r',
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
  { route: "/remisiones", label: "Pendientes", icon: "pi pi-clipboard" },
  {
    route: "/remisiones/Aprobadas",
    label: "Aprobadas",
    icon: "pi pi-check",
  },
  {
    route: "/remisiones/rechazadas",
    label: "Rechazadas",
    icon: "pi pi-times",
  },
]);

const route = useRoute();
const isActive = (routePath: string) => {
  return route.path === routePath;
};
</script>
