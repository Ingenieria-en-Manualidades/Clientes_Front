<template>
  <button type="button" @click="visible = true">
    <i class="pi pi-question-circle text-lg md:text-2xl hover:bg-gray-200 rounded-lg p-2"></i>
  </button>
  <div>
    <Dialog
      v-model:visible="visible"
      modal
      :header="'Guía paso a paso para módulos.'"
      :style="{ width: '25rem' }"
    >
      <ul>
        <li v-for="(modulo, i) in modulos" :key="i" class="w-full">
          <!-- We verify that the module is allowed and has a step by step -->
          <div v-if="modulo.stepByStep && modulo.visible">
            <div v-if="modulo.submodulos">
              <div
                class="flex border border-gray-300 items-center truncate w-full gap-2 p-2 hover:bg-gray-300 cursor-pointer rounded-lg"
                @click.stop="toggle(i)"
              >
                <i :class="modulo.icono"></i>
                <p class="flex-1">{{ modulo.nombre }}</p>
                <i class="pi pi-angle-right transition-transform" :class="isOpen(i) ? 'rotate-90' : ''"></i>
              </div>

              <!-- contenedor colapsable -->
              <div
                :class="[
                  'grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out',
                  isOpen(i) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                ]"
              >
                <ul :class="['min-h-0 rounded-lg ml-5 mb-1', isOpen(i) ? 'border border-gray-300':'']">
                  <li v-for="(submodulo, index) in modulo.submodulos" :key="index">
                    <div
                      v-if="submodulo.stepByStep && submodulo.visible"
                      :class="[
                        'w-full flex items-center gap-2 border-gray-300 p-2',
                        index < modulo.submodulos.length - 1 ? 'border-b' : ''
                      ]"
                    >
                      <i :class="submodulo.icono"></i>
                      <p class="flex-1">{{ submodulo.nombre }}</p>
                      <button type="button" @click.stop="startStepByStep(submodulo.ruta)" class="rounded-3xl text-white text-sm bg-[#4789c8] px-2 py-1 mx-2">Empezar</button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <!-- div for modules with submodules -->
            <div v-else class="mb-1">
              <div class="w-full flex items-center border rounded-lg border-gray-300">
                <div class="flex items-center truncate w-full gap-2 p-2 rounded-l-lg">
                  <i :class="modulo.icono"></i>
                  <p class="flex-1">{{ modulo.nombre }}</p>
                </div>
                <button
                  type="button" @click.stop="startStepByStep(modulo.ruta)"
                  class="shrink-0 rounded-3xl text-white text-sm bg-[#4789c8] px-2 py-1 mx-2"
                >
                  Empezar
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useModulos } from "../composables/menuItems";

const visible = ref(false);
const router = useRouter();
const { modulos } = useModulos();

const abiertos = ref<Set<number>>(new Set())
const toggle = (i: number) => {
  if (abiertos.value.has(i)) abiertos.value.delete(i)
  else abiertos.value.add(i)
}
const isOpen = (i: number) => abiertos.value.has(i)

const startStepByStep = (path: string) => {
  visible.value = false;
  router.push(path + "#stepByStep");
}
</script>
