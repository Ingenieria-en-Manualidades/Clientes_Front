<template>
  <form class="w-[40%] max-w-[210px] text-sm sm:text-base">
    <fieldset
      class="border-[1px] border-black px-2 py-[11px] min-[444px]:py-[31px] min-[640px]:py-[37px] md:py-3 font-manrope-r rounded"
    >
      <legend class="font-manrope-b">Producción</legend>
      <p>Producción Planificada:</p>
      <input
        type="date"
        class="w-full border-[1px] border-black outline-none mb-1 rounded"
        :value="getFecha()"
      />
      <input
        type="text"
        v-model="prodPlan"
        class="w-full border-[1px] border-black rounded-md outline-none py-1 pl-2 mb-2"
      />
      <button
        @click="handleSubmit"
        class="w-full bg-azulClaroIENM py-1 rounded-md border-[1px] border-azulClaroIENM text-white font-manrope-b mb-5"
        type="button"
      >
        INGRESAR
      </button>
      <p class="mb-1">Producción Modificada:</p>
      <input
        type="text"
        v-model="prodMod"
        class="w-full border-[1px] border-black rounded-md outline-none py-1 pl-2 mb-2"
      />
      <button
        class="w-full bg-azulClaroIENM py-1 rounded-md border-[1px] border-azulClaroIENM text-white font-manrope-b text-sm sm:text-base mb-3"
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
import { useObjetivosApi } from "../../composables/objetivos/useObjetivosApi";

const prodMod = ref();
const prodPlan = ref();
const errorProdPlan = ref<null | string>();
const date = new Date();
const fecha = ref(
  `${date.getFullYear()}-${date.getMonth() + 1}-0${date.getDate()}`
);

const toast = useToast();
const { createProduccion } = useObjetivosApi();

const visible = ref(false);

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
      showMessage("success", "Guardado correctamente.", resultado.data);
    } else {
      showMessage("error", "Error al guardar.", resultado.error);
    }
  } else {
    showMessage("error", "Campos vacíos.", "Por favor llenar los campos.");
  }
};

const getFecha = () => {
  if (date.getMonth() + 1 > 0 && date.getMonth() + 1 < 10) {
    if (date.getDate() > 0 && date.getDate() < 10) {
      return `${date.getFullYear()}-0${date.getMonth() + 1}-0${date.getDate()}`;
    } else {
      return `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`;
    }
  } else {
    if (date.getDate() > 0 && date.getDate() < 10) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-0${date.getDate()}`;
    } else {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
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
