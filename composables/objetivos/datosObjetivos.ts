import { ref } from "vue";
import type { Objetivos, Meta } from "../../interfaces/objetives";
import type { HeaderWithFilters } from "../../interfaces/filters";

export const itemsMetas = ref([
  {
    route: "/objetivos",
    label: "Ingresar",
    icon: "pi pi-plus text-[13px] sm:text-[16px]",
  },
  {
    route: "/objetivos/metasTable",
    label: "Consultar",
    icon: "pi pi-search text-[13px] sm:text-[16px]",
  },
]);

export const itemsCumplimientoMensual = ref([
  {
    route: "/objetivos/calidad",
    label: "Ingresar",
    icon: "pi pi-plus text-[13px] sm:text-[16px]",
  },
  {
    route: "/objetivos/calidadTable",
    label: "Consultar",
    icon: "pi pi-search text-[13px] sm:text-[16px]",
  },
]);

export const itemsCumplimientoDiario = ref([
  {
    route: "/objetivos/diarios",
    label: "Ingresar",
    icon: "pi pi-plus text-[13px] sm:text-[16px]",
  },
  {
    route: "/objetivos/diariosTable",
    label: "Consultar",
    icon: "pi pi-search text-[13px] sm:text-[16px]",
  },
]);

export const headersMetas = ref<HeaderWithFilters[]>([
  { label: "id", options: null },
  { label: "fecha", options: null },
  { label: "plan armado", options: null },
  { label: "eficiencia", options: null },
  { label: "calidad", options: null },
  { label: "desperdicio m.e", options: null },
  { label: "desperdicio p.p", options: null },
]);

export const attributesMetas = ref([
  "meta_id",
  "fecha",
  "cumplimiento",
  "eficiencia_productiva",
  "calidad",
  "desperdicio_me",
  "desperdicio_pp",
]);

export const headersCumplimientoMensual = ref<HeaderWithFilters[]>([
  { label: "id", options: null },
  { label: "fecha", options: null },
  { label: "checklist", options: null },
  { label: "inspección", options: null },
  { label: "evidencias", options: null },
]);

export const attributesCumplimientoMensual = ref([
  "calidad_id",
  "fecha",
  "checklist",
  "inspeccion",
  "evidencias",
]);

export const headersCumplimientoDiario = ref<HeaderWithFilters[]>([
  { label: "id", options: null },
  { label: "fecha", options: null },
  { label: "planificada", options: null },
  { label: "modificada", options: null },
  { label: "plan armado", options: null },
  { label: "calidad", options: null },
  { label: "desperfecto m.e", options: null },
  { label: "desperfecto p.p", options: null },
]);

export const attributesCumplimientoDiario = ref([
  "objetivos_id",
  "fecha",
  "planificada",
  "modificada",
  "plan_armado",
  "calidad",
  "desperfecto_me",
  "desperfecto_pp",
]);

export const datosObjetivos = () => { 

  const objObjetivo: Objetivos = {
    fecha: null,
    cliente_id: null,
    planificada: null,
    modificada: null,
    plan_armado: null,
    calidad: null,
    desperfecto_me: null,
    desperfecto_pp: null,
  };

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  
  const getFecha = (date: Date) => {
    if (date.getMonth() + 1 > 0 && date.getMonth() + 1 < 10) {
      if (date.getDate() > 0 && date.getDate() < 10) {
        return `${date.getFullYear()}-0${date.getMonth() + 1}-0${date.getDate()}`;
      } else {
        return `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`;
      }
    } else {
      if (date.getDate() > 0 && date.getDate() < 10) {
        return `${date.getFullYear()}-${date.getMonth() + 1}-0${date.getDate()}`;
      } else {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      }
    }
  };
  
  /**
   * Método que se encarga de retorna una fecha que es la actual pero 3 días adelantados o retrasados, se creo
   * para ser la fecha maxima o minima a elegir para los input de "Date".
   * @param maxima : Valor el cual ayuda a decidir si aumentar o reducir la fecha actual a 3 dias, en caso
   * de ser 'true' se aumentan los 3 días si es 'false' se reducen a 3 días.
   */
  const getFechaMaxMin = (maxima: Boolean) => {
    const hoy = new Date();
    const fechaMax = new Date(hoy);

    //Dependiendo del valor de 'maxima' se suma o resta los días a la fecha actual
    if (maxima) {
      fechaMax.setDate(hoy.getDate() + 3);
    } else {
      fechaMax.setDate(hoy.getDate() - 3);
    }

    //Nos aseguramos que la fecha sea en formato 'YYYY-MM-DD'
    const año = fechaMax.getFullYear();
    //Nos aseguramos que en el caso de ser solo un digito el mes, se rellene con un 0, de esta manera '02'
    const mes = String(fechaMax.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaMax.getDate()).padStart(2, '0');

    return `${año}-${mes}-${dia}`;
  }

  const setCheckMaxMinNumber = (objMeta: Meta | Objetivos) => {
    const valuesObject = Object.values(objMeta).reduce((acc, el) => {
      if (typeof el === "number") {
        if (el >= 0 && el < 101) {
          acc.push(true);
        } else {
          acc.push(false);
        }
      }
      return acc;
    }, []);
    return !valuesObject.includes(false);
  }
  
  return {
    meses,
    getFecha,
    objObjetivo,
    getFechaMaxMin,
    setCheckMaxMinNumber,
  };
}

export const datosTablaProd = () => {
  
  const cabezasProd = ["Produccion Planificada", "Produccion Modificada"];
  
  const atribProd = ["valorPlan", "valorMod"];
  
  const dataProd = [
    {
      valorPlan: "90%",
      valorMod: "90%"
    }
  ];

  return {
    cabezasProd,
    atribProd,
    dataProd
  };
}
