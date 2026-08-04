import { ref } from "vue";
import type { HeaderWithFilters } from "../../interfaces/filters";

export const scheduledDetailTabs = ref([
  {
    route: "/objetivos/programacion-detallada",
    label: "Cargar archivo",
    icon: "pi pi-upload text-[13px] sm:text-[16px]",
  },
  {
    route: "/objetivos/programacion-detallada-table",
    label: "Consultar",
    icon: "pi pi-search text-[13px] sm:text-[16px]",
  },
]);

export const scheduledDetailHeaders = ref<HeaderWithFilters[]>([
  { label: "ID", options: null },
  { label: "año", options: null },
  { label: "semana", options: null },
  { label: "fecha inicio", options: null },
  { label: "fecha fin", options: null },
  { label: "usuario", options: null },
]);

export const scheduledDetailAttributes = ref([
  "scheduled_detail_id",
  "year",
  "week_number",
  "week_start_date",
  "week_end_date",
  "username",
]);
