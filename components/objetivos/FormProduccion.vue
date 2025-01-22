<template>
  <form class="font-manrope-r w-[40%] max-w-[210px] text-sm sm:text-base">
    <fieldset
      class="border-[1px] border-black px-2 py-[11px] min-[444px]:py-[31px] min-[640px]:py-[37px] md:py-3 font-manrope-r rounded"
    >
      <legend class="font-manrope-b">Producción</legend>
      <p>Producción Planificada:</p>
      <input
        v-model="fechaPlan"
        type="date"
        class="w-full border-[1px] border-black outline-none rounded mb-1"
        :min="getFechaMaxMin(false)"
        :max="getFecha(date)"
      />
      <input
        type="text"
        v-model="prodPlan"
        class="w-full border-[1px] border-black rounded-md outline-none py-1 pl-2 mb-1"
      />
      <p class="text-red-500 text-xs my-1">{{ errorProd }}</p>
      <button
        type="button"
        @click="submitPlanificada"
        class="w-full py-1 rounded-md border-[1px] bg-azulClaroIENM border-azulClaroIENM text-white font-manrope-b mb-5"
      >
        INGRESAR
      </button>
      <p>Producción Modificada:</p>
      <p class="mb-1 text-xs">* Elegir una fecha anterior</p>
      <input
        type="date"
        v-model="fechaMod"
        :max="getFechaMaxMin(true)"
        :min="getFechaMaxMin(false)"
        class="w-full border-[1px] border-black outline-none rounded mb-1"
      />
      <input
        type="text"
        v-model="prodMod"
        class="w-full border-[1px] border-black rounded-md outline-none py-1 pl-2 mb-1"
      />
      <p class="text-red-500 text-xs my-1">{{ errorMod }}</p>
      <button
        type="button"
        @click="submitModificada()"
        class="w-full bg-azulClaroIENM border-azulClaroIENM py-1 rounded-md border-[1px] text-white font-manrope-b text-sm sm:text-base"
      >
        INGRESAR
      </button>
    </fieldset>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import { datosObjetivos } from "../../composables/objetivos/datosObjetivos";
import { useObjetivosApi } from "../../composables/objetivos/useObjetivosApi";

const prodMod = ref();
const prodPlan = ref();
const date = new Date();
const fechaMod = ref<Date | null>();
const fechaPlan = ref<Date | null>();
const errorMod = ref<null | string>();
const errorProd = ref<null | string>();
const idCliente = useCookie("idCliente");

const toast = useToast();
const { objObjetivo, getFecha, getFechaMaxMin } = datosObjetivos();
const { createObjetivos, updateObjetivos } = useObjetivosApi();

const submitPlanificada = async () => {
  if (prodPlan.value) {
    limpiarObjeto();
    objObjetivo.fecha = fechaPlan.value;
    objObjetivo.cliente_id = Number(idCliente.value);
    objObjetivo.planificada = Number(prodPlan.value);

    const resultado = await createObjetivos(objObjetivo);

    if (resultado.success) {
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
    objObjetivo.cliente_id = Number(idCliente.value);
    objObjetivo.fecha = fechaMod.value;
    objObjetivo.modificada = prodMod.value;

    const resultado = await updateObjetivos(objObjetivo);

    if (resultado.success) {
      errorMod.value = null;
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
  objObjetivo.fecha = null;
  objObjetivo.cliente_id = null;
  objObjetivo.planificada = null;
  objObjetivo.modificada = null;
  objObjetivo.plan_armado = null;
  objObjetivo.calidad = null;
  objObjetivo.desperfecto_me = null;
  objObjetivo.desperfecto_pp = null;
};
</script>
