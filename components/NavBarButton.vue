<template>
  <button
    @click="toggleMenu"
    class="bg-azulIENM z-50 text-white text-3xl rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
    aria-label="Abrir menú"
  >
    <i class="pi pi-bars"></i>
  </button>
</template>


<script lang="ts" setup>
import { ref } from 'vue';


const emit = defineEmits(['toggle']);
const isOpen = ref(false);

const toggleMenu = () => {
  emit('toggle');
}


</script>