<template>
  <div>
    <p>Modulo 3</p>
  </div>
</template>

<script lang="ts" setup>
import { useCookie, navigateTo } from "nuxt/app";

const token = useCookie("token");

if (!token.value) {
  navigateTo("/");
}
</script>
