import { computed, ref } from "vue";
import { HeaderWithFilters } from "../../interfaces/filters";

export const headers = ref<HeaderWithFilters[]>([
  {
    label: "id",
    options: null,
  },
  {
    label: "unidades",
    options: null,
  },
  {
    label: "mes",
    options: null,
  },
  {
    label: "area",
    options: {
      atribute: "area_id_groot",
      labels: [],
    },
  },
  {
    label: "version",
    options: null,
  },
  {
    label: "usuario",
    options: null,
  },
]);

export const attributes = ref([
  "meta_unidades_id",
  "valor",
  "fecha_meta",
  "area_id_groot",
  "actualizaciones",
  "usuario",
]);


export const headersUnitsDaily = computed<HeaderWithFilters[]>(() => [
  {
    label: "fecha de programación",
    options: null,
  },
  {
    label: "valor",
    options: null,
  },
  {
    label: "ultima actualización",
    options: null,
  },
  {
    label: "usuario",
    options: null,
  },
]);

export const attributesUnitsDaily = ref([
  "fecha_programacion",
  "valor",
  "updated_at",
  "usuario",
]);

export const items = ref([
  {
    route: "/objetivos/unidades",
    label: "Ingresar",
    icon: "pi pi-plus text-[13px] sm:text-[16px]",
  },
  {
    route: "/objetivos/unidadesTable",
    label: "Consultar",
    icon: "pi pi-search text-[13px] sm:text-[16px]",
  },
]);