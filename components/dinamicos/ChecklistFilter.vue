<template>
  <div
    :class="['relative', placeholder ? 'max-w-40' : 'max-w-7']"
    ref="dropdown" id="dinamicChecklistFilter"
  >
    <div
      @click="visible = !visible"
      class="flex items-center border-[1px] border-black p-[2px] rounded bg-white text-black cursor-pointer ml-1"
    >
      <p v-if="placeholder" class="w-[90%] mx-1">{{ placeholder }}</p>
      <i class="pi pi-angle-down"></i>
    </div>
    <ul class="absolute w-auto border-[1px] border-black bg-white mt-1 rounded z-30" v-show="visible">
      <label v-for="(item, index) in items" :key="`${atribute}-${index}`" :for="`${atribute}-${index}`">
        <li :class="['py-1 px-2 flex cursor-pointer hover:bg-gray-200',
                    index === 0 ? 'rounded-t border-b-[1px] border-b-black'
                    : index !== items.length - 1 ? 'border-b-[1px] border-b-black' : 'rounded-b']">
          <input
            type="checkbox"
            v-model="selectedOptions"
            :id="`${atribute}-${index}`"
            :value="item.value"
            class="peer hidden"
          />
          <p class="w-6 h-6 mr-1 inline-block border-[1px] rounded-sm border-blue-500 peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all duration-200">
            <i :class="['pi pi-check text-base text-white ml-[2px]', selectedOptions.includes(item.value) ? 'opacity-100' : 'opacity-0']"></i>
          </p>
          <p class="text-black">{{ item.label.replace(/\s+/g, '_') }}</p>
        </li>
      </label>
    </ul>
  </div>
</template>

<script lang="ts" setup>
// <script setup lang="ts">
import { computed, ref, defineProps, defineEmits, watch, onMounted, onBeforeUnmount } from 'vue'

const visible = ref(false)
const selectedOptions = ref<string[]>([])
const dropdown = ref<HTMLElement|null>(null)

const props = defineProps<{
  options: any[]            // <- acepta cualquier forma
  atribute: string
  placeholder?: string
}>()

const items = computed(() =>
  (props.options || []).map((o: any) => {
    const label =
      typeof o === 'string' ? o :
      typeof o === 'number' ? String(o) :
      String(o?.label ?? o?.name ?? '')
    const value =
      typeof o === 'string' || typeof o === 'number' ? String(o) :
      (o?.value ?? label)
    return { label, value }
  })
)

const emits = defineEmits<{
  (e: 'updateFilter', atribute: string, selected: string[]): void
}>()

// We use a watcher to run 'filter' only when 'arrayCheck' changes.
watch(selectedOptions, v => emits('updateFilter', props.atribute, v))

// Detect click outside the dropdown and close the menu.
const handleClickOutside = (e: MouseEvent) => {
  if (dropdown.value && !dropdown.value.contains(e.target as Node)) visible.value = false
}

// Add and remove the event listener.
onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

</script>
