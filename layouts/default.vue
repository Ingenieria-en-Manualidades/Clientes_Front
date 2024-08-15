<template>
  <NavBar :usuario="usuario" />
  <div class="my-[1%] ml-[22%] w-[77%] h-[528px] bg-red-400">
    <!-- <MenuLateral /> -->
    <div class="flex justify-center rounded-lg border-[1px] border-gray-300">
      <slot></slot>
    </div>
    <footer class="border-t-[1px] mt-5 bg-blue-400">
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam eaque
        dolorum illum molestias. Earum et quia quae similique quo. Reiciendis
        molestias earum a doloremque ducimus dolore cumque aliquam aliquid
        beatae.
      </p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
const usuario = useCookie("usuario");
</script>
