<template>
  <div>
    <DinamicosInputText
      v-model="text"
      :label="'Name'"
      :displayFlex="false"
      :warning="message"
    />
    <DinamicosInputText
      v-model="textTwo"
      :label="'Username'"
      :displayFlex="false"
      :warning="message"
    />
    <DinamicosDropDownList :label="'List complet'" :displayFlex="false" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const text = ref();
const textTwo = ref();
const message = ref<String | null>(null);
</script>
