<template>
  <div
    :class="['relative', placeholder ? 'max-w-40' : 'max-w-7']"
    ref="dropdown"
  >
    <div
      @click="visible = !visible"
      class="flex items-center border-[1px] border-black p-[2px] rounded bg-white text-black cursor-pointer ml-1"
    >
      <p v-if="placeholder" class="w-[90%] mx-1">{{ placeholder }}</p>
      <i class="pi pi-angle-down"></i>
    </div>
    <ul
      class="absolute w-auto border-[1px] border-black bg-white mt-1 rounded z-30"
      v-show="visible"
    >
      <label
        v-for="(option, index) in options"
        v-bind:key="`${atribute}-${index}`"
        :for="`${atribute}-${index}`"
      >
        <li
          :class="[
            'py-1 px-2 flex cursor-pointer hover:bg-gray-200',
            index === 0
              ? 'rounded-t border-b-[1px] border-b-black'
              : index !== options.length - 1
              ? 'border-b-[1px] border-b-black'
              : 'rounded-b',
          ]"
        >
          <input
            type="checkbox"
            v-model="selectedOptions"
            :id="`${atribute}-${index}`"
            :value="option"
            class="peer hidden"
          />
          <p
            class="w-6 h-6 mr-1 inline-block border-[1px] rounded-sm border-blue-500 peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all duration-200"
          >
            <i
              :class="[
                'pi pi-check text-base text-white ml-[2px]',
                selectedOptions.includes(option) ? 'opacity-100' : 'opacity-0',
              ]"
            ></i>
          </p>
          <p class="text-black">{{ option.replace(" ", "_") }}</p>
        </li>
      </label>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  watch,
  ref,
  onMounted,
  onBeforeUnmount,
} from "vue";

const visible = ref<boolean>(false);
const selectedOptions = ref<string[]>([]);
const dropdown = ref<HTMLElement | null>(null);

const props = defineProps({
  options: {
    type: Array as () => string[],
    required: true,
  },
  atribute: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    required: false,
  },
});

const emits = defineEmits<{
  (event: "updateFilter", atribute: string, selectedOptions: string[]): void;
}>();

// We use a watcher to run 'filter' only when 'arrayCheck' changes.
watch(selectedOptions, async (newVal: string[], oldVal: string[]) => {
  if (newVal !== oldVal) {
    emits("updateFilter", props.atribute, selectedOptions.value);
  }
});

// Detect click outside the dropdown and close the menu.
const handleClickOutside = (event: MouseEvent) => {
  if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
    visible.value = false;
  }
};

// Add and remove the event listener.
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
