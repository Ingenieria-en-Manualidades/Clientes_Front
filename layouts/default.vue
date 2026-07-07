<!-- <template>
  <NavBar :usuario="usuario ?? undefined" @extenderMain="isOpen = !isOpen" />
   <div
        v-if="(isSmall || isMedium) && sidebarOpen"
        class="fixed inset-0 bg-black/30 z-20 lg:hidden"
        @click="sidebarOpen = false"
      />
  <div
        :class="[
          'fixed right-1 lg:top-[80px] md:top-[80px] top-[60px] bottom-2 bg-white border border-gray-300 shadow-xl rounded-2xl transition-all duration-500 ease-in-out z-10',
          contentWidthClass
        ]"
      >
      <slot />
    </div>
    <footer class="border-y-[1px] mt-3 p-3 hidden">
      <p>@Copyrigth (footer)</p>
    </footer>
  </div>
</template> -->

<template>
  <div class="relative min-h-screen w-full">

    <NavBar :usuario="usuario ?? undefined" @extenderMain="isOpen = !isOpen" @toggleMenu="toggleMenu" :isOpen="sidebarOpen" />    

    <main class="flex-1 pt-16 p-8 bg-cover bg-center bg-brand-500 w-full h-screen">

      <MenuLateral
        :isOpen="sidebarPinned ? false : !sidebarOpen"
        @closeSidebar="sidebarOpen = false"
      />

     <div
        v-if="(isSmall || isMedium) && sidebarOpen"
        class="fixed inset-0 bg-black/30 z-20 lg:hidden"
        @click="sidebarOpen = false"
      />

      <!-- Contenido -->
      <div
        :class="[
          'fixed right-1 lg:top-[95px] md:top-[90px] top-[80px] bottom-2 overflow-y-auto overflow-x-hidden bg-white border border-gray-300 shadow-xl rounded-2xl transition-all duration-500 ease-in-out z-10',
          contentWidthClass
        ]"
      >
        <slot />
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCookie } from "nuxt/app";
import MenuLateral from '../components/MenuLateral.vue';

const isOpen = ref(true);
const usuario = useCookie("usuario"); 

const contentWidthClass = computed(() => {
  if (sidebarPinned.value) return 'w-[82%]'
  return 'w-[98%]'
})

const sidebarOpen = ref(false)

const sidebarPinned = computed(() => !isSmall.value && !isMedium.value)

onMounted(() => {
  checkScreen()
  window.addEventListener('resize', checkScreen)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkScreen)
})

const isSmall  = ref(false)
const isMedium = ref(false)

const checkScreen = () => {
  const w = window.innerWidth
  isSmall.value  = w <= 640
  isMedium.value = w > 640 && w <= 1150
}
const toggleMenu = () => {
  if (sidebarPinned.value) return // en grande no togglear
  sidebarOpen.value = !sidebarOpen.value
}

import { useHead } from "#app"

useHead({
  script: [
    {
      hid: "tawkto",
      src: "https://embed.tawk.to/6924841527ad1319611fc94c/1jara7stu",
      async: true,
      charset: "UTF-8",
      crossorigin: "anonymous"
    }
  ]
})

</script>
