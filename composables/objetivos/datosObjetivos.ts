import { Produccion } from "../../interfaces/objetives";

export const datosObjetivos = () => { 

  const objProduccion: Produccion = {
    fecha_produccion: null,
    planificada: null,
    modificada: null,
    plan_armado: null,
    calidad: null,
    desperfecto_me: null,
    desperfecto_pp: null,
    tablero_id: null,
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
  
  return {
    getFecha,
    meses,
    objProduccion
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

export const datosTablaArmado = () => {
  
  const cabezasArm = ["Indicador","1","2","3","4","5"];

  // const setCabezas = () => {
  //   let dia: number = 28;
  //   let date: Date = new Date();
  //   const mesesTreintaUno = [4, 6, 9, 11];
  //   const mesesTreinta = [1, 3, 5, 7, 8, 10, 12];

  //   for (const mes of mesesTreinta) {
  //     if (date.getMonth() == mes) {
  //       dia = 30;
  //     }
  //   }

  //   for (const mes of mesesTreintaUno) {
  //     if (date.getMonth() == mes) {
  //       dia = 31;
  //     }
  //   }

  //   if (dia === 30) {
      
  //   } else {
      
  //   }
    
  //   // if ( ) {
      
  //   // } else {
      
  //   // }
  // }
  
  const atribArm = ["label", "dia1", "dia2", "dia3", "dia4", "dia5"];
  
  const dataArm = [
    {
      label: "Cumplimiento Plan de armado",
      dia1: "90%",
      dia2: "90%",
      dia3: "90%",
      dia4: "90%",
      dia5: "90%",
    }
  ];

  return {
    cabezasArm,
    atribArm,
    dataArm
  };
}

