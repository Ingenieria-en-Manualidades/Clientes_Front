<template>
  <div>
    <form class="flex gap-16" ref="formCalidad">
      <fieldset class="border-[1px] border-black rounded-lg p-3">
        <legend class="px-1 font-manrope-l">CheckList</legend>
        <p class="font-manrope-b text-lg mb-1">Mes</p>
        <p v-if="errors.dateCheck" class="text-red-500 text-sm pb-1">
          Este campo es obligatorio
        </p>
        <select
          v-model="dateCheck"
          class="bg-white text-lg border-[1px] border-black py-1 px-2 rounded-md font-manrope-r mb-5"
        >
          <option v-for="(mes, index) in meses" v-bind:key="index" :value="mes">
            {{ mes }}
          </option>
        </select>
        <p class="font-manrope-b text-lg mb-1">Calificación</p>
        <p v-if="errors.calificacionCheck" class="text-red-500 text-sm pb-1">
          Este campo es obligatorio
        </p>
        <input
          type="text"
          v-model="calCheck"
          class="border-[1px] border-black rounded-md w-[90%] font-manrope-r p-1 outline-none"
        />
      </fieldset>
      <fieldset class="border-[1px] border-black rounded-lg p-3">
        <legend class="px-1 font-manrope-l">Inspección sol</legend>
        <p class="font-manrope-b text-lg mb-1">Mes</p>
        <p v-if="errors.dateInspSol" class="text-red-500 text-sm pb-1">
          Este campo es obligatorio
        </p>
        <select
          v-model="dateInspSol"
          class="bg-white text-lg border-[1px] border-black py-1 px-2 rounded-md font-manrope-r mb-5"
        >
          <option v-for="(mes, index) in meses" v-bind:key="index" :value="mes">
            {{ mes }}
          </option>
        </select>
        <p class="font-manrope-b text-lg mb-1">Calificación</p>
        <p v-if="errors.calificacionInspSol" class="text-red-500 text-sm pb-1">
          Este campo es obligatorio
        </p>
        <input
          type="text"
          v-model="calInspSol"
          class="border-[1px] border-black rounded-md w-[90%] font-manrope-r p-1 outline-none"
        />
      </fieldset>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { defineExpose, ref } from "vue";
import { useObjetivosApi } from "../../composables/objetivos/useObjetivosApi";

const dateCheck = ref("");
const dateInspSol = ref("");
const calCheck = ref();
const calInspSol = ref();
const { createCalidad } = useObjetivosApi();

let errors = ref({
  dateCheck: false,
  calificacionCheck: false,
  dateInspSol: false,
  calificacionInspSol: false,
});

// Método para validar y enviar el formulario
const submitForm = async (metaID: number) => {
  //Reiniciar los errores
  errors.value = {
    dateCheck: false,
    calificacionCheck: false,
    dateInspSol: false,
    calificacionInspSol: false,
  };

  console.log("metaID calidad: ", metaID);

  if (!dateCheck.value) errors.value.dateCheck = true;
  if (!dateInspSol.value) errors.value.dateInspSol = true;
  if (!calCheck.value) errors.value.calificacionCheck = true;
  if (!calInspSol.value) errors.value.calificacionInspSol = true;

  const objCalidad = {
    checklist: Number(calCheck.value),
    inspeccion: Number(calInspSol.value),
    meta_id: metaID,
  };

  const resultado = await createCalidad(objCalidad);

  if (resultado.success) {
    dateCheck.value = "";
    dateInspSol.value = "";
    calCheck.value = "";
    calInspSol.value = "";
    return true;
  } else {
    console.error(resultado.error);
    return false;
  }
};

const meses = ref([
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]);

// Exponer el método `submitForm` para que el componente padre pueda acceder a él
defineExpose({
  submitForm,
});
</script>
