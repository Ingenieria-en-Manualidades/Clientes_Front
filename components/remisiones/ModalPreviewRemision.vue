<template>
  <button
    type="button"
    class="bg-verdeOscIENM px-3 py-1 rounded hover:bg-verdeIENM mb-1 sm:mb-0"
    @click="visible = true"
  >
    <i class="pi pi-eye text-white"></i>
    <span class="text-white font-manrope-r ml-2 hidden sm:inline-flex"
      >Ver</span
    >
  </button>
  <div>
    <Dialog
      v-model:visible="visible"
      modal
      :header="`Detalle de la Remision N° ${numRemision}`"
      :style="{ width: '70rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <div ref="contenido">
        <!-- Cabecerar con información de la empresa -->
        <div
          class="inline-flex w-full justify-center gap-2 sm:gap-[22%] border-t-[1px] border-gray-300 pt-2"
        >
          <img
            src="/assets/img/ienmLogo.jpeg"
            alt="IENM Logo"
            class="w-[70px] sm:w-[130px]"
          />
          <p class="text-center font-manrope-b text-black text-xs sm:text-xs">
            INGENIERÍA EN MANUALIDADES SAS <br />
            NIT 800.187.547-1 <br />
            TV 29 #16-57
          </p>
          <p class="text-center font-manrope-b text-black text-xs sm:text-xs">
            REMISIÓN N° {{ numRemision }}<br />{{ fecha }}
          </p>
        </div>
        <!-- Tabla de la información del cliente -->
        <div class="flex justify-center">
          <table>
            <tr
              class="bg-azulClaroIENM border-x-[1px] border-t-[1px] border-x-azulIENM border-t-azulIENM"
            >
              <th
                class="py-[6px] font-manrope-b text-white text-sm sm:text-base"
                colspan="3"
              >
                {{ cliente }}
              </th>
            </tr>
            <tr
              class="bg-amarilloIENM font-manrope-b text-center text-black text-sm sm:text-base"
            >
              <th class="celdasModalP">Orden de compra</th>
              <th class="celdasModalP">Hoja de entrada</th>
              <th class="celdasModalP">Contacto</th>
            </tr>
            <tr
              class="font-manrope-r text-center text-black text-sm sm:text-base"
            >
              <td class="bg-gray-100 celdasModalP">{{ ordenCompra }}</td>
              <td class="bg-gray-100 celdasModalP">{{ hojaEntrada }}</td>
              <td class="bg-gray-100 celdasModalP">{{ contacto }}</td>
            </tr>
          </table>
        </div>
        <!-- Tabla de las actividades -->
        <div class="mt-5">
          <table class="w-full">
            <thead>
              <tr
                class="font-manrope-b border-b-2 border-b-black bg-verdeOscIENM text-black text-xs sm:text-[15px]"
              >
                <th class="py-2">OP</th>
                <th class="py-2">SKU</th>
                <th class="py-2">ACTIVIDAD</th>
                <th class="py-2">UNIDADES</th>
                <th class="py-2">PRECIO UNITARIO</th>
                <th class="py-2">TOTAL</th>
              </tr>
            </thead>
            <tbody class="h-[50px overflow-y-auto]">
              <tr
                v-for="dato in datos"
                v-bind:key="dato.nombre"
                class="text-center font-manrope-r border-b-[1px] border-b-gray-300 text-xs sm:text-[14px] cursor-pointer hover:bg-gray-300 text-black"
              >
                <td class="py-2">{{ dato.programacion_id }}</td>
                <td class="py-2">{{ dato.codigo_cobro }}</td>
                <td class="py-2">{{ dato.nombre }}</td>
                <td class="py-2">{{ dato.unidades }}</td>
                <td class="py-2">
                  <span class="font-bold">$</span> {{ dato.precio }}
                </td>
                <td class="py-2">
                  <span class="font-bold">$</span> {{ dato.totalredondeado }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr
                class="bg-gray-200 border-b-[1px] border-b-black border-t-2 border-t-black font-manrope-r text-black text-xs sm:text-[14px]"
              >
                <td class="text-right pr-5 py-1" colspan="7">
                  <span class="font-bold mr-10">TOTAL</span>
                  <span class="font-bold mr-1">$</span>{{ total }}
                </td>
              </tr>
              <tr
                class="bg-gray-200 border-b-[1px] border-b-black font-manrope-r text-black text-xs sm:text-[14px]"
              >
                <td class="text-right pr-5 py-1" colspan="7">
                  <span class="font-bold mr-10">IVA</span>
                  <span class="font-bold mr-1">$</span>{{ iva }}
                </td>
              </tr>
              <tr
                class="bg-gray-200 font-manrope-r text-black text-xs sm:text-[14px]"
              >
                <td class="text-right pr-5 py-1" colspan="7">
                  <span class="font-bold mr-7">TOTAL GENERAL</span>
                  <span class="font-bold mr-1">$</span>{{ totalGeneral }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <!-- Ultimos detalles como la observación y la firma -->
        <div class="mt-3">
          <div class="font-manrope-b mb-2 text-black">
            <label for="observacion">Observaciones:</label>
          </div>
          <Textarea
            id="observacion"
            v-model="observaciones"
            rows="3"
            readonly
            class="w-full bg-[#e9ecef] border-[1px] border-gray-400 text-black font-manrope-r"
          />
          <div class="w-full inline-flex mt-12">
            <p
              class="text-center w-2/4 text-black font-manrope-b text-xs sm:text-base"
            >
              ELABORADO POR:<br />{{ usuario }}
            </p>
            <p class="text-center w-2/4">
              ___________________________<br />
              <span class="font-manrope-b text-black text-xs sm:text-base"
                >FIRMA</span
              >
            </p>
          </div>
        </div>
      </div>
      <div class="w-full text-right mt-4 border-t-[1px] border-t-gray-300 pt-3">
        <button class="botones bg-red-500 mr-3" @click="visible = false">
          Cancelar
        </button>
        <button class="botones bg-verdeOscIENM" @click="generarPDF">
          <i class="pi pi-file-pdf"></i>
          Generar PDF
        </button>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { jsPDF } from "jspdf";
import type { PreviewRemision } from "~/interfaces/remisiones";
import { useRemisionesApi } from "~/composables/remisiones/remisionesApi";

const iva = ref();
const total = ref();
const visible = ref(false);
const totalGeneral = ref();
const observaciones = ref();
const usuario = useCookie("usuario");
const datos = ref<PreviewRemision[]>([]);
const contenido = ref<HTMLElement | null>(null);
const { listarPreviewRemision } = useRemisionesApi();

const props = defineProps({
  numRemision: String,
  fecha: String,
  cliente: String,
  ordenCompra: String,
  hojaEntrada: String,
  contacto: String,
});

const getModalPreview = async () => {
  const resultado = await listarPreviewRemision(props.numRemision);

  if (resultado.success) {
    datos.value = resultado.remisiones;
    total.value = Number(resultado.remisiones[0].valor);
    observaciones.value = resultado.remisiones[0].observacion;
    iva.value = (total.value * 19) / 100;
    totalGeneral.value = total.value + iva.value;
  } else {
    console.log("Fallo!!");
  }
};

const generarPDF = () => {
  const doc = new jsPDF({
    format: "a3",
    orientation: "l",
    unit: "pt",
  });

  if (contenido.value) {
    doc.html(contenido.value, {
      callback: function (doc: jsPDF) {
        doc.save(`Detalles-remisión-${props.numRemision}.pdf`);
      },
      x: 10,
      y: 10,
    });
  }
};

getModalPreview();
</script>
