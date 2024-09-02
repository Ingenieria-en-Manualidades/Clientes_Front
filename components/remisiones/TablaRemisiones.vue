<template>
  <table class="text-xs sm:text-sm w-[95%] mx-[2.5%] lg:w-full font-manrope-r">
    <thead>
      <tr class="sm:text-base">
        <th class="bg-azulIENM text-white py-4 rounded-tl-md">N°</th>
        <th class="bg-azulIENM text-white py-4">VALOR</th>
        <th class="bg-azulIENM text-white py-4">FECHA</th>
        <th class="bg-azulIENM text-white py-4 rounded-tr-md">ACCIÓN</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="remision in remisionesData"
        v-bind:key="remision.no_remision"
        class="border-x-[1px] border-b-[1px] border-gray-400"
      >
        <td class="text-center p-3">
          {{ remision.no_remision }}
        </td>
        <td class="text-center">
          <b>$</b> {{ formatoNumero(remision.valor) }}
        </td>
        <td class="text-center">
          {{ remision.fecha }}
        </td>
        <td class="text-center sm:flex justify-center gap-1 py-2">
          <ModalPreviewRemision
            v-if="modales === 'Aprobados' || modales === 'Pendientes'"
            :numRemision="remision.no_remision"
            :fecha="remision.fecha"
            :cliente="remision.nombre_cliente"
            :ordenCompra="remision.orden_compra"
            :hojaEntrada="remision.numero_pedido"
            :contacto="remision.nombre + ' ' + remision.apellido"
            :estado="modales === 'Pendientes' ? 'Pendiente' : 'Aprobado'"
          />
          <ModalRemisiones
            v-if="modales === 'Pendientes'"
            :numRemision="remision.no_remision"
            :idRemision="remision.remision_id"
            @postGuardarRemision="listar"
          />
          <ModalRechazo
            v-if="modales === 'Rechazados'"
            :numRemision="remision.no_remision"
            :motivo="remision.motivo"
          />
        </td>
      </tr>
    </tbody>
  </table>
  <div class="w-full mx-[2.5%] py-4 flex justify-center my-[7px]">
    <button
      type="button"
      :disabled="paginaActual === 1"
      @click="paginaActual = 1"
      :class="[
        'py-2 px-3 rounded-[50%]',
        paginaActual === 1 ? 'text-gray-400' : 'hover:bg-gray-200',
      ]"
    >
      <i class="pi pi-angle-double-left"></i>
    </button>
    <button
      type="button"
      :disabled="paginaActual === 1"
      @click="paginaActual -= 1"
      :class="[
        'py-2 px-3 rounded-[50%]',
        paginaActual === 1 ? 'text-gray-400' : 'hover:bg-gray-200',
      ]"
    >
      <i class="pi pi-angle-left"></i>
    </button>
    <span class="font-manrope-b mt-[6px]"
      >Página {{ paginaActual }} de {{ totalPaginas }}</span
    >
    <button
      type="button"
      :disabled="paginaActual === totalPaginas"
      @click="paginaActual += 1"
      :class="[
        'py-2 px-3 rounded-[50%]',
        paginaActual === totalPaginas ? 'text-gray-400' : 'hover:bg-gray-200',
      ]"
    >
      <i class="pi pi-angle-right"></i>
    </button>
    <button
      type="button"
      :disabled="paginaActual === totalPaginas"
      @click="paginaActual = totalPaginas"
      :class="[
        'py-2 px-3 rounded-[50%]',
        paginaActual === totalPaginas ? 'text-gray-400' : 'hover:bg-gray-200',
      ]"
    >
      <i class="pi pi-angle-double-right"></i>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";
import type { Remision } from "~/interfaces/remisiones";
import ModalRechazo from "~/components/remisiones/ModalRechazo.vue";
import ModalPreviewRemision from "~/components/remisiones/ModalPreviewRemision.vue";

const props = defineProps({
  remisiones: {
    type: Array as () => Remision[],
    required: true,
  },
  modales: String,
});

const itemsPorPagina = ref(5);
const paginaActual = ref(1);
const totalItems = computed(() => props.remisiones.length);
const totalPaginas = computed(() =>
  Math.ceil(totalItems.value / itemsPorPagina.value)
);

const remisionesData = computed(() => {
  const start = (paginaActual.value - 1) * itemsPorPagina.value;
  const end = start + itemsPorPagina.value;
  return props.remisiones.slice(start, end);
});

const emit = defineEmits(["listar"]);

const listar = () => {
  emit("listar");
};

const formatoNumero = (numero: number): string => {
  return new Intl.NumberFormat("es-ES").format(numero);
};
</script>
