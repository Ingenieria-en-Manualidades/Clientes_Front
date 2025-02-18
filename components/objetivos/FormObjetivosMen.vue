<template>
  <div class="my-3">
    <form class="font-manrope-r flex justify-center">
      <div>
        <p><b>Elegir mes:</b></p>
        <Calendar
          v-model="date"
          :manualInput="false"
          view="month"
          dateFormat="yy/mm"
          showIcon
          fluid
          inputClass="w-full"
          iconDisplay="input"
        />
        <p v-if="errors.fecha" class="text-red-500 text-sm font-bold">
          Este campo es obligatorio
        </p>
        <fieldset
          class="border-[1px] border-black rounded p-5 max-w-[850px] mt-3"
        >
          <div class="flex justify-center flex-wrap gap-6">
            <div class="ml-9">
              <p class="font-bold mb-1">Cumplimiento Plan de Armado (%)</p>
              <input
                v-model="cumplimiento"
                type="text"
                maxlength="3"
                class="border-[1px] border-black rounded-md p-1 outline-none"
              />
              <p
                v-if="errors.cumplimiento"
                class="text-red-500 text-sm font-bold"
              >
                Este campo es obligatorio
              </p>
            </div>
            <div>
              <p class="font-bold mb-1">Eficiencia Productiva (%)</p>
              <input
                v-model="eficienciaProductiva"
                type="text"
                maxlength="3"
                class="border-[1px] border-black rounded-md p-1 outline-none"
              />
              <p
                v-if="errors.eficienciaProductiva"
                class="text-red-500 text-sm font-bold"
              >
                Este campo es obligatorio
              </p>
            </div>
            <div>
              <p class="font-bold mb-1">Inspección de Calidad (%)</p>
              <input
                v-model="calidad"
                type="text"
                maxlength="3"
                class="border-[1px] border-black rounded-md p-1 outline-none"
              />
              <p v-if="errors.calidad" class="text-red-500 text-sm font-bold">
                Este campo es obligatorio
              </p>
            </div>
            <div>
              <p class="font-bold mb-1">Desperdicios de M.E (%)</p>
              <input
                v-model="desperdicioME"
                type="text"
                maxlength="3"
                class="border-[1px] border-black rounded-md p-1 outline-none"
              />
              <p
                v-if="errors.desperdicioME"
                class="text-red-500 text-sm font-bold"
              >
                Este campo es obligatorio
              </p>
            </div>
            <div>
              <p class="font-bold mb-1">Desperdicios de P.P (%)</p>
              <input
                v-model="desperdicioPP"
                type="text"
                maxlength="3"
                class="border-[1px] border-black rounded-md p-1 outline-none"
              />
              <p
                v-if="errors.desperdicioPP"
                class="text-red-500 text-sm font-bold"
              >
                Este campo es obligatorio
              </p>
            </div>
          </div>
          <div class="flex justify-center mt-8">
            <button
              type="button"
              class="bg-[#0063a6] px-10 py-2 rounded-lg text-white font-manrope-b"
              @click="submitForm"
            >
              Guardar
            </button>
          </div>
        </fieldset>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useCookie } from "nuxt/app";
import { defineExpose, ref } from "vue";
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

// Variables de errores para la validación
const errors = ref({
  fecha: false,
  cumplimiento: false,
  eficienciaProductiva: false,
  calidad: false,
  desperdicioME: false,
  desperdicioPP: false,
});
const { getFecha } = datosObjetivos();

// Método para validar y enviar el formulario
const submitForm = async () => {
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
      // Llamar a la API para crear los objetivos
      const { createMeta } = useObjetivosApi();
      const objetivosData = {
        fecha: getFecha(date.value),
        cumplimiento: Number(cumplimiento.value),
        eficienciaProductiva: Number(eficienciaProductiva.value),
        calidad: Number(calidad.value),
        desperdicioME: Number(desperdicioME.value),
        desperdicioPP: Number(desperdicioPP.value),
        cliente_endpoint_id: clienteID.value,
      };

      const response = await createMeta(objetivosData);

      if (response.success) {
        toast.add({
          severity: "success",
          summary: "Meta guardada.",
          detail: "Exito a la hora de guardar las metas.",
          life: 3000,
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
          life: 3000,
        });
      }
    } else {
      toast.add({
        severity: "error",
        summary: "Error de valores.",
        detail: "Por favor solo ingresar números en los campos.",
        life: 3000,
      });
    }
  } else {
    toast.add({
      severity: "error",
      summary: "Faltan campos",
      detail: "Por favor ingresar los campos faltantes.",
      life: 3000,
    });
  }
};
</script>
