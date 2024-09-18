<template>
  <div>
    <form class="font-manrope-r">
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
              class="w-16 border-[1px] border-black rounded-md outline-none py-1 px-2"
            />
          </div>
          <div>
            <p>Tipo</p>
            <select
              class="bg-white text-lg border-[1px] border-black py-1 px-2 rounded-md font-manrope-r mb-5"
            >
              <option
                v-for="(accidente, index) in accidentes"
                v-bind:key="index"
                :value="index"
              >
                {{ accidente }}
              </option>
            </select>
          </div>
          <div>
            <button
              class="border-[1px] border-green-400 py-1 px-5 mt-6 rounded-lg bg-green-400"
              type="button"
            >
              Agregar
            </button>
          </div>
        </div>
        <div></div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const opcion = ref();
const accidentes = ref(["accidente 1", "accidente 2", "accidente 3"]);
const elegidos = ref<String[]>([]);
</script>
