<template>
  <title>Modulo 1</title>
  <div class="flex gap-3 w-full p-1">
    <div class="w-1/3 bg-blue-400 text-center rounded-lg">
      <p>1</p>
    </div>
    <div class="w-1/3 bg-blue-400 text-center rounded-lg">
      <p>2</p>
    </div>
    <div class="w-1/3 bg-blue-400 text-center rounded-lg">
      <p>3</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCookie, navigateTo } from "nuxt/app";
definePageMeta({
    layout: 'default',
    middleware: "auth",
  })
</script>
