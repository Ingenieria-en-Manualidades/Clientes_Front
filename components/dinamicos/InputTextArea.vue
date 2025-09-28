<template>
  <div
    :class="[
      'w-full font-manrope-r relative py-1',
      displayFlex ? 'flex gap-1' : 'block',
    ]"
  >
    <div>
      <label :for="`inp${label}`" class="cursor-pointer font-manrope-b"
        >{{ label }}:</label
      >
    </div>
    <p class="text-red-500 text-sm font-manrope-b">{{ info }}</p>
    <textarea class="w-full rounded outline-none p-1 resize-y border border-black"
      :id="`inp${label}`"
      v-model="model"
      :maxlength="limitMax"
      :disabled="disabled"
    ></textarea>
    <p class="text-red-500 text-sm font-manrope-b">{{ warning }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

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
  disabled: {
    type: Boolean,
    required: false,
  },
  limitMax: {
    type: Number,
    required: false,
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
