<template>
  <div>
    <FormAccidentes />
  </div>
</template>

<script setup lang="ts">
import FormAccidentes from "../../components/objetivos/FormAccidentes.vue";

definePageMeta({
    layout: 'default',
    middleware: "auth",
  })
</script>
