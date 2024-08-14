<template>
  <nav class="w-full inline-flex border-gray-300 border-b-[1px]">
    <div class="w-[23%] p-[2%] md:py-[1.5%] lg:py-[1%] flex">
      <img
        src="/assets/img/ienmLogito.png"
        alt="Logo IENM"
        width="160px"
        class="min-w-[120px]"
      />
      <button class="ml-14 mt-3" id="botonjaja">
        <i class="pi pi-bars text-2xl"></i>
      </button>
    </div>
    <div class="w-[75%] inline-flex justify-end">
      <MenuItems :usuario="props.usuario" />
    </div>
  </nav>
</template>

<script lang="ts" setup>
const props = defineProps({
  usuario: String,
});
</script>
