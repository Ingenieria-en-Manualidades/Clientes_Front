import { ref } from "vue";

export const datosObjetivos = () => {

  
  return {

  };
}

export const datosTablaIndicadores = () => {

  const cabezasInd = ["Indicador", "Abril", "Junio"];
  
  const atribInd = ["indicador","mesUno","mesDos"];
  
  const dataInd = [
    {
      indicador: "Cumplimiento Productivo",
      mesUno: "90%",
      mesDos: "90%",
    },
    {
      indicador: "Cumplimiento Plan Armado",
      mesUno: "90%",
      mesDos: "90%",
    },
  ];

  return {
    cabezasInd,
    atribInd,
    dataInd
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

