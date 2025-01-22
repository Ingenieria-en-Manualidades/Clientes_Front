<template>
  <button
    type="button"
    class="font-manrope-r border-[1px] border-green-500 bg-green-500 px-6 py-1 rounded"
    @click="showModal"
  >
    <span>Si</span>
  </button>
  <Dialog
    v-model:visible="visible"
    modal
    :header="'Solicitud para sobreescribir archivo'"
    :style="{ width: '25rem' }"
  >
    <div
      class="font-manrope-r text-center border-[1px] border-gray-500 rounded py-7"
    >
      <p class="font-bold">Fecha de la solicitud</p>
      <input
        type="text"
        class="border-[1px] border-black rounded p-1 mb-5"
        v-model="currentDate"
        disabled
      />
      <div class="block">
        <div>
          <label for="motive" class="font-bold">Motivo del rechazo</label>
        </div>
        <div>
          <textarea
            class="border-[1px] border-black rounded p-1 h-[150px]"
            id="motive"
            v-model="motive"
          ></textarea>
        </div>
      </div>
      <div class="mt-8">
        <button
          class="font-manrope-b border-[1px] border-green-500 bg-green-500 px-6 py-1 rounded text-white"
          @click="submit"
        >
          Enviar
        </button>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const motive = ref();
const visible = ref();
const date = new Date();
const currentDate = ref(
  `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`
);
const emits = defineEmits(["removeMessage"]);

const showModal = () => {
  visible.value = true;
};

const closeModal = () => {
  visible.value = false;
};

const submit = () => {
  closeModal();
  emits("removeMessage");
};
</script>
