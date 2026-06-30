<template>
  <div class="my-4 flex w-full justify-center px-1">
    <form class="w-full max-w-5xl">
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <div class="border-b border-slate-100 bg-gradient-to-r from-[#eef7ff] via-white to-[#f8fafc] px-5 py-5 md:px-8">
          <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-azulClaroIENM">
                Tablero SAE
              </p>
              <h2 class="mt-1 text-2xl font-bold text-slate-900">
                Metas mensuales
              </h2>
              <p class="mt-1 max-w-2xl text-sm text-slate-500">
                Define los porcentajes objetivo que se usarán para medir el cumplimiento del mes seleccionado.
              </p>
            </div>
            <div class="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-azulClaroIENM shadow-sm">
              Valores de 0 a 100%
            </div>
          </div>
        </div>

        <div class="space-y-6 px-5 py-6 md:px-8">
          <section class="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:p-5">
            <div class="mb-3 flex items-center gap-3">
              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-azulClaroIENM/10 text-azulClaroIENM">
                <i class="pi pi-calendar"></i>
              </span>
              <div>
                <h3 class="font-semibold text-slate-900">Periodo de la meta</h3>
                <p class="text-sm text-slate-500">Selecciona el mes al que pertenecen estos objetivos.</p>
              </div>
            </div>
            <div class="max-w-xs">
              <label class="mb-1 block text-sm font-semibold text-slate-700">Elegir mes</label>
              <Calendar
                v-model="date"
                :manualInput="false"
                view="month"
                dateFormat="yy/mm"
                showIcon
                fluid
                inputClass="w-full rounded-xl border border-slate-200 px-3 py-2 shadow-sm"
                iconDisplay="input"
                id="calendarFilterGoals"
              />
              <p v-if="errors.fecha" class="mt-1 text-sm font-semibold text-red-500">
                Este campo es obligatorio
              </p>
            </div>
          </section>

          <fieldset
            id="fieldsetGoals"
            class="rounded-2xl border border-slate-100 bg-white p-4 md:p-5"
          >
            <legend class="px-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Indicadores objetivo
            </legend>
            <div class="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition focus-within:border-azulClaroIENM focus-within:ring-2 focus-within:ring-azulClaroIENM/10">
                <label class="mb-2 block text-sm font-semibold text-slate-700">Cumplimiento Plan de Armado (%)</label>
                <input
                  v-model="cumplimiento"
                  type="text"
                  maxlength="3"
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none transition focus:border-azulClaroIENM focus:bg-white"
                  placeholder="Ej: 90"
                />
                <p
                  v-if="errors.cumplimiento"
                  class="mt-1 text-sm font-semibold text-red-500"
                >
                  Este campo es obligatorio
                </p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition focus-within:border-azulClaroIENM focus-within:ring-2 focus-within:ring-azulClaroIENM/10">
                <label class="mb-2 block text-sm font-semibold text-slate-700">Eficiencia Productiva (%)</label>
                <input
                  v-model="eficienciaProductiva"
                  type="text"
                  maxlength="3"
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none transition focus:border-azulClaroIENM focus:bg-white"
                  placeholder="Ej: 95"
                />
                <p
                  v-if="errors.eficienciaProductiva"
                  class="mt-1 text-sm font-semibold text-red-500"
                >
                  Este campo es obligatorio
                </p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition focus-within:border-azulClaroIENM focus-within:ring-2 focus-within:ring-azulClaroIENM/10">
                <label class="mb-2 block text-sm font-semibold text-slate-700">Inspección de Calidad (%)</label>
                <input
                  v-model="calidad"
                  type="text"
                  maxlength="3"
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none transition focus:border-azulClaroIENM focus:bg-white"
                  placeholder="Ej: 98"
                />
                <p v-if="errors.calidad" class="mt-1 text-sm font-semibold text-red-500">
                  Este campo es obligatorio
                </p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition focus-within:border-azulClaroIENM focus-within:ring-2 focus-within:ring-azulClaroIENM/10">
                <label class="mb-2 block text-sm font-semibold text-slate-700">Desperdicios de M.E (%)</label>
                <input
                  v-model="desperdicioME"
                  type="text"
                  maxlength="3"
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none transition focus:border-azulClaroIENM focus:bg-white"
                  placeholder="Ej: 2"
                />
                <p
                  v-if="errors.desperdicioME"
                  class="mt-1 text-sm font-semibold text-red-500"
                >
                  Este campo es obligatorio
                </p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition focus-within:border-azulClaroIENM focus-within:ring-2 focus-within:ring-azulClaroIENM/10">
                <label class="mb-2 block text-sm font-semibold text-slate-700">Desperdicios de P.P (%)</label>
                <input
                  v-model="desperdicioPP"
                  type="text"
                  maxlength="3"
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none transition focus:border-azulClaroIENM focus:bg-white"
                  placeholder="Ej: 1"
                />
                <p
                  v-if="errors.desperdicioPP"
                  class="mt-1 text-sm font-semibold text-red-500"
                >
                  Este campo es obligatorio
                </p>
              </div>
            </div>
          </fieldset>

          <div class="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-sm text-slate-500">
              Revisa que todos los valores estén entre 0 y 100 antes de guardar.
            </p>
            <button
              type="button"
              class="rounded-xl bg-[#0063a6] px-8 py-3 font-semibold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#00558f] disabled:cursor-not-allowed disabled:opacity-70"
              @click="submitForm"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? "Guardando..." : "Guardar meta" }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useCookie } from "nuxt/app";
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { datosObjetivos } from "../../composables/objetivos/datosObjetivos";
import { useObjetivosApi } from "../../composables/objetivos/useObjetivosApi"; // Asegúrate de que esta ruta sea correcta

const clienteID = useCookie("idCliente");
// Variables reactivas de los campos del formulario
const date = ref<Date | null>(null);
const regex = /[0-9]/;
const calidad = ref("");
const toast = useToast();
const cumplimiento = ref("");
const desperdicioME = ref("");
const desperdicioPP = ref("");
const errorRegex = ref(false);
const eficienciaProductiva = ref("");
const isSubmitting = ref(false);

// Variables de errores para la validación
const errors = ref({
  fecha: false,
  cumplimiento: false,
  eficienciaProductiva: false,
  calidad: false,
  desperdicioME: false,
  desperdicioPP: false,
});
const { getFecha, setCheckMaxMinNumber } = datosObjetivos();

// Método para validar y enviar el formulario
const submitForm = async () => {
  if (isSubmitting.value) return;

  //Reiniciar los errores
  errors.value = {
    fecha: false,
    cumplimiento: false,
    eficienciaProductiva: false,
    calidad: false,
    desperdicioME: false,
    desperdicioPP: false,
  };
  errorRegex.value = false;

  // Validar los campos
  if (!date.value) errors.value.fecha = true;
  if (!cumplimiento.value) errors.value.cumplimiento = true;
  if (!eficienciaProductiva.value) errors.value.eficienciaProductiva = true;
  if (!calidad.value) errors.value.calidad = true;
  if (!desperdicioME.value) errors.value.desperdicioME = true;
  if (!desperdicioPP.value) errors.value.desperdicioPP = true;

  if (!regex.test(cumplimiento.value)) errorRegex.value = true;
  if (!regex.test(eficienciaProductiva.value)) errorRegex.value = true;
  if (!regex.test(calidad.value)) errorRegex.value = true;
  if (!regex.test(desperdicioME.value)) errorRegex.value = true;
  if (!regex.test(desperdicioPP.value)) errorRegex.value = true;

  //Comprobar si hay errores
  const noErrors = !Object.values(errors.value).includes(true);

  // const noErrors = false;
  if (noErrors) {
    if (!errorRegex.value) {
      const objetivosData = {
        fecha: getFecha(date.value),
        cumplimiento: Number(cumplimiento.value),
        eficienciaProductiva: Number(eficienciaProductiva.value),
        calidad: Number(calidad.value),
        desperdicioME: Number(desperdicioME.value),
        desperdicioPP: Number(desperdicioPP.value),
        cliente_endpoint_id: String(clienteID.value),
      };

      const resp = setCheckMaxMinNumber(objetivosData);
      if (resp) {
        isSubmitting.value = true;

        try {
          // Llamar a la API para crear los objetivos
          const { createMeta } = useObjetivosApi();
          const response = await createMeta(objetivosData);

          if (response.success) {
            toast.add({
              severity: "success",
              summary: "Meta guardada.",
              detail: "Exito a la hora de guardar las metas.",
              life: 4000,
            });
            date.value = null;
            cumplimiento.value = "";
            eficienciaProductiva.value = "";
            calidad.value = "";
            desperdicioME.value = "";
            desperdicioPP.value = "";
          } else {
            console.error("Error al crear objetivos:", response.error);
            toast.add({
              severity: "error",
              summary: "Error al guardar.",
              detail: response.error,
              life: 4000,
            });
          }
        } finally {
          isSubmitting.value = false;
        }
      } else {
        toast.add({
          severity: "warn",
          summary: "Mala digitación.",
          detail: "Por favor no digitar un número negativo o mayor a 100.",
          life: 4000,
        });
      }
    } else {
      toast.add({
        severity: "warn",
        summary: "Error de valores.",
        detail: "Por favor solo ingresar números en los campos.",
        life: 4000,
      });
    }
  } else {
    toast.add({
      severity: "error",
      summary: "Faltan campos",
      detail: "Por favor ingresar los campos faltantes.",
      life: 4000,
    });
  }
};
</script>
