<template>
  <title>Improductividades</title>
  <div>
    <Tabla :cabezas="cols" :arrayData="data">
      <template #nuevaColumna>
        <th class="bg-azulIENM text-white py-4 px-5">ACCIONES</th>
      </template>
      <template #botones>
        <td>
          <button
            type="button"
            class="border-[1px] border-green-400 py-1 px-4 rounded-lg bg-green-400"
          >
            Gestionar
          </button>
        </td>
      </template>
    </Tabla>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useCookie } from "nuxt/app";
import type { Improductividad } from "../../interfaces/improductividades";
import Tabla from "../../components/dinamicos/Tabla.vue";

const cols = ref(["no_improductividad", "fecha", "valor"]);
const data = ref<Improductividad[]>();

data.value = [
  {
    no_improductividad: "1",
    fecha: "02/05/2021",
    valor: 132,
  },
  {
    no_improductividad: "2",
    fecha: "02/05/2021",
    valor: 132,
  },
  {
    no_improductividad: "3",
    fecha: "02/05/2021",
    valor: 132,
  },
  {
    no_improductividad: "4",
    fecha: "02/05/2021",
    valor: 132,
  },
];
</script>
