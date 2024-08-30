<template>
  <div
    class="relative flex flex-col h-full overflow-hidden shadow-md rounded-3xl bg-white p-4"
  >
    <div class="mb-4">
      <input
        class="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        placeholder="Search"
        v-model="searchQuery"
      />
    </div>

    <div class="flex-1 overflow-auto table-container">
      <table
        class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md"
      >
        <thead class="bg-gray-100 text-gray-700 text-center">
          <tr>
            <th
              v-for="(header, index) in headers"
              :key="index"
              class="px-6 py-3 border-b border-gray-200"
            >
              {{ header }}
            </th>
            <th class="px-6 py-3 border-b border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in paginatedData"
            :key="rowIndex"
            class="hover:bg-gray-50"
          >
            <td
              v-for="(header, headerIndex) in headers"
              :key="headerIndex"
              class="text-center px-6 py-4 border-b border-gray-200"
            >
              {{ row[header] }}
            </td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td
              :colspan="headers.length + 1"
              class="text-center px-6 py-4 text-gray-500"
            >
              No data found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4 flex justify-between items-center">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Previous
      </button>
      <span class="text-gray-700"
        >Page {{ currentPage }} of {{ totalPages }}</span
      >
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from "vue";

const props = defineProps<{
  data: Record<string, string | number>[];
}>();

const headers = ref(["DNI", "NAME", "AGE"]);

const emit = defineEmits<{
  (event: "edit", row: Record<string, string | number>): void;
  (event: "delete", row: Record<string, string | number>): void;
}>();

const searchQuery = ref("");
const itemsPerPage = ref(10);
const currentPage = ref(2);

const filteredData = computed(() => {
  if (!searchQuery.value) {
    return props.data;
  }
  const query = searchQuery.value.toLowerCase();
  return props.data.filter((row) =>
    Object.entries(row).some(
      ([key, value]) =>
        headers.value.includes(key) &&
        value.toString().toLowerCase().includes(query)
    )
  );
});

const totalItems = computed(() => filteredData.value.length);
const totalPages = computed(() =>
  Math.ceil(totalItems.value / itemsPerPage.value)
);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredData.value.slice(start, end);
});

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};
</script>
