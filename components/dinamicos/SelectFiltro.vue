<template>
  <div class="relative w-full">
    <button
      type="button"
      @click="visible = !visible"
      class="flex border-[1px] border-black py-1 pl-2 rounded bg-white"
    >
      <div class="w-[85%] truncate text-base outline-none cursor-pointer">
        {{ placeholder }}
      </div>
      <i class="pi pi-angle-down text-black mt-1 mx-2"></i>
    </button>
    <div
      :class="[
        'absolute border-[1px] border-black rounded top-2 left-0',
        visible ? 'block translate-y-7' : 'hidden',
      ]"
    >
      <label
        :for="opcion + 'ID'"
        v-for="(opcion, index) in opciones"
        v-bind:key="index"
      >
        <div
          :class="[
            'py-1 px-3 bg-white hover:bg-[#fdb740] flex cursor-pointer font-manrope-r text-black text-left',
            index === 0
              ? 'rounded-t border-b-[1px] border-b-black'
              : index + 1 === opciones?.length
              ? 'rounded-b'
              : 'border-b-[1px] border-b-black',
          ]"
        >
          <Checkbox
            v-model="elegidos"
            :inputId="opcion + 'ID'"
            :value="opcion"
            @click="seleccionar"
          />
          <p class="ml-2">{{ opcion }}</p>
        </div>
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const visible = ref(false);
const elegidos = defineModel();

const props = defineProps({
  opciones: {
    type: Array as () => String[],
    required: true,
  },
  placeholder: {
    type: String,
    required: false,
  },
});
const emit = defineEmits(["metodo"]);

const seleccionar = async () => {
  await dormir(100);
  emit("metodo");
};

const dormir = (tiempo: number) => {
  return new Promise((resolve) => setTimeout(resolve, tiempo));
};
</script>
