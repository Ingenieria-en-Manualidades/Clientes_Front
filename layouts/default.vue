<template>
  <NavBar :usuario="usuario" />
  <div class="inline-flex m-[1%] w-[100%]">
    <MenuLateral class="hidden" />
    <div class="w-[100%] flex justify-center pr-[1%]">
      <slot></slot>
    </div>
  </div>
  <footer class="border-t-[1px] mt-2 h-3"></footer>
</template>

<script lang="ts" setup>
const usuario = useCookie("usuario");
</script>

<style></style>
