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
    <button
      type="button"
      class="bg-azulClaroIENM px-3 py-[3px] rounded hover:bg-azulIENM my-1"
      @click="visibleModal = true"
    >
      Boton A
    </button>
    <button
      type="button"
      class="bg-azulClaroIENM px-3 py-[3px] rounded hover:bg-azulIENM my-1"
      @click="visibleModal = true"
    >
      Boton B
    </button>
    <ModalChooseClient v-model:visibleProp="visibleModal" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const text = ref();
const textTwo = ref();
const visibleModal = ref(false);
const message = ref<String | null>(null);
</script>
