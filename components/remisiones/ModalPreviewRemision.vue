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
            <thead>
              <tr>
                <th
                  class="py-[6px] font-manrope-b text-black text-sm sm:text-base bg-gray-300 border-b-[1px] border-b-black"
                  colspan="3"
                >
                  {{ cliente }}
                </th>
              </tr>
            </thead>
            <tbody>
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
            </tbody>
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
import { defineProps, ref } from "vue";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useToast } from "primevue/usetoast";
import type { PreviewRemision } from "~/interfaces/remisiones";
import { useRemisionesApi } from "~/composables/remisiones/remisionesApi";
import { useCookie } from "nuxt/app";
import Aprobado from "~/assets/img/Aprobado.png";
import imgHeader from "~/assets/img/header.png";

const iva = ref<number>(0);
const total = ref<number>(0);
const totalGeneral = ref<number>(0);
const observaciones = ref<string>("");
const usuario = useCookie("usuario");
const datos = ref<PreviewRemision[]>([]);
const visible = ref<boolean>(false);
const contenido = ref<HTMLElement | null>(null);
const { listarPreviewRemision } = useRemisionesApi();

const props = defineProps<{
  numRemision: string;
  fecha: string;
  cliente: string;
  ordenCompra: string;
  hojaEntrada: string;
  contacto: string;
  estado: string;
}>();

const formatoNumero = (numero: number): string => {
  return new Intl.NumberFormat("es-ES").format(numero);
};

const getModalPreview = async () => {
  try {
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
  } catch (error) {
    useToast().add({
      severity: "error",
      summary: "Error en la carga",
      detail: "Por favor vuelve a recargar la página.",
      life: 4000,
    });
  }
};

const generarPDF = async () => {
  let finalY = 0;
  const doc = new jsPDF("p", "pt", "letter");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 50;
  let currentY = 20;

  doc.addImage(imgHeader, "PNG", 10, currentY, 130, 90);
  currentY += 50;

  // Información de la empresa
  doc.setFontSize(12);
  doc.text("INGENIERÍA EN MANUALIDADES SAS", pageWidth / 2, currentY, {
    align: "center",
  });
  doc.text("NIT 800.187.547-1", pageWidth / 2, currentY + 15, {
    align: "center",
  });
  doc.text("TV 29 #16-57", pageWidth / 2, currentY + 30, { align: "center" });

  doc.text(`REMISIÓN N° ${props.numRemision}`, pageWidth - margin, currentY, {
    align: "right",
  });
  doc.text(props.fecha, pageWidth - margin, currentY + 15, { align: "right" });
  currentY += 60;

  // Información del cliente
  autoTable(doc, {
    startY: currentY,
    head: [
      [
        {
          content: props.cliente,
          colSpan: 3,
          styles: {
            halign: "center",
            fontSize: 14,
            fillColor: [169, 169, 169],
          },
        },
      ],
      ["Orden de compra", "Hoja de entrada", "Contacto"],
    ],
    body: [[props.ordenCompra, props.hojaEntrada, props.contacto]],
    headStyles: {
      fillColor: [140, 140, 140],
      textColor: [0, 0, 0],
      fontSize: 12,
      halign: "center",
    },
    styles: {
      fontSize: 10,
      halign: "center", // Centra el texto en las celdas de la tabla
    },
    columnStyles: {
      0: { halign: "center" },
      1: { halign: "center" },
      2: { halign: "center" },
    },
    margin: { left: margin, right: margin },
    theme: "striped",
    didDrawPage: (data) => {
      if (data.cursor) {
        finalY = data.cursor.y;
      } else {
        console.warn("data.cursor is undefined");
      }
    },
  });

  currentY = finalY + 20;

  // Tabla de actividades
  autoTable(doc, {
    startY: currentY,
    head: [["OP", "SKU", "ACTIVIDAD", "UNIDADES", "PRECIO UNITARIO", "TOTAL"]],
    body: datos.value.map((dato) => [
      dato.programacion_id,
      dato.codigo_cobro,
      dato.nombre,
      formatoNumero(dato.unidades),
      `$${formatoNumero(dato.precio)}`,
      `$${formatoNumero(dato.totalredondeado)}`,
    ]),
    styles: {
      fontSize: 10,
      halign: "center", // Centra el texto en las celdas de la tabla
    },
    columnStyles: {
      0: { halign: "center" },
      1: { halign: "center" },
      2: { halign: "center" },
      3: { halign: "center" },
      4: { halign: "center" },
      5: { halign: "center" },
    },
    margin: { left: margin, right: margin },
    theme: "striped",
    didDrawPage: (data) => {
      if (data.cursor) {
        finalY = data.cursor.y;
      } else {
        console.warn("data.cursor is undefined");
      }
    },
  });

  currentY = finalY + 20;

  // Totales
  autoTable(doc, {
    startY: currentY,
    body: [
      [`TOTAL: $${formatoNumero(total.value)}`],
      [`IVA: $${formatoNumero(iva.value)}`],
      [`TOTAL GENERAL: $${formatoNumero(totalGeneral.value)}`],
    ],
    styles: {
      fontSize: 10,
      halign: "right",
    },
    margin: { right: margin },
    theme: "plain",
    didDrawPage: (data) => {
      if (data.cursor) {
        finalY = data.cursor.y;
      } else {
        console.warn("data.cursor is undefined");
      }
    },
  });

  currentY = finalY + 30;

  // Observaciones
  autoTable(doc, {
    startY: currentY,
    head: [["OBERVACIONES:"]],
    body: [[observaciones.value || "N/A"]],
    styles: {
      fontSize: 10,
      halign: "left",
    },
    margin: { left: margin },
    theme: "plain",
    didDrawPage: (data) => {
      if (data.cursor) {
        finalY = data.cursor.y;
      } else {
        console.warn("data.cursor is undefined");
      }
    },
  });

  currentY = finalY + 20;

  const table1Width = (pageWidth - margin * 2) / 2;
  const table2Width = table1Width;

  // Información Elaborado por
  autoTable(doc, {
    startY: currentY,
    head: [["ELABORADO POR:"]],
    body: [[`${usuario.value}`]],
    styles: {
      fontSize: 10,
      halign: "left",
    },
    margin: { left: margin },
    theme: "plain",
    didDrawPage: (data) => {
      if (data.cursor) {
        finalY = data.cursor.y;
      } else {
        console.warn("data.cursor is undefined");
      }
    },
  });

  // Información Firma
  autoTable(doc, {
    startY: currentY,
    head: [["______________________________"]],
    body: [["FIRMA"]],
    styles: {
      fontSize: 10,
      halign: "right",
    },
    margin: { right: margin },
    theme: "plain",
    didDrawPage: (data) => {
      if (data.cursor) {
        finalY = data.cursor.y;
      } else {
        console.warn("data.cursor is undefined");
      }
    },
  });
  // Agregar marca de agua
  const roatatioAngle = 45;

  const fontSizeW = 80;
  const rotationAngle = 45; // Grados para rotar la imagen
  const transparency = 0.1;
  const totalPages = doc.internal.pages.length;
  for (let i = 0; i < totalPages; i++) {
    doc.setPage(i + 1);

    // Establecer el estado de gráficos para aplicar transparencia
    doc.setGState(new doc.GState({ opacity: transparency }));
    doc.setTextColor(220, 220, 220);
    doc.setFontSize(fontSizeW);
    doc.setFont("helvetica", "bold");
    doc.addImage(
      Aprobado,
      "JPEG",
      200,
      300,
      400,
      200,
      undefined,
      "NONE",
      roatatioAngle
    );
    doc.setGState(new doc.GState({ opacity: 1 }));
  }

  // Guardar PDF
  doc.save(`Detalles-remision-${props.numRemision}.pdf`);
};

getModalPreview();
</script>
