import { ref } from "vue"
import type { Improductividad } from "../../interfaces/improductividades";

export const useDatosImproductividades = () => {

  const setConsultar = async (improductividades: Improductividad[], dataFecha: Array<Date>) => {
    const fechas = formatoFechas(dataFecha[0], dataFecha[1]);
    
    if (!fechas[1]) {
      return improductividades.filter(r => r.fecha_ingreso >= `${fechas[0]} 00:00:00` && r.fecha_ingreso <= `${fechas[0]} 23:59:59`);
    }else{
      return improductividades.filter(r => r.fecha_ingreso >= `${fechas[0]} 00:00:00` && r.fecha_ingreso <= `${fechas[1]} 23:59:59`);
    }
  }

  const formatoFechas = (fecha1: Date, fecha2: Date | null) => {
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

  const filtrarPorLinea = (lineasElegidas: String[], data: Improductividad[] | undefined) => {
    let dataFilter: Improductividad[] = [];

    for (const e of lineasElegidas) {
      let arrayTurno: Improductividad[] | undefined;
      
      if (data) {
        arrayTurno = data.filter((rem) => rem.dispositivo === e);
        dataFilter = dataFilter.concat(arrayTurno);
      }
    }
    return dataFilter;
  };

  const filtrarPorTurno = (turnosElegidos: String[], data: Improductividad[] | undefined) => {
    let dataFilter: Improductividad[] = [];

    for (const e of turnosElegidos) {
      let arrayTurno: Improductividad[] | undefined;
      
      if (data) {
        arrayTurno = data.filter((rem) => rem.turno === e);
        // console.log("arrayturno: ", arrayTurno);
        dataFilter = dataFilter.concat(arrayTurno);
        // console.log("dataFilter loop: ", dataFilter);
      }
    }
    return dataFilter;
  };

  return {
    setConsultar,
    filtrarPorLinea,
    filtrarPorTurno
  };
}

export const items = ref([
  {
    route: "/improductividades",
    label: "Pendientes",
    icon: "pi  pi-clipboard"
  },
  {
    route: "/improductividades/aprobadas",
    label: "Aprobadas",
    icon: "pi  pi-check"
  },
  {
    route: "/improductividades/rechazadas",
    label: "Rechazadas",
    icon: "pi  pi-times"
  }
]);

export const cols = ref([
  "actividad",
  "descripcion",
  "fecha de ingreso",
  "horas",
  "minutos",
  "cantidad de personas",
  "improductividades hora hombre"
]);

export const atributos = ref([
  "actividad",
  "descripcion",
  "fecha_ingreso",
  "horas",
  "minutos",
  "cant_personas",
  "horasxpersonas"
]);

export const lineas = ref(["1", "2", "3", "4", "5", "6", "7", "NA"]);
export const turnos = ref(["A", "B", "C"]);