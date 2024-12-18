<template>
  <div class="flex font-manrope-r gap-2 mb-2">
    <div class="w-1/5">
      <div>
        <label for="op">Filtrar por operación</label>
      </div>
      <div>
        <input
          type="text"
          id="op"
          class="border-[1px] border-black outline-none p-1 text-sm rounded-l w-[80%]"
        />
        <slot name="botonOP"></slot>
      </div>
    </div>
    <div class="w-1/5">
      <div>
        <label for="ref">Filtrar por referencía</label>
      </div>
      <div>
        <input
          type="text"
          id="ref"
          class="border-[1px] border-black outline-none p-1 text-sm rounded-l w-[78%]"
        />
        <slot name="botonRef"></slot>
      </div>
    </div>
    <div class="w-1/5 mr-2">
      <div>
        <label for="ref">Filtrar por fecha</label>
      </div>
      <div class="flex">
        <Calendar
          v-model="dates"
          selectionMode="range"
          :manualInput="false"
          dateFormat="yy/mm/dd"
          placeholder="Escoge una o dos fechas"
          showIcon
          fluid
          class="h-8"
          inputClass="w-full"
          iconDisplay="input"
        />
        <slot name="botonFecha"></slot>
      </div>
    </div>
    <div class="w-1/5">
      <div>
        <label>Filtrar por líneas</label>
      </div>
      <SelectFiltro
        v-model="lineasElegidas"
        :opciones="lineas"
        :placeholder="'Elige varias opciones'"
        @metodo="$emit('consultarLineas')"
      />
    </div>
    <div class="w-1/5">
      <div>
        <label>Filtrar por turnos</label>
      </div>
      <SelectFiltro
        v-model="turnosElegidos"
        :opciones="turnos"
        :placeholder="'Elige varias opciones'"
        @metodo="$emit('consultarTurnos')"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import SelectFiltro from "../dinamicos/SelectFiltro.vue";
import type {
  Improductividad,
  promiseComp,
} from "../../interfaces/improductividades";
import { useImproductividadesAPI } from "../../composables/improductividades/improductividadesAPI";
import { useDatosImproductividades } from "../../composables/improductividades/datosImproductividades";

const dates = ref();
const idCliente = useCookie("idCliente");
const lineasElegidas = ref();
const turnosElegidos = ref();
const toast = useToast();
const opciones = ref(["Masculino", "Gay", "Helicoptero"]);
const alerta = () => {
  alert("Opción: ");
};

const props = defineProps({
  lineas: {
    type: Object as () => String[],
    required: true,
  },
  turnos: {
    type: Object as () => String[],
    required: true,
  },
});

const emits = defineEmits(["consultarLineas", "consultarTurnos", "recargar"]);
const { listarImproductividades } = useImproductividadesAPI();
const {
  setConsultar,
  filtrarPorLinea,
  filtrarPorTurno,
  getFiltros,
  getImprodFiltradas,
} = useDatosImproductividades();

const getDataFecha = async (
  improductividades: Improductividad[]
): Promise<Improductividad[]> => {
  // Check that there are dates entered.
  if (!dates.value) {
    toast.add({
      severity: "error",
      summary: "Fecha no asignada",
      detail: "Por favor elige una fecha o dos con el calendario.",
      life: 3000,
    });
    return improductividades;
  } else {
    // We perform the filter to consult by dates.
    improductividades = await setConsultar(improductividades, dates.value);

    return improductividades;
  }
};

const getDataLineas = async (
  improductividades: Improductividad[]
): Promise<Improductividad[]> => {
  // We verify that there are no previous filters for dates or shifts, if there are, perform the filters.
  if (dates.value) {
    improductividades = await setConsultar(improductividades, dates.value);
  }

  if (turnosElegidos.value) {
    improductividades = await filtrarPorTurno(
      turnosElegidos.value,
      improductividades
    );
  }

  // We verify that if you execute this "getFiltrarLinea" method and there is no line chosen, take into account what to do.
  if (lineasElegidas.value.length === 0) {
    // We verify that there are no date filters, if there are any, the query is made.
    if (dates.value) {
      improductividades = await setConsultar(improductividades, dates.value);
      return improductividades;
    } else {
      // We verify that there are no shift filters, if there are, the query is made.
      if (turnosElegidos.value.length !== 0) {
        improductividades = await filtrarPorTurno(
          turnosElegidos.value,
          improductividades
        );
        return improductividades;
      } else {
        // If there are no filters, we list the table again as before.
        const response = await listarImproductividades(idCliente.value);

        // We verify that the method has worked.
        if (response.success && response.data) {
          improductividades = response.data.filter(
            (rem) => rem.estado === null
          );
          dates.value = null;
          emits("recargar");
        }
        return improductividades;
      }
    }
  } else {
    // We use this method that will return the filtered shifts.
    improductividades = await filtrarPorLinea(
      lineasElegidas.value,
      improductividades
    );
    return improductividades;
  }
};

const getDataTurnos = async (
  improductividades: Improductividad[]
): Promise<Improductividad[]> => {
  // We verify that there are no previous filters by dates or lines, if the filters have been made.
  if (dates.value) {
    improductividades = await setConsultar(improductividades, dates.value);
  }

  if (lineasElegidas.value) {
    improductividades = await filtrarPorLinea(
      lineasElegidas.value,
      improductividades
    );
  }

  // We verify that if you execute this "getFiltrarTurno" method and there is no line chosen, take into account what to do.
  if (turnosElegidos.value.length === 0) {
    // We verify that there are no date filters, if there are any, the query is made.
    if (dates.value) {
      improductividades = await setConsultar(improductividades, dates.value);
      return improductividades;
    } else {
      // We verify that there are no shift filters, if there are, the query is made.
      if (lineasElegidas.value.length !== 0) {
        improductividades = await filtrarPorLinea(
          lineasElegidas.value,
          improductividades
        );
        return improductividades;
      } else {
        // If there are no filters, we list the table again as before.
        const response = await listarImproductividades(idCliente.value);

        // We verify that the method has worked.
        if (response.success && response.data) {
          improductividades = response.data.filter(
            (rem) => rem.estado === null
          );
          dates.value = null;
          emits("recargar");
        }
        return improductividades;
      }
    }
  } else {
    // We use this method that will return the filtered shifts.
    improductividades = await filtrarPorTurno(
      turnosElegidos.value,
      improductividades
    );

    return improductividades;
  }
};

defineExpose({
  getDataFecha,
  getDataLineas,
  getDataTurnos,
});
</script>
