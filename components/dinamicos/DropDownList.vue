<template>
  <div :class="['w-full font-manrope-r', displayFlex ? 'flex gap-1' : 'block']">
    <div>
      <label for="list">{{ label }}:</label>
    </div>
    <div>
      <select
        id="list"
        v-model="opt"
        class="border-black border rounded bg-white appearance-none"
      >
        <option
          value="one"
          class="text-red-500 hover:text-red-700 hover:bg-blue-500 appearance-none"
        >
          One
        </option>
        <option value="two">Two</option>
        <option value="tree">Tree</option>
        <optgroup label="putos">
          <option value="conejo">Bad bunny</option>
          <option value="maluma">Maluma</option>
        </optgroup>
      </select>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const opt = ref<String[] | null>();

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  displayFlex: {
    type: Boolean,
    required: true,
  },
});
</script>
