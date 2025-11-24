<template>
  <div
    :class="[
      'w-full  relative py-1',
      displayFlex ? 'flex gap-1' : 'block',
    ]"
  >
    <div>
      <label :for="`inp${label}`" class="cursor-pointer "
        >{{ label }}:</label
      >
    </div>
    <p class="text-red-500 text-sm ">{{ info }}</p>
    <div :class="['w-full rounded-3xl outline-none p-1 shadow-2xl flex items-center gap-2',
        disabled ? 'bg-gray-200 border border-gray-400' : 'border border-gray-300',
      ]">
      <input
        :type="showPassword ? 'text' : 'password'"
        :id="`inp${label}`"
        v-model="model"
        :maxlength="limitMax"
        :disabled="disabled"
        class="w-full rounded outline-none p-1"
      />
      <span
        v-show="showIcon"
        class="cursor-pointer"
        @click="toggleShowPassword"
      >
        <i :class="showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
      </span>
    </div>
    <p class="text-red-500 text-sm ">{{ warning }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

const model = defineModel('model');

const props = defineProps({
  label: {type: String, required: true,},
  displayFlex: {type: Boolean, required: true},
  disabled: {type: Boolean, required: false},
  limitMax: {type: Number, required: false},
  info: {type: String, required: false},
  warning: {type: String, required: false},
  showPassword: { type: Boolean, default: false},
  showIcon: { type: Boolean, default: true },
});

const emit = defineEmits(["update:showPassword"]);

function toggleShowPassword() {
  emit("update:showPassword", !props.showPassword);
}
</script>
