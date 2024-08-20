<template>
  <NavBar :usuario="usuario ?? undefined" @extenderMain="isOpen = !isOpen" />
  <div
    :class="[
      'my-[1%] h-[519px] overflow-y-scroll duration-200',
      isOpen ? 'ml-[22%] w-[77%]' : 'ml-[1%] w-[98%]',
    ]"
  >
    <!-- <MenuLateral /> -->
    <div class="flex justify-center rounded-lg border-[1px] border-gray-300">
      <slot />
    </div>
    <footer class="border-y-[1px] mt-3 p-3 flex justify-center">
      <p>@Copyrigth (footer)</p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
const usuario = useCookie("usuario");
const isOpen = ref(false);
</script>
