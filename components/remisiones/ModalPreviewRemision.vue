<template>
  <button
    type="button"
    class="relative bg-rojoIENM px-3 py-[6px] rounded hover:bg-verdeIENM mb-1 sm:mb-0 group"
    @click="visible = true"
  >
    <i class="pi pi-eye text-white"></i>
    <p class="tooltipModalPreview">ver remisión</p>
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
          class="inline-flex w-full justify-center gap-2 sm:gap-7 md:gap-[22%] border-t-[1px] border-gray-300 pt-2"
        >
          <img
            src="/assets/img/ienmLogo.jpeg"
            alt="IENM Logo"
            class="w-[90px] sm:w-[130px]"
          />
          <p class="text-center font-manrope-b text-black text-xs sm:text-base">
            INGENIERÍA EN MANUALIDADES SAS <br />
            NIT 800.187.547-1 <br />
            TV 29 #16-57
          </p>
          <p class="text-center font-manrope-b text-black text-xs sm:text-base">
            REMISIÓN N° {{ numRemision }}<br />{{ fecha }}
          </p>
        </div>
        <!-- Tabla de la información del cliente -->
        <div class="flex justify-center">
          <table class="border-[1px] border-black">
            <tr class="">
              <th
                class="py-[6px] font-manrope-b text-black text-sm sm:text-base bg-gray-300 border-b-[1px] border-b-black"
                colspan="3"
              >
                {{ cliente }}
              </th>
            </tr>
            <tr
              class="font-manrope-b text-center text-black text-sm sm:text-base"
            >
              <th class="bg-gray-200 celdasModalP">Orden de compra</th>
              <th class="bg-gray-200 celdasModalP">Hoja de entrada</th>
              <th class="bg-gray-200 celdasModalP">Contacto</th>
            </tr>
            <tr
              class="font-manrope-r text-center text-black text-sm sm:text-base"
            >
              <td class="celdasModalP hover:bg-gray-100 cursor-pointer">
                {{ ordenCompra }}
              </td>
              <td class="celdasModalP hover:bg-gray-100 cursor-pointer">
                {{ hojaEntrada }}
              </td>
              <td class="celdasModalP hover:bg-gray-100 cursor-pointer">
                {{ contacto }}
              </td>
            </tr>
          </table>
        </div>
        <!-- Tabla de las actividades -->
        <div class="mt-5">
          <table class="w-full">
            <thead>
              <tr
                class="font-manrope-b border-b-2 border-b-black text-black text-xs sm:text-[15px]"
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
                <td class="py-2">{{ formatoNumero(dato.unidades) }}</td>
                <td class="py-2">
                  <span class="font-bold">$</span>
                  {{ formatoNumero(dato.precio) }}
                </td>
                <td class="py-2">
                  <span class="font-bold">$</span>
                  {{ formatoNumero(dato.totalredondeado) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr
                class="bg-gray-200 border-t-2 border-t-black font-manrope-r text-black text-xs sm:text-[14px]"
              >
                <td class="text-right lg:pr-5 py-1" colspan="7">
                  <span class="font-bold mr-10">TOTAL</span>
                  <span class="font-bold mr-1">$</span
                  >{{ formatoNumero(total) }}
                </td>
              </tr>
              <tr
                class="bg-gray-200 font-manrope-r text-black text-xs sm:text-[14px]"
              >
                <td class="text-right lg:pr-5 py-1" colspan="7">
                  <span class="font-bold mr-10">IVA</span>
                  <span class="font-bold mr-1">$</span>{{ formatoNumero(iva) }}
                </td>
              </tr>
              <tr
                class="bg-gray-200 font-manrope-r text-black text-xs sm:text-[14px]"
              >
                <td class="text-right lg:pr-5 py-1" colspan="7">
                  <span class="font-bold mr-7">TOTAL GENERAL</span>
                  <span class="font-bold mr-1">$</span
                  >{{ formatoNumero(totalGeneral) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <!-- Ultimos detalles como la observación y la firma -->
        <div class="mt-3">
          <div class="font-manrope-b mb-2 text-black text-xs sm:text-base">
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
            <p class="text-center w-2/4 hidden sm:block">
              _____________________________________________<br />
              <span class="font-manrope-b text-black text-xs sm:text-base"
                >FIRMA</span
              >
            </p>
            <p class="text-center w-2/4 block sm:hidden">
              ___________________________<br />
              <span class="font-manrope-b text-black text-xs sm:text-base"
                >FIRMA</span
              >
            </p>
          </div>
        </div>
      </div>
      <!-- IF que ayuda a mostrar el boton para generar PDF en caso de ser remisiones aprobadas  -->
      <div
        class="w-full mt-5 border-t-[1px] border-t-gray-300 pt-3 inline-flex"
        v-if="estado === 'Aprobado'"
      >
        <div
          class="bg-verdeOscIENM py-2 px-1 sm:px-5 rounded-lg font-manrope-b text-white mt-1 mr-[11.5%] text-center block sm:inline-flex"
        >
          <i class="pi pi-check text-xs sm:text-base pt-1"></i>
          <p class="ml-0 sm:ml-3 text-xs sm:text-base">{{ estado }}</p>
        </div>
        <div class="w-3/4 text-right mt-2">
          <button class="botones bg-red-500 mr-3" @click="visible = false">
            Cerrar
          </button>
          <button class="botones bg-verdeOscIENM" @click="generarPDF">
            <i class="pi pi-file-pdf"></i>
            Generar PDF
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { jsPDF } from "jspdf"; //nos ayuda generar el PDF
import { useToast } from "primevue/usetoast";
import type { PreviewRemision } from "~/interfaces/remisiones"; //Modelo del objeto que llegue de la API
import { useRemisionesApi } from "~/composables/remisiones/remisionesApi";

const iva = ref();
const total = ref();
const visible = ref(false);
const totalGeneral = ref();
const observaciones = ref();
const usuario = useCookie("usuario");
const datos = ref<PreviewRemision[] | undefined>([]); //Arreglo con la información de las actividades.
const contenido = ref<HTMLElement | null>(null); //Variable con la información de la modal a PDF
const { listarPreviewRemision } = useRemisionesApi(); //Método que trae la información de la remisión oprimida.

//Variables importantes a especificar en el componente
const props = defineProps({
  numRemision: String,
  fecha: String,
  cliente: String,
  ordenCompra: String,
  hojaEntrada: String,
  contacto: String,
  estado: String,
});

//Método que llena la modal con la información de la remisión
const getModalPreview = async () => {
  const resultado = await listarPreviewRemision(props.numRemision);

  if (resultado.success) {
    datos.value = resultado.remisiones;
    total.value = Number(resultado.remisiones[0].valor);
    observaciones.value = resultado.remisiones[0].observacion;
    iva.value = (total.value * 19) / 100;
    totalGeneral.value = total.value + iva.value;
  } else {
    useToast().add({
      severity: "error",
      summary: "Error en la carga",
      detail: "Por favor vuelve a recargar la página.",
      life: 4000,
    });
  }
};

//Método que genera el PDF de la modal seleccionada.
const generarPDF = () => {
  /**
   * Creamos el objeto jsPDF con sus propiedades.
   * - format: Es el tamaño del formato: [1100, 1097] [ancho, altura].
   * - orientation: Es la orientación y la 'p' quiere decir que es vertical.
   * - unit: Es el tamaño del contenido que tendra y la 'pt' es la más pequeña.
   */
  const doc = new jsPDF({
    format: [959, 1097],
    orientation: "p",
    unit: "pt",
  });

  //Definimos el tamaño del margin y conseguimos el alto y el ancho del formato
  const margin = 50;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  //Si existe el contenido realizara esto.
  if (contenido.value) {
    doc.html(contenido.value, {
      callback: function (doc: jsPDF) {
        const totalPaginas = doc.internal.getNumberOfPages(); //Conseguimos a cantidad de páginas que tendra el pdf por su tamaño.

        //Este 'for' ayudara aplicar la margen y la marca de agua en cada página.
        for (let i = 0; i < totalPaginas; i++) {
          doc.setPage(i);
          //Definimos y agregamos la margen en cada página, tomando en cuenta el tamaño y ancho del PDF.
          doc.setDrawColor(0);
          doc.setLineWidth(0.5);
          doc.rect(
            margin,
            margin,
            pageWidth - 2 * margin,
            pageHeight - 2 * margin
          );
          //Definimos y agregamos la marca de agua en cada página.
          doc.saveGraphicsState();
          doc.setGState(new doc.GState({ opacity: 0.2 })); //Definimos la opacidad.
          doc.setTextColor(160, 160, 160); //Definimos el color del texto.
          doc.setFontSize(150); //Definimos la opacidad.
          doc.setFont("helvetica", "bold");
          doc.text("APROBADO", pageWidth / 1.5, pageHeight / 1.3, {
            angle: 45,
            align: "center",
          });
          doc.restoreGraphicsState();
        }
        //Guardamos el pdf con su propio nombre
        doc.save(`Detalles-remisión-${props.numRemision}.pdf`);
      },
      x: margin,
      y: margin,
      html2canvas: {
        scale: 0.8,
        width: pageWidth - 2 * margin,
        height: pageHeight - 2 * margin,
      },
    });
  }
};

const formatoNumero = (numero: number): string => {
  return new Intl.NumberFormat("es-ES").format(numero);
};

getModalPreview();
</script>
