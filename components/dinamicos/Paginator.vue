<template>
  <div class="w-full text-center py-1 items-center">
    <button
      type="button"
      :disabled="currentPage === 1"
      @click="currentPage = 1"
      :class="[
        'py-2 px-3 rounded-[50%]',
        currentPage === 1 ? 'text-gray-400' : 'hover:bg-gray-200',
      ]"
    >
      <i class="pi pi-angle-double-left"></i>
    </button>
    <button
      type="button"
      :disabled="currentPage === 1"
      @click="currentPage -= 1"
      :class="[
        'py-2 px-3 rounded-[50%]',
        currentPage === 1 ? 'text-gray-400' : 'hover:bg-gray-200',
      ]"
    >
      <i class="pi pi-angle-left"></i>
    </button>
    <span class="font-manrope-b"
      >Página {{ currentPage }} de {{ totalPages }}</span
    >
    <button
      type="button"
      :disabled="currentPage === totalPages"
      @click="currentPage += 1"
      :class="[
        'py-2 px-3 rounded-[50%]',
        currentPage === totalPages ? 'text-gray-400' : 'hover:bg-gray-200',
      ]"
    >
      <i class="pi pi-angle-right"></i>
    </button>
    <button
      type="button"
      :disabled="currentPage === totalPages"
      @click="currentPage = totalPages"
      :class="[
        'py-2 px-3 rounded-[50%]',
        currentPage === totalPages ? 'text-gray-400' : 'hover:bg-gray-200',
      ]"
    >
      <i class="pi pi-angle-double-right"></i>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, computed, watch } from "vue";

const props = defineProps({
  filteredData: {
    type: Array as () => any[],
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
});

const currentPage = ref(props.currentPage);
const itemsPerPage = ref(props.itemsPerPage);

const emits = defineEmits<{
  (event: "updateDataForPages", dataForPages: any[]): void;
}>();

const totalItems = computed(() => props.filteredData.length);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value))
);

watch([currentPage, totalPages], ([newCurrentPage, newTotalPages]) => {
  if (newCurrentPage > newTotalPages) {
    currentPage.value = newTotalPages;
  } else if (newCurrentPage < 1) {
    currentPage.value = 1;
  }
});

const dataForPages = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return props.filteredData.slice(start, end);
});

watch(dataForPages, (newVal) => {
  emits("updateDataForPages", newVal);
});
</script>
