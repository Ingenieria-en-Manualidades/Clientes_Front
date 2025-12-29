<template>
  <div
    :class="[
      'w-full relative py-1',
      displayFlex ? 'flex gap-1 items-start' : 'block',
    ]"
    ref="dropdown"
  >
    <p class="text-sm">{{ label }}:</p>
    <p class="text-red-500 text-sm" v-if="info">{{ info }}</p>

    <label
      class="shadow-2xl cursor-pointer"
    >
      <div @click="toggle" class="flex items-stretch w-full border border-gray-300 rounded-3xl overflow-hidden">
        <div class="flex-1 min-w-0 px-3 py-2" @click="toggle">
          <p class="truncate">
            Selecciona una opción
          </p>
        </div>
        <button
          type="button"
          class="px-3 bg-azulClaroIENM text-white flex items-center justify-center self-stretch"
          aria-label="Abrir opciones"
        >
          <i class="pi pi-angle-down"></i>
        </button>
      </div>
    </label>

    <ul
      class="absolute z-40 mt-1 w-full bg-white border rounded-lg shadow-lg"
      v-show="visible"
    >
      <li
        v-for="(option, index) in options"
        :key="index"
        :class="['flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer', index === 0 ? 'rounded-t' : '']"
      >
        <label :for="`option-${index}`" class="flex items-center gap-2 w-full cursor-pointer">
          <template v-if="multiple">
            <input type="checkbox" :value="option.value" v-model="selectedArray" :id="`option-${index}`" />
          </template>
          <template v-else>
            <input type="radio" :value="option.value" v-model="selectedSingle" name="dinamicos-radio" :id="`option-${index}`" />
          </template>
          <span class="truncate">{{ option.label }}</span>
        </label>
      </li>
    </ul>

    <!-- CHIPS: valores seleccionados como en InputSearchList -->
    <div class="mt-2 flex flex-wrap gap-2" v-if="selectedLabels.length > 0">
      <span
        v-for="(lab, i) in selectedLabels"
        :key="`chip-${i}`"
        class="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
      >
        {{ lab }}
        <button class="hover:text-blue-600" @click.stop.prevent="removeAt(i)">×</button>
      </span>
    </div>

    <p class="text-red-500 text-sm" v-if="warning">{{ warning }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import type { OptionDropdown } from '../../interfaces/componentesDinamicos'

// v-model
const model = defineModel<any>()

const props = defineProps({
  label: { type: String, required: true },
  displayFlex: { type: Boolean, required: true },
  placeholder: { type: String, required: false },
  options: { type: Array as () => OptionDropdown[], required: true },
  info: { type: String, required: false },
  warning: { type: String, required: false },
  disabled: { type: Boolean, required: false },
  multiple: { type: Boolean, required: false, default: false },
})

const visible = ref(false)
const dropdown = ref<HTMLElement | null>(null)

const selectedArray = ref<any[]>([])
const selectedSingle = ref<any>('')

// Toggle open/close
const toggle = () => {
  if (props.disabled) return
  visible.value = !visible.value
}

// Select handler when clicking a list item (ensures toggling for checkboxes)
const selectOption = (value: any) => {
  if (props.multiple) {
    const idx = selectedArray.value.indexOf(value)
    if (idx === -1) selectedArray.value.push(value)
    else selectedArray.value.splice(idx, 1)
  } else {
    selectedSingle.value = value
    visible.value = false
  }
}

// computed labels para los chips
const selectedLabels = computed(() => {
  const opts = props.options || []
  const values = props.multiple ? selectedArray.value : (selectedSingle.value ? [selectedSingle.value] : [])
  return values.map((val: any) => {
    const found = opts.find((o: any) => o.value == val || o.value === val)
    return found ? found.label : String(val)
  })
})

// función para remover una selección desde los chips
const removeAt = (idx: number) => {
  if (!props.multiple) {
    selectedSingle.value = ''
    return
  }
  if (idx < 0 || idx >= selectedArray.value.length) return
  selectedArray.value.splice(idx, 1)
}

// Sync v-model with internal state
watch(
  () => model.$value,
  v => {
    if (props.multiple) {
      selectedArray.value = Array.isArray(v) ? [...v] : (v ? [v] : [])
    } else {
      selectedSingle.value = v ?? ''
    }
  },
  { immediate: true }
)

watch(selectedArray, v => model.value = v)
watch(selectedSingle, v => model.value = v)

// Click outside to close
const handleClickOutside = (e: MouseEvent) => {
  if (dropdown.value && !dropdown.value.contains(e.target as Node)) visible.value = false
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>
