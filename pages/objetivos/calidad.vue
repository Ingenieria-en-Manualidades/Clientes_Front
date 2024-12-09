<template>
  <div class="w-full flex justify-center p-2 gap-1 sm:gap-3 md:p-5">
    <title>Calidad</title>
    <FormChecklist />
    <FormCalidad />
    <div class="ml-[3%] mt-[6%]">
      <Tabla
        :cabezas="cabezas"
        :arrayData="dataArchivos"
        :atributosDatos="atributos"
        :pag="true"
      >
        <template #nuevaColumna>
          <th class="bg-azulIENM text-white py-3 px-5">ACCIONES</th>
        </template>
        <template #botones>
          <td>
            <button
              type="button"
              class="bg-[#c86a2b] rounded py-1 px-2 my-1 text-white"
            >
              Descargar
            </button>
          </td>
        </template>
      </Tabla>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useCookie } from "nuxt/app";
import Tabla from "../../components/dinamicos/Tabla.vue";
import FormCalidad from "../../components/objetivos/FormCalidad.vue";
import FormChecklist from "../../components/objetivos/FormChecklist.vue";
import { useObjetivosApi } from "../../composables/objetivos/useObjetivosApi";
import { datosTablaCalidad } from "../../composables/objetivos/datosObjetivos";

const clienteID = useCookie("idCliente");
const dataArchivos = ref();
const { listarFiles } = useObjetivosApi();
const { cabezas, atributos } = datosTablaCalidad();

const listar = async () => {
  const resultado = await listarFiles(Number(clienteID.value));

  if (resultado.success) {
    dataArchivos.value = resultado.data.archivos;
    console.log("archivos: ", resultado.data.archivos);
  } else {
    console.log("ERROR: ", resultado.error);
  }
};

listar();
</script>
