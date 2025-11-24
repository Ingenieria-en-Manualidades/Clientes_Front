<template>
  <div class="w-full relative py-1" ref="root">
    <!-- Label -->
    <div>
      <label :for="`inpSearch${label}`" class="cursor-pointer">{{ label }}:</label>
    </div>
    <p class="text-red-500 text-sm ">{{ warning }}</p>

    <!-- trigger -->
    <div 
      @click="toggle"
      :id="`inpSearch${label}`"
      class="w-full rounded-3xl outline-none shadow-2xl border border-gray-300 flex items-center justify-between cursor-pointer bg-white"
    >
      <div
        class="my-2 ml-2"
      >
        <div class="flex-1 text-left">
          <template v-if="multiple">
            <span class="text-gray-500">{{ placeholder }}</span>
          </template>
          <template v-else>
            <span class="text-gray-500">{{ placeholder }}</span>
          </template>
        </div>
      </div>
      <div class="px-3 bg-azulClaroIENM text-white flex items-center justify-center self-stretch rounded-r-3xl">
        <i :class="['pi', visible ? 'pi-angle-up' : 'pi-angle-down']"></i>
      </div>
    </div>

    <!-- dropdown -->
    <div v-show="visible" class="absolute z-40 mt-1 w-full bg-white border rounded-lg shadow-lg">
      <!-- search input -->
      <div class="p-2 border-b">
        <input
          ref="searchInput"
          type="text"
          v-model="query"
          :placeholder="searchPlaceholder"
          class="w-full p-2 rounded-3xl border border-gray-300 outline-none"
        />
      </div>

      <!-- list -->
      <ul class="max-h-48 overflow-auto">
        <li
          v-for="(it, idx) in filteredItems"
          :key="`${atribute}-${idx}`"
          class="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
          @click.stop="selectItem(it.value)"
        >
          <template v-if="multiple">
            <div class="w-5 h-5 flex items-center justify-center border rounded border-gray-400">
              <i v-if="isSelected(it.value)" class="pi pi-check text-blue-500"></i>
            </div>
          </template>
          <template v-else>
            <span class="w-5"></span>
          </template>
          <span class="text-sm">{{ it.label }}</span>
        </li>
        <li v-if="filteredItems.length === 0" class="px-3 py-2 text-gray-500 text-center">No hay resultados</li>
      </ul>
    </div>

    <!-- chips -->
    <div class="mt-2 flex flex-wrap gap-2" v-if="selectedLabels.length > 0">
      <span
        v-for="(lab, i) in selectedLabels"
        :key="`chip-${i}`"
        class="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
      >
        {{ lab }}
        <button class="hover:text-blue-600" @click.prevent="removeAt(i)">×</button>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps<{
  options: any[]                // items: strings | numbers | { label, value }
  atribute?: string
  placeholder?: string
  searchPlaceholder?: string
  multiple?: boolean
  modelValue?: string | string[]
  label: string
  warning: string      // New required prop
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', v: string | string[]): void
  (e: 'updateFilter', atribute: string|undefined, selected: string[]): void
}>()

const visible = ref(false)
const query = ref('')

const root = ref<HTMLElement|null>(null)
const searchInput = ref<HTMLInputElement | null>(null)

// normalize options to { label, value }
const items = computed(() => (props.options || []).map((o: any) => {
  const label = typeof o === 'string' ? o : typeof o === 'number' ? String(o) : String(o?.label ?? o?.name ?? '')
  const value = typeof o === 'string' || typeof o === 'number' ? String(o) : (String(o?.value ?? label))
  return { label, value }
}))

const filteredItems = computed(() => {
  const q = (query.value || '').trim().toLowerCase()
  if (!q) return items.value
  return items.value.filter(i => i.label.toLowerCase().includes(q) || i.value.toLowerCase().includes(q))
})

// internal selected state derived from modelValue
const selected = ref<string[]>([])

onMounted(() => {
  syncFromModel()
  document.addEventListener('click', onBodyClick)
})
onBeforeUnmount(() => document.removeEventListener('click', onBodyClick))

watch(() => props.modelValue, () => syncFromModel(), { immediate: true })

function syncFromModel() {
  if (props.multiple ?? true) {
    selected.value = Array.isArray(props.modelValue) ? [...(props.modelValue as string[])] : (props.modelValue ? [String(props.modelValue)] : [])
  } else {
    const v = props.modelValue == null ? [] : [String(props.modelValue)]
    selected.value = v
  }
}

function onBodyClick(e: MouseEvent) {
  if (!root.value) return
  if (!root.value.contains(e.target as Node)) visible.value = false
}

function toggle() {
  visible.value = !visible.value
  if (visible.value) {
    query.value = ''
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

function isSelected(val: string) {
  return selected.value.includes(val)
}

function toggleSelect(val: string) {
  if (!(props.multiple ?? true)) {
    selected.value = [val]
    commit()
    visible.value = false
    return
  }
  const idx = selected.value.indexOf(val)
  if (idx >= 0) selected.value.splice(idx, 1)
  else selected.value.push(val)
  commit()
}

function selectItem(val: string) {
  if (props.multiple ?? true) {
    toggleSelect(val)
  } else {
    selected.value = [val]
    commit()
    visible.value = false
  }
}

function commit() {
  const out = props.multiple ?? true ? [...selected.value] : (selected.value[0] ?? '')
  emits('update:modelValue', out)
  // also emit updateFilter for parity with ChecklistFilter
  emits('updateFilter', props.atribute, [...selected.value])
}

const selectedLabels = computed(() => {
  return selected.value.map(s => {
    const found = items.value.find(i => i.value === s)
    return found ? found.label : s
  })
})

function removeAt(idx: number) {
  if (idx < 0 || idx >= selected.value.length) return
  selected.value.splice(idx, 1)
  commit()
}
</script>

