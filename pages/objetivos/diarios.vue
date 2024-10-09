<template>
  <div class="w-full">
    <p class="font-manrope-b text-center text-2xl my-1">PRODUCCIÓN</p>
    <!-- <div class="text-center">
      <p v-if="formVisible" class="font-manrope-r mb-3">
        Ingresar producción del día
      </p>
    </div> -->
    <div class="w-full flex justify-center p-1 gap-2">
      <FormProduccion :visible="visible" @setVisible="visible = !visible" />
      <FormIndicadores :visible="visible" @setVisible="visible = !visible" />
      <fieldset class="border-[1px] border-black rounded p-2">
        <legend>Meses Anteriores</legend>
        <Calendar
          v-model="dates"
          selectionMode="range"
          :manualInput="false"
          view="month"
          dateFormat="yy/mm"
          placeholder="Elegir mes o meses"
          showIcon
          fluid
          iconDisplay="input"
        />
        <button
          @click="show"
          class="bg-azulClaroIENM ml-2 p-[11px] rounded mb-2"
        >
          <i class="pi pi-search text-white"></i>
        </button>
        <Tabla
          :cabezas="cabezasInd"
          :arrayData="dataInd"
          :atributosDatos="atribInd"
          :pag="false"
        />
      </fieldset>
      <!-- <div class="w-[74%] ml-2">
        <div class="w-full flex justify-center gap-10">
          <div class="float-right">
            <Tabla
              :cabezas="cabezasProd"
              :arrayData="dataProd"
              :atributosDatos="atribProd"
              :pag="false"
            />
          </div>
        </div>
        <div class="mt-1">
          <Tabla
            :cabezas="cabezasArm"
            :arrayData="dataArm"
            :atributosDatos="atribArm"
            :pag="false"
          />
        </div>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import Tabla from "../../components/dinamicos/Tabla.vue";
import FormProduccion from "../../components/objetivos/FormProduccion.vue";
import FormIndicadores from "../../components/objetivos/FormIndicadores.vue";
import {
  datosTablaProd,
  datosTablaArmado,
} from "../../composables/objetivos/datosObjetivos";

const dates = ref();
const toast = useToast();
const { cabezasArm, atribArm, dataArm } = datosTablaArmado();
const { cabezasProd, atribProd, dataProd } = datosTablaProd();

const visible = ref(true);

let cabezasInd = ref<String[]>(["Indicador", "Abril", "Junio"]);

const atribInd = ["indicador", "mesUno", "mesDos"];

const dataInd = [
  {
    indicador: "Cumplimiento Productivo",
    mesUno: "90%",
    mesDos: "90%",
  },
  {
    indicador: "Cumplimiento Plan Armado",
    mesUno: "90%",
    mesDos: "90%",
  },
  {
    indicador: "Calidad",
    mesUno: "90%",
    mesDos: "90%",
  },
  {
    indicador: "Desperfecto M.E",
    mesUno: "90%",
    mesDos: "90%",
  },
  {
    indicador: "Desperfecto P.P",
    mesUno: "90%",
    mesDos: "90%",
  },
];

const show = () => {
  if (dates.value) {
    cabezasInd.value.splice(0, cabezasInd.value.length, "Indicador");
    cabezasInd.value = cabezasInd.value.concat(getMeses(dates.value));
  } else {
    toast.add({
      severity: "error",
      summary: "Falta llenar el campo.",
      detail: "Por favor elegir un mes o dos.",
      life: 3000,
    });
  }
};

const getMeses = (fechas: Date[]): String[] => {
  const arrayMeses: String[] = [];
  if (!fechas[1]) {
    arrayMeses.push(meses[fechas[0].getMonth()]);
  } else {
    for (let i = fechas[0].getMonth(); i <= fechas[1].getMonth(); i++) {
      arrayMeses.push(meses[i]);
    }
  }
  return arrayMeses;
};
</script>
