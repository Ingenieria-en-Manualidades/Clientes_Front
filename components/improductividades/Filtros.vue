<template>
  <div class="flex font-manrope-r bg-yellow-50 gap-2">
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
        <button class="bg-azulClaroIENM py-1 px-2 rounded-r">
          <i class="pi pi-search text-white"></i>
        </button>
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
        <button class="bg-azulClaroIENM py-1 px-2 rounded-r">
          <i class="pi pi-search text-white"></i>
        </button>
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
        <button class="bg-azulClaroIENM py-1 px-2 rounded">
          <i class="pi pi-search text-white"></i>
        </button>
      </div>
    </div>
    <div class="w-1/5">
      <div>
        <label>Filtrar por fecha</label>
      </div>
      <SelectFiltro
        v-model="elegido"
        :opciones="opciones"
        :placeholder="'Elige varias opciones'"
        @metodo="alerta"
      />
    </div>
    <div class="w-1/5">
      <div>
        <label>Filtrar por fecha</label>
      </div>
      <SelectFiltro
        v-model="elegido"
        :opciones="opciones"
        :placeholder="'Elige varias opciones'"
        @metodo="alerta"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import SelectFiltro from "../dinamicos/SelectFiltro.vue";

const dates = ref();
const elegido = ref();
const opciones = ref(["Masculino", "Gay", "Helicoptero"]);
const alerta = () => {
  alert("Opción: " + elegido.value);
};
</script>
