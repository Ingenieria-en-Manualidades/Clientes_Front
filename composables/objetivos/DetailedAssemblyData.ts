import { ref } from "vue";
import type { HeaderWithFilters, WarningTable } from "../../interfaces/filters";

export const detailedAssemblyTabs = ref([
  {
    route: "/objetivos/armado-detallado",
    label: "Cargar archivo",
    icon: "pi pi-upload text-[13px] sm:text-[16px]",
  },
  {
    route: "/objetivos/armado-detallado-table",
    label: "Consultar",
    icon: "pi pi-search text-[13px] sm:text-[16px]",
  },
]);

export const detailedAssemblyHeaders = ref<HeaderWithFilters[]>([
  { label: "ID", options: null },
  { label: "año", options: null },
  { label: "semana", options: null },
  { label: "fecha inicio", options: null },
  { label: "fecha fin", options: null },
  { label: "usuario", options: null },
]);

export const detailedAssemblyAttributes = ref([
  "detailed_assembly_id",
  "year",
  "week_number",
  "week_start_date",
  "week_end_date",
  "username",
]);

export const detailedAssemblyPreviewHeaders = ref<HeaderWithFilters[]>([
  { label: "fecha inicio", options: null },
  { label: "fecha fin", options: null },
  { label: "nombre cliente", options: null },
  { label: "SKU", options: null },
  { label: "producto", options: null },
  { label: "total semana", options: null },
]);

export const detailedAssemblyPreviewAttributes = [
  "start_date",
  "end_date",
  "nombre_cliente",
  "sku",
  "producto",
  "value",
];

export const detailedAssemblyPreviewWarningData: WarningTable = {
  success: false,
  label: "",
};
