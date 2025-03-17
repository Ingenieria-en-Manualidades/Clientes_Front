<template>
  <div
    :class="[
      'w-full font-manrope-r relative py-1',
      displayFlex ? 'flex gap-1' : 'block',
    ]"
  >
    <div>
      <label class="cursor-pointer font-manrope-b">{{ label }}:</label>
    </div>
    <Calendar
      v-model="model"
      :manualInput="false"
      :dateFormat="dateFormat"
      :view="view"
      :disabled="disabled"
      showIcon
      fluid
      inputClass="w-full"
      iconDisplay="input"
      showButtonBar
    />
    <p class="text-red-500 text-xs font-manrope-b">{{ warning }}</p>
  </div>
</template>

<script lang="ts" setup>
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
  dateFormat: {
    type: String,
    required: false,
  },
  view: {
    type: String,
    required: false,
  },
  warning: {
    type: String,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: true,
  },
});
</script>
