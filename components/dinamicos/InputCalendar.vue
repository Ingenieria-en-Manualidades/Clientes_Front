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
    <p class="text-red-500 text-sm font-manrope-b">{{ info }}</p>
    <Calendar
      v-model="model"
      :manualInput="false"
      :dateFormat="dateFormat"
      :view="view"
      :disabled="disabled"
      :minDate="minDate"
      :maxDate="maxDate"
      showIcon
      fluid
      inputClass="w-full"
      iconDisplay="input"
      showButtonBar
    />
    <p class="text-red-500 text-sm font-manrope-b">{{ warning }}</p>
  </div>
</template>

<script lang="ts" setup>
const model = defineModel<Date | null>();
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
    type: String as () => "date" | "month" | "year",
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
  disabled: {
    type: Boolean,
    required: true,
  },
  minDate: {
    type: Date,
    required: false,
  },
  maxDate: {
    type: Date,
    required: false,
  },
});
</script>
