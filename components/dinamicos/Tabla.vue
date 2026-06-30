<template>
  <component :is="scrollComponent" v-bind="scrollProps">
    <table class="text-xs sm:text-sm w-full ">
      <caption class="text-base" v-if="titulo">
        {{
          titulo
        }}
      </caption>
      <thead>
        <tr class="sm:text-sm">
          <th
            class="bg-azulIENM text-white py-2 px-3"
            v-for="(cabeza, index) in cabezas"
            v-bind:key="index"
          >
            {{ cabeza.toUpperCase() }}
          </th>
          <slot name="nuevaColumna"></slot>
        </tr>
      </thead>
      <tbody id="tableBodyDynamic">
        <tr
          class="border-x-[1px] border-b-[1px] border-gray-400 text-center"
          v-for="(data, index) in arrayData"
          v-bind:key="index"
        >
          <td
            class="p-[5px]"
            v-for="(atributo, index) in atributosDatos"
            v-bind:key="index"
          >
            {{ data[atributo] }}
          </td>
          <slot name="botones" :data="data"></slot>
        </tr>
      </tbody>
      <tfoot>
        <slot name="tfoot"></slot>
      </tfoot>
    </table>
  </component>
  <div v-if="pag" class="w-full text-center py-3">
    <button
      type="button"
      :disabled="paginaActual === 1"
      @click="paginaActual = 1"
      :class="[
        'py-2 px-3 rounded-[50%]',
        paginaActual === 1 ? 'text-gray-400' : 'hover:bg-gray-200',
      ]"
    >
      <i class="pi pi-angle-double-left"></i>
    </button>
    <button
      type="button"
      :disabled="paginaActual === 1"
      @click="paginaActual -= 1"
      :class="[
        'py-2 px-3 rounded-[50%]',
        paginaActual === 1 ? 'text-gray-400' : 'hover:bg-gray-200',
      ]"
    >
      <i class="pi pi-angle-left"></i>
    </button>
    <span class=" mt-[6px]"
      >Página {{ paginaActual }} de {{ totalPaginas }}</span
    >
    <button
      type="button"
      :disabled="paginaActual === totalPaginas"
      @click="paginaActual += 1"
      :class="[
        'py-2 px-3 rounded-[50%]',
        paginaActual === totalPaginas ? 'text-gray-400' : 'hover:bg-gray-200',
      ]"
    >
      <i class="pi pi-angle-right"></i>
    </button>
    <button
      type="button"
      :disabled="paginaActual === totalPaginas"
      @click="paginaActual = totalPaginas"
      :class="[
        'py-2 px-3 rounded-[50%]',
        paginaActual === totalPaginas ? 'text-gray-400' : 'hover:bg-gray-200',
      ]"
    >
      <i class="pi pi-angle-double-right"></i>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, computed, resolveComponent } from "vue";

const props = defineProps({
  titulo: String,
  cabezas: {
    type: Object as () => String[],
    required: true,
  },
  atributosDatos: {
    type: Object as () => String[],
    required: false,
  },
  arrayData: {
    type: Object as () => any[],
    required: true,
  },
  pag: Boolean,
  nativeScroll: Boolean,
});

const scrollComponent = computed(() =>
  props.nativeScroll ? "div" : resolveComponent("ScrollPanel")
);
const scrollProps = computed(() =>
  props.nativeScroll
    ? {
        class: "max-w-full overflow-auto",
        style: { width: "100%", maxHeight: "319px" },
      }
    : { style: { width: "100%", height: "319px" } }
);

const paginaActual = ref(1);
const itemsPorPagina = ref(5);
const totalItems = computed(() => props.arrayData.length);
const totalPaginas = computed(() =>
  Math.ceil(totalItems.value / itemsPorPagina.value)
);

const arrayData = computed(() => {
  const start = (paginaActual.value - 1) * itemsPorPagina.value;
  const end = start + itemsPorPagina.value;
  return props.arrayData.slice(start, end);
});

// Method that is executed after a query and ensures that if the current page is greater than the total number of pages, the current page will be the last one.
const reestablecerPaginas = async () => {
  await dormir(1); // We pause the code so that the total number of pages is updated.
  if (paginaActual.value > totalPaginas.value) {
    paginaActual.value = totalPaginas.value;
  }
};

// Method made to stop the code from working.
const dormir = (tiempo: number) => {
  return new Promise((resolve) => setTimeout(resolve, tiempo));
};

defineExpose({
  reestablecerPaginas,
});
</script>
