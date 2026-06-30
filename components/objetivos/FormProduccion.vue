<template>
  <form id="formProduccion" class="w-full text-sm">
    <fieldset class="h-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-5">
      <legend class="px-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
        Producción
      </legend>
      <div class="mb-4 flex items-center gap-3">
        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-azulClaroIENM/10 text-azulClaroIENM">
          <i class="pi pi-chart-line"></i>
        </span>
        <div>
          <h3 class="font-semibold text-slate-900">Producción diaria</h3>
          <p class="text-sm text-slate-500">Registra la cantidad planificada y ajusta la producción modificada.</p>
        </div>
      </div>

      <section class="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
        <label class="mb-1 block text-sm font-semibold text-slate-700">Producción planificada</label>
      <!-- <input
        id="fechaPlan"
        v-model="fechaPlan"
        type="date"
        class="w-full border-[1px] border-black outline-none rounded mb-1"
        :min="getFechaMaxMin(false)"
        :max="getFecha(date)"
      /> -->
      <input
        id="fechaPlan"
        v-model="fechaPlan"
        type="date"
        class="mb-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-azulClaroIENM"
      />
      <div id="grupoPlan">
        <input
          id="prodPlan"
          type="text"
          v-model="prodPlan"
          maxlength="6"
          class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-azulClaroIENM"
          placeholder="Ej: 1200"
        />
        <p class="my-1 text-xs font-semibold text-red-500">{{ errorProd }}</p>
        <button
          id="btnSubmitPlan"
          type="button"
          @click="submitPlanificada"
          class="mb-1 w-full rounded-xl border border-azulClaroIENM bg-azulClaroIENM py-2 font-semibold text-white shadow-sm transition hover:bg-[#00558f] disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="isSubmittingPlanificada"
        >
          {{ isSubmittingPlanificada ? "Ingresando..." : "Ingresar planificada" }}
        </button>
      </div>
      </section>

      <section class="mt-4 rounded-xl border border-slate-100 bg-white p-3">
        <label class="mb-1 block text-sm font-semibold text-slate-700">Producción modificada</label>
        <p class="mb-2 text-xs text-slate-500">Elegir una fecha anterior.</p>
      <!-- <input
        id="fechaMod"
        type="date"
        v-model="fechaMod"
        :max="getFechaMaxMin(true)"
        :min="getFechaMaxMin(false)"
        class="w-full border-[1px] border-black outline-none rounded mb-1"
      /> -->
      <input
        id="fechaMod"
        type="date"
        v-model="fechaMod"
        class="mb-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none transition focus:border-azulClaroIENM focus:bg-white"
      />
      <div id="grupoMod">
        <input
          id="prodMod"
          type="text"
          v-model="prodMod"
          maxlength="6"
          class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none transition focus:border-azulClaroIENM focus:bg-white"
          placeholder="Ej: 1100"
        />
        <p class="my-1 text-xs font-semibold text-red-500">{{ errorMod }}</p>
        <button
          id="btnSubmitMod"
          type="button"
          @click="submitModificada()"
          class="w-full rounded-xl border border-azulClaroIENM bg-azulClaroIENM py-2 font-semibold text-white shadow-sm transition hover:bg-[#00558f] disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="isSubmittingModificada"
        >
          {{ isSubmittingModificada ? "Ingresando..." : "Ingresar modificada" }}
        </button>
      </div>
      </section>
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
const isSubmittingPlanificada = ref(false);
const isSubmittingModificada = ref(false);

const toast = useToast();
const { objObjetivo, getFecha, getFechaMaxMin } = datosObjetivos();
const { createObjetivos, updateObjetivos } = useObjetivosApi();

const submitPlanificada = async () => {
  if (isSubmittingPlanificada.value) return;

  if (prodPlan.value && fechaPlan.value) {
    if (prodPlan.value < 0) {
      showMessage(
        "warn",
        "Mala digitación.",
        "Por favor no agregar números negativos."
      );
    } else {
      limpiarObjeto();
      objObjetivo.fecha = fechaPlan.value;
      objObjetivo.cliente_id = Number(idCliente.value);
      objObjetivo.planificada = Number(prodPlan.value);

      isSubmittingPlanificada.value = true;

      try {
        const resultado = await createObjetivos(objObjetivo);

        if (resultado.success) {
          showMessage("success", "Guardado correctamente.", resultado.data);
          errorProd.value = null;
          fechaPlan.value = null;
          prodPlan.value = "";
        } else {
          showMessage("error", "Error al guardar.", resultado.error);
        }
      } finally {
        isSubmittingPlanificada.value = false;
      }
    }
  } else {
    fechaPlan.value
      ? (errorProd.value = "El valor de este campo es obligatorio.")
      : (errorProd.value = "La fecha de este campo es obligatorio.");
    showMessage("error", "Campos vacíos.", "Por favor llenar los campos.");
  }
};

const submitModificada = async () => {
  if (isSubmittingModificada.value) return;

  if (prodMod.value && fechaMod.value) {
    if (prodMod.value < 0) {
      showMessage(
        "warn",
        "Mala digitación.",
        "Por favor no agregar números negativos."
      );
    } else {
      limpiarObjeto();
      objObjetivo.cliente_id = Number(idCliente.value);
      objObjetivo.fecha = fechaMod.value;
      objObjetivo.modificada = prodMod.value;

      isSubmittingModificada.value = true;

      try {
        const resultado = await updateObjetivos(objObjetivo);

        if (resultado.success) {
          showMessage("success", "Guardado correctamente.", resultado.data);
          errorMod.value = null;
          fechaMod.value = null;
          prodMod.value = "";
        } else {
          showMessage("error", "Error al guardar.", resultado.error);
        }
      } finally {
        isSubmittingModificada.value = false;
      }
    }
  } else {
    fechaMod.value
      ? (errorMod.value = "El valor de este campo es obligatorio.")
      : (errorMod.value = "La fecha de este campo es obligatorio.");
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
