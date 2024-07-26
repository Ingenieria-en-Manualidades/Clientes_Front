<template>
  <nav class="w-full inline-flex border-gray-300 border-b-[1px]">
    <div class="w-[19%] p-[2%] md:py-[1.5%] lg:py-[1%]">
      <img
        src="/assets/img/ienmLogito.png"
        alt="Logo IENM"
        width="160px"
        class="min-w-[120px]"
      />
    </div>
    <div class="w-[77%] inline-flex justify-end">
      <MenuItems :usuario="props.usuario" />
    </div>
  </nav>
</template>

<script lang="ts" setup>
const props = defineProps({
  usuario: String,
});
</script>
