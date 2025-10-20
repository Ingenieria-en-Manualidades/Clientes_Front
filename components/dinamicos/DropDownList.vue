<template>
  <div id="dailyDropDown"
    :class="[
      'w-full  relative py-1 ',
      displayFlex ? 'flex gap-1 items-start' : 'block',
      'cursor-pointer'
    ]"
    @click="openSelect"
  >
    <p class=" text-sm">{{ label }}:</p>
    <p class="text-red-500 text-sm " v-if="info">{{ info }}</p>

    <!-- Contenedor del control (match de alturas y bordes) -->
    <label
      class=" shadow-2xl flex items-stretch w-full border border-gray-300 rounded-3xl overflow-hidden"
      @click.stop="openSelect"
    >
      <select
        ref="selectEl"
        v-model="model"
        :class="['flex-1 min-w-0 appearance-none px-3 py-2 cursor-pointer rounded-none', disabled ? 'bg-gray-200' : 'bg-white',]"
        :aria-label="`Seleccionar ${label}`"
        @click.stop
        :disabled="disabled"
      >
        <option disabled value="">
          {{ placeholder ?? 'Selecciona una opción' }}
        </option>
        <option
          v-for="(option, index) in options"
          :key="index"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Flecha: misma altura que el select -->
      <button
        type="button"
        class="px-3 bg-azulClaroIENM text-white flex items-center justify-center self-stretch"
        aria-label="Abrir opciones"
        @click.stop="openSelect"
      >
        <i class="pi pi-angle-down"></i>
      </button>
    </label>

    <p class="text-red-500 text-sm " v-if="warning">{{ warning }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { OptionDropdown } from '../../interfaces/componentesDinamicos'

// v-model del componente
const model = defineModel<any>()

const props = defineProps({
  label: { type: String, required: true },
  displayFlex: { type: Boolean, required: true },
  placeholder: { type: String, required: false },
  options: { type: Array as () => OptionDropdown[], required: true },
  info: { type: String, required: false },
  warning: { type: String, required: false },
  disabled: {type: Boolean, required: false},
})

const selectEl = ref<HTMLSelectElement | null>(null)

const openSelect = () => {
  const el = selectEl.value
  if (!el) return

  // Chrome/Edge modernos
  // @ts-ignore: showPicker no está tipado en todos los entornos
  if (typeof el.showPicker === 'function') {
    // @ts-ignore
    el.showPicker()
    return
  }

  // Fallback para otros navegadores
  el.focus()
  el.click()
}
</script>
