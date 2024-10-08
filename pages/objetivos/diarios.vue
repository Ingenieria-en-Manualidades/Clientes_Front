<template>
  <div class="w-full">
    <p class="font-manrope-b text-center text-2xl my-1">PRODUCCIÓN</p>
    <!-- <div class="text-center">
      <p v-if="formVisible" class="font-manrope-r mb-3">
        Ingresar producción del día
      </p>
    </div> -->
    <div class="w-full flex justify-center p-1 gap-2">
      <FormProduccion />
      <FormIndicadores />
      <!-- <div class="w-[74%] ml-2">
        <div class="w-full flex justify-center gap-10">
          <div>
            <Tabla
              :cabezas="cabezasInd"
              :arrayData="dataInd"
              :atributosDatos="atribInd"
              :pag="false"
            />
          </div>
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
  datosTablaIndicadores,
  datosTablaProd,
  datosTablaArmado,
} from "../../composables/objetivos/datosObjetivos";

const { cabezasArm, atribArm, dataArm } = datosTablaArmado();
const { cabezasProd, atribProd, dataProd } = datosTablaProd();
const { cabezasInd, atribInd, dataInd } = datosTablaIndicadores();
</script>
