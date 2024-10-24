<template>
  <div class="my-5">
    <form ref="formObjetivos">
      <div class="flex justify-center mb-12 gap-10">
        <div>
          <p class="font-manrope-b text-lg mb-1">Cumplimiento Plan de Armado</p>
          <input
            v-model="cumplimiento"
            type="text"
            class="border-[1px] border-black rounded-md w-[90%] font-manrope-r p-1 outline-none"
          />
          <p v-if="errors.cumplimiento" class="text-red-500 text-sm">
            Este campo es obligatorio
          </p>
        </div>
        <div>
          <p class="font-manrope-b text-lg mb-1">Eficiencia Productiva</p>
          <input
            v-model="eficienciaProductiva"
            type="text"
            class="border-[1px] border-black rounded-md w-[90%] font-manrope-r p-1 outline-none"
          />
          <p v-if="errors.eficienciaProductiva" class="text-red-500 text-sm">
            Este campo es obligatorio
          </p>
        </div>
        <div>
          <p class="font-manrope-b text-lg mb-1">Inspección de Calidad</p>
          <input
            v-model="calidad"
            type="text"
            class="border-[1px] border-black rounded-md w-[90%] font-manrope-r p-1 outline-none"
          />
          <p v-if="errors.calidad" class="text-red-500 text-sm">
            Este campo es obligatorio
          </p>
        </div>
      </div>
      <div class="flex justify-center gap-6">
        <div>
          <p class="font-manrope-b text-lg mb-1">Desperdicios de M.E</p>
          <input
            v-model="desperdicioME"
            type="text"
            class="border-[1px] border-black rounded-md w-[90%] font-manrope-r p-1 outline-none"
          />
          <p v-if="errors.desperdicioME" class="text-red-500 text-sm">
            Este campo es obligatorio
          </p>
        </div>
        <div>
          <p class="font-manrope-b text-lg mb-1">Desperdicios de P.P</p>
          <input
            v-model="desperdicioPP"
            type="text"
            class="border-[1px] border-black rounded-md w-[90%] font-manrope-r p-1 outline-none"
          />
          <p v-if="errors.desperdicioPP" class="text-red-500 text-sm">
            Este campo es obligatorio
          </p>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useCookie } from "nuxt/app";
import { defineExpose, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useObjetivosApi } from "../../composables/objetivos/useObjetivosApi"; // Asegúrate de que esta ruta sea correcta

const clienteID = useCookie("idCliente");
// Variables reactivas de los campos del formulario
const calidad = ref("");
const toast = useToast();
const cumplimiento = ref("");
const desperdicioME = ref("");
const desperdicioPP = ref("");
const eficienciaProductiva = ref("");

// Variables de errores para la validación
const errors = ref({
  cumplimiento: false,
  eficienciaProductiva: false,
  calidad: false,
  desperdicioME: false,
  desperdicioPP: false,
});

// Método para validar y enviar el formulario
const submitForm = async () => {
  //Reiniciar los errores
  errors.value = {
    cumplimiento: false,
    eficienciaProductiva: false,
    calidad: false,
    desperdicioME: false,
    desperdicioPP: false,
  };
  // return true;
  // Validar los campos
  if (!cumplimiento.value) errors.value.cumplimiento = true;
  if (!eficienciaProductiva.value) errors.value.eficienciaProductiva = true;
  if (!calidad.value) errors.value.calidad = true;
  if (!desperdicioME.value) errors.value.desperdicioME = true;
  if (!desperdicioPP.value) errors.value.desperdicioPP = true;

  //Comprobar si hay errores
  const noErrors = !Object.values(errors.value).includes(true);
  if (noErrors) {
    // Llamar a la API para crear los objetivos
    const { createMeta } = useObjetivosApi();
    const objetivosData = {
      cumplimiento: Number(cumplimiento.value),
      eficienciaProductiva: Number(eficienciaProductiva.value),
      calidad: Number(calidad.value),
      desperdicioME: Number(desperdicioME.value),
      desperdicioPP: Number(desperdicioPP.value),
      cliente_endpoint_id: clienteID.value,
    };

    const response = await createMeta(objetivosData);

    if (response.success) {
      console.log("Objetivos creados correctamente:", response.data.message);
      return { success: true, metaID: response.data.metaID }; // Formulario válido, seguir adelante
    } else {
      console.error("Error al crear objetivos:", response.error);
      return { success: false, metaID: 0 }; // Hubo un error en la creación
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

// Exponer el método `submitForm` para que el componente padre pueda acceder a él
defineExpose({
  submitForm,
});
</script>
