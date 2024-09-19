//Importe para que vue sepa los valores que devuelve la API.
import { ref } from "vue";
import type { Remision } from "../../interfaces/remisiones";

export const useDatosRemisiones = () => {
  
  //Se encarga de filtrar las remisiones que se encuentren entre dos fechas o una.
  const setConsultar = async (tRemision: Remision[], dataFecha: Array<Date>) => {
    const fechas = getFechas(dataFecha[0], dataFecha[1]);
    if (!fechas[1]) {
      return tRemision.filter(r => r.fecha === fechas[0]);
      
    }else{
      return tRemision.filter(r => r.fecha >= fechas[0] && r.fecha <= fechas[1]);
    }
  }

  //El método hace que las fechas dadas por el usuario esten con el formato correcto para filtrar.
  const getFechas = (fecha1: Date, fecha2: Date | null) => {
    const fechas: String[] = [];

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
    setConsultar,
  };
}

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

/**
 * Array de Elementos, rutas e iconos para las modulos y la navegación general de la página.
 * Importado en el componente 'MenuLateral'.
 */
export const modulos = ref([
  {
    icono: "pi pi-home",
    nombre: "Inicio",
    ruta: "",
  },
  {
    icono: "pi pi-bell",
    nombre: "Remisiones",
    ruta: "/remisiones",
  },
  {
    icono: "pi pi-user",
    nombre: "Programación",
    ruta: "/modulo1",
  },
  {
    icono: "pi pi-sliders-h",
    nombre: "Improductividades",
    ruta: "/improductividades",
  },
  {
    icono: "pi pi-bullseye",
    nombre: "Objetivos",
    ruta: "/objetivos"
  },
  {
    icono: "pi pi-exclamation-triangle",
    nombre: "Accidentes",
    ruta: "/accidentes"
  }
]);