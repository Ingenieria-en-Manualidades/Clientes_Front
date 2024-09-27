<template>
  <div class="w-full">
    <p class="font-manrope-b text-center text-2xl my-3">PRODUCCIÓN</p>
    <!-- <div class="text-center">
      <p v-if="formVisible" class="font-manrope-r mb-3">
        Ingresar producción del día
      </p>
    </div> -->
    <div class="w-full flex">
      <div class="w-[23%] px-3">
        <form class="mb-10 mx-5">
          <p class="mb-1 font-manrope-r">Producción Planificada:</p>
          <input
            type="text"
            v-model="prodPlan"
            class="w-full border-[1px] border-black rounded-md outline-none py-1 pl-2 mb-3"
          />
          <button
            class="w-full bg-azulClaroIENM py-1 rounded-md border-[1px] border-azulClaroIENM text-white font-manrope-b"
            type="submit"
          >
            INGRESAR
          </button>
        </form>
        <form class="mb-10 mx-5">
          <p class="mb-1 font-manrope-r">Producción Planificada:</p>
          <input
            type="text"
            v-model="prodPlan"
            class="w-full border-[1px] border-black rounded-md outline-none py-1 pl-2 mb-3"
          />
          <button
            class="w-full bg-azulClaroIENM py-1 rounded-md border-[1px] border-azulClaroIENM text-white font-manrope-b"
            type="submit"
          >
            INGRESAR
          </button>
        </form>
        <form class="mb-3 mx-5">
          <p class="mb-1 font-manrope-r">Plan armado:</p>
          <input
            type="text"
            v-model="planArmado"
            class="w-full border-[1px] border-black rounded-md outline-none py-1 pl-2 mb-3"
          />
          <button
            class="w-full bg-azulClaroIENM py-1 rounded-md border-[1px] border-azulClaroIENM text-white font-manrope-b"
            type="submit"
          >
            INGRESAR
          </button>
        </form>
      </div>
      <div class="w-[74%] ml-2">
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
        <div class="bg-yellow-300 mt-1">
          <Tabla
            :cabezas="cabezasProd"
            :arrayData="dataProd"
            :atributosDatos="atribProd"
            :pag="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import Tabla from "../../components/dinamicos/Tabla.vue";
import {
  datosTablaIndicadores,
  datosTablaProd,
} from "../../composables/objetivos/datosObjetivos";

const prodPlan = ref();
const planArmado = ref();
const toast = useToast();
const formVisible = ref(true);
const { cabezasProd, atribProd, dataProd } = datosTablaProd();
const { cabezasInd, atribInd, dataInd } = datosTablaIndicadores();

let date: Date = new Date();
console.log("Date: ", date);

const handleSubmit = () => {
  if (prodPlan.value && planArmado.value) {
    formVisible.value = false;
  } else {
    toast.add({
      severity: "error",
      summary: "",
      detail: "",
      life: 3000,
    });
  }
};
</script>
