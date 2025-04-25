<template>
  <div
    :class="[
      'w-full font-manrope-r relative py-1',
      displayFlex ? 'flex gap-1' : 'block',
    ]"
  >
    <p class="font-manrope-b">{{ label }}:</p>
    <p class="text-red-500 text-sm font-manrope-b">{{ info }}</p>
    <label class="flex border border-black rounded">
      <select
        v-model="model"
        class="w-[90%] rounded bg-white appearance-none p-1 cursor-pointer"
      >
        <option disabled value="">
          {{ placeholder ?? "Selecciona una opción" }}
        </option>
        <option
          v-for="(option, index) in options"
          v-bind:key="index"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <div class="pt-1 px-2 items-center bg-azulClaroIENM rounded-r">
        <i class="pi pi-angle-down text-white"></i>
      </div>
    </label>
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
  placeholder: {
    type: String,
    required: false,
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
});
</script>
