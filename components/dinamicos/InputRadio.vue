<template>
  <div class="w-full font-manrope-r relative py-1">
    <p class="font-manrope-b">{{ label }}:</p>
    <p class="text-red-500 text-sm font-manrope-b">{{ info }}</p>
    <div :class="['w-full font-manrope-r relative py-1', displayFlex ? 'flex gap-8' : 'block',]">
      <div v-for="(option, index) in options" v-bind:key="index">
        <input type="radio" name="" :disabled="disabled" :id="`option-${option.label}`" :value="`${option.value}`" v-model="model" class="mr-2" />
        <label>{{ option.label }}</label>
      </div>
    </div>
    <p class="text-red-500 text-sm font-manrope-b">{{ warning }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { OptionDropdown } from "../../interfaces/componentesDinamicos";

const model = defineModel();

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  displayFlex: {
    type: Boolean,
    required: true,
  },
  options: {
    type: Array as () => OptionDropdown[],
    required: true,
  },
  info: {
    type: String,
    required: false,
  },
  warning: {
    type: String,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
});
</script>
