<template>
  <div class="w-full md:w-[97%]">
    <title>Improductividades</title>
    <TabPanelRemisiones :items="items2" v-if="items2" />

    <div v-if="data?.length !== 0">
      <!-- Tabla agrupada -->
      <div class="min-h-[396px] mt-5">
        <h2 class="text-lg font-bold mb-4">Improductividades Agrupadas</h2>
        <Tabla
          :cabezas="encabezadosAgrupados"
          :atributosDatos="atributosAgrupados"
          :arrayData="improductividadesAgrupadas"
          :pag="true"
          @rowClick="mostrarDetalles"
        >
          <template #nuevaColumna>
            <th class="bg-azulIENM text-white py-3 px-5">ACCIONES</th>
          </template>
          <template #botones="{ data }">
            <td>
              <ModalGestionar
                :idImproductividad="data.op"
                :actividad="data.referencia"
                :descripcion="data.sumHoraHombre"
                @postGuardar="
                  guardarImproductividades(data.op, data.referencia)
                "
              />
            </td>
          </template>

          <!-- Redondeo de los campos excepto setupLinea -->
          <template #columnaTiempoParaCobrar="{ data }">
            <td>
              {{ Math.round(data.tiempoParaCobrar) }}
            </td>
          </template>
          <template #columnaSetupLinea="{ data }">
            <td>
              {{ data.setupLinea }}
            </td>
          </template>
        </Tabla>
      </div>
    </div>

    <!-- Loading -->
    <div class="p-5 rounded-t-lg text-center" v-else-if="isLoading">
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="transparent"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />
    </div>

    <!-- Mensaje de estado -->
    <div
      class="p-10 rounded-t-lg text-center"
      v-else-if="estadoImproductividades"
    >
      <i :class="avisoIcono"></i>
      <p class="font-manrope-b text-xl mt-3">{{ avisodetalles }}</p>
      <button
        v-if="botonRecargar"
        class="bg-azulClaroIENM px-3 py-1 rounded mt-3 font-manrope-b text-white"
        @click="recargarTabla"
      >
        Recargar tabla
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import ProgressSpinner from "primevue/progressspinner";
import Tabla from "../../components/dinamicos/Tabla.vue";
import TabPanelRemisiones from "../../components/remisiones/TabPanelRemisiones.vue";
import ModalGestionar from "../../components/improductividades/ModalGestionar.vue";
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";
import { useImproductividadesAPI } from "../../composables/improductividades/improductividadesAPI";

// Variables reactivas
const dates = ref();
const estadoImproductividades = ref(false);
const isLoading = ref(false);
const recargar = ref(false);
const toast = useToast();
const idCliente = useCookie("idCliente");
const items2 = ref([]); // Define items2 para evitar errores

interface Improductividad {
  programacion_id: string;
  codigo_cobro: string;
  horasxpersonas?: number;
  cant_personas: number;
  allocated_time?: number;
  fecha: string; // Asegúrate de que el tipo sea correcto (string, Date, etc.)
}

interface ImproductividadAgrupada {
  op: string;
  referencia: string;
  cantPersonasMax: number;
  sumHoraHombre: number;
  setup: number;
  setupLinea: number;
  tiempoParaCobrar: number;
}

const data = ref<Improductividad[]>([]);
const improductividadesAgrupadas = ref<ImproductividadAgrupada[]>([]);

// Encabezados y atributos
const encabezadosAgrupados = [
  "OP",
  "Referencia",
  "Total Tiempo Improductivo",
  "Personal Improductivo",
  "Setup",
  "Setup Línea",
  "Tiempo para Cobrar",
];
const atributosAgrupados = [
  "op",
  "referencia",
  "sumHoraHombre",
  "cantPersonasMax",
  "setup",
  "setupLinea",
  "tiempoParaCobrar",
];

// Datos y métodos
const { listarImproductividades, guardarCambiosImproductividades } =
  useImproductividadesAPI();

const procesarImproductividades = (data: any[]): ImproductividadAgrupada[] => {
  const agrupadas = data.reduce((acc, item) => {
    const key = `${item.programacion_id}-${item.codigo_cobro}`;
    if (!acc[key]) {
      acc[key] = {
        op: item.programacion_id,
        referencia: item.codigo_cobro,
        cantPersonasMax: 0,
        sumHoraHombre: 0,
        setup: item.allocated_time || 0,
        setupLinea: 0,
        tiempoParaCobrar: 0, // Inicializamos en 0
      };
    }
    const horas = Number(item.horasxpersonas) || 0;
    acc[key].cantPersonasMax = Math.max(
      acc[key].cantPersonasMax,
      item.cant_personas
    );
    acc[key].sumHoraHombre += horas;
    acc[key].setupLinea = acc[key].cantPersonasMax * acc[key].setup;
    // Calcular 'tiempoParaCobrar' y redondearlo
    acc[key].tiempoParaCobrar = Math.round(
      acc[key].sumHoraHombre - acc[key].setupLinea
    ); // Redondeo aquí
    return acc;
  }, {} as Record<string, ImproductividadAgrupada>);
  return Object.values(agrupadas);
};

const listar = async () => {
  isLoading.value = true;
  const response = await listarImproductividades(idCliente.value);

  if (response.success && response.data) {
    // Verificación adicional
    data.value = response.data;
    improductividadesAgrupadas.value = procesarImproductividades(data.value);
  } else {
    // Manejo de casos en los que response.success es false o response.data es undefined
    data.value = [];
    improductividadesAgrupadas.value = [];
    toast.add({
      severity: "error",
      summary: "Error al listar improductividades",
      detail: "No se pudo obtener la información.",
      life: 3000,
    });
  }

  isLoading.value = false;
};

const guardarImproductividades = async (
  programacion_id: string,
  codigo_cobro: string
) => {
  const response = await guardarCambiosImproductividades({
    programacion_id,
    codigo_cobro,
  });

  if (response.success) {
    toast.add({
      severity: "success",
      summary: "Guardado exitoso",
      detail: "Los cambios se han guardado correctamente.",
      life: 3000,
    });
    listar();
  } else {
    toast.add({
      severity: "error",
      summary: "Error al guardar",
      detail: "No se pudieron guardar los cambios.",
      life: 3000,
    });
  }
};

const recargarTabla = () => {
  listar();
  recargar.value = false;
  dates.value = null;
};

const consultarImproductividades = async () => {
  if (!dates.value) {
    toast.add({
      severity: "error",
      summary: "Fecha no asignada",
      detail: "Por favor elige una fecha o dos con el calendario.",
      life: 3000,
    });
    return;
  }

  isLoading.value = true;
  const response = await listarImproductividades(idCliente.value);

  if (response.success && response.data) {
    const filtradas = response.data.filter((item: Improductividad) => {
      const itemDate = new Date(item.fecha); // Asegúrate de que 'fecha' existe
      return (
        itemDate >= new Date(dates.value[0]) &&
        itemDate <= new Date(dates.value[1])
      );
    });
    data.value = filtradas;
    improductividadesAgrupadas.value = procesarImproductividades(filtradas);
  } else {
    toast.add({
      severity: "error",
      summary: "Error al consultar",
      detail: "No se pudieron cargar las improductividades.",
      life: 3000,
    });
  }

  isLoading.value = false;
};

// Inicialización
listar();

definePageMeta({
  middleware: "usuario-verificado",
});
</script>
