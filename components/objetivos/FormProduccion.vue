<template>
  <form class="w-[40%] max-w-[210px] text-sm sm:text-base">
    <fieldset
      class="border-[1px] border-black px-2 py-[11px] min-[444px]:py-[31px] min-[640px]:py-[37px] md:py-3 font-manrope-r rounded"
    >
      <legend class="font-manrope-b">Producción</legend>
      <p>Producción Planificada:</p>
      <input
        type="date"
        readonly
        class="w-full border-[1px] border-black outline-none rounded mb-1"
        :value="getFecha(date)"
      />
      <input
        type="text"
        v-model="prodPlan"
        class="w-full border-[1px] border-black rounded-md outline-none py-1 pl-2"
      />
      <p class="text-red-500 text-xs my-1">{{ errorProd }}</p>
      <button
        @click="handleSubmit"
        class="w-full bg-azulClaroIENM py-1 rounded-md border-[1px] border-azulClaroIENM text-white font-manrope-b mb-5"
        type="button"
      >
        INGRESAR
      </button>
      <p class="mb-1">Producción Modificada:</p>
      <input
        type="date"
        :readonly="visible"
        class="w-full border-[1px] border-black outline-none rounded mb-1"
      />
      <input
        type="text"
        :readonly="visible"
        v-model="prodMod"
        :class="[
          'w-full border-[1px] rounded-md outline-none py-1 pl-2 mb-1',
          visible ? 'bg-gray-300 border-gray-500' : 'border-black',
        ]"
      />
      <button
        :disabled="visible"
        :class="[
          'w-full py-1 rounded-md border-[1px] text-white font-manrope-b text-sm sm:text-base',
          visible
            ? 'bg-blue-400 border-blue-400'
            : 'bg-azulClaroIENM border-azulClaroIENM',
        ]"
        type="button"
      >
        INGRESAR
      </button>
    </fieldset>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import type { Produccion } from "../../interfaces/objetives";
import { datosObjetivos } from "../../composables/objetivos/datosObjetivos";
import { useObjetivosApi } from "../../composables/objetivos/useObjetivosApi";

const prodMod = ref();
const prodPlan = ref();
const date = new Date();
const errorProd = ref<null | string>();

const toast = useToast();
const { getFecha } = datosObjetivos();
const { createProduccion } = useObjetivosApi();

const props = defineProps({
  visible: Boolean,
});
const emit = defineEmits(["setVisible"]);

const handleSubmit = async () => {
  const objProduccion: Produccion = {
    fecha_produccion: date,
    planificada: Number(prodPlan.value),
    modificada: null,
    plan_armado: null,
    calidad: null,
    desperfecto_me: null,
    desperfecto_pp: null,
    tablero_id: 2,
  };

  if (prodPlan.value) {
    const resultado = await createProduccion(objProduccion);

    if (resultado.success) {
      prodPlan.value = "";
      emit("setVisible");
      showMessage("success", "Guardado correctamente.", resultado.data);
      errorProd.value = null;
    } else {
      showMessage("error", "Error al guardar.", resultado.error);
    }
  } else {
    errorProd.value = "Este campo es obligatorio.";
    showMessage("error", "Campos vacíos.", "Por favor llenar los campos.");
  }
};

const showMessage = (
  severidad: string,
  titulo: string,
  detalles: string | undefined
) => {
  toast.add({
    severity: severidad,
    summary: titulo,
    detail: detalles,
    life: 3000,
  });
};
</script>
