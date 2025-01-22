<template>
  <div class="w-full font-manrope-r">
    <p class="w-full text-lg text-center font-bold">{{ caption }}</p>
    <div class="w-full flex justify-start items-center mb-1">
      <slot name="newFilter"></slot>
      <div
        class="flex justify-around gap-1"
        v-if="positionFilters === 'onTable'"
      >
        <div v-for="(header, index) in headers" v-bind:key="index">
          <span v-if="header.options">Buscar por:</span>
          <DinamicosChecklistFilter
            v-if="header.options"
            :options="header.options.labels"
            :atribute="header.options.atribute"
            :placeholder="header.label"
            @update-filter="updateFilter"
            class="mr-10"
          />
        </div>
      </div>
    </div>
    <ScrollPanel :style="{ width: '100%', height: heightTable }">
      <table class="w-full text-xs sm:text-sm">
        <thead>
          <tr>
            <th class="bg-azulIENM text-white py-2 px-3">
              <button
                v-show="visibleCleanFilters"
                @click="cleanFilters"
                class="bg-yellow-200 border-[1px] border-black rounded text-black px-2 py-1"
              >
                <i class="pi pi-refresh"></i>
              </button>
            </th>
            <th
              v-for="(header, index) in headers"
              v-bind:key="index"
              class="bg-azulIENM text-white py-2 px-3"
            >
              <div class="flex justify-center items-center">
                <span>{{ header.label.toUpperCase() }}</span>
                <DinamicosChecklistFilter
                  v-if="header.options && positionFilters === 'inTable'"
                  :options="header.options.labels"
                  :atribute="header.options.atribute"
                  @update-filter="updateFilter"
                />
              </div>
            </th>
            <slot name="newColumn"></slot>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="loading"
            class="border-x-[1px] border-b-[1px] border-gray-400 text-center"
          >
            <td class="py-3" :colspan="atributes.length + 1">
              <div class="p-5 rounded-t-lg text-center">
                <ProgressSpinner
                  style="width: 50px; height: 50px"
                  strokeWidth="8"
                  fill="transparent"
                  animationDuration=".5s"
                  aria-label="Custom ProgressSpinner"
                />
              </div>
            </td>
          </tr>
          <tr
            v-else-if="filteredData.length !== 0"
            class="border-x-[1px] border-b-[1px] border-gray-400 text-center"
            v-for="(object, indexData) in dataPages"
            v-bind:key="indexData"
          >
            <td></td>
            <td
              class="py-1"
              v-for="(atribute, indexAtribute) in atributes"
              v-bind:key="indexAtribute"
            >
              {{ object[atribute] }}
            </td>
            <slot name="newCell" :object="object"></slot>
          </tr>
          <tr
            v-else-if="errorData"
            class="border-x-[1px] border-b-[1px] border-gray-400 text-center"
          >
            <td
              class="py-3 font-bold text-center"
              :colspan="atributes.length + 1"
            >
              <i class="pi pi-times-circle text-3xl"></i>
              <p class="text-xl">ERROR A LA HORA DE CARGAR</p>
            </td>
          </tr>
          <tr
            v-else-if="warningData.success"
            class="border-x-[1px] border-b-[1px] border-gray-400 text-center"
          >
            <td
              class="py-3 font-bold text-center"
              :colspan="atributes.length + 1"
            >
              <i class="pi pi-exclamation-triangle text-3xl"></i>
              <p class="text-lg">{{ warningData.label }}</p>
            </td>
          </tr>
          <tr
            v-else
            class="border-x-[1px] border-b-[1px] border-gray-400 text-center"
          >
            <td
              class="py-3 font-bold text-center"
              :colspan="atributes.length + 1"
            >
              <i class="pi pi-exclamation-triangle text-3xl"></i>
              <p class="text-lg">NO HAY VALORES QUE CUMPLAN CON LOS FILTROS</p>
            </td>
          </tr>
        </tbody>
      </table>
    </ScrollPanel>
    <DinamicosPaginator
      :filteredData="filteredData"
      :currentPage="currentPage"
      :itemsPerPage="itemsPerPage"
      @update-data-for-pages="updateDataForPages"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, computed } from "vue";
import type { HeaderWithFilters, WarningTable } from "../../interfaces/filters";

const props = defineProps({
  headers: {
    type: Array as () => HeaderWithFilters[],
    required: true,
  },
  atributes: {
    type: Array as () => String[],
    required: true,
  },
  data: {
    type: Array as () => any[],
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  errorData: {
    type: Boolean,
    required: true,
  },
  warningData: {
    type: Object as () => WarningTable,
    required: true,
  },
  caption: {
    type: String,
    required: false,
  },
  height: {
    type: String,
    required: false,
  },
  positionFilters: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(["setCleanExternalFilters"]);

const currentPage = ref(1);
const itemsPerPage = ref(5);
const heightTable = ref(props.height || "311px");
const filters = ref<Record<string, string[]>>({});
const dataPages = ref(props.data.slice(0, itemsPerPage.value));

const updateFilter = (atribute: string, selectedOptions: string[]) => {
  filters.value[atribute] = selectedOptions;
};

const updateDataForPages = (dataForPages: any[]) => {
  dataPages.value = dataForPages;
};

const filteredData = computed(() => {
  return props.data.filter((item) => {
    return Object.entries(filters.value).every(
      ([atribute, selectedOptions]) => {
        return (
          selectedOptions.length === 0 ||
          selectedOptions.includes(item[atribute])
        );
      }
    );
  });
});

const visibleCleanFilters = computed(() => {
  const filtersChecked = Object.entries(filters.value).reduce((acc, filter) => {
    const test = filter[1].length !== 0;
    acc.push(test);
    return acc;
  }, []);

  return filtersChecked.includes(true);
});

const cleanFilters = () => {
  for (const filter of Object.entries(filters.value)) {
    filter[1].splice(0, filter.length);
  }
  emits("setCleanExternalFilters");
};
</script>
