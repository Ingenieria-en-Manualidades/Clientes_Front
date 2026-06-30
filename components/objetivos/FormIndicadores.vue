<template>
  <form id="formIndicadores" class="w-full text-sm">
    <fieldset class="h-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-5">
      <legend class="px-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
        Indicadores
      </legend>
      <div class="mb-4 flex items-center gap-3">
        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-azulClaroIENM/10 text-azulClaroIENM">
          <i class="pi pi-sliders-h"></i>
        </span>
        <div>
          <h3 class="font-semibold text-slate-900">Indicadores diarios</h3>
          <p class="text-sm text-slate-500">Completa los porcentajes de cumplimiento, calidad y desperfectos.</p>
        </div>
      </div>
      <div class="gap-2">
        <label class="mb-1 block text-sm font-semibold text-slate-700">Fecha</label>
        <!-- <input
          id="fechaIndicador"
          type="date"
          v-model="fecha"
          :max="getFecha(date)"
          :min="getFecha(ayer)"
          class="w-full border-[1px] border-black outline-none rounded mb-1"
        /> -->
        <input
          id="fechaIndicador"
          type="date"
          v-model="fecha"
          class="mb-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none transition focus:border-azulClaroIENM focus:bg-white"
        />
        <p v-if="errors.fecha" class="mb-2 text-xs font-semibold text-red-500">
          La fecha es obligatoria
        </p>
        <div id="divInputsIndicadores" class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <label class="mb-1 block text-sm font-semibold text-slate-700">Cumplimiento plan armado (%)</label>
            <p v-if="errors.planArmado" class="mb-1 text-xs font-semibold text-red-500">
              Este campo es obligatorio
            </p>
            <input
              type="text"
              maxlength="3"
              v-model="planArmado"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-azulClaroIENM"
              placeholder="Ej: 90"
            />
          </div>
          <div class="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <label class="mb-1 block text-sm font-semibold text-slate-700">Calidad (%)</label>
            <p v-if="errors.calidad" class="mb-1 text-xs font-semibold text-red-500">
              Este campo es obligatorio
            </p>
            <input
              type="text"
              maxlength="3"
              v-model="calidad"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-azulClaroIENM"
              placeholder="Ej: 95"
            />
          </div>
          <div class="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <label class="mb-1 block text-sm font-semibold text-slate-700">Desperfecto M.E (%)</label>
            <p v-if="errors.desperfectosME" class="mb-1 text-xs font-semibold text-red-500">
              Este campo es obligatorio
            </p>
            <input
              type="text"
              maxlength="3"
              v-model="desperfectosME"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-azulClaroIENM"
              placeholder="Ej: 2"
            />
          </div>
          <div class="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <label class="mb-1 block text-sm font-semibold text-slate-700">Desperfecto P.P (%)</label>
            <p v-if="errors.desperfectosPP" class="mb-1 text-xs font-semibold text-red-500">
              Este campo es obligatorio
            </p>
            <input
              type="text"
              maxlength="3"
              v-model="desperfectosPP"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-azulClaroIENM"
              placeholder="Ej: 1"
            />
          </div>
        </div>
      </div>
      <div class="mt-5 flex justify-center">
        <button
          id="btnSubmitIndicadores"
          type="button"
          @click="submit()"
          class="w-full rounded-xl border border-azulClaroIENM bg-azulClaroIENM py-3 font-semibold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#00558f] disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? "Ingresando..." : "Ingresar indicadores" }}
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
const isSubmitting = ref(false);
const errors = ref({
  fecha: false,
  calidad: false,
  planArmado: false,
  desperfectosME: false,
  desperfectosPP: false,
});

const { objObjetivo, getFecha, setCheckMaxMinNumber } = datosObjetivos();
const { updateObjetivos } = useObjetivosApi();

const date = new Date();
const ayer = new Date(
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() - 1}`
);

const submit = async () => {
  if (isSubmitting.value) return;

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
    objObjetivo.calidad = Number(calidad.value);
    objObjetivo.plan_armado = Number(planArmado.value);
    objObjetivo.cliente_id = null;
    objObjetivo.desperfecto_me = Number(desperfectosME.value);
    objObjetivo.desperfecto_pp = Number(desperfectosPP.value);

    const quest = setCheckMaxMinNumber(objObjetivo);

    if (quest) {
      objObjetivo.cliente_id = Number(idCliente.value);
      isSubmitting.value = true;

      try {
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
      } finally {
        isSubmitting.value = false;
      }
    } else {
      showMessage(
        "warn",
        "Mala digitación.",
        "No ingresar números negativos o mayores a 100."
      );
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
