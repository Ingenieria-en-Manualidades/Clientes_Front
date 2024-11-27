<template>
  <div class="w-[165px] relative">
    <button
      type="button"
      @click="visible = !visible"
      class="w-[16%] float-right border-[1px] border-black rounded pt-1 px-1"
    >
      <i class="pi pi-angle-down"></i>
    </button>
    <div
      :class="[
        'w-full absolute border-[1px] border-black rounded',
        visible ? 'block translate-y-8' : 'hidden',
      ]"
    >
      <label
        :for="index + 'ID'"
        v-for="(opcion, index) in opciones"
        v-bind:key="index"
      >
        <div
          :class="[
            'py-1 px-2 bg-white hover:bg-[#fdb740] cursor-pointer font-manrope-r',
            index === 0
              ? 'rounded-t border-b-[1px] border-b-black'
              : index + 1 === opciones?.length
              ? 'rounded-b'
              : 'border-b-[1px] border-b-black',
          ]"
        >
          <Checkbox
            v-model="lenguajes"
            :inputId="index + 'ID'"
            :value="opcion"
          />
          <span class="ml-2">{{ opcion }}</span>
        </div>
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const lenguajes = ref();
const visible = ref(true);

const props = defineProps({
  opciones: {
    type: Array as () => String[],
    require: true,
  },
});
</script>
