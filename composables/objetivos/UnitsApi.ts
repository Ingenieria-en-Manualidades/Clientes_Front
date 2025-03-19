import { useRuntimeConfig } from 'nuxt/app';
import { Units, UnitsDaily, ApiPromiseStandard } from "../../interfaces/objetives";

export const useUnitsApi = () => {
  const config = useRuntimeConfig();
  const url = config.public.apiBackendCliente;

  const createMetaUnidades = async (objUnits: Units):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/createMetaUnidades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objUnits)
      });

      const data = await response.json();
      
      if (response.ok) {
        return {success: true, title: data.title, message: data.message};
      } else {
        if (data.error) console.error("Error a la hora de guardar las unidades metas: ",data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de agregar las unidades mensuales: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }

  const createUnidadesDiarias = async (objUnitsD: UnitsDaily):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/createUnidadesDiarias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objUnitsD)
      });

      const data = await response.json();

      if (response.ok) {
        return {success: true, title: data.title, message: data.message};
      } else {
        if (data.error) console.error("Error a la hora de guardar las unidades diarias: ",data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de agregar las unidades diarias: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }

  const getMetaUnidades = async (today: Date):Promise<ApiPromiseStandard<any>> => {
    try {
      let meta: String;
      const month = today.getMonth() + 1;
      if (month > 0 && month < 10) {
        meta = today.getFullYear() + '-0' + month;
      } else {
        meta = today.getFullYear() + '-' + month;
      }
      console.log("meta: ", meta);
      
      const response = await fetch(`${url}api/metaUnidadesExists/${meta}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (response.ok) {
        return {success: true, title: data.title, message: data.message, data: data.exists};
      } else {
        if (data.error) console.error("Error a la hora de consultar las metas unidades.", data.error);
        return {success: false, title: data.title, message: data.message, data: data.exists};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de agregar las unidades diarias: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }

  return {
    getMetaUnidades,
    createMetaUnidades,
    createUnidadesDiarias
  }
}
