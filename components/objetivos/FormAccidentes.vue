<template>
  <div>
    <form class="font-manrope-r" @submit.prevent="submit">
      <p>¿Hubo algun accidente?</p>
      <div class="flex justify-center gap-1 mb-3">
        <label for="opcionUno">Si</label>
        <input
          type="radio"
          value="s"
          name="accidentes"
          id="opcionUno"
          v-model="opcion"
          class="mr-5"
        />
        <label for="opcionDos">No</label>
        <input
          type="radio"
          value="n"
          name="accidentes"
          id="opcionDos"
          v-model="opcion"
        />
      </div>
      <div v-if="opcion === 's'">
        <p>¿Cuantos accidentes y de que tipo?</p>
        <div class="flex gap-7">
          <div>
            <div>
              <label for="cantidad">Cantidad</label>
            </div>
            <input
              type="number"
              id="cantidad"
              v-model="cantidad"
              class="w-16 border-[1px] border-black rounded-md outline-none py-1 px-2"
            />
          </div>
          <div>
            <p>Tipo</p>
            <select
              v-model="accidente"
              class="bg-white text-lg border-[1px] border-black py-1 px-2 rounded-md font-manrope-r mb-5"
            >
              <option
                v-for="(accidente, index) in accidentes"
                v-bind:key="index"
                :value="accidente"
              >
                {{ accidente }}
              </option>
            </select>
          </div>
          <div>
            <button
              class="border-[1px] border-green-400 py-1 px-5 mt-6 rounded-lg bg-green-400"
              type="submit"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useObjetivosApi } from "../../composables/objetivos/useObjetivosApi";

const opcion = ref();
const cantidad = ref();
const accidente = ref();
const date = new Date();
const toast = useToast();
const accidentes = ref(["accidente 1", "accidente 2", "accidente 3"]);
const { createAccidente } = useObjetivosApi();

let errors = ref({
  cantidad: false,
  accidente: false,
});

const submit = async () => {
  errors.value = {
    cantidad: false,
    accidente: false,
  };

  if (!cantidad.value) errors.value.cantidad = true;
  if (!accidente.value) errors.value.accidente = true;

  const objAccidente = {
    tipo_accidente: accidente.value,
    cantidad: Number(cantidad.value),
    objetivos_id: 3,
  };

  const resultado = await createAccidente(objAccidente);

  if (resultado.success) {
    accidente.value = "";
    cantidad.value = "";

    toast.add({
      severity: "success",
      summary: "Guardado correctamente.",
      detail: "Objetivos y calidad del mes guardado correctamente.",
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Error a la hora de guardar calidad.",
      detail: "Por favor revisar el error a resolver.",
      life: 3000,
    });
  }
};
</script>
