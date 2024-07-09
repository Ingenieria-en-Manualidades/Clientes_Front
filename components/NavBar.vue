<template>
  <nav class="w-full inline-flex border-gray-300 border-b-[1px]">
    <div class="w-[19%] pl-6 pt-4">
      <img src="/assets/img/ienmLogito.png" alt="Logo IENM" width="72%" />
    </div>
    <div class="w-[77%] inline-flex justify-end">
      <MenuItems :usuario="props.usuario" />
      <div class="pt-[2.5%] mr-[2%] hidden">
        <i class="pi pi-spin pi-cog text-azulIENM" style="font-size: 2rem"></i>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps({
  usuario: String,
});
</script>

<style></style>
