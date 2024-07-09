<template>
  <Sidebar v-model:visible="visible"> </Sidebar>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const visible = ref(true);
</script>
