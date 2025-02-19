import { ref } from "vue";
import { Objetivos } from "../../interfaces/objetives";

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
  
  return {
    meses,
    getFecha,
    objObjetivo,
    getFechaMaxMin
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
