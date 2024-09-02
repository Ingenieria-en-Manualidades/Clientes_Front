<template>
  <!-- Agregamos el método para cambiar la variable 'isOpen' para así afectar  -->
  <NavBar :usuario="usuario ?? undefined" @extenderMain="isOpen = !isOpen" />
  <div
    :class="[
      'my-[1%] h-[519px] overflow-y-scroll duration-200',
      isOpen
        ? 'ml-[1%] w-[98%] min-[1300px]:ml-[22%] min-[1300px]:w-[77%]'
        : 'ml-[1%] w-[98%]',
    ]"
  >
    <!-- <MenuLateral /> -->
    <div class="flex justify-center rounded-lg border-[1px] border-gray-300">
      <slot />
    </div>
    <footer class="border-y-[1px] mt-3 p-3 hidden">
      <p>@Copyrigth (footer)</p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
const usuario = useCookie("usuario");
const isOpen = ref(true);
</script>
