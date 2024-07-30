//Importe para que vue sepa los valores que devuelve la API.
import type { Remision } from "~/interfaces/remisiones";

export const useDatosRemisiones = () => {
  const remisionesPendientes = ref<Remision[]>([]);
  const remisionesAprobadas =  ref<Remision[]>([]);
  const remisionesRechazadas =  ref<Remision[]>([]);
  
  const setConsultar = async (tRemision: Array, dataFecha: Array<Date>) => {
    const fechas = getFechas(dataFecha[0], dataFecha[1]);
    if (!fechas[1]) {
      tRemision.value = tRemision.value.filter(r => r.fecha === fechas[0]);
    }else{
      tRemision.value = tRemision.value.filter(r => r.fecha >= fechas[0] && r.fecha <= fechas[1]);
    }
  }

  const getFechas = (fecha1: Date, fecha2: Date | null) => {
    const fechas = [];

    if (fecha1.getMonth() + 1 > 0 && fecha1.getMonth() + 1 < 10) {
      if (fecha1.getDate() > 0 && fecha1.getDate() < 10) {
        fechas.push(`${fecha1.getFullYear()}-0${fecha1.getMonth() + 1}-0${fecha1.getDate()}`);
      }else{
        fechas.push(`${fecha1.getFullYear()}-0${fecha1.getMonth() + 1}-${fecha1.getDate()}`);
      }
    }else{
      if (fecha1.getDate() > 0 && fecha1.getDate() < 10) {
        fechas.push(`${fecha1.getFullYear()}-${fecha1.getMonth() + 1}-0${fecha1.getDate()}`);
      }else{
        fechas.push(`${fecha1.getFullYear()}-${fecha1.getMonth() + 1}-${fecha1.getDate()}`);
      }
    }

    if (fecha2 !== null) {
      if (fecha2.getMonth() + 1 > 0 && fecha2.getMonth() + 1 < 10) {
        if (fecha2.getDate() > 0 && fecha2.getDate() < 10) {
          fechas.push(`${fecha2.getFullYear()}-0${fecha2.getMonth() + 1}-0${fecha2.getDate()}`);
        }else{
          fechas.push(`${fecha2.getFullYear()}-0${fecha2.getMonth() + 1}-${fecha2.getDate()}`);
        }
      }else{
        if (fecha2.getDate() > 0 && fecha2.getDate() < 10) {
          fechas.push(`${fecha2.getFullYear()}-${fecha2.getMonth() + 1}-0${fecha2.getDate()}`);
        }else{
          fechas.push(`${fecha2.getFullYear()}-${fecha2.getMonth() + 1}-${fecha2.getDate()}`);
        }
      }
    }

    return fechas;
  }

  return {
    remisionesPendientes,
    remisionesAprobadas,
    remisionesRechazadas,
    setConsultar,
  };
}

export const columnas = [
  { field: "no_remision", header: "N°" },
  { field: "orden_compra", header: "Orden de compra" },
  { field: "numero_pedido", header: "Número de pedido" },
  { field: "valor", header: "VALOR" },
  { field: "fecha", header: "FECHA" },
];

/**
 * Array de Elementos, rutas e iconos para las pestañas y la navegación entre remisiones.
 * Importado en el componente 'TabPanelRemisiones'.
 */
export const items = ref([
  {
    route: "/remisiones",
    label: "Pendientes",
    icon: "pi pi-clipboard text-[13px] sm:text-[16px]",
  },
  {
    route: "/remisiones/Aprobadas",
    label: "Aprobadas",
    icon: "pi pi-check text-[13px] sm:text-[16px]",
  },
  {
    route: "/remisiones/rechazadas",
    label: "Rechazadas",
    icon: "pi pi-times text-[13px] sm:text-[16px]",
  },
]);