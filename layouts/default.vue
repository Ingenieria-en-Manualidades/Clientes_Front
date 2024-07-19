<template>
  <NavBar :usuario="'AUXPEPE'" />
  <div class="inline-flex m-[1%] w-[100%]">
    <MenuLateral class="hidden" />
    <div class="w-[100%] flex justify-center pr-[1%]">
      <slot></slot>
    </div>
  </div>
  <footer class="border-t-[1px] mt-2 h-3"></footer>
</template>

<script lang="ts" setup>
import { usarCookies } from "~/composables/cookies";

const { usuario } = usarCookies();
</script>

<style></style>
