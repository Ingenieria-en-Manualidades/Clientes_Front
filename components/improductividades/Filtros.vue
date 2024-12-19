<template>
  <div class="lg:flex font-manrope-r gap-2 mb-2">
    <div class="lg:w-1/6 mb-2">
      <div>
        <label for="op">Filtrar por operación</label>
      </div>
      <div>
        <input
          type="text"
          id="op"
          v-model="op"
          class="border-[1px] border-black outline-none p-1 text-sm rounded-l lg:w-[75%]"
        />
        <slot name="botonOP"></slot>
      </div>
    </div>
    <div class="lg:w-1/6 mb-2">
      <div>
        <label for="ref">Filtrar por referencía</label>
      </div>
      <div>
        <input
          type="text"
          id="ref"
          v-model="referencia"
          class="border-[1px] border-black outline-none p-1 text-sm rounded-l lg:w-[75%]"
        />
        <slot name="botonRef"></slot>
      </div>
    </div>
    <div :class="['mb-2', recargar ? 'lg:w-1/6' : 'lg:w-2/6']">
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
    <div class="flex w-2/6 gap-5 lg:ml-2">
      <div class="lg:pt-[22px] text-center mb-2">
        <SelectFiltro
          v-model="lineasElegidas"
          :opciones="lineas"
          :placeholder="'Filtrar por líneas'"
          @metodo="$emit('consultarLineas')"
        />
      </div>
      <div class="lg:pt-[22px] mb-2">
        <SelectFiltro
          v-model="turnosElegidos"
          :opciones="turnos"
          :placeholder="'Filtrar por turnos'"
          @metodo="$emit('consultarTurnos')"
        />
      </div>
    </div>
    <div class="lg:w-1/6" v-if="recargar">
      <button
        type="button"
        class="bg-azulClaroIENM px-3 py-1 rounded mt-6"
        @click="recargarTabla"
      >
        <i class="pi pi-refresh text-white"
          ><span class="ml-2 font-manrope-r">Recargar tabla</span></i
        >
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import SelectFiltro from "../dinamicos/SelectFiltro.vue";
import type { Improductividad } from "../../interfaces/improductividades";
import { useImproductividadesAPI } from "../../composables/improductividades/improductividadesAPI";
import { useDatosImproductividades } from "../../composables/improductividades/datosImproductividades";

const op = ref();
const dates = ref();
const referencia = ref();
const toast = useToast();
const recargar = ref(false);
const idCliente = useCookie("idCliente");
const lineasElegidas = ref<String[]>([]);
const turnosElegidos = ref<String[]>([]);

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
const emits = defineEmits(["consultarLineas", "consultarTurnos", "listar"]);
const { listarImproductividades } = useImproductividadesAPI();
const { setConsultar, filtrarPorLinea, filtrarPorTurno } =
  useDatosImproductividades();

const getDataOP = async (improductividades: Improductividad[]) => {
  // Check that there are dates entered.
  if (!op.value) {
    toast.add({
      severity: "error",
      summary: "Operación no asignada.",
      detail: "Por favor escribe una op para buscar.",
      life: 3000,
    });
    return improductividades;
  } else {
    if (lineasElegidas.value.length !== 0) {
      improductividades = await filtrarPorLinea(
        lineasElegidas.value,
        improductividades
      );
    }

    if (turnosElegidos.value.length !== 0) {
      improductividades = await filtrarPorTurno(
        turnosElegidos.value,
        improductividades
      );
    }

    // We perform the filter to consult by dates.
    if (dates.value) {
      improductividades = await setConsultar(improductividades, dates.value);
    }

    if (referencia.value) {
      improductividades = improductividades.filter(
        (imp) => imp.codigo_cobro === referencia.value
      );
    }

    improductividades = improductividades.filter(
      (imp) => imp.programacion_id === op.value
    );

    recargar.value = true;
    return improductividades;
  }
};

const getDataRef = async (improductividades: Improductividad[]) => {
  // Check that there are dates entered.
  if (!referencia.value) {
    toast.add({
      severity: "error",
      summary: "Referencia no asignada.",
      detail: "Por favor escribe una referencia para buscar.",
      life: 3000,
    });
    return improductividades;
  } else {
    if (lineasElegidas.value.length !== 0) {
      improductividades = await filtrarPorLinea(
        lineasElegidas.value,
        improductividades
      );
    }

    if (turnosElegidos.value.length !== 0) {
      improductividades = await filtrarPorTurno(
        turnosElegidos.value,
        improductividades
      );
    }

    // We perform the filter to consult by dates.
    if (dates.value) {
      improductividades = await setConsultar(improductividades, dates.value);
    }

    if (op.value) {
      improductividades = improductividades.filter(
        (imp) => imp.programacion_id === op.value
      );
    }

    improductividades = improductividades.filter(
      (imp) => imp.codigo_cobro === referencia.value
    );
    recargar.value = true;
    return improductividades;
  }
};

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
    if (lineasElegidas.value.length !== 0) {
      improductividades = await filtrarPorLinea(
        lineasElegidas.value,
        improductividades
      );
    }

    if (turnosElegidos.value.length !== 0) {
      improductividades = await filtrarPorTurno(
        turnosElegidos.value,
        improductividades
      );
    }

    if (op.value) {
      improductividades = improductividades.filter(
        (imp) => imp.programacion_id === op.value
      );
    }

    if (referencia.value) {
      improductividades = improductividades.filter(
        (imp) => imp.codigo_cobro === referencia.value
      );
    }

    improductividades = await setConsultar(improductividades, dates.value);
    recargar.value = true;
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

  if (turnosElegidos.value.length !== 0) {
    improductividades = await filtrarPorTurno(
      turnosElegidos.value,
      improductividades
    );
  }

  if (op.value) {
    improductividades = improductividades.filter(
      (imp) => imp.programacion_id === op.value
    );
  }

  if (referencia.value) {
    improductividades = improductividades.filter(
      (imp) => imp.codigo_cobro === referencia.value
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
        if (referencia.value) {
          improductividades = improductividades.filter(
            (imp) => imp.codigo_cobro === referencia.value
          );
          return improductividades;
        } else {
          recargar.value = false;
          // If there are no filters, we list the table again as before.
          const response = await listarImproductividades(idCliente.value);

          // We verify that the method has worked.
          if (response.success && response.data) {
            improductividades = response.data.filter(
              (rem) => rem.estado === null
            );
            dates.value = null;
          }
          return improductividades;
        }
      }
    }
  } else {
    // We use this method that will return the filtered shifts.
    improductividades = await filtrarPorLinea(
      lineasElegidas.value,
      improductividades
    );
    recargar.value = true;
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

  if (lineasElegidas.value.length !== 0) {
    improductividades = await filtrarPorLinea(
      lineasElegidas.value,
      improductividades
    );
  }

  if (op.value) {
    improductividades = improductividades.filter(
      (imp) => imp.programacion_id === op.value
    );
  }

  if (referencia.value) {
    improductividades = improductividades.filter(
      (imp) => imp.codigo_cobro === referencia.value
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
        if (referencia.value) {
          improductividades = improductividades.filter(
            (imp) => imp.codigo_cobro === referencia.value
          );
          return improductividades;
        } else {
          recargar.value = false;
          // If there are no filters, we list the table again as before.
          const response = await listarImproductividades(idCliente.value);

          // We verify that the method has worked.
          if (response.success && response.data) {
            improductividades = response.data.filter(
              (rem) => rem.estado === null
            );
            dates.value = null;
          }
          return improductividades;
        }
      }
    }
  } else {
    // We use this method that will return the filtered shifts.
    improductividades = await filtrarPorTurno(
      turnosElegidos.value,
      improductividades
    );
    recargar.value = true;
    return improductividades;
  }
};

const recargarTabla = () => {
  emits("listar");
  dates.value = null;
  recargar.value = false;
  op.value = "";
  // Delete arrangements of chosen shifts and lines.
  lineasElegidas.value.splice(0, lineasElegidas.value.length);
  turnosElegidos.value.splice(0, turnosElegidos.value.length);
};

defineExpose({
  getDataOP,
  getDataRef,
  getDataFecha,
  getDataLineas,
  getDataTurnos,
  recargarTabla,
});
</script>
