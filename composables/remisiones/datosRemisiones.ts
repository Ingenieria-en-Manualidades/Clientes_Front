import { useToast } from "primevue/usetoast";
import { usarCookies } from "~/composables/cookies";
//Importe para que vue sepa los valores que devuelve la API.
import type { Remision } from "~/interfaces/remisiones";
//Archivo con las llamadas a la API.
import { useRemisionesApi } from "~/composables/remisiones/remisionesApi";

export const useDatosRemisiones = () => {
  const toast = useToast();
  const { idCliente } = usarCookies();
  const remisionesPendientes = ref<Remision[]>([]);
  const remisionesAprobadas =  ref<Remision[]>([]);
  const remisionesRechazadas =  ref<Remision[]>([]);
  
  const setRemisionesFiltradas = async () => {
    //Método del listar remisiones.
    const { listarRemisionesPorId } = useRemisionesApi();
    
    //Método que llama las remisiones por id del cliente y las guarda en el arreglo
    const res = await listarRemisionesPorId(idCliente.value);
    
    remisionesPendientes.value = res.filter((rem) => rem.estado === null);
    remisionesAprobadas.value = res.filter((rem) => rem.estado === "Aprobado");
    remisionesRechazadas.value = res.filter((rem) => rem.estado === "Rechazado");
  }

  const setConsultar = async (tRemision: Array, dataFecha: Array<Date>) => {
    const fechas = getFechas(dataFecha[0], dataFecha[1]);
    if (!fechas[1]) {
      tRemision.value = tRemision.value.filter(r => r.fecha === fechas[0]);
    }else{
      tRemision.value = tRemision.value.filter(r => r.fecha >= fechas[0] && r.fecha <= fechas[1]);
    }
    
    if (tRemision.value.length === 0) {
      toast.add({
        severity: 'warn',
        summary: 'Sin ocurrencias',
        detail: 'No se encontro ninguna remisión entre esas fechas.',
        life: 3000,
      });
    }
  }

  const getFechas = (fecha1: Date, fecha2: Date | null) => {
    const fechas = [];
    
    if (fecha1.getMonth() + 1 > -1 && fecha1.getMonth() + 1 < 10) {
      fechas.push(`${fecha1.getFullYear()}-0${fecha1.getMonth() + 1}-${fecha1.getDate()}`);
    }else{
      fechas.push(`${fecha1.getFullYear()}-${fecha1.getMonth() + 1}-${fecha1.getDate()}`);
    }

    if (fecha2 !== null) {
      if (fecha2.getMonth() + 1 > -1 && fecha2.getMonth() + 1 < 10) {
        fechas.push(`${fecha2.getFullYear()}-0${fecha2.getMonth() + 1}-${fecha2.getDate()}`);
      }else{
        fechas.push(`${fecha2.getFullYear()}-${fecha2.getMonth() + 1}-${fecha2.getDate()}`);
      }
    }

    return fechas;
  }

  setRemisionesFiltradas();

  return {
    remisionesPendientes,
    remisionesAprobadas,
    remisionesRechazadas,
    setRemisionesFiltradas,
    setConsultar
  };
}

export const columnas = [
  { field: "no_remision", header: "N°" },
  { field: "valor", header: "VALOR" },
  { field: "fecha", header: "FECHA" },
];