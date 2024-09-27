import { ref } from "vue";

export const useDatosObjetivos = () => {
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
  
  const cabezasProd = ["Indicador"];

  const setCabezas = () => {
    
  }
  
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