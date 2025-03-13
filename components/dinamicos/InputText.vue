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
    <input
      type="text"
      :id="`inp${label}`"
      v-model="model"
      :maxlength="limitMax"
      class="w-full border-[1px] border-black rounded outline-none p-1"
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
  limitMax: {
    type: Number,
    required: false,
  },
  warning: {
    type: String,
    required: false,
  },
});
</script>
