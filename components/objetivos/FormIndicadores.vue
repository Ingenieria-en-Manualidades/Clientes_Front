<template>
  <form class="w-[22%] max-w-[220px] text-sm sm:text-base">
    <fieldset
      class="w-full border-[1px] border-black p-2 font-manrope-r rounded"
    >
      <legend class="font-manrope-b">Indicadores</legend>
      <div class="gap-2">
        <p v-if="errors.fecha" class="text-xs text-red-500">
          Este campo es obligatorio
        </p>
        <input
          type="date"
          v-model="fecha"
          :max="getFecha(date)"
          :min="getFecha(ayer)"
          class="w-full border-[1px] border-black outline-none rounded mb-1"
        />
        <div class="mb-2">
          <p>Cumplimiento plan armado:</p>
          <p v-if="errors.planArmado" class="text-xs text-red-500">
            Este campo es obligatorio
          </p>
          <input
            type="text"
            v-model="planArmado"
            class="w-full border-[1px] border-black rounded-md outline-none py-1 pl-2"
          />
        </div>
        <div class="mb-2">
          <p>Calidad:</p>
          <p v-if="errors.calidad" class="text-xs text-red-500">
            Este campo es obligatorio
          </p>
          <input
            type="text"
            v-model="calidad"
            class="w-full border-[1px] border-black rounded-md outline-none py-1 pl-2"
          />
        </div>
        <div class="mb-2">
          <p>Desperfecto M.E:</p>
          <p v-if="errors.desperfectosME" class="text-xs text-red-500">
            Este campo es obligatorio
          </p>
          <input
            type="text"
            v-model="desperfectosME"
            class="w-full border-[1px] border-black rounded-md outline-none py-1 pl-2"
          />
        </div>
        <div class="mb-2">
          <p>Desperfecto P.P:</p>
          <p v-if="errors.desperfectosPP" class="text-xs text-red-500">
            Este campo es obligatorio
          </p>
          <input
            type="text"
            v-model="desperfectosPP"
            class="w-full border-[1px] border-black rounded-md outline-none py-1 pl-2"
          />
        </div>
      </div>
      <div class="flex justify-center">
        <button
          type="button"
          @click="submit()"
          class="bg-azulClaroIENM border-azulClaroIENM py-1 rounded-md border-[1px] text-white font-manrope-b text-sm sm:text-base w-full"
        >
          INGRESAR
        </button>
      </div>
    </fieldset>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import { datosObjetivos } from "../../composables/objetivos/datosObjetivos";
import { useObjetivosApi } from "../../composables/objetivos/useObjetivosApi";

const fecha = ref();
const calidad = ref();
const planArmado = ref();
const toast = useToast();
const desperfectosME = ref();
const desperfectosPP = ref();
const idCliente = useCookie("idCliente");
const errors = ref({
  fecha: false,
  calidad: false,
  planArmado: false,
  desperfectosME: false,
  desperfectosPP: false,
});

const { objObjetivo, getFecha } = datosObjetivos();
const { updateObjetivos } = useObjetivosApi();

const date = new Date();
const ayer = new Date(
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() - 1}`
);

const submit = async () => {
  //Reiniciar los errores
  errors.value = {
    fecha: false,
    calidad: false,
    planArmado: false,
    desperfectosME: false,
    desperfectosPP: false,
  };

  if (!fecha.value) errors.value.fecha = true;
  if (!calidad.value) errors.value.calidad = true;
  if (!planArmado.value) errors.value.planArmado = true;
  if (!desperfectosME.value) errors.value.desperfectosME = true;
  if (!desperfectosPP.value) errors.value.desperfectosPP = true;

  const noErrors = !Object.values(errors.value).includes(true);

  if (noErrors) {
    limpiarObjeto();
    objObjetivo.fecha = fecha.value;
    objObjetivo.calidad = calidad.value;
    objObjetivo.plan_armado = planArmado.value;
    objObjetivo.cliente_id = Number(idCliente.value);
    objObjetivo.desperfecto_me = desperfectosME.value;
    objObjetivo.desperfecto_pp = desperfectosPP.value;

    const resultado = await updateObjetivos(objObjetivo);

    if (resultado.success) {
      //Reiniciar los errores
      errors.value = {
        fecha: false,
        calidad: false,
        planArmado: false,
        desperfectosME: false,
        desperfectosPP: false,
      };
      fecha.value = "";
      calidad.value = "";
      planArmado.value = "";
      desperfectosME.value = "";
      desperfectosPP.value = "";
      showMessage("success", "Guardado correctamente.", resultado.data);
    } else {
      showMessage("error", "Error al guardar.", resultado.error);
    }
  } else {
    showMessage("error", "Campos vacios", "Por favor llenar los campos.");
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
