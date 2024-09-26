<template>
  <div class="py-11">
    <div class="text-center">
      <p class="font-manrope-b text-xl">PRODUCCIÓN</p>
      <p v-if="formVisible" class="font-manrope-r mb-3">
        Ingresar producción del día
      </p>
    </div>
    <form
      v-if="formVisible"
      @submit.prevent="handleSubmit"
      class="px-5 py-8 border-[1px] border-black rounded-lg"
    >
      <p class="mb-1 font-manrope-r">Producción Planificada:</p>
      <input
        type="text"
        v-model="prodPlan"
        class="border-[1px] border-black rounded-md outline-none py-1 pl-2 mb-6"
      />
      <p class="mb-1 font-manrope-r">Plan armado:</p>
      <input
        type="text"
        v-model="planArmado"
        class="border-[1px] border-black rounded-md outline-none py-1 pl-2 mb-8"
      />
      <div class="flex justify-center">
        <button
          class="w-full bg-azulClaroIENM py-1 rounded-md border-[1px] border-azulClaroIENM text-white font-manrope-b"
          type="submit"
        >
          EMPEZAR
        </button>
      </div>
    </form>
    <div></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";

const prodPlan = ref();
const planArmado = ref();
const toast = useToast();
const formVisible = ref(false);

const handleSubmit = () => {
  if (prodPlan.value && planArmado.value) {
    formVisible.value = false;
  } else {
    toast.add({
      severity: "error",
      summary: "",
      detail: "",
      life: 3000,
    });
  }
};
</script>
