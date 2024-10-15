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
        :disabled="!visible"
        v-model="prodPlan"
        :class="[
          'w-full border-[1px] rounded-md outline-none py-1 pl-2 mb-1',
          visible ? 'border-black' : 'bg-gray-300 border-gray-500',
        ]"
      />
      <p class="text-red-500 text-xs my-1">{{ errorProd }}</p>
      <button
        type="button"
        :disabled="!visible"
        @click="submitPlanificada"
        :class="[
          'w-full py-1 rounded-md border-[1px] text-white font-manrope-b mb-5',
          visible
            ? 'bg-azulClaroIENM border-azulClaroIENM'
            : 'bg-blue-400 border-blue-400',
        ]"
      >
        INGRESAR
      </button>
      <p>Producción Modificada:</p>
      <p class="mb-1 text-xs">* Elegir una fecha anterior</p>
      <input
        type="date"
        :disabled="visibleMod"
        v-model="fechaMod"
        class="w-full border-[1px] border-black outline-none rounded mb-1"
      />
      <input
        type="text"
        :disabled="visibleMod"
        v-model="prodMod"
        :class="[
          'w-full border-[1px] rounded-md outline-none py-1 pl-2 mb-1',
          visibleMod ? 'bg-gray-300 border-gray-500' : 'border-black',
        ]"
      />
      <p class="text-red-500 text-xs my-1">{{ errorMod }}</p>
      <button
        type="button"
        :disabled="visibleMod"
        @click="submitModificada()"
        :class="[
          'w-full py-1 rounded-md border-[1px] text-white font-manrope-b text-sm sm:text-base',
          visibleMod
            ? 'bg-blue-400 border-blue-400'
            : 'bg-azulClaroIENM border-azulClaroIENM',
        ]"
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
const visibleMod = ref(true);
const fechaMod = ref<Date | null>();
const errorMod = ref<null | string>();
const errorProd = ref<null | string>();

const toast = useToast();
const { objProduccion, getFecha } = datosObjetivos();
const { createProduccion, updateProduccion } = useObjetivosApi();

const props = defineProps({
  visible: Boolean,
});
const emit = defineEmits(["setVisible"]);

const submitPlanificada = async () => {
  if (prodPlan.value) {
    limpiarObjeto();
    objProduccion.tablero_id = 2;
    objProduccion.fecha_produccion = date;
    objProduccion.planificada = Number(prodPlan.value);

    const resultado = await createProduccion(objProduccion);

    if (resultado.success) {
      emit("setVisible");
      visibleMod.value = false;
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

const submitModificada = async () => {
  if (prodMod.value && fechaMod.value) {
    limpiarObjeto();
    objProduccion.tablero_id = 2;
    objProduccion.modificada = prodMod.value;
    objProduccion.fecha_produccion = fechaMod.value;

    const resultado = await updateProduccion(objProduccion);

    if (resultado.success) {
      errorMod.value = null;
      visibleMod.value = true;
      showMessage("success", "Guardado correctamente.", resultado.data);
    } else {
      showMessage("error", "Error al guardar.", resultado.error);
    }
  } else {
    if (prodMod.value) {
      errorMod.value = "El campo de fecha es obligatorio.";
    } else {
      errorMod.value = "Este campo de es obligatorio.";
    }
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

const limpiarObjeto = () => {
  objProduccion.fecha_produccion = null;
  objProduccion.planificada = null;
  objProduccion.modificada = null;
  objProduccion.plan_armado = null;
  objProduccion.calidad = null;
  objProduccion.desperfecto_me = null;
  objProduccion.desperfecto_pp = null;
  objProduccion.tablero_id = null;
};
</script>
