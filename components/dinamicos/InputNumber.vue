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
    <input
      type="text"
      :id="`inp${label}`"
      v-model="model"
      :maxlength="limitMax"
      :disabled="disabled"
      @keypress="preventLetters"
      :class="[
        'w-full rounded outline-none p-1',
        disabled ? 'bg-gray-300 border border-gray-400' : 'border border-black',
      ]"
    />
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

function preventLetters(event: KeyboardEvent) {
  const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"];
  const isNumber = /^[0-9]$/.test(event.key);
  const isAllowed = allowed.includes(event.key);

  const input = event.target as HTMLInputElement;
  const cursorPos = input.selectionStart ?? 0;
  const value = input.value;

  if (!isNumber && !isAllowed) {
    event.preventDefault();
    return;
  }

  // Bloquear si el valor empieza con "0" y se intenta escribir algo más
  if (value === "0" && isNumber && event.key !== "Backspace") {
    event.preventDefault();
    return;
  }

  // Bloquear escribir "0" como primer carácter si se va a seguir escribiendo más
  if (event.key === "0" && cursorPos === 0 && value.length > 0) {
    event.preventDefault();
    return;
  }

  // Bloquear "0" como primer carácter si el usuario va a escribir más luego
  if (event.key === "0" && cursorPos === 0 && value.length === 0) {
    return; // permitir "0" solo si está vacío
  }

  // Si ya hay un 0 al principio y el cursor está en el segundo lugar, bloquear más dígitos
  if (value.startsWith("0") && value.length > 0 && cursorPos > 0) {
    event.preventDefault();
  }
}
</script>
