<template>
  <nav class="w-full inline-flex border-gray-300 border-b-[1px]">
    <div class="w-[23%] p-[2%] md:py-[1.5%] lg:py-[1%] flex">
      <MenuLateral @extenderMain="extenderMain" />
      <img
        src="/assets/img/ienmLogito.png"
        alt="Logo IENM"
        width="160px"
        class="min-w-[120px]"
      />
    </div>
    <div class="w-[75%] inline-flex justify-end">
      <MenuItems :usuario="props.usuario" />
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { defineEmits } from "vue";
const props = defineProps({
  usuario: String || null,
});

const emit = defineEmits(["extenderMain"]);

const extenderMain = () => {
  emit("extenderMain");
};
</script>
